export interface Video {
  bvid: string; // B 站 BV 号
  title: string;
  description: string;
  cover: string; // 封面图地址，本地 public/covers/ 下的图片
  url: string; // B 站视频链接
  date: string; // YYYY-MM-DD
}

// 在这里维护你的 B 站视频，按发布日期倒序排列
// 运行 node scripts/fetch-bilibili-videos.mjs <视频链接或BV号> 可自动抓取标题/简介/封面/时间
export const videos: Video[] = [
  {
    bvid: 'BV1VtMk6YEcJ',
    title: 'GitHub零基础-5分钟保姆级使用教程！',
    description: '这是全网最快入门GitHub的零基础教程了，5分钟跟你讲讲GitHub的核心功能。 ✅不会 Git、不会代码也能看懂。 ✅这期带你学会： 1、怎么找到自己需要的开源项目？怎么借助AI快速了找到需要的项目？ 2、怎么看 README文件，怎么…',
    cover: '/covers/bili-BV1VtMk6YEcJ.jpg',
    url: 'https://www.bilibili.com/video/BV1VtMk6YEcJ/',
    date: '2026-08-05',
  },
  {
    bvid: 'BV14z346DEKU',
    title: 'Kimi-K3模型去哪里用呢？4个途径，非常方便！',
    description: 'Kimi K3模型最近真的杀疯了！ 前端、全栈、综合Agent能力挤上世界第一梯队。 那去哪里可以使用到Kimi K3模型呢？🤔 ✅这期分享4种使用Kimi K3的方法：最后一种最简单，新手也能直接上手！',
    cover: '/covers/bili-BV14z346DEKU.jpg',
    url: 'https://www.bilibili.com/video/BV14z346DEKU/',
    date: '2026-07-30',
  },
  {
    bvid: 'BV1No3v63EU5',
    title: '7个省Token的实用技巧，耗量减少80%！Codex、ClaudeCode都通用！',
    description: '你的 Codex 、Claude Code 的额度为什么总是不够用？🤔 ⚠️很多时候，不是模型问题，而是你的使用姿势不对！ 这期整理了 7 个省 Token 技巧： ✅ 需求先聊清，减少 AI 返工 ✅ 少开 Fast 模式，降低无效消耗…',
    cover: '/covers/bili-BV1No3v63EU5.jpg',
    url: 'https://www.bilibili.com/video/BV1No3v63EU5/',
    date: '2026-07-28',
  },
];

/** 首页「视频教程」展示，取最新 limit 个 */
export function getLatestVideos(limit = 3): Video[] {
  return [...videos].sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit);
}
