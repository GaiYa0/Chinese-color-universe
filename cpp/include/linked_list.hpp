#pragma once
#include <string>

namespace ds {
// 链表节点 - 文化时间轴
struct ListNode {
    std::string data;
    ListNode* next;
    ListNode(const std::string& d) : data(d), next(nullptr) {}
};

class LinkedList {
    ListNode* head;
public:
    LinkedList();
    ~LinkedList();
    void append(const std::string& data);
    void insert(size_t pos, const std::string& data);
    std::string get(size_t index) const;
    size_t size() const;
    ListNode* getHead() { return head; }
};
} // namespace ds
