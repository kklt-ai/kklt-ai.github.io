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
  if (url === basePath || url.startsWith(`${basePath}/`)) return url;
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
