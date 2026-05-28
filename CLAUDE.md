# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Firefly 是一个基于 Astro 6.x 的静态博客主题，由 [fuwari](https://github.com/saicaca/fuwari) 二次开发而来。所有源码和配置都在 `Firefly/` 目录内。

## Commands

所有命令在 `Firefly/` 目录下执行，使用 pnpm（禁止 npm/yarn）。

| Command | Description |
|---|---|
| `pnpm dev` | 启动开发服务器 `localhost:4321` |
| `pnpm build` | 构建：生成图标 → astro build → pagefind 搜索索引 |
| `pnpm preview` | 预览构建产物 |
| `pnpm check` | Astro 类型检查 |
| `pnpm type-check` | TypeScript 类型检查（不输出文件） |
| `pnpm format` | Biome 格式化 `./src` |
| `pnpm lint` | Biome lint + 自动修复 `./src` |
| `pnpm new-post <filename>` | 在 `src/content/posts/` 创建新文章 |
| `pnpm icons` | 仅重新生成图标 |

## Architecture

### 渲染层

- **`src/layouts/Layout.astro`** — 基础 HTML 壳。注入 `<head>`（主题初始化脚本、字体、analytics、OG meta、favicon）、全局 CSS 变量、swup 钩子（主题同步、导航栏行为、侧边栏响应式调整）。
- **`src/layouts/MainGridLayout.astro`** — 主布局。包含 Navbar、壁纸（banner/fullscreen/overlay 四种模式）、水波纹效果、三列 grid 系统（左栏 / 主内容 / 右栏）、页脚、Live2D/Spine 看板娘。内联了大量壁纸模式和轮播的 JS 逻辑。
- **`src/components/layout/SideBar.astro`** — 侧边栏渲染器，根据 `side` prop（`left`/`right`/`bottom`）从 `sidebarLayoutConfig` 读取组件列表并渲染对应 Widget。
- **`src/pages/posts/[...slug].astro`** — 文章详情页，处理封面图解析、加密文章、许可证、分享海报、推荐文章。
- **`src/pages/[...page].astro`** — 分页文章列表。

### 配置系统

所有配置在 `src/config/` 下，类型定义在 `src/types/config.ts`。`src/config/index.ts` 统一导出。关键配置文件：

- **`siteConfig.ts`** — 站点标题、URL、语言、主题色、分页、页面开关、图片优化
- **`sidebarConfig.ts`** — 侧边栏位置（left/right/both）、各位置挂载哪些组件
- **`backgroundWallpaper.ts`** — 壁纸模式、图片来源、Banner 文字、轮播、水波纹等
- **`navBarConfig.ts`** — 导航链接和搜索配置

### 内容系统

- 文章是 `src/content/posts/` 下的 `.md` / `.mdx` 文件，通过 `content.config.ts` 中的 glob loader 加载
- Frontmatter schema 见 `content.config.ts` 的 zod 定义
- `src/utils/content-utils.ts` — 文章排序（置顶优先，按日期降序）、标签/分类统计、相关文章推荐（Jaccard 相似度 + 时间衰减）

### Markdown 处理管道

`astro.config.mjs` 定义：

**Remark 插件顺序：** remarkMath → remarkReadingTime → remarkImageGrid → remarkExcerpt → remarkDirective → remarkSectionize → parseDirectiveNode → remarkMermaid → remarkPlantuml

**Rehype 插件顺序：** rehypeKatex → rehypeCallouts → rehypeSlug → rehypeMermaid → rehypePlantuml → rehypeFigure → rehypeExternalLinks → rehypeEmailProtection → rehypeComponents（GitHub 卡片） → rehypeAutolinkHeadings

自定义插件在 `src/plugins/` 中。

### 页面过渡

使用 [swup](https://swup.js.org/) 实现 SPA 式页面切换。`Layout.astro` 的 `<script>` 块中有完整的 swup 钩子注册（`link:click`、`content:replace`、`visit:start`、`page:view`、`visit:end`）。swup containers 在 `astro.config.mjs` 的 `integrations.swup.containers` 中定义。

### 关键 globals

- `--hue` CSS 变量控制全局主题色相
- `data-theme` 属性切换 Expressive Code 代码块主题
- `data-wallpaper-mode` 属性控制壁纸模式（banner/fullscreen/overlay/none）
- `siteConfig.ts` 中的 `themeColor.defaultMode` 设置默认亮暗模式

### 路径别名

定义在 `tsconfig.json`：
- `@components/*` → `src/components/*`
- `@assets/*` → `src/assets/*`
- `@constants/*` → `src/constants/*`
- `@utils/*` → `src/utils/*`
- `@i18n/*` → `src/i18n/*`
- `@layouts/*` → `src/layouts/*`
- `@/*` → `src/*`

## Tech Stack

- **Framework:** Astro 6.x + Svelte 5（仅用于交互组件如 Search、SharePoster、DisplaySettings）
- **Styling:** Tailwind CSS 4 + Stylus（`src/styles/` 下的 `.styl` 文件）
- **Code highlighting:** astro-expressive-code
- **Package manager:** pnpm 9（preinstall 脚本强制 pnpm）
- **Lint/format:** Biome 2.x
- **Search:** Pagefind（构建时生成索引）
