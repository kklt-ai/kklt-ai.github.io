/**
 * 抓取公众号文章的标题、描述、封面、发布时间，
 * 封面图保存到 public/covers/，并回写 src/data/wechat-articles.ts。
 *
 * 用法：node scripts/fetch-wechat-articles.mjs
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataFile = path.join(root, 'src/data/wechat-articles.ts');
const coverDir = path.join(root, 'public/covers');

// 微信文章页对 UA 敏感，模拟手机微信浏览器
const UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 ' +
  '(KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.47 NetType/WIFI Language/zh_CN';

function decodeEntities(str) {
  return str
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function pick(html, ...patterns) {
  for (const pattern of patterns) {
    const m = html.match(pattern);
    if (m && m[1] && m[1].trim()) return decodeEntities(m[1].trim());
  }
  return '';
}

function escapeTs(str) {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

async function fetchArticle(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();

  const title = pick(
    html,
    /<meta\s+property="og:title"\s+content="([^"]*)"/,
    /var\s+msg_title\s*=\s*'([^']*)'/,
    /<h1[^>]*class="rich_media_title[^"]*"[^>]*>([\s\S]*?)<\/h1>/
  );
  const description = pick(
    html,
    /<meta\s+property="og:description"\s+content="([^"]*)"/,
    /var\s+msg_desc\s*=\s*'([^']*)'/
  );
  const cover = pick(
    html,
    /<meta\s+property="og:image"\s+content="([^"]*)"/,
    /var\s+msg_cdn_url\s*=\s*"([^"]*)"/,
    /var\s+cdn_url_1_1\s*=\s*"([^"]*)"/
  );
  let date = pick(html, /var\s+createTime\s*=\s*'([^']*)'/, /<em\s+id="publish_time"[^>]*>([^<]*)<\/em>/);
  if (!date) {
    const ct = html.match(/var\s+ct\s*=\s*"(\d+)"/);
    if (ct) date = new Date(Number(ct[1]) * 1000).toISOString().slice(0, 10);
  } else {
    date = date.slice(0, 10);
  }

  if (!title) throw new Error('未解析到标题，页面可能被微信拦截（环境异常/验证页）');
  return { title, description, cover, date };
}

async function downloadCover(coverUrl, referer, index) {
  const res = await fetch(coverUrl, {
    headers: { 'User-Agent': UA, Referer: referer },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`封面下载失败 HTTP ${res.status}`);
  const type = res.headers.get('content-type') || '';
  const ext = type.includes('png') ? 'png' : type.includes('gif') ? 'gif' : type.includes('webp') ? 'webp' : 'jpg';
  const filename = `wechat-${index + 1}.${ext}`;
  const buffer = Buffer.from(await res.arrayBuffer());
  await writeFile(path.join(coverDir, filename), buffer);
  return `/covers/${filename}`;
}

async function main() {
  const source = await readFile(dataFile, 'utf8');
  const urls = [...source.matchAll(/url:\s*'([^']+)'/g)].map((m) => m[1]);
  if (urls.length === 0) throw new Error('数据文件里没有找到文章链接');

  await mkdir(coverDir, { recursive: true });

  const articles = [];
  for (const [i, url] of urls.entries()) {
    console.log(`[${i + 1}/${urls.length}] 抓取 ${url}`);
    const article = await fetchArticle(url);
    articles.push({ ...article, url });
    console.log(`  ${article.date} ${article.title}`);
  }

  // 新文章排在最前面
  articles.sort((a, b) => b.date.localeCompare(a.date));

  for (const [i, article] of articles.entries()) {
    if (article.cover) {
      article.cover = await downloadCover(article.cover, article.url, i);
      console.log(`封面已保存 ${article.cover}`);
    } else {
      console.log(`警告：「${article.title}」未解析到封面，保留空 cover`);
      article.cover = '';
    }
  }

  const out = `export interface WechatArticle {
  title: string;
  description: string;
  cover: string; // 封面图地址，可用公众号封面图或本地 public/ 下的图片
  url: string;   // 公众号文章链接
  date: string;
}

// 在这里维护你的公众号文章，新文章往数组最前面加
// 也可以运行 node scripts/fetch-wechat-articles.mjs 自动抓取标题/描述/封面/时间
export const wechatArticles: WechatArticle[] = [
${articles
  .map(
    (a) => `  {
    title: '${escapeTs(a.title)}',
    description: '${escapeTs(a.description)}',
    cover: '${a.cover}',
    url: '${a.url}',
    date: '${a.date}',
  },`
  )
  .join('\n')}
];
`;
  await writeFile(dataFile, out);
  console.log(`\n已更新 ${path.relative(root, dataFile)}，共 ${articles.length} 篇`);
}

main().catch((err) => {
  console.error(`抓取失败：${err.message}`);
  process.exit(1);
});
