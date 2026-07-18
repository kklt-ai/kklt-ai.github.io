# 卡卡罗特AI 的手绘博客 ✏️

一个手绘风格的个人博客网站，基于 [Astro](https://astro.build) 构建，零客户端框架、纯静态输出，部署到任何静态托管平台都可以。

## 快速开始

```bash
npm install        # 安装依赖
npm run dev        # 本地开发，默认 http://localhost:4321
npm run build      # 构建静态站点到 dist/
npm run preview    # 本地预览构建结果
```

## 内容维护

### 1. 公众号文章（首页卡片）

编辑 `src/data/wechat-articles.ts`，每篇文章包含封面、标题、简介、链接、日期。新文章加到数组最前面即可：

```ts
{
  title: '文章标题',
  description: '一句话简介',
  cover: '/covers/xxx.png',        // 放到 public/covers/ 目录
  url: 'https://mp.weixin.qq.com/s/xxx',
  date: '2026-07-18',
}
```

### 2. 站内 Markdown 博客（防封备份）

在 `src/content/blog/` 下新建 `.md` 文件，文件名即为文章 URL（如 `my-post.md` → `/blog/my-post/`）。头部 frontmatter 格式：

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

编辑 `src/data/projects.ts`，维护项目名称、简介、链接、emoji 图标和标签。

## 目录结构

```
src/
├── content/blog/        # Markdown 博客文章
├── data/                # 项目列表、公众号文章列表
├── layouts/             # 页面公共布局（导航、页脚）
├── pages/               # 首页、博客列表页、文章详情页
└── styles/global.css    # 手绘风格全局样式与动画
public/
└── covers/              # 文章封面图
```

## 手绘风格说明

- 不规则圆角边框 + 硬阴影，模拟马克笔手绘卡片
- 纸张点阵纹理背景
- 波浪线分隔、荧光笔高亮、胶带贴纸等涂鸦元素
- 动画：挥手的小人、眨眼、漂浮涂鸦、滚动渐入、下划线画入
- 中文手写字体使用 [霞鹜文楷](https://github.com/lxgw/LxgwWenKai)（CDN 加载，失败时回退到楷体）
