#pragma once
#include <string>
#include <vector>
#include <unordered_map>
#include <queue>

namespace ds {
// 图 - 中华文化关系图 (邻接表)
struct GraphNode {
    std::string id;
    std::string type; // color, relic, dynasty, poet, location
};

class Graph {
    std::unordered_map<std::string, std::vector<std::pair<std::string, int>>> adjList;
    std::unordered_map<std::string, GraphNode> nodes;
public:
    void addNode(const std::string& id, const std::string& type);
    void addEdge(const std::string& from, const std::string& to, int weight = 1);
    std::vector<std::string> BFS(const std::string& start);
    std::vector<std::string> DFS(const std::string& start);
    std::vector<std::string> topologicalSort();
};
} // namespace ds
