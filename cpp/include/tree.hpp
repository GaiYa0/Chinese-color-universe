#pragma once
#include <string>
#include <vector>

namespace ds {
// 树节点 - 颜色分类树
struct TreeNode {
    std::string name;
    std::vector<std::string> colors;
    std::vector<TreeNode*> children;
    TreeNode(const std::string& n) : name(n) {}
};

class ColorTree {
    TreeNode* root;
public:
    ColorTree();
    ~ColorTree();
    TreeNode* getRoot() { return root; }
    void addCategory(const std::string& parent, const std::string& name, const std::vector<std::string>& colors);
    TreeNode* find(const std::string& name);
};
} // namespace ds
