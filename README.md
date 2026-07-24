# 卡卡罗特AI · 手绘风格个人博客

持续分享有用的 AI 干货教程～

这是一个基于 [Astro](https://astro.build/) 构建的纯静态个人博客，使用手绘风格 UI 展示 Vibe Coding 项目、微信公众号文章和站内 Markdown 文章。构建结果可部署到 Vercel、Netlify、Cloudflare Pages、GitHub Pages 等静态托管平台。

## 功能

- 手绘风格首页，包含个人介绍、精选项目和最新文章
- 项目列表页，集中展示 Vibe Coding 作品
- 统一文章列表，按时间混排公众号文章与站内文章
- 基于 Astro Content Collections 的 Markdown 内容管理
- 文章列表分页、正文目录和相关文章推荐
- 响应式布局，并支持 `prefers-reduced-motion`

## 技术栈

- [Astro 5](https://docs.astro.build/)：静态站点生成与文件路由
- Astro Content Collections：Markdown 内容校验和加载
- TypeScript：项目和文章数据建模
- 原生 CSS：手绘卡片、纸张纹理、动效与响应式布局

## 快速开始

项目使用 npm，并已提交 `package-lock.json`。

```bash
# 安装锁定版本的依赖
npm ci

# 启动本地开发服务器，默认访问 http://localhost:4321
npm run dev

# 构建静态站点，产物写入 dist/
npm run build

# 本地预览构建结果
npm run preview
```

如果本地环境无法写入 Astro 遥测目录，可以临时关闭遥测：

```bash
ASTRO_TELEMETRY_DISABLED=1 npm run dev
```

## 内容维护

### 公众号文章

在 [`src/data/wechat-articles.ts`](src/data/wechat-articles.ts) 的数组开头添加文章：

```ts
{
  title: '文章标题',
  description: '一句话简介',
  cover: '/covers/wechat-example.jpg',
  url: 'https://mp.weixin.qq.com/s/example',
  date: '2026-07-18',
}
```

封面图片放在 [`public/covers/`](public/covers/)，代码中的访问路径以 `/covers/` 开头。

仓库还提供了抓取脚本：

```bash
node scripts/fetch-wechat-articles.mjs
```

该脚本会读取现有数据中的公众号链接，重新抓取标题、简介、发布日期和封面，然后覆盖写回 `src/data/wechat-articles.ts`。运行前请确认链接完整，并在运行后检查数据文件与封面图片的变更。

### 站内 Markdown 文章

在 [`src/content/blog/`](src/content/blog/) 新建 `.md` 文件。文件名会成为文章 slug，例如 `my-post.md` 对应 `/blog/my-post/`。

```markdown
---
title: 文章标题
description: 一句话简介
pubDate: 2026-07-18
tags: ['标签1', '标签2']
cover: /covers/example.jpg
---

正文直接使用 Markdown 编写。
```

`title`、`description` 和 `pubDate` 必填；`tags` 可省略并默认为空数组，`cover` 也可省略。字段由 [`src/content.config.ts`](src/content.config.ts) 校验。文章正文配图建议放在 `public/blog/<slug>/`，并使用 `/blog/<slug>/图片名` 引用。

### 项目

在 [`src/data/projects.ts`](src/data/projects.ts) 中维护项目：

```ts
{
  name: '项目名称',
  description: '一句话介绍',
  url: 'https://example.com/project',
  emoji: '🚀',
  tag: 'Web 工具',
  color: 'orange', // green | orange | blue | pink
  featured: true,
}
```

设置 `featured: true` 后，项目可以出现在首页精选区；首页最多展示 3 个，完整列表位于 `/projects/`。

### 文章汇总规则

[`src/data/articles.ts`](src/data/articles.ts) 负责把公众号文章和站内 Markdown 文章转换为统一数据结构，并按 `date` 从新到旧排序：

- 首页展示最新 5 篇文章
- `/blog/` 每页展示 6 篇文章
- 公众号文章在新标签页打开，站内文章进入本地详情页

## 目录结构

```text
kklt-blog/
├── public/                         # 原样复制到站点根目录的静态资源
│   ├── blog/<slug>/                # 站内文章配图
│   ├── covers/                     # 文章封面
│   ├── favicon.svg
│   └── wechat_qrcode.JPG
├── scripts/
│   └── fetch-wechat-articles.mjs   # 公众号元数据与封面抓取脚本
├── src/
│   ├── assets/                     # 由 Astro 处理和优化的本地资源
│   ├── content/
│   │   └── blog/                   # 站内 Markdown 文章
│   ├── data/
│   │   ├── articles.ts             # 汇总并排序全部文章
│   │   ├── projects.ts             # 项目数据
│   │   └── wechat-articles.ts      # 公众号文章数据
│   ├── layouts/
│   │   └── BaseLayout.astro        # 全站 HTML、导航和页脚
│   ├── pages/
│   │   ├── blog/
│   │   │   ├── [...page].astro     # 文章列表与分页
│   │   │   └── [...slug].astro     # 站内文章详情
│   │   ├── projects/
│   │   │   └── index.astro         # 项目列表
│   │   └── index.astro             # 首页
│   ├── styles/
│   │   └── global.css              # 全局变量、组件样式和动画
│   └── content.config.ts           # Content Collections 配置
├── AGENTS.md                       # 仓库协作与修改约定
├── astro.config.mjs                # Astro 配置
├── package.json
└── package-lock.json
```

`dist/` 和 `.astro/` 都是生成目录，不应手动修改或提交。

## 页面路由

| 路径 | 说明 |
| --- | --- |
| `/` | 首页：个人介绍、精选项目与最新文章 |
| `/projects/` | 全部项目 |
| `/blog/` | 全部文章第一页 |
| `/blog/2/` | 全部文章后续分页 |
| `/blog/<slug>/` | 站内 Markdown 文章详情 |

## 部署

先确认生产构建通过：

```bash
npm run build
```

- Vercel、Netlify、Cloudflare Pages：构建命令使用 `npm run build`，输出目录使用 `dist`
- GitHub Pages：先把 [`astro.config.mjs`](astro.config.mjs) 中的 `site` 改为实际站点地址，再配置静态站点发布流程

当前 `site` 仍是示例地址，正式部署前必须替换。

## License

个人项目，可自由使用与修改。
