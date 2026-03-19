#pragma once
#include <vector>
#include <string>

namespace ds {
// 栈 - 浏览历史
class Stack {
    std::vector<std::string> data;
public:
    void push(const std::string& item);
    std::string pop();
    std::string top() const;
    bool empty() const { return data.empty(); }
    size_t size() const { return data.size(); }
};
} // namespace ds
