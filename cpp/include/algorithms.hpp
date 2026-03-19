#pragma once
#include <string>
#include <vector>
#include <unordered_map>

namespace ds {
// A*搜索 - 文化导览最优路线
struct MapNode {
    std::string name;
    double x, y;
};

struct Route {
    std::string from, to;
    double distance;
    int cultureScore;
};

class AStar {
    std::unordered_map<std::string, MapNode> nodes;
    std::vector<Route> routes;
    double heuristic(const std::string& a, const std::string& b);
public:
    void addCity(const std::string& name, double x, double y);
    void addRoute(const std::string& from, const std::string& to, double dist, int cultureScore);
    std::vector<std::string> findPath(const std::string& start, const std::string& goal);
};

// 优先队列 - Top-K推荐
struct Recommendation {
    std::string colorName;
    double score;
    bool operator<(const Recommendation& o) const { return score < o.score; }
};
} // namespace ds
