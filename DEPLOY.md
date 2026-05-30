# Firefly 部署指南

## 构建

```bash
pnpm install   # 安装依赖
pnpm build     # 构建到 dist/
```

构建产物在 `dist/` 目录下，这就是你要上传的静态文件。

## 部署到 GitHub Pages（dist 仓库）

你的博客源码在 `HP-Patience/bolg-Firefly`，GitHub Pages 部署在 `HP-Patience/blog-firefly-dist`。

### 方式一：手动上传（每次改完都要做）

1. 在本机执行 `pnpm build` 生成 dist
2. 进入 dist 目录，初始化 git（仅首次）：

   ```bash
   cd dist
   git init
   git remote add origin https://github.com/HP-Patience/blog-firefly-dist.git
   ```

3. 推送：

   ```bash
   cd dist
   git add -A
   git commit -m "deploy: YYYY-MM-DD"
   git push -f origin master
   ```

> `-f` 是强制推送，因为 dist 是构建产物，不需要保留历史。

### 方式二：一条命令部署

在项目根目录执行（`pnpm deploy` 已配好脚本，需先确保 `dist/` 已初始化为 git 仓库并关联了远程）：

```bash
pnpm deploy
```

这个命令会执行 `pnpm build` → 进入 dist → `git add -A` → `git commit` → `git push`。

**首次使用需要先初始化 dist 的 git：**

```bash
# 仅首次执行
rm -rf dist/.git
cd dist
git init
git remote add origin https://github.com/HP-Patience/blog-firefly-dist.git
git checkout -b master
cd ..
```

之后每次部署只需 `pnpm deploy`。

### 方式三：GitHub Actions 自动部署（推荐）

推送源码到 master 分支时自动构建并部署，无需手动操作。

仓库中已有 `.github/workflows/deploy.yml`，它会：
1. 检出源码
2. 安装依赖并构建
3. 将 dist 推送到同仓库的 `pages` 分支

如果你想把自动部署的目标改为 `blog-firefly-dist` 仓库，需要修改 `.github/workflows/deploy.yml` 中 deploy 步骤的目标仓库。

## GitHub Pages 设置

部署完成后，去 `HP-Patience/blog-firefly-dist` 仓库的 **Settings → Pages**：

- **Source** 选择 `Deploy from a branch`
- **Branch** 选择 `master`，目录选 `/ (root)`
- 保存后等待几分钟，网站就会生效

## Giscus 评论配置

Giscus 已配置在 `HP-Patience/blog-firefly-dist` 仓库上。如果未来更换仓库，需要：

1. 去 [giscus.app](https://giscus.app) 用新仓库生成配置
2. 修改 `src/config/commentConfig.ts` 中的 giscus 字段
3. 在新仓库 **Settings → Features** 中启用 Discussions
4. 在新仓库安装 [Giscus GitHub App](https://github.com/apps/giscus)
