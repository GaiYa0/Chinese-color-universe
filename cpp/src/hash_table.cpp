#include "hash_table.hpp"
#include <functional>

namespace ds {
size_t HashTable::hash(const std::string& key) const {
    size_t h = 0;
    for (char c : key) h = h * 31 + static_cast<size_t>(c);
    return h % capacity;
}

HashTable::HashTable(size_t cap) : capacity(cap) { buckets.resize(capacity); }

void HashTable::insert(const std::string& key, const ColorInfo& value) {
    size_t i = hash(key);
    for (auto& p : buckets[i])
        if (p.first == key) { p.second = value; return; }
    buckets[i].emplace_back(key, value);
}

bool HashTable::get(const std::string& key, ColorInfo& out) const {
    size_t i = hash(key);
    for (const auto& p : buckets[i])
        if (p.first == key) { out = p.second; return true; }
    return false;
}

bool HashTable::contains(const std::string& key) const {
    ColorInfo tmp;
    return get(key, tmp);
}
} // namespace ds
