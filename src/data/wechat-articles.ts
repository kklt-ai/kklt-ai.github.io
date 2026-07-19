export interface WechatArticle {
  title: string;
  description: string;
  cover: string; // 封面图地址，可用公众号封面图或本地 public/ 下的图片
  url: string;   // 公众号文章链接
  date: string;
}

// 在这里维护你的公众号文章，新文章往数组最前面加
// 也可以运行 node scripts/fetch-wechat-articles.mjs 自动抓取标题/描述/封面/时间
export const wechatArticles: WechatArticle[] = [
  {
    title: '神级Skill Superpowers，今天我终于把它卸载了。臃肿 + Token吞金兽！',
    description: 'Superpowers 曾是 AI 编程新手的必备神器，但随着模型能力越来越强、项目越来越复杂，它的超长 Skill 说明书反而成了负担。本文拆解 Superpowers 的三大硬伤：Token 消耗飙升、上下文污染稀释关键信息、小任务也被强制完整规划。并给出不同阶段的推荐做法',
    cover: '/covers/wechat-1.jpg',
    url: 'https://mp.weixin.qq.com/s/uaZjJ-0bICaZGCtBu6U51g',
    date: '2026-07-17',
  },
  {
    title: '被爆“偷”用户代码后，马斯克被迫把 Grok Builder 开源了',
    description: '被爆偷用户代码后，马斯克开源Grok Builder 了',
    cover: '/covers/wechat-2.jpg',
    url: 'https://mp.weixin.qq.com/s/hTSUjXGVtft-ioTGCg3mWA',
    date: '2026-07-16',
  },
  {
    title: '被 Meta 买走 5 个月后，腾讯准备 120 亿赎回Manus？',
    description: 'Manus 被 Meta 以超 20 亿美元收购后，交易遭监管叫停，如今腾讯联合原股东拟将其“赎回”。文章回顾 Manus 从爆红、出海到被收购的全过程，并实测建站、PPT、云电脑及会员价格，分析其产品护城河与腾讯可能接盘的原因。',
    cover: '/covers/wechat-3.jpg',
    url: 'https://mp.weixin.qq.com/s/0jPZ1KJsQ4VyVrUga5_NXA',
    date: '2026-07-14',
  },
  {
    title: 'ChatGPT取消5小时限额，Codex终于可以疯狂造起来了！',
    description: 'OpenAI 暂时取消 Plus、Business、Pro 套餐的 5 小时使用限制，Codex 随便用。同时梳理近期 AI 模型大乱斗：Fable 5 被迫第三次延长、Grok 4.5 翻身、Gemini 3.5 Pro 回炉重造。竞争让模型越来越强、价格越来越低，普通消费者正在享受最大的红利。',
    cover: '/covers/wechat-4.jpg',
    url: 'https://mp.weixin.qq.com/s/IxPOk1hD6_RqEA5M5WjZqQ',
    date: '2026-07-13',
  },
];
