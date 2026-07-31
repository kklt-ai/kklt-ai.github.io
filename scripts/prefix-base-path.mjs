import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const distDir = fileURLToPath(new URL('../dist/', import.meta.url));
const rawBasePath = process.env.BASE_PATH ?? '/';
const basePath = `/${rawBasePath.replace(/^\/+|\/+$/g, '')}`;

if (basePath === '/') {
  process.exit(0);
}

function prefixUrl(url) {
  if (!url.startsWith('/') || url.startsWith('//')) return url;
  // Astro 在 --base 下只会自动为构建产物（/_astro/）加前缀，
  // 其余根相对 URL 都需要在这里补前缀；不能按 basePath 前缀豁免，
  // 否则站内 /blog/ 等路由在 basePath 同为 /blog 时会被误判为已加前缀。
  if (url.startsWith(`${basePath}/_astro/`)) return url;
  return `${basePath}${url}`;
}

function prefixHtml(html) {
  const withUrls = html.replace(
    /\b(href|src)=(["'])([^"']*)\2/g,
    (match, attribute, quote, url) =>
      `${attribute}=${quote}${prefixUrl(url)}${quote}`
  );

  return withUrls.replace(
    /\bsrcset=(["'])([^"']*)\1/g,
    (match, quote, value) => {
      const sources = value
        .split(',')
        .map((source) => {
          const [url, ...descriptor] = source.trim().split(/\s+/);
          return [prefixUrl(url), ...descriptor].join(' ');
        })
        .join(', ');

      return `srcset=${quote}${sources}${quote}`;
    }
  );
}

async function findHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory()
        ? findHtmlFiles(path)
        : entry.name.endsWith('.html')
          ? [path]
          : [];
    })
  );

  return files.flat();
}

const htmlFiles = await findHtmlFiles(distDir);

await Promise.all(
  htmlFiles.map(async (file) => {
    const html = await readFile(file, 'utf8');
    await writeFile(file, prefixHtml(html));
  })
);

console.log(`Prefixed ${htmlFiles.length} HTML files with ${basePath}`);
