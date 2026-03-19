#include "stack.hpp"
#include <stdexcept>

namespace ds {
void Stack::push(const std::string& item) { data.push_back(item); }

std::string Stack::pop() {
    if (data.empty()) throw std::runtime_error("stack empty");
    std::string r = data.back();
    data.pop_back();
    return r;
}

std::string Stack::top() const {
    if (data.empty()) throw std::runtime_error("stack empty");
    return data.back();
}
} // namespace ds
