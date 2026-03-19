#include "kdtree.hpp"
#include <cmath>
#include <algorithm>

namespace ds {
KDTree::KDTree() : root(nullptr) {}

KDTree::~KDTree() {
    auto freeKD = [](KDNode* n) {
        if (!n) return;
        freeKD(n->left);
        freeKD(n->right);
        delete n;
    };
    freeKD(root);
}

long long KDTree::dist(int r1, int g1, int b1, int r2, int g2, int b2) {
    long long dr = r1 - r2, dg = g1 - g2, db = b1 - b2;
    return dr * dr + dg * dg + db * db;
}

KDNode* KDTree::build(std::vector<std::pair<std::array<int,3>, std::string>>& points, int depth) {
    if (points.empty()) return nullptr;
    int axis = depth % 3;
    std::nth_element(points.begin(), points.begin() + points.size() / 2, points.end(),
        [axis](const auto& a, const auto& b) { return a.first[axis] < b.first[axis]; });
    auto mid = points.begin() + points.size() / 2;
    KDNode* n = new KDNode((*mid).first[0], (*mid).first[1], (*mid).first[2], (*mid).second);
    std::vector<std::pair<std::array<int,3>, std::string>> left(points.begin(), mid),
        right(mid + 1, points.end());
    n->left = build(left, depth + 1);
    n->right = build(right, depth + 1);
    return n;
}

void KDTree::buildTree(const std::vector<std::pair<std::array<int,3>, std::string>>& colors) {
    auto pts = colors;
    root = build(pts, 0);
}

void KDTree::nearest(KDNode* node, int r, int g, int b, int depth, KDNode*& best, long long& bestDist) {
    if (!node) return;
    long long d = dist(r, g, b, node->r, node->g, node->b);
    if (d < bestDist) { bestDist = d; best = node; }
    int axis = depth % 3;
    int val = (axis == 0) ? r : (axis == 1) ? g : b;
    int nodeVal = (axis == 0) ? node->r : (axis == 1) ? node->g : node->b;
    KDNode* near = (val < nodeVal) ? node->left : node->right;
    KDNode* far = (val < nodeVal) ? node->right : node->left;
    nearest(near, r, g, b, depth + 1, best, bestDist);
    long long planeDist = (val - nodeVal) * (long long)(val - nodeVal);
    if (planeDist < bestDist) nearest(far, r, g, b, depth + 1, best, bestDist);
}

std::string KDTree::findNearest(int r, int g, int b) {
    if (!root) return "";
    KDNode* best = root;
    long long bestDist = dist(r, g, b, root->r, root->g, root->b);
    nearest(root, r, g, b, 0, best, bestDist);
    return best ? best->name : "";
}
} // namespace ds
