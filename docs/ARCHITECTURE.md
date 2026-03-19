# 中国色·万物生 - 系统架构文档

## 一、总体架构

系统采用经典三层架构，各层职责明确：

```
┌─────────────────────────────────────────────────────────────┐
│                    用户界面层 (React/Vite)                     │
│  色览 | AI识色 | 色宇宙 | 文化地图 | 知识图谱 | 数据看板          │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP / REST API
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  文化服务层 (Python FastAPI)                   │
│  数据管理 | 搜索服务 | 推荐系统 | 图谱构建 | 业务逻辑            │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ 数据与算法调用
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                数据结构算法层 (C++ / Python DS)                 │
│  Array | List | Stack | Queue | Tree | Graph | Hash          │
│  Trie | KD-Tree | Union-Find | LRU | DFS/BFS | A*            │
└─────────────────────────────────────────────────────────────┘
```

## 二、数据结构映射表

| 功能模块     | 数据结构       | 实现位置     | 用途说明           |
|--------------|----------------|--------------|--------------------|
| 颜色存储     | Array          | ds_services  | 150 种颜色主存储    |
| 时间轴       | Linked List    | ds_services  | 文化发展时间线      |
| 浏览历史     | Stack          | main.py      | 用户浏览记录        |
| 导览路线     | Queue          | main.py      | 文化导览排队        |
| 分类树       | Tree           | ds_services  | 颜色分类层级        |
| 快速查询     | Hash + LRU     | ds_services  | 颜色名 → 详情 O(1) |
| 前缀搜索     | Trie           | ds_services  | 自动补全 O(k)       |
| 颜色匹配     | KD-Tree        | ds_services  | 最近邻 O(log n)     |
| 文化群组     | Union-Find     | ds_services  | 同色系归类          |
| 关系网络     | Graph          | ds_services  | 邻接表存储          |
| Top-K 推荐   | Priority Queue| ds_services  | 堆实现              |
| 路线规划     | A*             | ds_services  | 启发式搜索          |

## 三、API 设计

| 方法 | 路径                    | 数据结构   | 说明           |
|------|-------------------------|------------|----------------|
| GET  | /api/colors             | Array      | 获取全部颜色   |
| GET  | /api/colors/search      | Trie       | 前缀搜索       |
| GET  | /api/colors/{name}      | LRU+Hash   | 单色详情       |
| POST | /api/colors/match       | KD-Tree    | RGB 匹配       |
| POST | /api/colors/{name}/recommend | Priority Queue | 推荐   |
| GET  | /api/colors/{name}/group| Union-Find | 文化群组       |
| POST | /api/history            | Stack      | 浏览历史       |
| POST | /api/tour               | A*         | 导览路线       |
| GET  | /api/graph/bfs          | Graph      | BFS            |
| GET  | /api/graph/dfs          | Graph      | DFS            |
| GET  | /api/graph/topological  | Graph      | 拓扑排序       |

## 四、数据流

1. **颜色搜索**：用户输入 → Trie.prefix_match → 过滤颜色列表 → 返回
2. **AI 识色**：RGB/图片 → KD-Tree.find_nearest → 返回最接近中国色
3. **文化路线**：起点/终点 → A* → 返回最优路径序列
