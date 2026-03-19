#include "union_find.hpp"
#include <algorithm>

namespace ds {
void UnionFind::addElement(const std::string& name) {
    if (nameToId.count(name)) return;
    int id = static_cast<int>(idToName.size());
    nameToId[name] = id;
    idToName.push_back(name);
    parent.push_back(id);
    rank.push_back(0);
}

int UnionFind::find(const std::string& name) {
    if (!nameToId.count(name)) return -1;
    int id = nameToId[name];
    while (parent[id] != id) {
        parent[id] = parent[parent[id]];
        id = parent[id];
    }
    return id;
}

void UnionFind::unite(const std::string& a, const std::string& b) {
    addElement(a);
    addElement(b);
    int ra = find(a), rb = find(b);
    if (ra == rb || ra < 0 || rb < 0) return;
    if (rank[ra] < rank[rb]) std::swap(ra, rb);
    parent[rb] = ra;
    if (rank[ra] == rank[rb]) ++rank[ra];
}

bool UnionFind::connected(const std::string& a, const std::string& b) {
    int ra = find(a), rb = find(b);
    return ra >= 0 && rb >= 0 && ra == rb;
}

std::vector<std::string> UnionFind::getGroup(const std::string& name) {
    int rootId = find(name);
    if (rootId < 0) return {};
    std::vector<std::string> result;
    for (size_t i = 0; i < idToName.size(); ++i) {
        int r = static_cast<int>(i);
        while (parent[r] != r) r = parent[r];
        if (r == rootId) result.push_back(idToName[i]);
    }
    return result;
}
} // namespace ds
