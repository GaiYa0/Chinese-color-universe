#pragma once
#include <string>
#include <vector>

namespace ds {
// KD-Tree - AI颜色匹配核心 O(log n)
struct KDNode {
    int r, g, b;
    std::string name;
    KDNode* left = nullptr;
    KDNode* right = nullptr;
    KDNode(int r_, int g_, int b_, const std::string& n) : r(r_), g(g_), b(b_), name(n) {}
};

class KDTree {
    KDNode* root;
    KDNode* build(std::vector<std::pair<std::array<int,3>, std::string>>& points, int depth);
    void nearest(KDNode* node, int r, int g, int b, int depth, KDNode*& best, long long& bestDist);
    long long dist(int r1, int g1, int b1, int r2, int g2, int b2);
public:
    KDTree();
    ~KDTree();
    void buildTree(const std::vector<std::pair<std::array<int,3>, std::string>>& colors);
    std::string findNearest(int r, int g, int b);
};
} // namespace ds
