# MenthaMC 官方网站

<div align="center">

![MenthaMC Logo](https://img.shields.io/badge/MenthaMC-Minecraft%20Server-brightgreen?style=for-the-badge)
![Vue 3](https://img.shields.io/badge/Vue-3.x-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

基于 Vue 3 + TypeScript + Vite 构建的现代化 Minecraft 服务端项目官网

[🌐 在线预览](https://menthamc.github.io) | [📖 文档](https://menthamc.github.io/docs/) | [💬 社区](https://discord.gg/menthamc)

</div>

## ✨ 项目特色

- 🚀 **现代化技术栈** - Vue 3 + TypeScript + Vite
- 🌍 **多语言支持** - 支持中文和英文，自动检测浏览器语言
- 📱 **响应式设计** - 完美适配桌面端、平板和移动设备
- 🎨 **精美 UI** - 现代化的设计风格和流畅的动画效果
- ⚡ **高性能** - 基于 Vite 的快速构建和热重载
- 🔧 **TypeScript** - 完整的类型支持，提升开发体验

## 🌍 多语言支持

本网站完全支持多语言功能：

### 支持的语言

- 🇨🇳 **简体中文** (zh-CN) - 默认语言
- 🇺🇸 **English** (en-US) - 英文支持

### 多语言特性

- ✅ 自动检测浏览器语言偏好
- ✅ 实时语言切换，无需刷新页面
- ✅ 语言偏好本地存储
- ✅ 响应式语言选择器
- ✅ 完整的页面翻译覆盖

### 语言文件结构

```
src/locales/
├── index.ts      # i18n 配置和工具函数
├── zh-CN.ts      # 中文翻译文件
└── en-US.ts      # 英文翻译文件
```

## 🏗️ 项目结构

```
menthamc-web/
├── public/                 # 静态资源
├── src/
│   ├── components/         # Vue 组件
│   │   ├── home/          # 首页组件
│   │   ├── download/      # 下载页组件
│   │   └── icons/         # 图标组件
│   ├── composables/       # 组合式函数
│   ├── locales/           # 多语言文件
│   ├── router/            # 路由配置
│   ├── styles/            # 样式文件
│   ├── types/             # TypeScript 类型定义
│   ├── utils/             # 工具函数
│   └── views/             # 页面视图
├── MULTILINGUAL_SUPPORT.md # 多语言支持文档
└── README.md              # 项目说明
```

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 7.0.0 或 yarn >= 1.22.0

### 安装依赖

```bash
# 使用 npm
npm install

# 或使用 yarn
yarn install

# 或使用 pnpm
pnpm install
```

### 开发环境

```bash
# 启动开发服务器
npm run dev

# 或
yarn dev
```

访问 `http://localhost:5173` 查看网站

### 构建生产版本

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

### 类型检查

```bash
# 运行 TypeScript 类型检查
npm run type-check
```

## 🛠️ 技术栈

### 核心技术

- **Vue 3** - 渐进式 JavaScript 框架
- **TypeScript** - JavaScript 的超集，提供静态类型检查
- **Vite** - 下一代前端构建工具
- **Vue Router** - Vue.js 官方路由管理器
- **Vue I18n** - Vue.js 国际化插件

### 开发工具

- **ESLint** - 代码质量检查
- **Prettier** - 代码格式化
- **Husky** - Git hooks 管理
- **lint-staged** - 暂存文件检查

## 📄 页面结构

- **首页** (`/`) - 项目介绍和特性展示
- **下载页** (`/download`) - 服务端下载和版本信息
- **社区页** (`/community`) - 社区平台和贡献指南
- **文档** (外链) - 详细的使用文档

## 🎨 设计特色

### 视觉设计

- 深色主题设计，符合开发者审美
- 渐变色彩搭配，现代化视觉效果
- 毛玻璃效果和阴影，增强层次感
- 流畅的动画过渡，提升用户体验

### 交互设计

- 响应式布局，适配各种设备
- 平滑的页面切换动画
- 悬停效果和微交互
- 直观的导航和操作流程

## 🌐 部署

### GitHub Pages

项目配置了 GitHub Actions 自动部署到 GitHub Pages：

1. 推送代码到 `main` 分支
2. GitHub Actions 自动构建
3. 部署到 `gh-pages` 分支
4. 通过 GitHub Pages 访问

### 其他部署方式

- **Vercel** - 零配置部署
- **Netlify** - 持续部署
- **服务器部署** - 构建后上传到服务器

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 如何贡献

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

### 开发规范

- 遵循 ESLint 和 Prettier 配置
- 提交信息使用约定式提交格式
- 添加适当的类型注解
- 编写清晰的代码注释

## 📝 多语言贡献

如果你想为网站添加新的语言支持：

1. 在 `src/locales/` 目录下创建新的语言文件
2. 参考现有的 `zh-CN.ts` 和 `en-US.ts` 文件结构
3. 在 `src/locales/index.ts` 中添加新语言配置
4. 更新 `availableLanguages` 数组
5. 测试所有页面的翻译效果

详细信息请参考 [多语言支持文档](./MULTILINGUAL_SUPPORT.md)

## 📊 项目统计

- 🎯 **页面数量**: 3+ 个主要页面
- 🌍 **支持语言**: 2 种语言
- 📱 **响应式断点**: 4 个断点
- 🎨 **组件数量**: 20+ 个组件
- 📦 **包大小**: < 500KB (gzipped)

## 📞 联系我们

- **GitHub**: [MenthaMC](https://github.com/MenthaMC)
- **Discord**: [加入我们的社区](https://discord.gg/menthamc)
- **文档**: [查看完整文档](https://menthamc.github.io/docs/)

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

感谢所有为 MenthaMC 项目做出贡献的开发者和社区成员！

---

<div align="center">

**[⬆ 回到顶部](#menthamc-官方网站)**

Made with ❤️ by MenthaMC Team

</div>
