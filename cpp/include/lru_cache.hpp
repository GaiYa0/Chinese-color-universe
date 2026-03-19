#pragma once
#include <string>
#include <unordered_map>
#include <list>

namespace ds {
// LRU缓存 - 查询优化 O(1)
struct CacheNode {
    std::string key;
    std::string value;
    CacheNode *prev = nullptr, *next = nullptr;
};

class LRUCache {
    size_t capacity;
    std::unordered_map<std::string, CacheNode*> map;
    CacheNode *head = nullptr, *tail = nullptr;
    void moveToFront(CacheNode* node);
    void addToFront(CacheNode* node);
    void removeNode(CacheNode* node);
public:
    explicit LRUCache(size_t cap = 100);
    ~LRUCache();
    std::string get(const std::string& key);
    void put(const std::string& key, const std::string& value);
};
} // namespace ds
