# GitHub Pages Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deploy `kklt-ai/kklt-blog` to GitHub Pages through GitHub Actions with working project-site links and images.

**Architecture:** GitHub Actions builds the Astro static site with the Pages-provided origin and base path, rewrites root-relative URLs in generated HTML for the `/kklt-blog/` project path, uploads `dist/` as a Pages artifact, and deploys it with GitHub's Pages action. Local development remains rooted at `/`, while the production workflow supplies the repository base path.

**Tech Stack:** Astro 5, Node.js 20, GitHub Actions, GitHub Pages

## Global Constraints

- Use npm and the committed `package-lock.json`.
- Do not add runtime dependencies.
- Keep article slugs, content, and public asset paths unchanged.
- Validate with `npm run build`, a Pages-base build, `git diff --check`, and generated HTML URL checks.

---

### Task 1: Add the GitHub Pages build and deployment pipeline

**Files:**
- Create: `.github/workflows/deploy-pages.yml`
- Create: `scripts/prefix-base-path.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: `BASE_PATH`, set by the GitHub Actions `configure-pages` output.
- Produces: a `dist/` directory whose HTML root-relative `href`, `src`, and `srcset` values begin with the Pages project base path.

- [x] **Step 1: Verify the current build failure**

Run:

```bash
npm run build
```

Expected: FAIL because `scripts/build-sites.mjs` no longer exists.

- [x] **Step 2: Restore the standard Astro build command**

Set `package.json` to:

```json
"build": "astro build"
```

- [x] **Step 3: Add the generated-HTML base-path rewriter**

Create `scripts/prefix-base-path.mjs`:

```js
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
```

- [x] **Step 4: Add the Pages workflow**

Create `.github/workflows/deploy-pages.yml` that:

- triggers on pushes to `main` and manual dispatch;
- grants `contents: read`, `pages: write`, and `id-token: write`;
- uses one build job followed by one deploy job;
- runs `npm ci`;
- uses `actions/configure-pages`;
- runs Astro with the action's `origin` and `base_path`;
- runs `BASE_PATH=... node scripts/prefix-base-path.mjs`;
- uploads `dist/` with `actions/upload-pages-artifact`;
- deploys with `actions/deploy-pages`.

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Setup Pages
        id: pages
        uses: actions/configure-pages@v5

      - name: Install dependencies
        run: npm ci

      - name: Build with Astro
        run: npm run build -- --site "${{ steps.pages.outputs.origin }}" --base "${{ steps.pages.outputs.base_path }}"

      - name: Prefix root-relative URLs
        run: BASE_PATH="${{ steps.pages.outputs.base_path }}" node scripts/prefix-base-path.mjs

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [x] **Step 5: Verify local and Pages builds**

Run:

```bash
npm run build
npx astro build --site https://kklt-ai.github.io --base /kklt-blog
BASE_PATH=/kklt-blog node scripts/prefix-base-path.mjs
```

Expected: all commands exit successfully.

- [x] **Step 6: Verify generated URLs**

Run:

```bash
rg -n '(href|src)="\/(?!kklt-blog(?:\/|"))' dist --glob '*.html' --pcre2
```

Expected: no matches.

- [x] **Step 7: Check the final patch**

Run:

```bash
git diff --check
git status --short
git diff -- .github/workflows/deploy-pages.yml scripts/prefix-base-path.mjs package.json
```

Expected: no whitespace errors and only task-related changes.

- [ ] **Step 8: Commit and push**

Run:

```bash
git add .github/workflows/deploy-pages.yml scripts/prefix-base-path.mjs package.json docs/superpowers/plans/2026-07-28-github-pages-deployment.md
git commit -m "配置 GitHub Pages 自动部署"
git push -u origin codex/github-pages-actions
```

Expected: `origin/codex/github-pages-actions` contains the deployment commit. Merge the branch into `main` in GitHub so the deployment workflow is triggered.

- [ ] **Step 9: Verify GitHub Actions and the published site**

Open the repository's Actions and Pages views in Chrome. Confirm the deployment workflow completes successfully, then confirm `https://kklt-ai.github.io/kklt-blog/` loads and key internal links and article images resolve under `/kklt-blog/`.
