#include "tree.hpp"
#include <algorithm>

namespace ds {
ColorTree::ColorTree() { root = new TreeNode("中国传统色"); }

ColorTree::~ColorTree() {
    auto freeTree = [](TreeNode* n) {
        if (!n) return;
        for (auto c : n->children) freeTree(c);
        delete n;
    };
    freeTree(root);
}

void ColorTree::addCategory(const std::string& parentName, const std::string& name, const std::vector<std::string>& colors) {
    TreeNode* p = find(parentName);
    if (!p) return;
    TreeNode* n = new TreeNode(name);
    n->colors = colors;
    p->children.push_back(n);
}

TreeNode* ColorTree::find(const std::string& name) {
    if (root->name == name) return root;
    for (auto c : root->children) {
        if (c->name == name) return c;
        for (auto gc : c->children)
            if (gc->name == name) return gc;
    }
    return nullptr;
}
} // namespace ds
