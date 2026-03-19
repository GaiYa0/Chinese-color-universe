/**
 * 《中国色·万物生》—— 数据结构算法层 主程序
 * 演示所有基础与高级数据结构
 */
#include "array.hpp"
#include "linked_list.hpp"
#include "stack.hpp"
#include "queue.hpp"
#include "tree.hpp"
#include "hash_table.hpp"
#include "trie.hpp"
#include "kdtree.hpp"
#include "union_find.hpp"
#include "lru_cache.hpp"
#include "graph.hpp"
#include "algorithms.hpp"
#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <vector>
#include <queue>
#include <cmath>
#include <iomanip>

using namespace ds;

// 简化JSON解析 - 仅用于演示
void runDemo() {
    std::cout << "========== 中国色·万物生 数据结构演示 ==========\n\n";

    // 1. 数组 - 存储颜色
    std::cout << "[1] 数组 Array - 颜色数据库\n";
    ColorArray<std::string> arr;
    arr.push_back("天青"); arr.push_back("月白"); arr.push_back("朱红");
    std::cout << "  存储: 天青, 月白, 朱红. 大小=" << arr.size() << "\n\n";

    // 2. 链表 - 文化时间轴
    std::cout << "[2] 链表 Linked List - 文化时间轴\n";
    LinkedList timeline;
    timeline.append("商代-甲骨文"); timeline.append("汉代-马王堆"); timeline.append("唐代-敦煌");
    std::cout << "  时间轴: " << timeline.get(0) << " -> " << timeline.get(1) << " -> " << timeline.get(2) << "\n\n";

    // 3. 栈 - 浏览历史
    std::cout << "[3] 栈 Stack - 浏览历史\n";
    Stack history;
    history.push("天青"); history.push("月白"); history.push("石青");
    std::cout << "  当前页: " << history.top() << ", 后退-> " << history.pop() << "\n\n";

    // 4. 队列 - 导览路线
    std::cout << "[4] 队列 Queue - 文化导览路线\n";
    Queue tour;
    tour.enqueue("北京"); tour.enqueue("开封"); tour.enqueue("景德镇");
    std::cout << "  路线: " << tour.dequeue() << " -> " << tour.front() << "\n\n";

    // 5. 树 - 颜色分类
    std::cout << "[5] 树 Tree - 颜色分类树\n";
    ColorTree tree;
    tree.addCategory("中国传统色", "青系", {"天青", "石青", "黛蓝"});
    tree.addCategory("中国传统色", "红系", {"朱红", "中国红"});
    std::cout << "  分类: 青系(天青,石青,黛蓝), 红系(朱红,中国红)\n\n";

    // 6. 哈希表 - 快速查询
    std::cout << "[6] 哈希表 Hash Table - O(1)颜色查询\n";
    HashTable ht;
    ht.insert("天青", {1, "天青", "#4A5568", 74, 85, 104});
    ColorInfo ci;
    if (ht.get("天青", ci)) std::cout << "  查询天青: " << ci.hex << " RGB(" << ci.r << "," << ci.g << "," << ci.b << ")\n\n";

    // 7. Trie - 前缀搜索/自动补全
    std::cout << "[7] Trie树 - 颜色名称自动补全 O(k)\n";
    Trie trie;
    trie.insert("天青"); trie.insert("天水碧"); trie.insert("天蓝"); trie.insert("天缥");
    trie.insert("月白"); trie.insert("石青");
    auto completions = trie.prefixMatch("天");
    std::cout << "  输入'天'补全: ";
    for (const auto& s : completions) std::cout << s << " ";
    std::cout << "\n\n";

    // 8. KD-Tree - 颜色匹配
    std::cout << "[8] KD-Tree - AI颜色匹配 O(log n)\n";
    KDTree kdt;
    std::vector<std::pair<std::array<int,3>, std::string>> kdColors = {
        {{74,85,104}, "天青"}, {{232,244,248}, "月白"}, {{198,40,40}, "朱红"}
    };
    kdt.buildTree(kdColors);
    std::string nearest = kdt.findNearest(150, 180, 220);
    std::cout << "  RGB(150,180,220) 最接近: " << nearest << "\n\n";

    // 9. 并查集 - 文化群组
    std::cout << "[9] 并查集 Union-Find - 颜色族群\n";
    UnionFind uf;
    uf.addElement("天青"); uf.addElement("月白"); uf.addElement("影青");
    uf.unite("天青", "月白"); uf.unite("月白", "影青");
    std::cout << "  天青与影青同组: " << (uf.connected("天青", "影青") ? "是" : "否") << "\n\n";

    // 10. LRU缓存 - 查询优化
    std::cout << "[10] LRU Cache - 高频查询 O(1)\n";
    LRUCache lru(3);
    lru.put("天青", "#4A5568"); lru.put("月白", "#E8F4F8"); lru.put("朱红", "#C62828");
    std::cout << "  缓存: 天青=" << lru.get("天青") << ", 月白=" << lru.get("月白") << "\n";
    lru.put("石青", "#1565C0");
    std::cout << "  加入石青后, 朱红被淘汰. 朱红=" << (lru.get("朱红").empty() ? "未命中" : lru.get("朱红")) << "\n\n";

    // 11. 图 - BFS/DFS
    std::cout << "[11] 图 Graph - 文化关系 BFS/DFS\n";
    Graph g;
    g.addEdge("天青", "汝窑", 1); g.addEdge("汝窑", "宋代", 1);
    g.addEdge("朱红", "故宫", 1); g.addEdge("故宫", "明代", 1);
    auto bfs = g.BFS("天青");
    std::cout << "  BFS(天青): "; for (auto& s : bfs) std::cout << s << " "; std::cout << "\n\n";

    // 12. A* - 文化导览
    std::cout << "[12] A*搜索 - 最优文化路线\n";
    AStar astar;
    astar.addCity("北京", 116, 40); astar.addCity("开封", 114, 35);
    astar.addCity("景德镇", 117, 29); astar.addRoute("北京", "开封", 650, 95);
    astar.addRoute("开封", "景德镇", 800, 90);
    auto path = astar.findPath("北京", "景德镇");
    std::cout << "  北京->景德镇: "; for (auto& s : path) std::cout << s << " "; std::cout << "\n";

    std::cout << "\n========== 演示完成 ==========\n";
}

// 优先队列 Top-K 推荐
void demoPriorityQueue() {
    std::cout << "\n[优先队列] Top-K 颜色推荐:\n";
    using Rec = std::pair<double, std::string>;
    auto cmp = [](const Rec& a, const Rec& b) { return a.first > b.first; };
    std::priority_queue<Rec, std::vector<Rec>, decltype(cmp)> pq(cmp);
    pq.push({0.95, "月白"}); pq.push({0.88, "石青"}); pq.push({0.92, "黛蓝"});
    std::cout << "  用户浏览天青, 推荐: ";
    for (int i = 0; i < 3 && !pq.empty(); ++i) {
        std::cout << pq.top().second << "(" << std::fixed << std::setprecision(2) << pq.top().first << ") ";
        pq.pop();
    }
    std::cout << "\n";
}

int main(int argc, char* argv[]) {
    runDemo();
    demoPriorityQueue();
    return 0;
}
