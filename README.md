# 卡卡罗特AI · 手绘风格个人博客

持续分享有用的 AI 干货教程～

基于 [Astro](https://astro.build) 的纯静态个人博客：手绘 UI、公众号外链文章、Markdown 站内备份，适合部署到 GitHub Pages、Vercel、Cloudflare Pages 等任意静态托管。

## 功能概览

| 模块 | 说明 |
| --- | --- |
| 首页 Hero | 展示名字「卡卡罗特AI」与简介，含手绘动画角色 |
| Vibe-Coding 项目 | 卡片列表，点击跳转外部项目链接 |
| 公众号文章 | 封面 + 标题 + 简介布局，点击打开微信公众号原文 |
| 站内 Markdown 博客 | 本地 `.md` 文章，防止公众号内容失效后无备份 |

## 技术栈

- **Astro 5** — 静态站点生成
- **Content Collections** — Markdown 博客内容管理
- **手绘 CSS** — 不规则圆角、硬阴影、纸张纹理、涂鸦动画
- **霞鹜文楷** — 手写风格中文字体（CDN，失败回退楷体）

## 快速开始

```bash
# 安装依赖
npm install

# 本地开发（默认 http://localhost:4321）
npm run dev

# 构建静态站点到 dist/
npm run build

# 预览构建结果
npm run preview
```

如遇 Astro 遥测目录权限问题，可加环境变量：

```bash
ASTRO_TELEMETRY_DISABLED=1 npm run dev
```

## 内容维护

### 1. 公众号文章（首页卡片）

编辑 [`src/data/wechat-articles.ts`](src/data/wechat-articles.ts)，新文章加到数组最前面：

```ts
{
  title: '文章标题',
  description: '一句话简介',
  cover: '/covers/xxx.png', // 图片放在 public/covers/
  url: 'https://mp.weixin.qq.com/s/xxx',
  date: '2026-07-18',
}
```

### 2. 站内 Markdown 博客（防封备份）

在 [`src/content/blog/`](src/content/blog/) 新建 `.md` 文件。文件名对应 URL，例如 `my-post.md` → `/blog/my-post/`。

```markdown
---
title: 文章标题
description: 一句话简介
pubDate: 2026-07-18
tags: ['标签1', '标签2']
cover: /covers/xxx.png   # 可选
---

正文直接写 Markdown……
```

### 3. 个人项目

编辑 [`src/data/projects.ts`](src/data/projects.ts)：

```ts
{
  name: '项目名称',
  description: '一句话介绍',
  url: 'https://example.com/your-project',
  emoji: '🚀',
  tag: 'Web 工具',
  color: 'orange', // green | orange | blue | pink
}
```

## 目录结构

```text
kklt-blog/
├── public/
│   ├── covers/              # 文章封面图
│   └── favicon.svg
├── src/
│   ├── content/
│   │   └── blog/            # Markdown 博客原文
│   ├── data/
│   │   ├── projects.ts      # 个人项目列表
│   │   └── wechat-articles.ts
│   ├── layouts/
│   │   └── BaseLayout.astro # 导航 / 页脚 / 公共布局
│   ├── pages/
│   │   ├── index.astro      # 首页
│   │   └── blog/
│   │       ├── index.astro  # 文章列表
│   │       └── [...slug].astro
│   ├── styles/
│   │   └── global.css       # 手绘全局样式与动画
│   └── content.config.ts    # Content Collections 配置
├── astro.config.mjs
└── package.json
```

## 页面路由

| 路径 | 说明 |
| --- | --- |
| `/` | 首页：简介、项目、公众号文章、站内备份入口 |
| `/blog/` | 站内 Markdown 文章列表 |
| `/blog/:slug/` | 单篇文章详情 |

## 设计风格

- 不规则圆角边框 + 硬阴影，模拟马克笔手绘卡片
- 纸张点阵纹理背景
- 波浪线分隔、荧光笔高亮、胶带贴纸等涂鸦元素
- 动画：挥手小人、眨眼、漂浮涂鸦、滚动渐入、下划线画入
- 尊重 `prefers-reduced-motion`，减弱动画偏好时自动降级

## 部署建议

构建产物在 `dist/`，可直接部署：

```bash
npm run build
```

常见平台：

- **Vercel / Netlify / Cloudflare Pages**：连接仓库，构建命令 `npm run build`，输出目录 `dist`
- **GitHub Pages**：将 `astro.config.mjs` 中的 `site` 改为你的站点地址，再按平台文档配置静态发布

## License

个人项目，随意使用与修改。
