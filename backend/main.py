"""
《中国色·万物生》—— 文化服务层 API
FastAPI 后端服务
"""

import json
from pathlib import Path
from typing import List, Optional

from fastapi import FastAPI, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from ds_services import (
    ColorArray, LinkedList, Stack, Queue, Trie, KDTree,
    UnionFind, LRUCache, Graph, astar_search, top_k_recommend
)

# 数据目录
DATA_DIR = Path(__file__).parent.parent / "data"
COLORS_FILE = DATA_DIR / "colors.json"
RELATIONS_FILE = DATA_DIR / "cultural_relations.json"
MAP_FILE = DATA_DIR / "cultural_map.json"
GROUPS_FILE = DATA_DIR / "color_groups.json"

app = FastAPI(title="中国色·万物生", description="中国传统色彩文化探索平台")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 全局服务实例
color_array = ColorArray()
trie = Trie()
kdtree = KDTree()
union_find = UnionFind()
lru_cache = LRUCache(100)
graph = Graph()
evolution_graph = Graph()
browse_history = Stack()
tour_queue = Queue()
timeline = LinkedList()


def load_data():
    """加载数据并初始化数据结构"""
    color_array.load_from_json(str(COLORS_FILE))
    colors = color_array.get_all()
    for c in colors:
        trie.insert(c["name"])
    kd_colors = [((c["rgb"][0], c["rgb"][1], c["rgb"][2]), c["name"]) for c in colors]
    kdtree.build(kd_colors)
    if GROUPS_FILE.exists():
        with open(GROUPS_FILE, "r", encoding="utf-8") as f:
            groups = json.load(f).get("groups", [])
            for g in groups:
                for i, c in enumerate(g["colors"]):
                    for j in range(i + 1, len(g["colors"])):
                        union_find.union(c, g["colors"][j])
    if RELATIONS_FILE.exists():
        with open(RELATIONS_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            for e in data.get("edges", []):
                graph.add_edge(e["from"], e["to"], e.get("weight", 1))
            for ev in data.get("color_evolution", []):
                graph.add_edge(ev["from"], ev["to"], 1)
                evolution_graph.add_edge(ev["from"], ev["to"], 1)


@app.on_event("startup")
async def startup():
    load_data()


# ============ API 模型 ============
class ColorMatchRequest(BaseModel):
    r: int
    g: int
    b: int


class TourRequest(BaseModel):
    start: str
    goal: str


# ============ API 路由 ============

@app.get("/")
async def root():
    return {"name": "中国色·万物生", "version": "1.0"}


@app.get("/api/colors")
async def get_colors():
    """获取全部颜色 - 数组"""
    return color_array.get_all()


@app.get("/api/colors/search")
async def search_colors(q: str):
    """Trie 前缀搜索/自动补全"""
    matches = trie.prefix_match(q)
    results = [c for c in color_array.get_all() if c["name"] in matches]
    return results[:20]


@app.get("/api/colors/{name}")
async def get_color(name: str):
    """获取单色 - 哈希表/LRU"""
    cached = lru_cache.get(name)
    if cached:
        return json.loads(cached)
    for c in color_array.get_all():
        if c["name"] == name:
            lru_cache.put(name, json.dumps(c, ensure_ascii=False))
            return c
    raise HTTPException(404, "未找到颜色")


@app.post("/api/colors/match")
async def match_color(req: ColorMatchRequest):
    """KD-Tree AI 颜色匹配"""
    name = kdtree.find_nearest(req.r, req.g, req.b)
    if not name:
        return {"name": "", "color": None}
    for c in color_array.get_all():
        if c["name"] == name:
            return {"name": name, "color": c}
    return {"name": name, "color": None}


@app.post("/api/colors/{name}/recommend")
async def recommend_colors(name: str, k: int = 5):
    """优先队列 Top-K 推荐"""
    current = next((c for c in color_array.get_all() if c["name"] == name), None)
    if not current:
        raise HTTPException(404, "未找到颜色")
    return top_k_recommend(current, color_array.get_all(), k)


@app.get("/api/colors/{name}/group")
async def get_color_group(name: str):
    """并查集 - 文化群组"""
    group = union_find.get_group(name)
    return {"group": group}


@app.post("/api/history")
async def add_history(name: str):
    """栈 - 浏览历史"""
    browse_history.push(name)
    return {"history": browse_history.to_list()}


@app.get("/api/history")
async def get_history():
    return {"history": browse_history.to_list()}


@app.post("/api/tour")
async def plan_tour(req: TourRequest):
    """A* 文化导览路线"""
    if not MAP_FILE.exists():
        raise HTTPException(503, "地图数据未加载")
    with open(MAP_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    nodes = {c["id"]: (c["x"], c["y"]) for c in data["cities"]}
    edges = [
        (r["from"], r["to"], r["distance"], r.get("culture_score", 80))
        for r in data["routes"]
    ]
    path = astar_search(nodes, edges, req.start, req.goal)
    return {"path": path}


@app.get("/api/graph/bfs")
async def graph_bfs(start: str = "天青"):
    """图 BFS"""
    return {"result": graph.bfs(start)}


@app.get("/api/graph/dfs")
async def graph_dfs(start: str = "天青"):
    """图 DFS"""
    return {"result": graph.dfs(start)}


@app.get("/api/graph/topological")
async def graph_topological():
    """拓扑排序 - 颜色演化时间线 (Kahn 算法)"""
    return {"result": evolution_graph.topological_sort()}


@app.get("/api/map")
async def get_cultural_map():
    """文化地图数据"""
    if not MAP_FILE.exists():
        raise HTTPException(404)
    with open(MAP_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


@app.get("/api/stats")
async def get_stats():
    """数据统计仪表盘"""
    colors = color_array.get_all()
    dynasty_count = {}
    location_count = {}
    for c in colors:
        dynasty_count[c.get("dynasty", "未知")] = dynasty_count.get(c.get("dynasty"), 0) + 1
        location_count[c.get("location", "未知")] = location_count.get(c.get("location"), 0) + 1
    return {
        "total_colors": len(colors),
        "dynasty_count": dynasty_count,
        "location_count": location_count,
        "poem_count": sum(1 for c in colors if c.get("poem")),
    }


@app.post("/api/upload/match")
async def upload_match(file: UploadFile):
    """上传图片匹配颜色 - 简化版取平均色"""
    try:
        from PIL import Image
        import io
        contents = await file.read()
        img = Image.open(io.BytesIO(contents))
        img = img.resize((50, 50))
        pixels = list(img.getdata())
        r = sum(p[0] for p in pixels) // len(pixels)
        g = sum(p[1] for p in pixels) // len(pixels)
        b = sum(p[2] for p in pixels) // len(pixels)
        name = kdtree.find_nearest(r, g, b)
        for c in color_array.get_all():
            if c["name"] == name:
                return {"name": name, "color": c, "image_rgb": [r, g, b]}
        return {"name": name, "color": None, "image_rgb": [r, g, b]}
    except Exception as e:
        raise HTTPException(400, str(e))
