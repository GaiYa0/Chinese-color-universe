#pragma once
#include <deque>
#include <string>

namespace ds {
// 队列 - 文化导览路线
class Queue {
    std::deque<std::string> data;
public:
    void enqueue(const std::string& item);
    std::string dequeue();
    std::string front() const;
    bool empty() const { return data.empty(); }
    size_t size() const { return data.size(); }
};
} // namespace ds
