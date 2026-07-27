---
name: watermark-article-images
description: "Add a subtle text watermark to eligible local raster images referenced in a specified Astro Markdown blog article while excluding its frontmatter cover and body images whose width or height is below 200 pixels. Use when the user asks to watermark, brand, protect, or discourage reuse of one article's body images. Default to `公众号: 卡卡罗特AI`, a low-opacity bottom-right placement, and an explicit preview-before-apply workflow."
---

# Watermark article images

Watermark only eligible body images referenced by one local article. Keep the cover, Markdown, and small body images unchanged.

## Workflow

1. Read `AGENTS.md` and `src/content.config.ts`. Check `git status --short -uall` and preserve unrelated changes.
2. Resolve the requested article to `src/content/blog/<slug>.md`. Do not infer a different article when the name is ambiguous.
3. Preview the exact targets without writing files:

   ```bash
   python3 .agents/skills/watermark-article-images/scripts/watermark_article_images.py \
     '<slug-or-markdown-path>'
   ```

   The script reads inline Markdown images, reference-style Markdown images, and HTML `<img src>` values. It resolves root-relative paths under `public/`, deduplicates them, excludes the frontmatter `cover` path even if the body also references it, and reports images whose width or height is below 200 pixels as `Skipped small images`.
4. Review the preview:
   - Stop for missing, remote, unsupported, or animated images so the user does not receive a partially protected article.
   - Note pre-existing changes to target files. Never overwrite a change whose ownership or intent is unclear.
   - Treat `Already watermarked` as complete; do not add a second watermark.
   - Treat `Skipped small images` as intentionally excluded; do not enlarge or watermark them.
5. Apply the previewed operation:

   ```bash
   python3 .agents/skills/watermark-article-images/scripts/watermark_article_images.py \
     '<slug-or-markdown-path>' \
     --apply
   ```

   Use `--text '<text>'` only when the user supplies a different watermark. Use `--position center` only when the user explicitly prioritizes crop resistance over reading comfort. Other supported corners are `bottom-left`, `top-right`, and `top-left`.
6. Run the same preview again. It must report every eligible target as `Already watermarked`, preserve the same `Skipped small images` list, and show no pending targets. Confirm the cover is unchanged and inspect representative light, dark, wide, and narrow images when available.
7. Run:

   ```bash
   npm run build
   git diff --check
   git status --short -uall
   git diff --stat
   ```

## Default treatment

- Text: `公众号: 卡卡罗特AI`
- Position: bottom-right, inset from both edges
- Size: about 2.2% of the image's shorter edge, reduced when needed to fit
- Opacity: 35% white with a thin translucent dark stroke
- Small-image rule: skip when width or height is below 200 pixels; process only images whose dimensions are both at least 200 pixels

This placement avoids the title area and the center of screenshots while remaining visible on mixed backgrounds. It discourages direct reuse but does not technically block hotlinking; network-level hotlink protection belongs at the CDN or host.

## Safety

- Require Pillow (`python3 -m pip install Pillow` only with the user's approval if unavailable).
- Modify only eligible existing local raster files referenced by the requested article.
- Never edit `dist/`, `.astro/`, `node_modules/`, the Markdown file, or the cover.
- Render all output to a staging directory before replacing any target.
- Preserve image dimensions, ICC profiles, DPI where available, transparency, and EXIF data. Expect JPEG files to be re-encoded.
- Embed a `kklt-watermark` metadata marker so subsequent runs skip already processed images.
