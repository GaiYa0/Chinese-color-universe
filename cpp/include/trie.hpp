#pragma once
#include <map>
#include <string>
#include <vector>

namespace ds {
// Trie树 - 颜色名称搜索与自动补全 O(k)
struct TrieNode {
    std::map<char, TrieNode*> child;
    bool isWord = false;
};

class Trie {
    TrieNode* root;
    void collectWords(TrieNode* node, const std::string& prefix, std::vector<std::string>& result);
public:
    Trie();
    ~Trie();
    void insert(const std::string& word);
    bool search(const std::string& word) const;
    std::vector<std::string> prefixMatch(const std::string& prefix);
};
} // namespace ds
