#pragma once
#include <vector>
#include <string>

namespace ds {
// 数组 - 存储颜色数据库
template<typename T>
class ColorArray {
    std::vector<T> data;
public:
    void push_back(const T& item) { data.push_back(item); }
    T& operator[](size_t i) { return data[i]; }
    const T& operator[](size_t i) const { return data[i]; }
    size_t size() const { return data.size(); }
    void clear() { data.clear(); }
};
} // namespace ds
