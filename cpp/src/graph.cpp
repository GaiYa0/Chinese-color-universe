#include "graph.hpp"
#include <queue>
#include <stack>
#include <unordered_set>
#include <algorithm>

namespace ds {
void Graph::addNode(const std::string& id, const std::string& type) {
    nodes[id] = {id, type};
    if (adjList.find(id) == adjList.end()) adjList[id] = {};
}

void Graph::addEdge(const std::string& from, const std::string& to, int weight) {
    addNode(from, "unknown");
    addNode(to, "unknown");
    adjList[from].emplace_back(to, weight);
}

std::vector<std::string> Graph::BFS(const std::string& start) {
    std::vector<std::string> result;
    std::queue<std::string> q;
    std::unordered_set<std::string> visited;
    q.push(start);
    visited.insert(start);
    while (!q.empty()) {
        std::string u = q.front(); q.pop();
        result.push_back(u);
        for (const auto& p : adjList[u]) {
            if (visited.find(p.first) == visited.end()) {
                visited.insert(p.first);
                q.push(p.first);
            }
        }
    }
    return result;
}

void dfsHelper(const std::string& u, std::unordered_map<std::string, std::vector<std::pair<std::string,int>>>& adj,
    std::unordered_set<std::string>& visited, std::vector<std::string>& result) {
    visited.insert(u);
    result.push_back(u);
    for (const auto& p : adj[u])
        if (visited.find(p.first) == visited.end()) dfsHelper(p.first, adj, visited, result);
}

std::vector<std::string> Graph::DFS(const std::string& start) {
    std::vector<std::string> result;
    std::unordered_set<std::string> visited;
    dfsHelper(start, adjList, visited, result);
    return result;
}

std::vector<std::string> Graph::topologicalSort() {
    std::unordered_map<std::string, int> inDegree;
    for (const auto& p : adjList) inDegree[p.first];
    for (const auto& p : adjList)
        for (const auto& e : p.second) ++inDegree[e.first];
    std::queue<std::string> q;
    for (const auto& p : inDegree)
        if (p.second == 0) q.push(p.first);
    std::vector<std::string> result;
    while (!q.empty()) {
        std::string u = q.front(); q.pop();
        result.push_back(u);
        for (const auto& e : adjList[u]) {
            if (--inDegree[e.first] == 0) q.push(e.first);
        }
    }
    return result;
}
} // namespace ds
