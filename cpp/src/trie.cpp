#include "trie.hpp"
#include <algorithm>

namespace ds {
Trie::Trie() { root = new TrieNode(); }

Trie::~Trie() {
    auto freeTrie = [](TrieNode* n) {
        if (!n) return;
        for (auto& p : n->child) freeTrie(p.second);
        delete n;
    };
    freeTrie(root);
}

void Trie::insert(const std::string& word) {
    TrieNode* p = root;
    for (char c : word) {
        if (c >= 'A' && c <= 'Z') c += 32; // 简化：ASCII
        if (p->child.find(c) == p->child.end()) p->child[c] = new TrieNode();
        p = p->child[c];
    }
    p->isWord = true;
}

bool Trie::search(const std::string& word) const {
    TrieNode* p = root;
    for (char c : word) {
        if (p->child.find(c) == p->child.end()) return false;
        p = p->child[c];
    }
    return p->isWord;
}

void Trie::collectWords(TrieNode* node, const std::string& prefix, std::vector<std::string>& result) {
    if (node->isWord) result.push_back(prefix);
    for (const auto& p : node->child)
        collectWords(p.second, prefix + p.first, result);
}

std::vector<std::string> Trie::prefixMatch(const std::string& prefix) {
    std::vector<std::string> result;
    TrieNode* p = root;
    for (char c : prefix) {
        if (p->child.find(c) == p->child.end()) return result;
        p = p->child[c];
    }
    collectWords(p, prefix, result);
    return result;
}
} // namespace ds
