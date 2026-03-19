#include "queue.hpp"
#include <stdexcept>

namespace ds {
void Queue::enqueue(const std::string& item) { data.push_back(item); }

std::string Queue::dequeue() {
    if (data.empty()) throw std::runtime_error("queue empty");
    std::string r = data.front();
    data.pop_front();
    return r;
}

std::string Queue::front() const {
    if (data.empty()) throw std::runtime_error("queue empty");
    return data.front();
}
} // namespace ds
