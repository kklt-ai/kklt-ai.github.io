#!/usr/bin/env python3
"""Import a public WeChat article into this Astro blog."""

from __future__ import annotations

import argparse
import html
import json
import mimetypes
import re
import shutil
import subprocess
import sys
import tempfile
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime
from html.parser import HTMLParser
from pathlib import Path
from zoneinfo import ZoneInfo


USER_AGENT = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 Chrome/138.0.0.0 Safari/537.36"
)
IMAGE_RE = re.compile(r"!\[([^\]]*)\]\((https?://[^)\s]+)\)")
CREATE_TIME_RE = re.compile(r'var\s+(?:create_time|ct)\s*=\s*"(\d+)"')
SLUG_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")


class MetaParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.values: dict[str, str] = {}

    def handle_starttag(
        self, tag: str, attrs: list[tuple[str, str | None]]
    ) -> None:
        if tag != "meta":
            return
        values = {key: value or "" for key, value in attrs}
        key = values.get("property") or values.get("name")
        content = values.get("content")
        if key and content and key not in self.values:
            self.values[key] = content


def run(
    args: list[str], *, input_data: bytes | str | None = None
) -> subprocess.CompletedProcess[bytes]:
    if isinstance(input_data, str):
        input_data = input_data.encode()
    return subprocess.run(
        args,
        input=input_data,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=True,
    )


def require_commands() -> None:
    missing = [
        command
        for command in ("curl", "xmllint", "pandoc")
        if shutil.which(command) is None
    ]
    if missing:
        raise RuntimeError(f"missing required commands: {', '.join(missing)}")


def validate_url(url: str) -> None:
    parsed = urllib.parse.urlparse(url)
    if parsed.scheme != "https" or parsed.hostname != "mp.weixin.qq.com":
        raise ValueError("URL must use https://mp.weixin.qq.com/")


def fetch_page(url: str) -> bytes:
    result = run(
        [
            "curl",
            "-L",
            "--compressed",
            "--fail",
            "--max-time",
            "45",
            "-A",
            USER_AGENT,
            url,
        ]
    )
    if len(result.stdout) < 10_000:
        raise RuntimeError("WeChat returned an unexpectedly small page")
    return result.stdout


def parse_metadata(page: bytes) -> dict[str, str]:
    text = page.decode("utf-8", errors="replace")
    parser = MetaParser()
    parser.feed(text)

    title = normalize_space(parser.values.get("og:title", ""))
    description = normalize_space(parser.values.get("og:description", ""))
    if not title:
        raise RuntimeError("article title was not found; the page may be blocked")

    create_time = CREATE_TIME_RE.search(text)
    if create_time:
        published = datetime.fromtimestamp(
            int(create_time.group(1)), tz=ZoneInfo("Asia/Shanghai")
        ).date()
    else:
        published_meta = parser.values.get("article:published_time", "")
        if not published_meta:
            raise RuntimeError("article publish date was not found")
        published = datetime.fromisoformat(
            published_meta.replace("Z", "+00:00")
        ).astimezone(ZoneInfo("Asia/Shanghai")).date()

    return {
        "title": title,
        "description": description,
        "pubDate": published.isoformat(),
    }


def normalize_space(value: str) -> str:
    return re.sub(r"\s+", " ", html.unescape(value)).strip()


def extract_body_html(page: bytes) -> bytes:
    try:
        result = run(
            [
                "xmllint",
                "--html",
                "--recover",
                "--xpath",
                '//*[@id="js_content"]',
                "-",
            ],
            input_data=page,
        )
    except subprocess.CalledProcessError as exc:
        detail = exc.stderr.decode(errors="replace").strip()
        raise RuntimeError(f"article body was not found: {detail}") from exc

    body = result.stdout.decode("utf-8", errors="replace")
    body = body.replace(" data-src=", " src=")
    body = re.sub(
        r'<span(?=[^>]*style="[^"]*font-weight:\s*bold;?[^"]*")[^>]*>'
        r"([^<]*)</span>",
        r"<strong>\1</strong>",
        body,
    )
    return body.encode()


def html_to_markdown(body: bytes) -> str:
    result = run(
        ["pandoc", "-f", "html", "-t", "gfm-raw_html", "--wrap=none"],
        input_data=body,
    )
    markdown = result.stdout.decode("utf-8").strip()
    if len(markdown) < 100:
        raise RuntimeError("converted article body is unexpectedly short")
    return markdown + "\n"


def derive_description(markdown: str) -> str:
    result = run(
        ["pandoc", "-f", "gfm", "-t", "plain", "--wrap=none"],
        input_data=markdown,
    )
    plain = normalize_space(result.stdout.decode("utf-8"))
    if not plain:
        raise RuntimeError("could not derive an article description")
    return plain[:117] + ("…" if len(plain) > 117 else "")


def extension_from(url: str, content_type: str | None) -> str:
    query_format = urllib.parse.parse_qs(
        urllib.parse.urlparse(url).query
    ).get("wx_fmt", [""])[0].lower()
    if query_format in {"png", "gif", "webp", "avif", "svg"}:
        return query_format
    if query_format in {"jpg", "jpeg"}:
        return "jpeg"

    mime = (content_type or "").split(";", 1)[0].strip().lower()
    suffix = (mimetypes.guess_extension(mime) or "").lstrip(".").lower()
    if suffix in {"jpg", "jpeg", "jpe"}:
        return "jpeg"
    if suffix in {"png", "gif", "webp", "avif", "svg"}:
        return suffix
    raise RuntimeError(f"unsupported image content type: {content_type!r}")


def download_image(url: str, destination_base: Path, index: int, source: str) -> Path:
    request = urllib.request.Request(
        url,
        headers={"User-Agent": USER_AGENT, "Referer": source},
    )
    try:
        with urllib.request.urlopen(request, timeout=45) as response:
            data = response.read()
            content_type = response.headers.get("Content-Type")
    except urllib.error.URLError as exc:
        raise RuntimeError(f"failed to download image {url}: {exc}") from exc

    if not data or not (content_type or "").lower().startswith("image/"):
        raise RuntimeError(f"image URL did not return image data: {url}")

    destination = destination_base / f"{index:02d}.{extension_from(url, content_type)}"
    destination.write_bytes(data)
    return destination


def localize_images(
    markdown: str, stage_dir: Path, slug: str, source_url: str
) -> tuple[str, list[Path]]:
    seen: dict[str, str] = {}
    downloaded: list[Path] = []

    def replace(match: re.Match[str]) -> str:
        alt, url = match.group(1), match.group(2)
        if url not in seen:
            path = download_image(url, stage_dir, len(downloaded) + 1, source_url)
            downloaded.append(path)
            seen[url] = f"/blog/{slug}/{path.name}"
        return f"![{alt}]({seen[url]})"

    localized = IMAGE_RE.sub(replace, markdown)
    return localized, downloaded


def yaml_string(value: str) -> str:
    return json.dumps(value, ensure_ascii=False)


def build_document(
    metadata: dict[str, str],
    markdown: str,
    source_url: str,
    tags: list[str],
    cover: str | None,
) -> str:
    lines = [
        "---",
        f"title: {yaml_string(metadata['title'])}",
        f"description: {yaml_string(metadata['description'])}",
        f"pubDate: {metadata['pubDate']}",
        f"tags: {json.dumps(tags, ensure_ascii=False)}",
    ]
    if cover:
        lines.append(f"cover: {cover}")
    lines.extend(
        [
            f"wechatUrl: {source_url}",
            "---",
            "",
            markdown.rstrip(),
            "",
        ]
    )
    return "\n".join(lines)


def inspect_result(
    metadata: dict[str, str], markdown: str, source_url: str
) -> None:
    output = {
        **metadata,
        "url": source_url,
        "bodyImageCount": len(IMAGE_RE.findall(markdown)),
    }
    print(json.dumps(output, ensure_ascii=False, indent=2))


def import_article(args: argparse.Namespace) -> None:
    if not args.slug or not SLUG_RE.fullmatch(args.slug):
        raise ValueError(
            "--slug is required and must contain lowercase ASCII letters, "
            "digits, and single hyphens"
        )

    repo = args.repo_root.resolve()
    content_dir = repo / "src/content/blog"
    public_blog_dir = repo / "public/blog"
    if not (repo / "package.json").is_file() or not content_dir.is_dir():
        raise RuntimeError(f"not a compatible Astro blog root: {repo}")

    markdown_target = content_dir / f"{args.slug}.md"
    assets_target = public_blog_dir / args.slug
    if markdown_target.exists() or assets_target.exists():
        raise FileExistsError(
            f"refusing to overwrite {markdown_target} or {assets_target}"
        )

    page = fetch_page(args.url)
    metadata = parse_metadata(page)
    body_markdown = html_to_markdown(extract_body_html(page))
    if args.title:
        metadata["title"] = normalize_space(args.title)
    metadata["description"] = normalize_space(
        args.description or metadata["description"]
    )
    if not metadata["description"]:
        metadata["description"] = derive_description(body_markdown)

    with tempfile.TemporaryDirectory(prefix="wechat-import-") as temp:
        stage_dir = Path(temp) / "images"
        stage_dir.mkdir()
        localized, images = localize_images(
            body_markdown, stage_dir, args.slug, args.url
        )
        cover = f"/blog/{args.slug}/{images[0].name}" if images else None
        document = build_document(
            metadata, localized, args.url, args.tag, cover
        )

        assets_created = False
        try:
            if images:
                public_blog_dir.mkdir(parents=True, exist_ok=True)
                shutil.copytree(stage_dir, assets_target)
                assets_created = True
            markdown_target.write_text(document, encoding="utf-8")
        except Exception:
            if markdown_target.exists():
                markdown_target.unlink()
            if assets_created:
                shutil.rmtree(assets_target)
            raise

    print(f"created_markdown={markdown_target}")
    print(f"localized_images={len(images)}")
    print(f"assets_dir={assets_target if images else 'none'}")
    print(f"route=/blog/{args.slug}/")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("url", help="Public mp.weixin.qq.com article URL")
    parser.add_argument("--inspect", action="store_true", help="Print metadata only")
    parser.add_argument("--slug", help="ASCII blog slug")
    parser.add_argument("--title", help="Optional title override")
    parser.add_argument("--description", help="Optional list-card description")
    parser.add_argument("--tag", action="append", default=[], help="Repeat for tags")
    parser.add_argument(
        "--repo-root", type=Path, default=Path.cwd(), help="Astro repository root"
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    try:
        require_commands()
        validate_url(args.url)
        if args.inspect:
            page = fetch_page(args.url)
            metadata = parse_metadata(page)
            markdown = html_to_markdown(extract_body_html(page))
            inspect_result(metadata, markdown, args.url)
        else:
            import_article(args)
    except (
        FileExistsError,
        RuntimeError,
        ValueError,
        subprocess.CalledProcessError,
    ) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
