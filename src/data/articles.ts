import { getCollection } from 'astro:content';
import { wechatArticles } from './wechat-articles';

export interface Article {
  title: string;
  description: string;
  cover?: string;
  url: string;
  date: string; // YYYY-MM-DD
  source: '公众号' | '站内';
  external: boolean;
  pinned: boolean;
}

// 合并公众号文章和站内 Markdown 文章：置顶文章在前，其余按时间倒序（最新在前），不区分入口
export async function getAllArticles(): Promise<Article[]> {
  const posts = await getCollection('blog');

  const blogArticles: Article[] = posts.map((p) => ({
    title: p.data.title,
    description: p.data.description,
    cover: p.data.cover,
    url: `/blog/${p.id}/`,
    date: p.data.pubDate.toISOString().slice(0, 10),
    source: '站内',
    external: false,
    pinned: p.data.pinned,
  }));

  const wechat: Article[] = wechatArticles.map((a) => ({
    title: a.title,
    description: a.description,
    cover: a.cover,
    url: a.url,
    date: a.date,
    source: '公众号',
    external: true,
    pinned: a.pinned ?? false,
  }));

  return [...wechat, ...blogArticles].sort(
    (a, b) => Number(b.pinned) - Number(a.pinned) || b.date.localeCompare(a.date)
  );
}
