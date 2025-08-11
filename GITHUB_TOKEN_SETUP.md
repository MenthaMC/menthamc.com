# GitHub Token 配置说明

## 问题描述
当前遇到的 "API访问受限" 错误是因为GitHub API对未认证请求有严格的速率限制：
- 未认证请求：每小时60次
- 认证请求：每小时5000次

## 解决方案

### 1. 创建GitHub Personal Access Token

1. 登录GitHub账号
2. 访问 https://github.com/settings/tokens
3. 点击 "Generate new token" -> "Generate new token (classic)"
4. 填写Token描述，如："MenthaMC Website API Access"
5. 选择过期时间（建议选择较长时间或无过期）
6. 选择权限范围：
   - `public_repo` - 访问公共仓库
   - `read:user` - 读取用户信息
7. 点击 "Generate token"
8. **重要：立即复制生成的token，页面刷新后将无法再次查看**

### 2. 配置环境变量

将生成的token添加到项目根目录的 `.env` 文件中：

```bash
# 将 your_token_here 替换为实际的token
# 注意：Vite项目中环境变量必须以 VITE_ 开头才能在浏览器中访问
VITE_GITHUB_TOKEN=your_token_here
```

### 3. 重启开发服务器

配置完成后，重启开发服务器：

```bash
npm run dev
# 或
yarn dev
```

## 验证配置

配置成功后，访问 http://localhost:5173/download 页面应该能正常加载，不再出现403错误。

## 注意事项

1. **安全性**：不要将token提交到版本控制系统中
2. **权限最小化**：只授予必要的权限
3. **定期更新**：建议定期更换token
4. **备用方案**：如果仍有问题，可以尝试使用不同的网络环境

## 临时解决方案

如果暂时无法配置token，可以：
1. 减少页面刷新频率
2. 等待一段时间后重试（GitHub API限制每小时重置）
3. 使用移动网络或VPN切换IP地址