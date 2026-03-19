"""
《中国色·万物生》—— Python 数据结构服务层
用 Python 实现与 C++ 对应的数据结构逻辑，供 API 调用
"""

import json
import math
from pathlib import Path
from typing import List, Dict, Any, Optional, Tuple
from collections import deque, OrderedDict
import heapq


# ============ 1. 数组 Array - 颜色数据库 ============
class ColorArray:
    def __init__(self):
        self._data: List[Dict] = []

    def load_from_json(self, filepath: str):
        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)
            self._data = data.get("colors", [])

    def get_all(self) -> List[Dict]:
        return self._data

    def get_by_id(self, idx: int) -> Optional[Dict]:
        for c in self._data:
            if c.get("id") == idx:
                return c
        return None

    def size(self) -> int:
        return len(self._data)


# ============ 2. 链表 Linked List - 文化时间轴 ============
class ListNode:
    def __init__(self, data: str):
        self.data = data
        self.next = None


class LinkedList:
    def __init__(self):
        self.head = None

    def append(self, data: str):
        if not self.head:
            self.head = ListNode(data)
            return
        p = self.head
        while p.next:
            p = p.next
        p.next = ListNode(data)

    def to_list(self) -> List[str]:
        r = []
        p = self.head
        while p:
            r.append(p.data)
            p = p.next
        return r


# ============ 3. 栈 Stack - 浏览历史 ============
class Stack:
    def __init__(self):
        self._data: List[str] = []

    def push(self, item: str):
        self._data.append(item)

    def pop(self) -> Optional[str]:
        return self._data.pop() if self._data else None

    def top(self) -> Optional[str]:
        return self._data[-1] if self._data else None

    def size(self) -> int:
        return len(self._data)

    def to_list(self) -> List[str]:
        return list(reversed(self._data))


# ============ 4. 队列 Queue - 导览路线 ============
class Queue:
    def __init__(self):
        self._data: deque = deque()

    def enqueue(self, item: str):
        self._data.append(item)

    def dequeue(self) -> Optional[str]:
        return self._data.popleft() if self._data else None

    def front(self) -> Optional[str]:
        return self._data[0] if self._data else None

    def to_list(self) -> List[str]:
        return list(self._data)


# ============ 5. Trie 树 - 颜色名称自动补全 O(k) ============
class TrieNode:
    def __init__(self):
        self.children: Dict[str, "TrieNode"] = {}
        self.is_word = False


class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str):
        node = self.root
        for ch in word:
            if ch not in node.children:
                node.children[ch] = TrieNode()
            node = node.children[ch]
        node.is_word = True

    def _collect(self, node: TrieNode, prefix: str, result: List[str]):
        if node.is_word:
            result.append(prefix)
        for ch, child in node.children.items():
            self._collect(child, prefix + ch, result)

    def prefix_match(self, prefix: str) -> List[str]:
        node = self.root
        for ch in prefix:
            if ch not in node.children:
                return []
            node = node.children[ch]
        result = []
        self._collect(node, prefix, result)
        return result


# ============ 6. KD-Tree - AI 颜色匹配 O(log n) ============
class KDNode:
    def __init__(self, point: Tuple[int, int, int], name: str, left=None, right=None):
        self.point = point
        self.name = name
        self.left = left
        self.right = right


class KDTree:
    def __init__(self):
        self.root = None
        self._colors: List[Tuple[Tuple[int, int, int], str]] = []

    def build(self, colors: List[Tuple[Tuple[int, int, int], str]]):
        self._colors = list(colors)

        def _build(points: List[Tuple[Tuple[int, int, int], str]], depth: int) -> Optional[KDNode]:
            if not points:
                return None
            axis = depth % 3
            points = sorted(points, key=lambda x: x[0][axis])
            mid = len(points) // 2
            node = KDNode(points[mid][0], points[mid][1])
            node.left = _build(points[:mid], depth + 1)
            node.right = _build(points[mid + 1 :], depth + 1)
            return node

        self.root = _build(self._colors, 0)

    def _dist(self, a: Tuple[int, int, int], b: Tuple[int, int, int]) -> int:
        return sum((x - y) ** 2 for x, y in zip(a, b))

    def _nearest(self, node: KDNode, target: Tuple[int, int, int], depth: int) -> Tuple[Optional[KDNode], float]:
        if node is None:
            return None, float("inf")
        d = self._dist(node.point, target)
        best_node, best_dist = node, d
        axis = depth % 3
        if target[axis] < node.point[axis]:
            near, far = node.left, node.right
        else:
            near, far = node.right, node.left
        n_node, n_dist = self._nearest(near, target, depth + 1)
        if n_node and n_dist < best_dist:
            best_node, best_dist = n_node, n_dist
        plane_dist = (target[axis] - node.point[axis]) ** 2
        if plane_dist < best_dist:
            f_node, f_dist = self._nearest(far, target, depth + 1)
            if f_node and f_dist < best_dist:
                best_node, best_dist = f_node, f_dist
        return best_node, best_dist

    def find_nearest(self, r: int, g: int, b: int) -> str:
        if not self.root:
            return ""
        node, _ = self._nearest(self.root, (r, g, b), 0)
        return node.name if node else ""


# ============ 7. 并查集 Union-Find - 文化群组 ============
class UnionFind:
    def __init__(self):
        self.parent: Dict[str, str] = {}
        self.rank: Dict[str, int] = {}

    def add(self, x: str):
        if x not in self.parent:
            self.parent[x] = x
            self.rank[x] = 0

    def find(self, x: str) -> str:
        self.add(x)
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x: str, y: str):
        rx, ry = self.find(x), self.find(y)
        if rx == ry:
            return
        if self.rank[rx] < self.rank[ry]:
            rx, ry = ry, rx
        self.parent[ry] = rx
        if self.rank[rx] == self.rank[ry]:
            self.rank[rx] += 1

    def connected(self, x: str, y: str) -> bool:
        return self.find(x) == self.find(y)

    def get_group(self, x: str) -> List[str]:
        rx = self.find(x)
        return [k for k in self.parent if self.find(k) == rx]


# ============ 8. LRU Cache - 查询优化 O(1) ============
class LRUCache:
    def __init__(self, capacity: int = 100):
        self.capacity = capacity
        self.cache: OrderedDict = OrderedDict()

    def get(self, key: str) -> Optional[str]:
        if key not in self.cache:
            return None
        self.cache.move_to_end(key)
        return self.cache[key]

    def put(self, key: str, value: str):
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)


# ============ 9. 图 Graph - BFS/DFS/拓扑排序 ============
class Graph:
    def __init__(self):
        self.adj: Dict[str, List[Tuple[str, int]]] = {}
        self.nodes: Dict[str, str] = {}

    def add_edge(self, u: str, v: str, w: int = 1):
        self.adj.setdefault(u, []).append((v, w))
        self.nodes.setdefault(u, "node")
        self.nodes.setdefault(v, "node")

    def bfs(self, start: str) -> List[str]:
        visited = set()
        q = deque([start])
        result = []
        while q:
            u = q.popleft()
            if u in visited:
                continue
            visited.add(u)
            result.append(u)
            for v, _ in self.adj.get(u, []):
                if v not in visited:
                    q.append(v)
        return result

    def dfs(self, start: str) -> List[str]:
        visited = set()
        result = []

        def _dfs(u: str):
            if u in visited:
                return
            visited.add(u)
            result.append(u)
            for v, _ in self.adj.get(u, []):
                _dfs(v)

        _dfs(start)
        return result

    def topological_sort(self) -> List[str]:
        in_degree: Dict[str, int] = {n: 0 for n in self.nodes}
        for u in self.adj:
            for v, _ in self.adj[u]:
                in_degree[v] = in_degree.get(v, 0) + 1
        q = deque([n for n, d in in_degree.items() if d == 0])
        result = []
        while q:
            u = q.popleft()
            result.append(u)
            for v, _ in self.adj.get(u, []):
                in_degree[v] -= 1
                if in_degree[v] == 0:
                    q.append(v)
        return result


# ============ 10. A* 搜索 - 文化导览 ============
def astar_search(
    nodes: Dict[str, Tuple[float, float]],
    edges: List[Tuple[str, str, float, int]],
    start: str,
    goal: str,
) -> List[str]:
    def heuristic(a: str, b: str) -> float:
        if a not in nodes or b not in nodes:
            return 1e9
        x1, y1 = nodes[a]
        x2, y2 = nodes[b]
        return math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)

    g_score = {start: 0}
    came_from = {}
    pq = [(heuristic(start, goal), 0, start)]

    while pq:
        _, g, u = heapq.heappop(pq)
        if u == goal:
            path = []
            while u:
                path.append(u)
                u = came_from.get(u)
            return list(reversed(path))
        if g > g_score.get(u, float("inf")):
            continue
        for e in edges:
            v = None
            cost = e[2] * (1 - e[3] / 200.0)
            if e[0] == u:
                v = e[1]
            elif e[1] == u:
                v = e[0]
            if v is None:
                continue
            tent = g_score[u] + cost
            if tent < g_score.get(v, float("inf")):
                came_from[v] = u
                g_score[v] = tent
                heapq.heappush(pq, (tent + heuristic(v, goal), tent, v))
    return []


# ============ 11. 优先队列 Top-K 推荐 ============
def top_k_recommend(
    current_color: Dict,
    colors: List[Dict],
    k: int = 5,
) -> List[Dict]:
    def score(c: Dict) -> float:
        base = 0.5
        if c.get("dynasty") == current_color.get("dynasty"):
            base += 0.2
        if c.get("location") == current_color.get("location"):
            base += 0.2
        return base

    others = [x for x in colors if x.get("name") != current_color.get("name")]
    scored = [(score(c), c) for c in others]
    heapq.heapify(scored)
    top = heapq.nlargest(k, scored, key=lambda x: x[0])
    return [c for _, c in top]
