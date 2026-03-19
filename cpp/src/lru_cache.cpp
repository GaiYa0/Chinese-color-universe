#include "lru_cache.hpp"

namespace ds {
LRUCache::LRUCache(size_t cap) : capacity(cap) {}

LRUCache::~LRUCache() {
    CacheNode* p = head;
    while (p) { CacheNode* n = p->next; delete p; p = n; }
}

void LRUCache::addToFront(CacheNode* node) {
    node->prev = nullptr;
    node->next = head;
    if (head) head->prev = node;
    head = node;
    if (!tail) tail = node;
}

void LRUCache::removeNode(CacheNode* node) {
    if (node->prev) node->prev->next = node->next;
    else head = node->next;
    if (node->next) node->next->prev = node->prev;
    else tail = node->prev;
}

void LRUCache::moveToFront(CacheNode* node) {
    removeNode(node);
    addToFront(node);
}

std::string LRUCache::get(const std::string& key) {
    if (map.find(key) == map.end()) return "";
    CacheNode* node = map[key];
    moveToFront(node);
    return node->value;
}

void LRUCache::put(const std::string& key, const std::string& value) {
    if (map.find(key) != map.end()) {
        map[key]->value = value;
        moveToFront(map[key]);
        return;
    }
    if (map.size() >= capacity && tail) {
        CacheNode* old = tail;
        removeNode(old);
        map.erase(old->key);
        delete old;
    }
    CacheNode* node = new CacheNode{key, value, nullptr, nullptr};
    addToFront(node);
    map[key] = node;
}
} // namespace ds
