# 中国色宇宙 · Chinese Color Universe

通过 WebGL / 数据可视化技术，把中国传统颜色文化转化为可以探索的宇宙系统。

## 技术栈

- **Next.js 16** + **React 19**
- **Three.js** + **React Three Fiber** + **Drei**
- **D3.js** · **ECharts**
- **TailwindCSS** · **Framer Motion**
- **TypeScript**

## 六大核心模块

| 模块 | 路径 | 描述 |
|------|------|------|
| 3D 宇宙首页 | `/` | 颜色星球围绕中心旋转，悬停/点击交互 |
| 颜色星空 | `/galaxy` | Force-directed 力导向图，文化关联连线 |
| 知识图谱 | `/knowledge` | BFS/DFS 文化探索路径 |
| 中国色地图 | `/map` | 城市坐标 + 文化色彩卡片 |
| 时间轴 | `/timeline` | 夏商周至清代代表颜色 |
| 今日中国色 | `/today` | 每日一色 + 文化故事 + 收藏 |

## 启动

```bash
cd universe
npm install
npm run dev
```

访问 http://localhost:3000

## 数据源

- `public/data/colors.json` - 中国传统颜色
- `public/data/cultural_relations.json` - 文化关系图
- `public/data/cultural_map.json` - 城市与色彩
- `public/data/color_groups.json` - 色系分组

## 设计风格

- **深色宇宙背景** · **玻璃拟态卡片**
- **粒子光晕** · **空间深度**
- **东方文化 × 未来科技**
