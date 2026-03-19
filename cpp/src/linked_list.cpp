#include "linked_list.hpp"
#include <stdexcept>

namespace ds {
LinkedList::LinkedList() : head(nullptr) {}

LinkedList::~LinkedList() {
    while (head) {
        ListNode* t = head;
        head = head->next;
        delete t;
    }
}

void LinkedList::append(const std::string& data) {
    if (!head) {
        head = new ListNode(data);
        return;
    }
    ListNode* p = head;
    while (p->next) p = p->next;
    p->next = new ListNode(data);
}

void LinkedList::insert(size_t pos, const std::string& data) {
    if (pos == 0) {
        ListNode* n = new ListNode(data);
        n->next = head;
        head = n;
        return;
    }
    ListNode* p = head;
    for (size_t i = 0; i < pos - 1 && p; ++i) p = p->next;
    if (!p) return;
    ListNode* n = new ListNode(data);
    n->next = p->next;
    p->next = n;
}

std::string LinkedList::get(size_t index) const {
    ListNode* p = head;
    for (size_t i = 0; i < index && p; ++i) p = p->next;
    if (!p) throw std::out_of_range("index");
    return p->data;
}

size_t LinkedList::size() const {
    size_t c = 0;
    for (ListNode* p = head; p; p = p->next) ++c;
    return c;
}
} // namespace ds
