/**
 * 抓取 B 站视频的标题、简介、封面、发布时间，
 * 封面图保存到 public/covers/，并回写 src/data/videos.ts（按发布日期倒序）。
 *
 * 用法：node scripts/fetch-bilibili-videos.mjs <视频链接或BV号> [...更多]
 * 数据文件里已有的视频会一并刷新。
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataFile = path.join(root, 'src/data/videos.ts');
const coverDir = path.join(root, 'public/covers');

// B 站接口对 UA 敏感，模拟桌面浏览器
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

function escapeTs(str) {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function formatDate(unixSeconds) {
  const d = new Date(unixSeconds * 1000);
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

async function fetchVideo(bvid) {
  const res = await fetch(`https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`, {
    headers: { 'User-Agent': UA, Referer: 'https://www.bilibili.com' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  if (json.code !== 0) throw new Error(`B 站接口返回 code=${json.code}（${json.message}）`);

  const d = json.data;
  // 简介折叠为单行并截断，避免卡片和数据文件过长
  let description = (d.desc || '').replace(/\s+/g, ' ').trim();
  if (description.length > 120) description = `${description.slice(0, 120)}…`;

  return {
    bvid: d.bvid,
    title: d.title,
    description,
    coverUrl: d.pic,
    url: `https://www.bilibili.com/video/${d.bvid}/`,
    date: formatDate(d.pubdate),
  };
}

async function downloadCover(video) {
  const res = await fetch(video.coverUrl, {
    headers: { 'User-Agent': UA, Referer: video.url },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`封面下载失败 HTTP ${res.status}`);
  const type = res.headers.get('content-type') || '';
  const ext = type.includes('png') ? 'png' : type.includes('webp') ? 'webp' : 'jpg';
  const filename = `bili-${video.bvid}.${ext}`;
  const buffer = Buffer.from(await res.arrayBuffer());
  await writeFile(path.join(coverDir, filename), buffer);
  return `/covers/${filename}`;
}

async function main() {
  // 命令行参数里的链接/BV号 + 数据文件里已有的 BV 号，去重后全部刷新
  const source = await readFile(dataFile, 'utf8');
  const existing = [...source.matchAll(/bvid:\s*'([^']+)'/g)].map((m) => m[1]);
  const fromArgs = process.argv
    .slice(2)
    .map((arg) => arg.match(/BV[a-zA-Z0-9]+/)?.[0])
    .filter(Boolean);
  const bvids = [...new Set([...fromArgs, ...existing])];
  if (bvids.length === 0) {
    throw new Error('请传入视频链接或 BV 号，例如：node scripts/fetch-bilibili-videos.mjs BV1xx411c7mD');
  }

  await mkdir(coverDir, { recursive: true });

  const videos = [];
  for (const [i, bvid] of bvids.entries()) {
    console.log(`[${i + 1}/${bvids.length}] 抓取 ${bvid}`);
    const video = await fetchVideo(bvid);
    video.cover = await downloadCover(video);
    delete video.coverUrl;
    videos.push(video);
    console.log(`  ${video.date} ${video.title}`);
  }

  // 新视频排在最前面
  videos.sort((a, b) => b.date.localeCompare(a.date));

  const out = `export interface Video {
  bvid: string; // B 站 BV 号
  title: string;
  description: string;
  cover: string; // 封面图地址，本地 public/covers/ 下的图片
  url: string; // B 站视频链接
  date: string; // YYYY-MM-DD
}

// 在这里维护你的 B 站视频，按发布日期倒序排列
// 运行 node scripts/fetch-bilibili-videos.mjs <视频链接或BV号> 可自动抓取标题/简介/封面/时间
export const videos: Video[] = [
${videos
  .map(
    (v) => `  {
    bvid: '${v.bvid}',
    title: '${escapeTs(v.title)}',
    description: '${escapeTs(v.description)}',
    cover: '${v.cover}',
    url: '${v.url}',
    date: '${v.date}',
  },`
  )
  .join('\n')}
];

/** 首页「视频教程」展示，取最新 limit 个 */
export function getLatestVideos(limit = 3): Video[] {
  return [...videos].sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit);
}
`;

  await writeFile(dataFile, out);
  console.log(`已更新 ${path.relative(root, dataFile)}，共 ${videos.length} 个视频`);
}

main().catch((err) => {
  console.error(`抓取失败：${err.message}`);
  process.exit(1);
});
