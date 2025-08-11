# GitHub API 对接服务

一个功能完整的GitHub API对接服务，支持自动数据同步、智能缓存管理、错误重试机制和定时任务调度。

## 功能特性

### 🚀 核心功能
- **自动数据同步**: 每5分钟自动请求GitHub API获取最新数据
- **智能缓存管理**: 高效的内存缓存，支持TTL过期时间和容量限制
- **错误重试机制**: 网络中断或API限流时自动重试，支持指数退避
- **定时任务调度**: 灵活的任务调度系统，支持并发控制
- **API认证**: 完整的GitHub Personal Access Token认证支持

### 📊 数据支持
- 用户信息获取
- 用户仓库列表
- 特定仓库信息
- 仓库搜索功能
- API限制信息监控

### 🛡️ 可靠性保障
- 自动重试机制（默认3次）
- API限流检测和处理
- 网络异常恢复
- 优雅关闭处理
- 完整的错误日志

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 环境配置

复制环境变量模板：
```bash
cp .env.example .env
```

编辑 `.env` 文件，配置必要参数：
```env
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_USERNAME=your_github_username
PORT=3000
```

### 3. 获取GitHub Token

1. 访问 [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. 点击 "Generate new token (classic)"
3. 选择所需权限：
   - `public_repo` - 访问公共仓库
   - `read:user` - 读取用户信息
   - `repo` - 访问私有仓库（可选）
4. 复制生成的token到 `.env` 文件

### 4. 启动服务

开发模式：
```bash
npm run dev
```

生产模式：
```bash
npm run build
npm start
```

## API 接口

### 基础接口

#### 健康检查
```http
GET /health
```

#### 服务状态
```http
GET /api/status
```

### GitHub 数据接口

#### 获取数据快照
```http
GET /api/github/snapshot
```

#### 获取用户信息
```http
GET /api/github/user/:username?
```

#### 获取用户仓库
```http
GET /api/github/repositories/:username?
```

#### 获取特定仓库
```http
GET /api/github/repository/:owner/:repo
```

#### 搜索仓库
```http
GET /api/github/search?q=搜索关键词
```

#### 获取API限制信息
```http
GET /api/github/rate-limit
```

### 管理接口

#### 手动触发同步
```http
POST /api/github/sync
```

#### 更新配置
```http
PUT /api/config
Content-Type: application/json

{
  "updateInterval": 600000,
  "searchQueries": ["new query"]
}
```

## 配置说明

### 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `GITHUB_TOKEN` | GitHub Personal Access Token | 必填 |
| `GITHUB_USERNAME` | GitHub用户名 | 必填 |
| `PORT` | 服务端口 | 3000 |
| `CACHE_TTL` | 缓存过期时间(ms) | 300000 |
| `UPDATE_INTERVAL` | 数据同步间隔(ms) | 300000 |
| `MAX_CONCURRENT_TASKS` | 最大并发任务数 | 5 |

### 服务配置

```typescript
const githubDataService = new GitHubDataService(
  {
    token: 'your_token',
    retryAttempts: 3,
    retryDelay: 2000
  },
  {
    username: 'your_username',
    repositories: ['owner/repo1', 'owner/repo2'],
    searchQueries: ['language:typescript', 'topic:react'],
    updateInterval: 5 * 60 * 1000
  }
);
```

## 架构设计

### 核心模块

1. **GitHubApiService**: GitHub API封装，处理认证和请求
2. **CacheService**: 内存缓存管理，支持TTL和容量控制
3. **SchedulerService**: 定时任务调度，支持并发控制
4. **GitHubDataService**: 数据同步服务，整合上述模块

### 数据流程

```
定时器触发 → 清除旧缓存 → 请求GitHub API → 错误重试 → 更新缓存 → 记录日志
```

### 错误处理

- **网络错误**: 自动重试，指数退避
- **API限流**: 检测Retry-After头，智能等待
- **认证错误**: 记录错误，停止请求
- **数据错误**: 跳过错误项，继续处理其他数据

## 监控和日志

### 日志级别
- `info`: 正常操作日志
- `warn`: 警告信息（重试、限流等）
- `error`: 错误信息（请求失败、认证错误等）

### 监控指标
- 请求成功率
- 缓存命中率
- API限制使用情况
- 任务执行统计

## 部署建议

### Docker 部署

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["node", "dist/app.js"]
```

### PM2 部署

```json
{
  "name": "github-api-service",
  "script": "dist/app.js",
  "instances": 1,
  "exec_mode": "cluster",
  "env": {
    "NODE_ENV": "production"
  }
}
```

## 开发指南

### 项目结构

```
src/
├── services/
│   ├── github-api.service.ts    # GitHub API封装
│   ├── cache.service.ts         # 缓存服务
│   ├── scheduler.service.ts     # 调度服务
│   └── github-data.service.ts   # 数据同步服务
├── app.ts                       # 主应用
└── types/                       # 类型定义
```

### 扩展功能

1. **添加新的数据源**:
   ```typescript
   // 在 github-data.service.ts 中添加新的同步方法
   private async syncNewData(): Promise<void> {
     // 实现新的数据同步逻辑
   }
   ```

2. **自定义缓存策略**:
   ```typescript
   const customCache = new CacheService({
     ttl: 10 * 60 * 1000,  // 10分钟
     maxSize: 2000,
     cleanupInterval: 2 * 60 * 1000
   });
   ```

3. **添加新的API端点**:
   ```typescript
   app.get('/api/custom/endpoint', (req, res) => {
     // 实现自定义端点逻辑
   });
   ```

## 故障排除

### 常见问题

1. **Token认证失败**
   - 检查token是否正确
   - 确认token权限是否足够
   - 检查token是否过期

2. **API限流**
   - 服务会自动处理限流，等待后重试
   - 可以通过 `/api/github/rate-limit` 查看限制状态

3. **缓存问题**
   - 通过 `/api/status` 查看缓存统计
   - 可以调用 `/api/github/sync` 强制刷新

4. **内存使用过高**
   - 调整 `CACHE_MAX_SIZE` 参数
   - 减少 `CACHE_TTL` 时间
   - 优化数据查询频率

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 贡献

欢迎提交 Issue 和 Pull Request！

## 更新日志

### v1.0.0
- 初始版本发布
- 支持GitHub API基础功能
- 实现缓存和调度系统
- 添加错误重试机制