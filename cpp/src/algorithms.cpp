#include "algorithms.hpp"
#include <queue>
#include <cmath>
#include <unordered_map>
#include <algorithm>

namespace ds {
double AStar::heuristic(const std::string& a, const std::string& b) {
    if (!nodes.count(a) || !nodes.count(b)) return 1e9;
    double dx = nodes[a].x - nodes[b].x;
    double dy = nodes[a].y - nodes[b].y;
    return std::sqrt(dx * dx + dy * dy);
}

void AStar::addCity(const std::string& name, double x, double y) {
    nodes[name] = {name, x, y};
}

void AStar::addRoute(const std::string& from, const std::string& to, double dist, int cultureScore) {
    routes.push_back({from, to, dist, cultureScore});
}

std::vector<std::string> AStar::findPath(const std::string& start, const std::string& goal) {
    struct PQNode {
        std::string name;
        double g, f;
        bool operator>(const PQNode& o) const { return f > o.f; }
    };
    std::priority_queue<PQNode, std::vector<PQNode>, std::greater<PQNode>> pq;
    std::unordered_map<std::string, double> gScore;
    std::unordered_map<std::string, std::string> cameFrom;
    gScore[start] = 0;
    pq.push({start, 0, heuristic(start, goal)});
    while (!pq.empty()) {
        PQNode cur = pq.top(); pq.pop();
        if (cur.name == goal) {
            std::vector<std::string> path;
            for (std::string at = goal; !at.empty(); at = cameFrom.count(at) ? cameFrom[at] : "")
                path.push_back(at);
            std::reverse(path.begin(), path.end());
            return path;
        }
        if (cur.g > gScore[cur.name]) continue;
        for (const auto& r : routes) {
            std::string next;
            if (r.from == cur.name) next = r.to;
            else if (r.to == cur.name) next = r.from;
            else continue;
            double cost = r.distance * (1.0 - r.cultureScore / 200.0);
            double tent = gScore[cur.name] + cost;
            if (!gScore.count(next) || tent < gScore[next]) {
                cameFrom[next] = cur.name;
                gScore[next] = tent;
                pq.push({next, tent, tent + heuristic(next, goal)});
            }
        }
    }
    return {};
}
} // namespace ds
