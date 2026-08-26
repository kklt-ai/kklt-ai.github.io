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
  /** true 时暂时下架，不在网站中显示 */
  hidden?: boolean;
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
  {
    slug: 'lobe-icons',
    name: 'LobeHub Icons',
    description: '专门收录 AI 与大模型品牌 Logo 的开源图标库。',
    url: 'https://icons.lobehub.com/',
    emoji: '🧩',
    category: '设计资源',
    color: 'blue',
    detail:
      'LobeHub Icons 是一套面向 AI 产品和开发者的品牌图标库，集中收录主流 AI、LLM、云服务与开发工具的 Logo。网站可以直接搜索和预览彩色、单色图标，也提供适合网页与应用开发的静态资源和组件。',
    features: [
      '覆盖主流 AI 模型、平台和开发工具品牌',
      '支持按品牌或模型关键词快速搜索',
      '可切换彩色与单色样式预览',
      '提供 SVG、PNG、WebP 等静态资源',
      '开源，并支持 React 与 React Native 项目使用',
    ],
  },
  {
    slug: 'iconfont',
    name: 'Iconfont',
    description: '阿里巴巴出品的矢量图标搜索、下载与团队管理平台。',
    url: 'https://www.iconfont.cn/',
    emoji: '🎨',
    category: '设计资源',
    color: 'orange',
    detail:
      'Iconfont 是阿里妈妈 MUX 打造的矢量图标管理与交流平台。设计师可以上传和维护图标库，用户可以搜索海量单色、多色图标与插画，自定义颜色后下载，并通过项目功能交付给前端开发使用。',
    features: [
      '支持中文、英文和拼音关键词搜索图标',
      '提供单色、多色图标与矢量插画资源',
      '可以在线改色并下载多种格式',
      '购物车支持批量下载和加入项目',
      '团队项目可将图标转换为字体和前端代码',
    ],
  },
  {
    slug: 'aihot',
    name: 'AI HOT',
    description: '聚合 AI 行业动态、热点事件和模型榜单的资讯站。',
    url: 'https://aihot.virxact.com/',
    emoji: '🔥',
    category: '资讯聚合',
    color: 'pink',
    detail:
      'AI HOT 是一个专注 AI 行业的信息聚合站，把网站、社交平台和 RSS 等多个信源中的动态统一筛选、归并和排序。除了实时信息流，还提供 AI 热点事件、日报、周报、月报和模型榜，适合快速了解 AI 圈正在发生什么。',
    features: [
      '聚合多个信源的 AI 新闻、产品更新和行业观点',
      '将重复报道归并为热点事件和时间线',
      '提供 AI 日报、周报、月报与主题聚合',
      '模型榜汇总公开评测、价格和发布时间',
      '支持 RSS、公开 API、Skill 与 MCP 接入',
    ],
  },
  {
    slug: 'newsnow',
    name: 'NewsNow',
    description: '一页查看国内外多个平台实时热榜的资讯聚合站。',
    url: 'https://newsnow.busiyi.world/c/hottest',
    emoji: '📰',
    category: '资讯聚合',
    color: 'green',
    detail:
      'NewsNow 把国内外多个新闻、社区和科技平台的热门内容集中到同一个页面，省去逐个打开网站查看热搜的时间。它既适合快速浏览全网热点，也可以收藏自己常看的信源，组成更精简的个人关注列表。',
    features: [
      '集中展示国内外主流平台的实时热榜',
      '覆盖新闻、科技、社区和社交媒体等信源',
      '支持在最新与最热内容之间切换',
      '可以收藏常用信源并查看个人关注列表',
      '多栏布局方便快速比较不同平台热点',
    ],
  },
  {
    slug: 'zhuque-ai-detection',
    name: '腾讯朱雀 AI 检测',
    description: '检测文本、图片和视频是否可能由 AI 生成。',
    url: 'https://matrix.tencent.com/ai-detect/ai_gen_txt',
    emoji: '🔍',
    category: 'AI 工具',
    color: 'blue',
    detail:
      '腾讯朱雀 AI 检测助手是一款免费的 AIGC 内容识别工具，可以分析文本、图片和视频中可能存在的 AI 生成特征。文本检测兼顾中文和英文，并会标记可疑段落、生成分析报告；检测结果适合作为辅助参考，不能代替人工判断。',
    features: [
      '检测文章、论文、作文和新闻等文本内容',
      '支持中文与英文，并标记疑似 AI 段落',
      '覆盖 GPT、Claude、DeepSeek、Gemini 等常见模型',
      '同时提供 AI 图片与视频检测入口',
      '生成检测报告，结果仅用于辅助判断',
    ],
  },
  {
    slug: 'ylsseo-blog',
    name: '鸭老师 SEO 博客',
    description: '系统讲解 Google SEO 算法、专利与实操方法的中文博客。',
    url: 'https://www.ylsseo.com/google-seo-blog/',
    emoji: '📈',
    category: '学习资源',
    color: 'orange',
    detail:
      '鸭老师 SEO 博客是一套面向中文读者的 Google SEO 学习资源，重点研究搜索算法、Google 专利、API 泄露文档和信息检索机制，同时覆盖内容优化、技术 SEO、链接、收录和常用工具等实操主题。',
    features: [
      '解读 Google 搜索算法、专利和排名机制',
      '覆盖站内、站外与技术 SEO 实操',
      '讲解关键词、搜索意图、内容与链接策略',
      '包含 GSC、Ahrefs、Semrush 等工具教程',
      '持续更新 SEO 行业动态和研究文章',
    ],
  },
  {
    slug: 'cockpit-tools',
    name: 'Cockpit Tools',
    description: '集中管理 Codex、Cursor 等 AI IDE 多账号与配额。',
    url: 'https://github.com/jlcodes99/cockpit-tools',
    emoji: '🎛️',
    category: '效率工具',
    color: 'pink',
    detail:
      'Cockpit Tools 是一款开源的 AI IDE 账号管理桌面工具，支持 Codex、GitHub Copilot、Windsurf、Kiro、Cursor、Trae 等多种平台。它把账号切换、配额监控、自动唤醒和多实例运行集中在一个界面中，适合需要管理多个 AI 编程账号的用户。',
    features: [
      '统一管理多种 AI IDE 和命令行工具账号',
      '一键切换账号，减少重复登录操作',
      '查看剩余配额、消耗进度和重置时间',
      '支持独立配置的应用多开与实例管理',
      '支持 macOS、Windows 和 Linux',
    ],
  },
  {
    slug: 'liang-intensity-calibrator',
    name: '滑动变祖器',
    description: '拖动滑杆，在 31 个等级间校准“梁系强度”的趣味网页。',
    url: 'https://lichtspektrum.github.io/liang-intensity-calibrator/',
    emoji: '🎚️',
    category: '趣味工具',
    color: 'green',
    detail:
      '「滑动变祖器」是一个开源的梁系强度校准器网页小玩具。拖动滑杆，人物会在 31 个等级间平滑变化，从“小难梁”一路升级到戴上帝冕的“梁祖”；还可以参与社区投票，查看实时平均分和历史变化。',
    features: [
      '滑杆覆盖 -15 到 +15，共 31 个强度等级',
      '六个主要状态之间通过视频帧平滑过渡',
      '支持社区投票并显示正向、负向人数',
      '展示个人评分、社区平均分和历史时间线',
      '支持鼠标、触摸和键盘，适配电脑与手机',
    ],
  },
];

/** 按分类分组，保持数据文件中分类出现的顺序 */
export function getToolsByCategory(): { category: string; sites: NavSite[] }[] {
  const groups = new Map<string, NavSite[]>();
  for (const site of tools.filter((site) => !site.hidden)) {
    const list = groups.get(site.category);
    if (list) {
      list.push(site);
    } else {
      groups.set(site.category, [site]);
    }
  }
  return [...groups.entries()].map(([category, sites]) => ({ category, sites }));
}
