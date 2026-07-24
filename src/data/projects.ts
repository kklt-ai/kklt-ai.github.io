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
    name: 'AI 提示词管理器',
    description: '一个帮你收集、分类、一键复用提示词的小工具，vibe-coding 一晚上撸出来的。',
    url: 'https://example.com/prompt-manager',
    emoji: '🧠',
    tag: 'Web 工具',
    color: 'orange',
    featured: true,
  },
  {
    name: '公众号排版助手',
    description: 'Markdown 一键转公众号富文本排版，写作效率直接翻倍。',
    url: 'https://example.com/wechat-md',
    emoji: '✍️',
    tag: '效率工具',
    color: 'green',
    featured: true,
  },
  {
    name: 'AI 周报生成器',
    description: '喂给它几条流水账，自动生成一份体面的工作周报。',
    url: 'https://example.com/weekly-report',
    emoji: '📅',
    tag: 'AI 应用',
    color: 'blue',
    featured: true,
  },
  {
    name: '卡通头像工坊',
    description: '上传照片生成手绘风头像，本站头像就是它画的。',
    url: 'https://example.com/avatar-studio',
    emoji: '🎨',
    tag: 'AI 绘画',
    color: 'pink',
  },
];

/** 首页 Vibe Coding 精选，最多 3 个 */
export function getFeaturedProjects(limit = 3): Project[] {
  return projects.filter((p) => p.featured).slice(0, limit);
}
