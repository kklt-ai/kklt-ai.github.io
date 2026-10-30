#!/usr/bin/env python3
"""Import a Yuque document or its Markdown export into an Astro blog."""

import argparse
import html
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo


def token_from_local(root):
    token = os.environ.get('YUQUE_TOKEN', '')
    path = root / '.env.local'
    if not token and path.exists():
        for line in path.read_text().splitlines():
            if line.startswith('YUQUE_TOKEN='):
                token = line.split('=', 1)[1].strip().strip('\"\'')
    if not token:
        raise ValueError('Set YUQUE_TOKEN in the ignored .env.local file.')
    return token


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def api(path, token):
    request = urllib.request.Request(
        'https://www.yuque.com/api/v2/' + path,
        headers={'X-Auth-Token': token, 'User-Agent': 'kklt-blog-importer'},
    )
    try:
        with urllib.request.build_opener(NoRedirect).open(request, timeout=45) as response:
            return json.load(response)['data']
    except urllib.error.HTTPError as exc:
        raise RuntimeError(f'Yuque API HTTP {exc.code}; stop and check access or rate limits.') from None


def pandoc(text, source, target):
    return subprocess.run(
        ['pandoc', '--from', source, '--to', target, '--wrap=none'],
        input=text, text=True, capture_output=True, check=True,
    ).stdout


def localize(body, asset_dir, slug, source_dir, cover):
    """Use Pandoc's AST so reference images work and code examples stay untouched."""
    document = json.loads(pandoc(body, 'gfm', 'json'))
    seen = {}
    mime_extensions = {
        'image/png': '.png', 'image/jpeg': '.jpeg', 'image/gif': '.gif',
        'image/webp': '.webp', 'image/avif': '.avif', 'image/svg+xml': '.svg',
    }

    def download(url, name=None):
        url = html.unescape(url)
        clean, _ = urllib.parse.urldefrag(url)
        if clean in seen and name is None:
            return seen[clean]
        if clean.startswith(('https://', 'http://')):
            request = urllib.request.Request(clean, headers={'User-Agent': 'Mozilla/5.0'})
            # Image hosts receive no Yuque token, including on redirects.
            with urllib.request.urlopen(request, timeout=45) as response:
                data = response.read()
                ext = mime_extensions.get(response.headers.get_content_type())
            if not ext:
                raise ValueError('Image URL did not return a supported image: ' + clean)
        else:
            if not source_dir:
                raise ValueError('Unexpected local image in API body: ' + clean)
            path = (source_dir / urllib.parse.unquote(clean)).resolve()
            if not path.is_relative_to(source_dir.resolve()):
                raise ValueError('Export image escapes its source directory.')
            data = path.read_bytes()
            ext = path.suffix.lower()
            if ext not in {*mime_extensions.values(), '.jpg'}:
                raise ValueError('Unsupported local image: ' + str(path))
        target = (name or f'{len(seen) + 1:02d}') + ext
        (asset_dir / target).write_bytes(data)
        local = f'/blog/{slug}/{target}'
        seen[clean] = local
        return local

    def walk(node):
        if isinstance(node, dict):
            if node.get('t') == 'Image':
                node['c'][2][0] = download(node['c'][2][0])
            elif node.get('t') in ('RawInline', 'RawBlock') and node['c'][0] == 'html':
                raw = node['c'][1]

                def image(match):
                    tag = match.group(0)
                    src = re.search(r'\bsrc=[\"\']([^\"\']+)[\"\']', tag, re.I)
                    if not src:
                        raise ValueError('HTML image without src requires manual review.')
                    return tag[:src.start(1)] + download(src[1]) + tag[src.end(1):]

                node['c'][1] = re.sub(r'<img\b[^>]*>', image, raw, flags=re.I)
                if re.search(r'\b(?:srcset|data-src)=', node['c'][1], re.I):
                    raise ValueError('Lazy/responsive images require manual review.')
            for value in node.values():
                walk(value)
        elif isinstance(node, list):
            for value in node:
                walk(value)

    walk(document)
    local_cover = download(cover, 'cover') if cover else None
    return pandoc(json.dumps(document), 'json', 'gfm'), local_cover, len(seen)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('url')
    parser.add_argument('--root', type=Path, default=Path.cwd())
    parser.add_argument('--inspect', action='store_true')
    parser.add_argument('--markdown', type=Path, help='UI-exported Markdown when API is unavailable')
    parser.add_argument('--title')
    parser.add_argument('--date', help='Verified source date, YYYY-MM-DD')
    parser.add_argument('--cover', help='Actual source cover URL; optional')
    parser.add_argument('--slug')
    parser.add_argument('--description')
    parser.add_argument('--tag', action='append', default=[])
    args = parser.parse_args()
    root = args.root.resolve()
    parsed = urllib.parse.urlsplit(args.url)
    parts = parsed.path.strip('/').split('/')
    if parsed.scheme != 'https' or parsed.netloc != 'www.yuque.com' or len(parts) != 3:
        raise ValueError('Expected https://www.yuque.com/<owner>/<book>/<doc>.')
    url = 'https://www.yuque.com/' + '/'.join(parts)
    for post in (root / 'src/content/blog').glob('*.md'):
        if url in post.read_text():
            raise ValueError('Source already imported: ' + str(post))

    if args.markdown:
        if not args.title or not args.date:
            raise ValueError('Markdown export requires --title and verified --date.')
        body = args.markdown.read_text()
        title, date, cover = args.title, args.date, args.cover
    else:
        token = token_from_local(root)
        path = 'repos/' + '/'.join(urllib.parse.quote(p, safe='') for p in parts[:2])
        doc = api(path + '/docs/' + urllib.parse.quote(parts[2], safe=''), token)
        title = doc['title']
        body = doc.get('body') if doc.get('format') == 'markdown' else None
        if not body:
            body = api('yfm/docs?doc_id=' + str(int(doc['id'])), token)['yfm']
        timestamp = doc.get('first_published_at') or doc.get('published_at') or doc['created_at']
        date = datetime.fromisoformat(timestamp.replace('Z', '+00:00')).astimezone(
            ZoneInfo('Asia/Shanghai')).strftime('%Y-%m-%d')
        cover = args.cover or doc.get('cover')
    datetime.strptime(date, '%Y-%m-%d')
    if not body.strip() or re.search(r'<(?:!doctype|html|lake|card)\b', body, re.I):
        raise ValueError('Empty or unsupported document; export Markdown through Yuque UI.')
    if args.inspect:
        print(json.dumps({'title': title, 'date': date, 'cover': cover, 'body': body}, ensure_ascii=False, indent=2))
        return
    if not args.slug or not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', args.slug):
        raise ValueError('Supply a lowercase ASCII --slug.')
    if not args.description:
        raise ValueError('Supply --description after reading the article.')
    article = root / f'src/content/blog/{args.slug}.md'
    assets = root / f'public/blog/{args.slug}'
    if article.exists() or assets.exists():
        raise ValueError('Article or image directory already exists; refusing to overwrite.')
    with tempfile.TemporaryDirectory(prefix='yuque-import-') as temp:
        staging = Path(temp)
        body, cover, count = localize(body, staging, args.slug,
                                      args.markdown.parent if args.markdown else None, cover)
        fields = {'title': title, 'description': args.description, 'pubDate': date,
                  'tags': args.tag, 'yuqueUrl': url}
        if cover:
            fields['cover'] = cover
        # JSON strings and arrays are valid YAML frontmatter values.
        frontmatter = '\n'.join(k + ': ' + json.dumps(v, ensure_ascii=False) for k, v in fields.items())
        text = f'---\n{frontmatter}\n---\n\n{body.strip()}\n'
        assets.parent.mkdir(parents=True, exist_ok=True)
        shutil.copytree(staging, assets)
        try:
            with article.open('x') as file:
                file.write(text)
        except Exception:
            shutil.rmtree(assets)
            raise
    print(json.dumps({'article': str(article), 'images': count, 'route': f'/blog/{args.slug}/'}, ensure_ascii=False))


if __name__ == '__main__':
    try:
        main()
    except (ValueError, RuntimeError, OSError, subprocess.CalledProcessError) as exc:
        print(str(exc), file=sys.stderr)
        sys.exit(1)
