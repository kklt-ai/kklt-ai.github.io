export interface NavSite {
  /** 详情页 URL slug，确定后不要修改，会改变公开链接 */
  slug: string;
  name: string;
  /** 列表卡片上的短描述 */
  description: string;
  url: string;
  emoji: string;
  /** 手绘风 SVG 图标，优先于 emoji 展示 */
  icon?: string;
  /** 功能分类，列表页按分类分组展示 */
  category: string;
  color: 'green' | 'orange' | 'blue' | 'pink';
  /** 详情页完整介绍 */
  detail: string;
  /** 详情页亮点功能列表 */
  features: string[];
}

// 在这里维护收录的宝藏网站，slug 一经确定不要修改
// 列表页按 category 分组，分组顺序取各分类第一次出现的位置
export const tools: NavSite[] = [
  {
    slug: 'qq-toolbox',
    name: '帮小忙',
    description: 'QQ 浏览器出品的在线工具箱，上百种免费小工具即开即用。',
    url: 'https://tool.browser.qq.com/',
    emoji: '🧰',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="#2b2b2b" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 9 Q3.4 7.8 4.6 7.8 H19.4 Q20.6 7.8 20.5 9 V18.6 Q20.6 19.8 19.4 19.8 H4.6 Q3.4 19.8 3.5 18.6 Z" fill="#fff"/><path d="M9 7.8 V6 Q9 4.6 10.2 4.6 H13.8 Q15 4.6 15 6 V7.8"/><path d="M3.5 12.6 Q7.6 14.6 12 14.6 T20.5 12.6"/><rect x="10.3" y="12.3" width="3.4" height="3.2" rx="0.9" fill="#ffd65a"/></svg>`,
    category: '效率工具',
    color: 'green',
    detail:
      '「帮小忙」是 QQ 浏览器推出的一站式在线工具箱，收录了上百种日常高频小工具：证件照制作、PDF 格式转换、图片压缩、文字提取、汇率换算……全部在浏览器里即开即用，无需下载安装任何软件，大部分功能完全免费。',
    features: [
      '证件照制作：换底色、改尺寸，一键生成标准证件照',
      'PDF 工具集：转 Word/图片、合并拆分、压缩加水印',
      '图片处理：压缩、裁剪、格式转换、人像抠图',
      '文本工具：OCR 文字识别、字数统计、大小写转换',
      '全部在线完成，无需安装，用完即走',
    ],
  },
  {
    slug: 'photor',
    name: 'Photor',
    description: '在线截图美化工具，让普通截图秒变高级产品图。',
    url: 'https://www.photor.fun/editor',
    emoji: '📸',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="#2b2b2b" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.2" y="5" width="17.6" height="14.4" rx="2.2" fill="#fff"/><circle cx="8.6" cy="9.6" r="1.7" fill="#ffd65a"/><path d="M4.4 17.4 L9.8 11.8 L13.2 15.2 L16.4 12 L20.4 17.4"/><path d="M17.6 1.8 L18 3 L19.2 3.4 L18 3.8 L17.6 5 L17.2 3.8 L16 3.4 L17.2 3 Z" fill="#ff6b35" stroke-width="1.2"/></svg>`,
    category: '图片处理',
    color: 'orange',
    detail:
      'Photor 是一款打开浏览器就能用的截图美化工具。把普通截图拖进去，几秒钟就能加上精致的背景、阴影、圆角和边框，让截图瞬间拥有「苹果发布会级别」的高级感，特别适合做产品展示图、公众号配图和社交媒体分享图。',
    features: [
      '海量精美渐变和纹理背景，一键替换',
      '自动添加柔和的阴影和圆角，质感拉满',
      '支持调整内边距、比例，适配各平台尺寸',
      '浏览器内完成全部处理，图片不上传服务器',
      '免费使用，导出高清无水印',
    ],
  },
  {
    slug: 'revezone',
    name: 'Revezone',
    description: '免费开源的在线白板与笔记工具，数据存在本地不上云。',
    url: 'https://revezone.com/index.html',
    emoji: '🎨',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="#2b2b2b" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.2" y="3.6" width="17.6" height="12.6" rx="2" fill="#fff"/><path d="M6.8 12.4 Q8.6 7.6 10.4 10.8 T14 9.6"/><path d="M17.4 6.6 V9.6 M15.9 8.1 H18.9"/><path d="M9.6 16.2 L8.2 20.4 M14.4 16.2 L15.8 20.4"/></svg>`,
    category: '效率工具',
    color: 'blue',
    detail:
      'Revezone 是一款免费开源的在线白板工具，把手绘风格画板、思维导图和笔记整合在了一起。界面简洁无广告，所有数据默认保存在浏览器本地，不强制注册、不上传云端，既保护隐私又打开就能用，适合随手画架构图、流程图和整理思路。',
    features: [
      '手绘风白板：自由画图、便签、箭头和流程图',
      '支持思维导图，快速梳理知识结构',
      '数据保存在本地浏览器，隐私安全',
      '免注册免登录，打开网页即用',
      '开源免费，无广告无套路',
    ],
  },
];

/** 按分类分组，保持数据文件中分类出现的顺序 */
export function getToolsByCategory(): { category: string; sites: NavSite[] }[] {
  const groups = new Map<string, NavSite[]>();
  for (const site of tools) {
    const list = groups.get(site.category);
    if (list) {
      list.push(site);
    } else {
      groups.set(site.category, [site]);
    }
  }
  return [...groups.entries()].map(([category, sites]) => ({ category, sites }));
}
