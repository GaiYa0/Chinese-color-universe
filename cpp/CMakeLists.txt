cmake_minimum_required(VERSION 3.10)
project(ChineseColorsDS)

set(CMAKE_CXX_STANDARD 17)

# 基础数据结构
add_executable(color_ds
    src/main.cpp
    src/array.cpp
    src/linked_list.cpp
    src/stack.cpp
    src/queue.cpp
    src/tree.cpp
    src/hash_table.cpp
    src/trie.cpp
    src/kdtree.cpp
    src/union_find.cpp
    src/lru_cache.cpp
    src/graph.cpp
    src/algorithms.cpp
)

# 移除 priority_queue - 使用 std::priority_queue

target_include_directories(color_ds PRIVATE ${CMAKE_SOURCE_DIR}/include)
