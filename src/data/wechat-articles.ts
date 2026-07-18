export interface WechatArticle {
  title: string;
  description: string;
  cover: string; // 封面图地址，可用公众号封面图或本地 public/ 下的图片
  url: string;   // 公众号文章链接
  date: string;
}

// 在这里维护你的公众号文章，新文章往数组最前面加
export const wechatArticles: WechatArticle[] = [
  {
    title: '零基础也能上手的 Cursor 保姆级教程',
    description: '从安装到写出第一个全栈项目，手把手带你用 AI 编程，全程无痛。',
    cover: '/covers/cover-1.svg',
    url: 'https://mp.weixin.qq.com/s/example-1',
    date: '2026-07-10',
  },
  {
    title: '我用 AI 一周做了 4 个小工具，方法全公开',
    description: 'vibe-coding 实战复盘：选题、提示词、踩坑记录，一篇讲透。',
    cover: '/covers/cover-2.svg',
    url: 'https://mp.weixin.qq.com/s/example-2',
    date: '2026-06-28',
  },
  {
    title: 'RAG 到底是什么？一篇漫画讲明白',
    description: '不堆术语，用画图的方式把检索增强生成讲得明明白白。',
    cover: '/covers/cover-3.svg',
    url: 'https://mp.weixin.qq.com/s/example-3',
    date: '2026-06-15',
  },
  {
    title: '程序员如何靠 AI 副业月入过万',
    description: '真实经历分享：接单渠道、定价策略、避坑指南，全是干货。',
    cover: '/covers/cover-4.svg',
    url: 'https://mp.weixin.qq.com/s/example-4',
    date: '2026-05-30',
  },
];
