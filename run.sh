#!/bin/bash
# 中国色·万物生 - 一键启动

echo "=== 中国色·万物生 启动脚本 ==="

# 启动后端
cd "$(dirname "$0")/backend"
if [ ! -d "venv" ]; then
  echo "创建虚拟环境..."
  python3 -m venv venv 2>/dev/null || true
fi
source venv/bin/activate 2>/dev/null || true
pip install -r requirements.txt -q
echo "启动后端 http://localhost:8000"
uvicorn main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# 启动前端
cd "../frontend"
if [ ! -d "node_modules" ]; then
  echo "安装前端依赖..."
  npm install
fi
echo "启动前端 http://localhost:3000"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "后端 PID: $BACKEND_PID"
echo "前端 PID: $FRONTEND_PID"
echo ""
echo "按 Ctrl+C 停止服务"
wait
