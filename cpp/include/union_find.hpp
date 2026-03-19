#pragma once
#include <vector>
#include <string>
#include <unordered_map>

namespace ds {
// 并查集 - 文化群组
class UnionFind {
    std::vector<int> parent;
    std::vector<int> rank;
    std::unordered_map<std::string, int> nameToId;
    std::vector<std::string> idToName;
public:
    void addElement(const std::string& name);
    int find(const std::string& name);
    void unite(const std::string& a, const std::string& b);
    bool connected(const std::string& a, const std::string& b);
    std::vector<std::string> getGroup(const std::string& name);
};
} // namespace ds
