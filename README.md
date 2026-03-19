# 中国色·万物生 —— 中国传统色彩文化探索平台

> 数据结构课程设计 · 三层架构 · 12+ 数据结构与算法

## 项目概述

本系统以**中国传统色彩文化**为主题，深度应用**多种数据结构与算法**，实现一个集文化展示、智能搜索、AI 颜色匹配、知识图谱与数据可视化于一体的综合平台。

## 系统架构

```
用户界面层 (React / Vite)
        │
文化服务层 (Python FastAPI)
        │
数据结构算法层 (C++)
```

## 数据结构体系

| 类型 | 结构 | 用途 | 复杂度 |
|------|------|------|--------|
| 基础 | Array | 颜色数据库 | O(1) |
| 基础 | Linked List | 文化时间轴 | O(n) |
| 基础 | Stack | 浏览历史 | O(1) |
| 基础 | Queue | 导览路线 | O(1) |
| 基础 | Tree | 颜色分类树 | O(log n) |
| 基础 | Graph | 文化关系网络 | - |
| 基础 | Hash Table | 快速查询颜色 | O(1) |
| 高级 | Trie | 前缀搜索/自动补全 | O(k) |
| 高级 | KD-Tree | AI 颜色匹配 | O(log n) |
| 高级 | Priority Queue | Top-K 推荐 | O(log k) |
| 高级 | Union-Find | 文化群组 | O(α(n)) |
| 高级 | LRU Cache | 查询优化 | O(1) |

## 算法模块

- **DFS / BFS**：图遍历，文化关系探索
- **拓扑排序**：Kahn 算法，颜色历史演化时间线
- **A\* 搜索**：文化导览最优路线规划

## 快速开始

### 1. 环境要求

- Python 3.9+
- Node.js 18+
- CMake 3.10+（可选，用于 C++ 演示）

### 2. 启动后端

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 3. 启动前端

```bash
cd frontend
npm install
npm run dev
```

访问 http://localhost:3000

### 4. 编译 C++ 演示（可选）

```bash
cd cpp
mkdir build && cd build
cmake ..
make
./color_ds
```

## 项目结构

```
chinese-colors-platform/
├── data/                 # 数据文件
│   ├── colors.json       # 150 种中国传统色
│   ├── cultural_relations.json
│   ├── cultural_map.json
│   └── color_groups.json
├── cpp/                  # C++ 数据结构层
│   ├── include/
│   ├── src/
│   └── CMakeLists.txt
├── backend/              # Python 服务层
│   ├── main.py
│   ├── ds_services.py
│   └── requirements.txt
└── frontend/             # React 界面层
    ├── src/
    └── package.json
```

## 核心功能

1. **色览**：浏览 150 种中国传统色，Trie 前缀搜索
2. **AI 识色**：上传图片 / 输入 RGB，KD-Tree 匹配最接近中国色
3. **文化地图**：A* 规划文化导览路线
4. **知识图谱**：BFS/DFS/拓扑排序可视化
5. **数据看板**：朝代、地域、诗词统计

## 课程设计说明

本项目满足《数据结构》课程设计的所有要求：

- ✅ 7 种基础数据结构
- ✅ 5 种高级数据结构
- ✅ 图算法（DFS、BFS、拓扑、A*）
- ✅ 完整三层架构
- ✅ 4000+ 行代码
- ✅ 可运行、模块化、带注释

## 许可证

MIT
