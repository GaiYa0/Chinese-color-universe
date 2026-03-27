# 中国色·万物生 —— 中国传统色彩文化探索平台

> 数据结构课程设计 · 三层架构 · 12+ 数据结构与算法

## 项目概述

本系统以**中国传统色彩文化**为主题，深度应用**多种数据结构与算法**，实现一个集文化展示、智能搜索、颜色工具链、知识图谱与数据可视化于一体的综合平台。

前端包含两套实现：

| 目录 | 技术栈 | 说明 |
|------|--------|------|
| **`universe/`** | Next.js 16 · React 19 · Tailwind CSS 4 | **中国色宇宙**：主站体验，含工具页、星系、地图、时间轴、知识图谱等 |
| **`frontend/`** | Vite · React 18 | 经典 SPA，可与 `run.sh` 一键联调后端 |

数据与算法服务仍由 **`backend/`（FastAPI）** 与可选 **`cpp/`** 演示程序提供。

## 系统架构

```
用户界面层 (Next.js / React + Vite)
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
| 高级 | KD-Tree | 颜色最近邻匹配 | O(log n) |
| 高级 | Priority Queue | Top-K 推荐 | O(log k) |
| 高级 | Union-Find | 文化群组 | O(α(n)) |
| 高级 | LRU Cache | 查询优化 | O(1) |

## 算法模块

- **DFS / BFS**：图遍历，文化关系探索  
- **拓扑排序**：Kahn 算法，颜色历史演化时间线  
- **A\***：文化导览路线规划  

## 快速开始

### 环境要求

- Python 3.9+
- Node.js 18+（推荐 20+）
- **pnpm**（`universe` 推荐使用）或 npm
- CMake 3.10+（可选，用于 C++ 演示）

### 方式 A：启动「中国色宇宙」（Next.js，推荐）

```bash
cd universe
pnpm install   # 或 npm install
pnpm dev       # 默认 http://localhost:3000
```

生产构建：

```bash
cd universe
pnpm build
pnpm start
```

### 方式 B：`run.sh` 联调经典前后端

脚本会启动 **FastAPI（8000）** 与 **Vite 前端（3000）**：

```bash
./run.sh
```

访问 http://localhost:3000  

（若仅启动后端，见下方「仅后端」。）

### 仅启动后端

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 仅启动经典 Vite 前端

```bash
cd frontend
npm install
npm run dev
```

### 编译 C++ 演示（可选）

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
├── data/                      # 数据文件
│   ├── colors.json            # 中国传统色（约 246 条，供前端/服务读取）
│   ├── cultural_relations.json
│   ├── cultural_map.json
│   └── color_groups.json
├── universe/                  # Next.js「中国色宇宙」
│   ├── src/app/               # App Router：/tools、/galaxy、/map、/timeline 等
│   ├── src/modules/           # 按领域拆分（toolkit、explore、graph…）
│   └── package.json
├── cpp/                       # C++ 数据结构层
│   ├── include/
│   ├── src/
│   └── CMakeLists.txt
├── backend/                   # Python 服务层
│   ├── main.py
│   ├── ds_services.py
│   └── requirements.txt
├── frontend/                  # Vite + React 经典前端
│   ├── src/
│   └── package.json
├── docs/
├── scripts/
└── run.sh                     # 一键启动 backend + frontend（Vite）
```

## 核心功能

### 中国色宇宙（`universe`）

1. **今日一色 / 色名详情**：单页展示传统色与典故  
2. **色览与探索**：时间轴、星系视图等可视化  
3. **文化地图**：地域与热力相关展示  
4. **知识图谱**：关系网络浏览  
5. **中国色工具系统**（`/tools`）：颜色转换、中国色匹配（KD-Tree）、调色器、渐变生成、图片取色（K-Means）、配色方案（Top-K）、相似推荐（K 近邻）等；工具入口采用玻璃拟态、渐变发光边框与 3D 倾斜等现代交互  
6. **传统配色方案**（`/tools/schemes`）：方案列表与详情页，含纹饰示意与中国风 UI 展示组件  

### 经典前端 + 后端

1. **色览**：浏览中国传统色，Trie 前缀搜索  
2. **AI 识色**：上传图片 / 输入 RGB，KD-Tree 匹配最接近中国色  
3. **文化地图**：A\* 规划文化导览路线  
4. **知识图谱**：BFS/DFS/拓扑排序可视化  
5. **数据看板**：朝代、地域、诗词统计  

## 课程设计说明

本项目满足《数据结构》课程设计的常见要求：

- 7 种基础数据结构  
- 5 种高级数据结构  
- 图算法（DFS、BFS、拓扑、A\*）  
- 完整三层架构  
- 可运行、模块化、带注释  

（具体代码行数随迭代变化，以仓库为准。）

## 许可证

MIT
