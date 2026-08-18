export interface Project {
  name: string;
  description: string;
  url: string;
  emoji: string;
  /** 手绘风 SVG 图标，优先于 emoji 展示 */
  icon?: string;
  tag: string;
  color: 'green' | 'orange' | 'blue' | 'pink';
  /** 首页「Vibe Coding精选」展示，建议只标 2～3 个 */
  featured?: boolean;
  /** 部署在外网、需要科学上网才能访问时标记，卡片上会显示「需要魔法」 */
  needVpn?: boolean;
}

// 在这里维护你的 vibe-coding 个人项目，url 填项目地址即可
// featured: true 的会出现在首页精选区
export const projects: Project[] = [
  {
    name: '公众号排版助手',
    description: '写公众号时把 Markdown 粘贴进来，一键转换成公众号排版格式。',
    url: 'https://kklt-wechat-publish.bigjuy008.workers.dev/',
    emoji: '✍️',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="#2b2b2b" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3.8 Q6 3 6.8 3 H13.4 L18 7.6 V20 Q18 20.8 17.2 20.8 H6.8 Q6 20.8 6 20 Z" fill="#fff"/><path d="M13.2 3.2 V7.8 H18"/><path d="M8.8 11.5 H15.2"/><path d="M8.8 14.3 H13.6"/><path d="M8.6 17.4 H15.4" stroke="#ff6b35" stroke-width="2.6"/></svg>`,
    tag: '效率工具',
    color: 'green',
    featured: true,
    needVpn: true,
  },
  {
    name: '手写图片生成器',
    description: '输入文字，一键转成真实手写风格的图片。',
    url: 'https://hand-write-img.bigjuy008.workers.dev/editor',
    emoji: '🖊️',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="#2b2b2b" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.2" y="4.2" width="17.6" height="15.6" rx="2.2" fill="#fff"/><path d="M6.2 15.5 Q8 10 9.8 13 Q11.6 16 13.2 11.5"/><path d="M15.2 13.8 L19.4 6.4 L20.6 7.6 L16.4 15 L14.9 15.3 Z" fill="#ffd65a"/></svg>`,
    tag: '图片工具',
    color: 'orange',
    featured: true,
    needVpn: true,
  },
];

/** 首页 Vibe Coding 精选，最多 3 个 */
export function getFeaturedProjects(limit = 3): Project[] {
  return projects.filter((p) => p.featured).slice(0, limit);
}
