# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Firefly — Astro 6.x 静态博客主题，[fuwari](https://github.com/saicaca/fuwari) 二次开发。中文为主。

## Commands

环境要求：Node.js >= 22，pnpm >= 9。所有命令用 pnpm（preinstall 脚本强制禁止 npm/yarn）。

| Command | Description |
|---|---|
| `pnpm install` | 安装依赖 |
| `pnpm dev` / `pnpm start` | 开发服务器 `localhost:4321` |
| `pnpm build` | 构建到 `dist/`：生成图标 → astro build → pagefind 搜索索引 |
| `pnpm preview` | 预览 `dist/` |
| `pnpm check` | Astro 类型检查 |
| `pnpm type-check` | TypeScript 类型检查 |
| `pnpm format` | Biome 格式化 `./src` |
| `pnpm lint` | Biome lint + auto-fix `./src` |
| `pnpm new-post <filename>` | 在 `src/content/posts/` 创建新文章 |
| `pnpm icons` | 仅重新生成图标 |
| `pnpm deploy` | `pnpm build` → 进入 dist → git add/commit/push -f |
| `pnpm astro ...` | 任意 Astro CLI 命令 |

## Architecture

### Rendering Layers

- **[src/layouts/Layout.astro](src/layouts/Layout.astro)** — 基础 HTML 壳。注入 `<head>`（主题初始化脚本、字体、analytics、OG meta、favicon）、全局 CSS 变量、swup 钩子（主题同步、导航栏行为、侧边栏响应式调整）。
- **[src/layouts/MainGridLayout.astro](src/layouts/MainGridLayout.astro)** — 主布局。含 Navbar、壁纸（banner/fullscreen/overlay/none 四种模式）、水波纹、三列 grid 系统（左栏/主内容/右栏）、页脚、Live2D/Spine 看板娘。
- **[src/components/layout/SideBar.astro](src/components/layout/SideBar.astro)** — 侧边栏渲染器。根据 `side` prop 从 `sidebarLayoutConfig` 读取组件列表，渲染对应 Widget。
- **[src/pages/posts/[...slug].astro](src/pages/posts/[...slug].astro)** — 文章详情页。处理封面图、加密文章、许可证、分享海报、推荐文章（Jaccard 相似度 + 时间衰减）。
- **[src/pages/[...page].astro](src/pages/[...page].astro)** — 分页文章列表。
- **[src/pages/search.astro](src/pages/search.astro)** — 搜索页，配合 Pagefind 使用。
- **[src/pages/about.astro](src/pages/about.astro)**、**[archive.astro](src/pages/archive.astro)**、**[friends.astro](src/pages/friends.astro)**、**[guestbook.astro](src/pages/guestbook.astro)**、**[sponsor.astro](src/pages/sponsor.astro)**、**[bangumi.astro](src/pages/bangumi.astro)** — 各独立页面。
- **[src/pages/404.astro](src/pages/404.astro)** — 404 页面。
- **[src/pages/rss.xml.ts](src/pages/rss.xml.ts)**、**[rss.astro](src/pages/rss.astro)** — RSS Feed 输出。
- **[src/pages/robots.txt.ts](src/pages/robots.txt.ts)** — robots.txt 生成。

### Widget / Sidebar System

侧边栏 Widget 挂载在 `SideBar.astro` 中。配置在 `sidebarLayoutConfig`（[src/config/sidebarConfig.ts](src/config/sidebarConfig.ts)），支持 left/right/both 三位置。Widget 组件在 [src/components/widget/](src/components/widget/) 下：

- Profile — 个人信息卡片（含 AvatarCard 3D 交互）
- Announcement — 公告栏
- Categories / Tags — 分类和标签导航
- SidebarTOC — 文章目录
- Advertisement — 广告（支持 adConfig1/adConfig2 双位置）
- SiteStats — 站点统计
- Calendar — 日历
- Music — 音乐播放器
- SpineModel — Spine 看板娘

每个 Widget 是 Astro 组件，通过 `WidgetLayout.astro` 包装统一样式。配置项控制 enable/position/sticky/responsive 等。

### Config System

所有配置在 [src/config/](src/config/)，类型定义在 [src/types/config.ts](src/types/config.ts)。`src/config/index.ts` 统一导出。共 20+ 配置模块：

| Config | Purpose |
|---|---|
| `siteConfig` | 站点标题/URL/语言/主题色/分页/页面开关/图片优化/analytics |
| `sidebarConfig` | 侧边栏位置、各位置组件列表 |
| `backgroundWallpaper` | 壁纸模式/banner/轮播/水波纹/渐变 |
| `navBarConfig` | 导航链接、搜索方法 |
| `commentConfig` | 评论系统 giscus/twikoo/waline/disqus/artalk |
| `profileConfig` | 头像、名称、社交链接 |
| `footerConfig` | 自定义页脚 HTML |
| `fontConfig` | 自定义字体库 |
| `expressiveCodeConfig` | 代码块主题和插件（折叠/语言徽章） |
| `licenseConfig` | 文章默认许可证 |
| `coverImageConfig` | 封面图显示和随机图 API |
| `musicConfig` | 音乐播放器（meting API / 本地） |
| `pioConfig` | Live2D 和 Spine 看板娘 |
| `effectsConfig` | 樱花特效参数 |
| `plantumlConfig` | PlantUML 服务器和主题 |
| `adConfig` | 广告配置（adConfig1/adConfig2） |
| `announcementConfig` | 公告栏内容 |
| `friendsConfig` | 友链列表和页面配置 |
| `galleryConfig` | 相册数据集 |
| `sponsorConfig` | 赞助方式和赞助者列表 |

### Content System

- 文章在 `src/content/posts/` 下 `.md` / `.mdx` 文件，通过 `content.config.ts` 的 glob loader 加载
- `src/content/spec/` 是第二个内容集合，用于 Markdown 语法示例
- Frontmatter schema 见 [content.config.ts:7-32](src/content.config.ts#L7-L32)：title, published, updated, draft, description, image, tags, category, lang, pinned, author, sourceLink, licenseName, licenseUrl, comment, password(加密), passwordHint, prevSlug/prevTitle/nextSlug/nextTitle（内部使用）
- [src/utils/content-utils.ts](src/utils/content-utils.ts) — 文章排序（置顶优先，按日期降序）、标签/分类统计、推荐文章（Jaccard 相似度 + 时间衰减）
- 加密文章：[src/utils/crypto-utils.ts](src/utils/crypto-utils.ts)（前端 Pako 压缩 + Base64）
- [src/utils/date-utils.ts](src/utils/date-utils.ts) — dayjs 封装的日期格式化
- [src/utils/url-utils.ts](src/utils/url-utils.ts) — URL 路径生成（分类链接、标签链接等）
- [src/utils/image-utils.ts](src/utils/image-utils.ts) — 图片路径处理和优化
- 其他工具：[language-utils](src/utils/language-utils.ts)、[layout-utils](src/utils/layout-utils.ts)、[navigation-utils](src/utils/navigation-utils.ts)、[responsive-utils](src/utils/responsive-utils.ts)、[setting-utils](src/utils/setting-utils.ts)、[toc-utils](src/utils/toc-utils.ts)、[gallery-utils](src/utils/gallery-utils.ts)、[sakura-manager](src/utils/sakura-manager.ts)

### i18n System

- **Key 定义**: [src/i18n/i18nKey.ts](src/i18n/i18nKey.ts) 的 `I18nKey` 枚举
- **获取**: [src/i18n/translation.ts](src/i18n/translation.ts) 的 `i18n(key)` 函数
- **翻译文件**: [src/i18n/languages/](src/i18n/languages/) 下（zh_CN, en, ja, ru, zh_TW）
- **新增语言**: languages/ 创建新文件 → translation.ts 的 map 中注册映射
- **回退**: 缺失时 zh_CN → en

### Icon Preprocessing Pipeline

- [scripts/generate-icons.js](scripts/generate-icons.js) — 构建时扫描 `src/` 下所有 `.svelte` 文件的 `icon="prefix:name"` 引用，从 iconify JSON 提取 SVG 内联，生成 `src/constants/icons.ts`
- `src/constants/icons.ts` 由脚本自动生成，**不可手动编辑**
- Svelte 组件通过 `getIconSvg("material-symbols:search")` 获取内联 SVG，无需运行时请求
- [src/constants/icon.ts](src/constants/icon.ts) — 手工维护的静态图标常量
- [src/constants/link-presets.ts](src/constants/link-presets.ts) — 导航栏预置链接映射

### Markdown Processing Pipeline

定义在 [astro.config.mjs](astro.config.mjs)。自定义插件在 [src/plugins/](src/plugins/)：

**Remark 顺序：** remarkMath → remarkReadingTime（阅读时间） → remarkImageGrid（图片网格 `::gallery`） → remarkExcerpt（摘要提取） → remarkDirective → remarkSectionize（章节编号） → parseDirectiveNode → remarkMermaid（` ```mermaid` 编码） → remarkPlantuml（` ```plantuml` 编码为 URL）

**Rehype 顺序：** rehypeKatex（数学公式） → rehypeCallouts（GitHub/Obsidian/Vitepress 风格 callout） → rehypeSlug → rehypeMermaid（mermaid URL 转 `<img>`） → rehypePlantuml（plantuml URL 转 `<img>`） → rehypeFigure（图片包 `<figure>`） → rehypeExternalLinks（外链新窗口） → rehypeEmailProtection（邮箱 Base64 保护） → rehypeComponents（`::github{repo="..."}` 卡片） → rehypeAutolinkHeadings（锚点）

### Page Transitions

使用 [swup](https://swup.js.org/) SPA 式页面切换。`Layout.astro` 注册 swup 钩子（`link:click`、`content:replace`、`visit:start`、`page:view`、`visit:end`）。Containers 在 `astro.config.mjs` 的 `integrations.swup.containers` 中配置（6 个容器 ID）。

### Build Pipeline

`pnpm build` 执行链：`node scripts/generate-icons.js`（图标预处理） → `astro build`（SSG 生成） → `pagefind --site dist`（搜索索引）。生产构建移除 `console.log` 和 `debugger`，CSS 代码分割，图片压缩优化。

### Deploy

- 构建产物在 `dist/`。源码仓库 `HP-Patience/blog-Firefly`，部署到 `HP-Patience/blog-firefly-dist`
- `pnpm deploy` — 构建 + 进入 dist → git add/commit/push -f（需首次初始化 dist 的 git）
- 支持 GitHub Actions 自动部署（`.github/workflows/deploy.yml`）
- 详细部署步骤见 [DEPLOY.md](DEPLOY.md)

### Key Globals

- `--hue` CSS 变量控制全局主题色相
- `data-theme` 属性切换 Expressive Code 代码块主题
- `data-wallpaper-mode` 控制壁纸模式（banner/fullscreen/overlay/none）
- `siteConfig.ts` 的 `themeColor.defaultMode` 设置默认亮暗模式

### Path Aliases（tsconfig.json）

- `@components/*` → `src/components/*`
- `@assets/*` → `src/assets/*`
- `@constants/*` → `src/constants/*`
- `@utils/*` → `src/utils/*`
- `@i18n/*` → `src/i18n/*`
- `@layouts/*` → `src/layouts/*`
- `@/*` → `src/*`

## Tech Stack

- **Framework:** Astro 6.x + Svelte 5
  - **`.astro`** — 布局、Widget、Markdown 渲染、SEO meta 等静态/SSR 逻辑
  - **`.svelte`** — 仅 12 个文件，用于客户端交互组件：Search, SharePoster, DisplaySettings, LightDarkSwitch, WallpaperSwitch, LayoutSwitchButton, ArchivePanel, DropdownItem/Panel, Icon, AdvancedSearch
- **Styling:** Tailwind CSS 4 + Stylus（[src/styles/](src/styles/) 下的 `.styl` 文件）
- **Lint/Format:** Biome 2.x
- **Code Highlight:** astro-expressive-code（支持折叠、语言徽章、行号）
- **Search:** Pagefind（构建时生成）
- **Package Manager:** pnpm 9（preinstall 强制）
