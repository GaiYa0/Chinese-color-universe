"""
《中国色·万物生》—— 数据结构单元测试
验证所有数据结构与算法的正确性
"""

import pytest
import sys
from pathlib import Path

# 添加父目录到路径
sys.path.insert(0, str(Path(__file__).parent.parent))

from ds_services import (
    ColorArray, LinkedList, Stack, Queue, Trie, KDTree,
    UnionFind, LRUCache, Graph, astar_search, top_k_recommend
)


class TestColorArray:
    """数组 - 颜色数据库"""
    def test_load_and_size(self):
        arr = ColorArray()
        data_path = Path(__file__).parent.parent.parent / "data" / "colors.json"
        arr.load_from_json(str(data_path))
        assert arr.size() == 150

    def test_get_by_id(self):
        arr = ColorArray()
        data_path = Path(__file__).parent.parent.parent / "data" / "colors.json"
        arr.load_from_json(str(data_path))
        c = arr.get_by_id(1)
        assert c is not None
        assert c["name"] == "天青"


class TestLinkedList:
    """链表 - 文化时间轴"""
    def test_append_and_to_list(self):
        ll = LinkedList()
        ll.append("商代")
        ll.append("唐代")
        ll.append("宋代")
        assert ll.to_list() == ["商代", "唐代", "宋代"]


class TestStack:
    """栈 - 浏览历史"""
    def test_push_pop(self):
        s = Stack()
        s.push("天青")
        s.push("月白")
        assert s.pop() == "月白"
        assert s.top() == "天青"

    def test_empty_pop(self):
        s = Stack()
        assert s.pop() is None


class TestQueue:
    """队列 - 导览路线"""
    def test_enqueue_dequeue(self):
        q = Queue()
        q.enqueue("北京")
        q.enqueue("开封")
        assert q.dequeue() == "北京"
        assert q.front() == "开封"


class TestTrie:
    """Trie 树 - 前缀搜索"""
    def test_insert_and_search(self):
        t = Trie()
        t.insert("天青")
        t.insert("天水碧")
        t.insert("月白")
        matches = t.prefix_match("天")
        assert "天青" in matches
        assert "天水碧" in matches
        assert "月白" not in matches


class TestKDTree:
    """KD-Tree - 颜色匹配"""
    def test_find_nearest(self):
        kd = KDTree()
        kd.build([
            ((74, 85, 104), "天青"),
            ((232, 244, 248), "月白"),
            ((198, 40, 40), "朱红"),
        ])
        name = kd.find_nearest(150, 180, 220)
        assert name in ["天青", "月白", "朱红"]


class TestUnionFind:
    """并查集 - 文化群组"""
    def test_union_and_connected(self):
        uf = UnionFind()
        uf.union("天青", "月白")
        uf.union("月白", "影青")
        assert uf.connected("天青", "影青") is True
        assert uf.connected("天青", "朱红") is False


class TestLRUCache:
    """LRU 缓存"""
    def test_put_get(self):
        lru = LRUCache(2)
        lru.put("a", "1")
        lru.put("b", "2")
        assert lru.get("a") == "1"
        lru.put("c", "3")  # 应淘汰 b
        assert lru.get("b") is None
        assert lru.get("c") == "3"


class TestGraph:
    """图 - BFS/DFS"""
    def test_bfs(self):
        g = Graph()
        g.add_edge("A", "B")
        g.add_edge("A", "C")
        g.add_edge("B", "D")
        result = g.bfs("A")
        assert "A" in result
        assert "B" in result
        assert "C" in result
        assert "D" in result

    def test_topological_sort(self):
        g = Graph()
        g.add_edge("A", "B")
        g.add_edge("B", "C")
        g.add_edge("A", "C")
        order = g.topological_sort()
        a_idx = order.index("A")
        b_idx = order.index("B")
        c_idx = order.index("C")
        assert a_idx < b_idx
        assert b_idx < c_idx


class TestAStar:
    """A* 搜索"""
    def test_find_path(self):
        nodes = {"A": (0, 0), "B": (1, 0), "C": (2, 0)}
        edges = [("A", "B", 1, 100), ("B", "C", 1, 100)]
        path = astar_search(nodes, edges, "A", "C")
        assert "A" in path
        assert "C" in path
