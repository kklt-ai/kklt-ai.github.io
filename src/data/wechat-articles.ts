export interface WechatArticle {
  title: string;
  description: string;
  cover: string; // 封面图地址，可用公众号封面图或本地 public/ 下的图片
  url: string;   // 公众号文章链接
  date: string;
  pinned?: boolean; // true 时该文章在列表中置顶
}

// 在这里维护你的公众号文章，新文章往数组最前面加
// 也可以运行 node scripts/fetch-wechat-articles.mjs 自动抓取标题/描述/封面/时间
export const wechatArticles: WechatArticle[] = [];
