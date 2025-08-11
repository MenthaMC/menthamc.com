#!/bin/bash

# 开发环境启动脚本

set -e

echo "🛠️  启动开发环境..."

# 检查环境文件
if [ ! -f ".env" ]; then
    echo "📝 创建环境配置文件..."
    cp .env.example .env
    echo "请编辑 .env 文件，设置必要的环境变量"
fi

# 加载环境变量
if [ -f ".env" ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# 检查必要的环境变量
if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ 请在 .env 文件中设置 GITHUB_TOKEN"
    exit 1
fi

# 安装依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
fi

# 启动开发服务器
echo "🚀 启动开发服务器..."
npm run dev