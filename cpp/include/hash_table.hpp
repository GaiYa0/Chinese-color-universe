#pragma once
#include <string>
#include <vector>
#include <list>

namespace ds {
// 哈希表 - 快速查询颜色 O(1)
struct ColorInfo {
    int id;
    std::string name;
    std::string hex;
    int r, g, b;
};

class HashTable {
    size_t capacity;
    std::vector<std::list<std::pair<std::string, ColorInfo>>> buckets;
    size_t hash(const std::string& key) const;
public:
    explicit HashTable(size_t cap = 256);
    void insert(const std::string& key, const ColorInfo& value);
    bool get(const std::string& key, ColorInfo& out) const;
    bool contains(const std::string& key) const;
};
} // namespace ds
