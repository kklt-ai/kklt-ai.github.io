export interface Project {
  name: string;
  description: string;
  url: string;
  emoji: string;
  tag: string;
  color: 'green' | 'orange' | 'blue' | 'pink';
  /** 首页「Vibe Coding精选」展示，建议只标 2～3 个 */
  featured?: boolean;
}

// 在这里维护你的 vibe-coding 个人项目，url 填项目地址即可
// featured: true 的会出现在首页精选区
export const projects: Project[] = [
  {
    name: '公众号排版助手',
    description: '写公众号时把 Markdown 粘贴进来，一键转换成公众号排版格式。',
    url: 'https://kklt-wechat-publish.bigjuy008.workers.dev/',
    emoji: '✍️',
    tag: '效率工具',
    color: 'green',
    featured: true,
  },
  {
    name: '手写图片生成器',
    description: '输入文字，一键转成真实手写风格的图片。',
    url: 'https://hand-write-img.bigjuy008.workers.dev/editor',
    emoji: '🖊️',
    tag: '图片工具',
    color: 'orange',
    featured: true,
  },
];

/** 首页 Vibe Coding 精选，最多 3 个 */
export function getFeaturedProjects(limit = 3): Project[] {
  return projects.filter((p) => p.featured).slice(0, limit);
}
