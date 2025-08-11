#!/bin/bash

# GitHub API 服务启动脚本

set -e

echo "🚀 启动 GitHub API 服务..."

# 检查 Node.js 版本
NODE_VERSION=$(node --version)
echo "Node.js 版本: $NODE_VERSION"

# 检查环境变量
if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ 错误: GITHUB_TOKEN 环境变量未设置"
    echo "请设置 GitHub Personal Access Token"
    exit 1
fi

if [ -z "$GITHUB_USERNAME" ]; then
    echo "⚠️  警告: GITHUB_USERNAME 环境变量未设置，将使用默认值"
fi

# 检查依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
fi

# 构建项目
if [ ! -d "dist" ] || [ "src" -nt "dist" ]; then
    echo "🔨 构建项目..."
    npm run build
fi

# 设置默认环境变量
export NODE_ENV=${NODE_ENV:-production}
export PORT=${PORT:-3000}

echo "🌍 环境: $NODE_ENV"
echo "🔌 端口: $PORT"

# 启动服务
echo "✅ 启动服务..."
exec node dist/app.js