#!/usr/bin/env python3
"""Add a subtle watermark to one Astro Markdown article's body images."""

from __future__ import annotations

import argparse
import hashlib
import html
import os
import re
import shutil
import sys
import tempfile
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import unquote, urlsplit

try:
    from PIL import Image, ImageDraw, ImageFont, ImageOps, PngImagePlugin
except ImportError as exc:
    raise SystemExit(
        "Pillow is required. Install it with `python3 -m pip install Pillow` "
        "after obtaining approval."
    ) from exc


DEFAULT_TEXT = "公众号: 卡卡罗特AI"
MARKER_KEY = "kklt-watermark"
MARKER_PREFIX = "kklt-watermark:v2:"
MIN_WATERMARK_DIMENSION = 200
SUPPORTED_SUFFIXES = {".png", ".jpg", ".jpeg", ".webp"}
POSITIONS = {"bottom-right", "bottom-left", "top-right", "top-left", "center"}

FENCED_CODE_RE = re.compile(r"(?ms)^[ \t]*(```|~~~).*?^[ \t]*\1[ \t]*$")
INLINE_IMAGE_RE = re.compile(
    r"!\[[^\]]*\]\(\s*(?:<([^>]+)>|([^\s)]+))"
    r"(?:\s+(?:\"[^\"]*\"|'[^']*'|\([^)]*\)))?\s*\)"
)
REFERENCE_IMAGE_RE = re.compile(r"!\[([^\]]*)\]\[([^\]]*)\]")
REFERENCE_DEFINITION_RE = re.compile(
    r"(?m)^[ \t]{0,3}\[([^\]]+)\]:[ \t]*(?:<([^>]+)>|(\S+))"
)
HTML_IMAGE_RE = re.compile(
    r"<img\b[^>]*?\bsrc\s*=\s*(?:\"([^\"]+)\"|'([^']+)'|([^\s>]+))",
    re.IGNORECASE,
)
FRONTMATTER_RE = re.compile(r"\A---[ \t]*\n(.*?)\n---[ \t]*(?:\n|$)", re.DOTALL)
COVER_RE = re.compile(r"(?m)^cover:[ \t]*(.*?)[ \t]*$")


@dataclass(frozen=True)
class ScanResult:
    article: Path
    cover: Path | None
    targets: tuple[Path, ...]
    already_watermarked: tuple[Path, ...]
    too_small: tuple[tuple[Path, tuple[int, int]], ...]
    remote: tuple[str, ...]
    missing: tuple[Path, ...]
    unsupported: tuple[Path, ...]
    animated: tuple[Path, ...]

    @property
    def has_errors(self) -> bool:
        return bool(self.remote or self.missing or self.unsupported or self.animated)


def find_repo_root(explicit: str | None) -> Path:
    if explicit:
        root = Path(explicit).expanduser().resolve()
        if not (root / "src/content/blog").is_dir() or not (root / "public").is_dir():
            raise ValueError(f"Not an Astro blog repository root: {root}")
        return root

    for candidate in Path(__file__).resolve().parents:
        if (candidate / "src/content/blog").is_dir() and (candidate / "public").is_dir():
            return candidate
    raise ValueError("Could not locate the repository root.")


def resolve_article(root: Path, value: str) -> Path:
    supplied = Path(value).expanduser()
    candidates = []
    if supplied.is_absolute():
        candidates.append(supplied)
    else:
        candidates.append(root / supplied)
        name = value if value.endswith(".md") else f"{value}.md"
        candidates.append(root / "src/content/blog" / name)

    blog_root = (root / "src/content/blog").resolve()
    for candidate in candidates:
        resolved = candidate.resolve()
        if resolved.is_file():
            try:
                resolved.relative_to(blog_root)
            except ValueError as exc:
                raise ValueError(f"Article must be under {blog_root}: {resolved}") from exc
            return resolved
    raise ValueError(f"Article not found: {value}")


def strip_quotes(value: str) -> str:
    value = value.strip()
    if len(value) >= 2 and value[0] == value[-1] and value[0] in {"'", '"'}:
        return value[1:-1]
    return value


def extract_image_references(markdown: str) -> tuple[list[str], str | None]:
    frontmatter_match = FRONTMATTER_RE.match(markdown)
    cover = None
    body = markdown
    if frontmatter_match:
        cover_match = COVER_RE.search(frontmatter_match.group(1))
        if cover_match:
            cover = strip_quotes(cover_match.group(1))
        body = markdown[frontmatter_match.end() :]

    body = FENCED_CODE_RE.sub("", body)
    references: list[str] = []

    for match in INLINE_IMAGE_RE.finditer(body):
        references.append(html.unescape(match.group(1) or match.group(2)))

    definitions: dict[str, str] = {}
    for match in REFERENCE_DEFINITION_RE.finditer(body):
        definitions[match.group(1).strip().casefold()] = html.unescape(
            match.group(2) or match.group(3)
        )
    for match in REFERENCE_IMAGE_RE.finditer(body):
        key = (match.group(2) or match.group(1)).strip().casefold()
        if key in definitions:
            references.append(definitions[key])

    for match in HTML_IMAGE_RE.finditer(body):
        references.append(html.unescape(next(group for group in match.groups() if group)))

    return references, cover


def resolve_local_image(root: Path, article: Path, reference: str) -> Path | None:
    reference = reference.strip()
    if not reference or reference.startswith("//"):
        return None

    parsed = urlsplit(reference)
    if parsed.scheme or parsed.netloc:
        return None

    decoded_path = unquote(parsed.path)
    if not decoded_path:
        return None
    if decoded_path.startswith("/"):
        candidate = root / "public" / decoded_path.lstrip("/")
    else:
        candidate = article.parent / decoded_path
        if not candidate.exists():
            candidate = root / "public" / decoded_path

    resolved = candidate.resolve()
    try:
        resolved.relative_to(root.resolve())
    except ValueError as exc:
        raise ValueError(f"Image reference escapes the repository: {reference}") from exc
    return resolved


def marker_for(text: str) -> str:
    digest = hashlib.sha256(text.encode("utf-8")).hexdigest()[:12]
    return f"{MARKER_PREFIX}{digest}"


def has_marker(image: Image.Image) -> bool:
    png_marker = image.info.get(MARKER_KEY)
    if png_marker and MARKER_PREFIX in str(png_marker):
        return True
    try:
        values = image.getexif().values()
    except Exception:
        return False
    for value in values:
        if isinstance(value, bytes):
            if MARKER_PREFIX.encode("ascii") in value:
                return True
        elif MARKER_PREFIX in str(value):
            return True
    return False


def inspect_image(path: Path) -> tuple[bool, bool, tuple[int, int]]:
    with Image.open(path) as image:
        animated = bool(getattr(image, "is_animated", False))
        return has_marker(image), animated, image.size


def is_too_small(size: tuple[int, int]) -> bool:
    width, height = size
    return width < MIN_WATERMARK_DIMENSION or height < MIN_WATERMARK_DIMENSION


def scan_article(root: Path, article: Path) -> ScanResult:
    markdown = article.read_text(encoding="utf-8")
    references, cover_reference = extract_image_references(markdown)

    cover = (
        resolve_local_image(root, article, cover_reference) if cover_reference else None
    )
    remote: list[str] = []
    missing: list[Path] = []
    unsupported: list[Path] = []
    animated: list[Path] = []
    targets: list[Path] = []
    already: list[Path] = []
    too_small: list[tuple[Path, tuple[int, int]]] = []
    seen: set[Path] = set()

    for reference in references:
        image_path = resolve_local_image(root, article, reference)
        if image_path is None:
            remote.append(reference)
            continue
        if image_path == cover or image_path in seen:
            continue
        seen.add(image_path)
        if not image_path.is_file():
            missing.append(image_path)
            continue
        if image_path.suffix.lower() not in SUPPORTED_SUFFIXES:
            unsupported.append(image_path)
            continue
        marked, is_animated, size = inspect_image(image_path)
        if is_animated:
            animated.append(image_path)
        elif is_too_small(size):
            too_small.append((image_path, size))
        elif marked:
            already.append(image_path)
        else:
            targets.append(image_path)

    return ScanResult(
        article=article,
        cover=cover,
        targets=tuple(targets),
        already_watermarked=tuple(already),
        too_small=tuple(too_small),
        remote=tuple(remote),
        missing=tuple(missing),
        unsupported=tuple(unsupported),
        animated=tuple(animated),
    )


def font_candidates() -> list[Path]:
    # Prefer lighter sans-serif faces; heavier fonts look bold when stroked.
    return [
        Path("/System/Library/Fonts/Hiragino Sans GB.ttc"),
        Path("/System/Library/Fonts/PingFang.ttc"),
        Path("/System/Library/Fonts/STHeiti Light.ttc"),
        Path("/System/Library/Fonts/STHeiti Medium.ttc"),
        Path("/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc"),
        Path("/usr/share/fonts/opentype/noto/NotoSansCJKsc-Regular.otf"),
        Path("/usr/share/fonts/truetype/wqy/wqy-zenhei.ttc"),
        Path("C:/Windows/Fonts/msyh.ttc"),
        Path("C:/Windows/Fonts/simhei.ttf"),
    ]


def resolve_font(explicit: str | None) -> Path:
    if explicit:
        path = Path(explicit).expanduser().resolve()
        if not path.is_file():
            raise ValueError(f"Font not found: {path}")
        return path
    for path in font_candidates():
        if path.is_file():
            return path
    raise ValueError(
        "No CJK font found. Pass one explicitly with `--font /path/to/font.ttf`."
    )


def fit_font(
    draw: ImageDraw.ImageDraw, font_path: Path, text: str, width: int, height: int
) -> tuple[ImageFont.FreeTypeFont, tuple[int, int, int, int]]:
    shorter = min(width, height)
    size = max(8, min(40, round(shorter * 0.022)))
    max_width = max(1, round(width * 0.48))
    max_height = max(1, round(height * 0.10))

    while size >= 6:
        font = ImageFont.truetype(str(font_path), size=size)
        bbox = draw.textbbox((0, 0), text, font=font, stroke_width=max(1, size // 20))
        if bbox[2] - bbox[0] <= max_width and bbox[3] - bbox[1] <= max_height:
            return font, bbox
        size -= 1
    raise ValueError(f"Image is too small for a readable watermark: {width}x{height}")


def watermark_position(
    position: str,
    width: int,
    height: int,
    text_width: int,
    text_height: int,
    bbox: tuple[int, int, int, int],
) -> tuple[int, int]:
    margin = max(8, round(min(width, height) * 0.018))
    if position == "bottom-right":
        x, y = width - margin - text_width, height - margin - text_height
    elif position == "bottom-left":
        x, y = margin, height - margin - text_height
    elif position == "top-right":
        x, y = width - margin - text_width, margin
    elif position == "top-left":
        x, y = margin, margin
    else:
        x, y = (width - text_width) // 2, (height - text_height) // 2
    return x - bbox[0], y - bbox[1]


def append_exif_marker(exif: Image.Exif, marker: str) -> None:
    tag = 37510  # UserComment
    encoded = b"ASCII\x00\x00\x00" + marker.encode("ascii")
    existing = exif.get(tag)
    if existing:
        existing_bytes = (
            existing if isinstance(existing, bytes) else str(existing).encode("utf-8")
        )
        encoded = existing_bytes + b"\n" + encoded
    exif[tag] = encoded
    exif.pop(274, None)  # Pixels have been normalized with exif_transpose.


def render_watermark(
    source: Path,
    destination: Path,
    text: str,
    position: str,
    opacity: float,
    font_path: Path,
) -> None:
    marker = marker_for(text)
    with Image.open(source) as original:
        image_format = original.format
        icc_profile = original.info.get("icc_profile")
        dpi = original.info.get("dpi")
        exif = original.getexif()
        normalized = ImageOps.exif_transpose(original)
        preserve_alpha = (
            "A" in normalized.getbands() or "transparency" in original.info
        )
        base = normalized.convert("RGBA")

        overlay = Image.new("RGBA", base.size, (0, 0, 0, 0))
        draw = ImageDraw.Draw(overlay)
        font, bbox = fit_font(draw, font_path, text, base.width, base.height)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        xy = watermark_position(
            position, base.width, base.height, text_width, text_height, bbox
        )
        stroke_width = max(1, font.size // 20)
        draw.text(
            xy,
            text,
            font=font,
            fill=(255, 255, 255, round(255 * opacity)),
            stroke_width=stroke_width,
            stroke_fill=(0, 0, 0, round(255 * min(opacity + 0.08, 0.45))),
        )
        output = Image.alpha_composite(base, overlay)
        destination.parent.mkdir(parents=True, exist_ok=True)

        common: dict[str, object] = {}
        if icc_profile:
            common["icc_profile"] = icc_profile
        if dpi:
            common["dpi"] = dpi

        suffix = source.suffix.lower()
        if suffix == ".png":
            pnginfo = PngImagePlugin.PngInfo()
            for key, value in original.info.items():
                if isinstance(value, str) and key != MARKER_KEY:
                    pnginfo.add_text(key, value)
            pnginfo.add_text(MARKER_KEY, marker)
            if preserve_alpha:
                output.save(
                    destination,
                    format=image_format or "PNG",
                    pnginfo=pnginfo,
                    optimize=True,
                    **common,
                )
            else:
                output.convert("RGB").save(
                    destination,
                    format=image_format or "PNG",
                    pnginfo=pnginfo,
                    optimize=True,
                    **common,
                )
        elif suffix in {".jpg", ".jpeg"}:
            append_exif_marker(exif, marker)
            output.convert("RGB").save(
                destination,
                format=image_format or "JPEG",
                quality=95,
                subsampling=0,
                exif=exif.tobytes(),
                **common,
            )
        elif suffix == ".webp":
            append_exif_marker(exif, marker)
            kwargs = dict(common)
            if exif:
                kwargs["exif"] = exif.tobytes()
            output.save(
                destination,
                format=image_format or "WEBP",
                quality=95,
                method=6,
                **kwargs,
            )
        else:
            raise ValueError(f"Unsupported image format: {source}")


def display_path(root: Path, path: Path | None) -> str:
    if path is None:
        return "(none)"
    try:
        return str(path.relative_to(root))
    except ValueError:
        return str(path)


def print_scan(root: Path, scan: ScanResult) -> None:
    print(f"Article: {display_path(root, scan.article)}")
    print(f"Cover (excluded): {display_path(root, scan.cover)}")
    print(f"Pending body images: {len(scan.targets)}")
    for path in scan.targets:
        print(f"  - {display_path(root, path)}")
    print(f"Already watermarked: {len(scan.already_watermarked)}")
    for path in scan.already_watermarked:
        print(f"  - {display_path(root, path)}")
    print(
        "Skipped small images "
        f"(width < {MIN_WATERMARK_DIMENSION} or "
        f"height < {MIN_WATERMARK_DIMENSION}): "
        f"{len(scan.too_small)}"
    )
    for path, (width, height) in scan.too_small:
        print(f"  - {display_path(root, path)} ({width}x{height})")
    if scan.remote:
        print("Remote images (must be localized first):")
        for reference in scan.remote:
            print(f"  - {reference}")
    if scan.missing:
        print("Missing images:")
        for path in scan.missing:
            print(f"  - {display_path(root, path)}")
    if scan.unsupported:
        print("Unsupported images:")
        for path in scan.unsupported:
            print(f"  - {display_path(root, path)}")
    if scan.animated:
        print("Animated images (unsupported):")
        for path in scan.animated:
            print(f"  - {display_path(root, path)}")


def apply_watermarks(
    root: Path,
    scan: ScanResult,
    text: str,
    position: str,
    opacity: float,
    font_path: Path,
) -> int:
    if not scan.targets:
        print("No pending images to watermark.")
        return 0

    with tempfile.TemporaryDirectory(prefix=".watermark-stage-", dir=root) as temp_dir:
        staging = Path(temp_dir)
        rendered: list[tuple[Path, Path]] = []
        for index, source in enumerate(scan.targets):
            destination = staging / f"{index:04d}{source.suffix.lower()}"
            render_watermark(source, destination, text, position, opacity, font_path)
            destination.chmod(source.stat().st_mode)
            rendered.append((source, destination))

        for source, destination in rendered:
            os.replace(destination, source)

    print(f"Applied watermark to {len(scan.targets)} body image(s).")
    return len(scan.targets)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Preview or apply a subtle watermark to one article's local body images. "
            "The frontmatter cover is always excluded."
        )
    )
    parser.add_argument("article", help="Article slug or Markdown path")
    parser.add_argument("--apply", action="store_true", help="Write the previewed changes")
    parser.add_argument("--text", default=DEFAULT_TEXT, help="Watermark text")
    parser.add_argument(
        "--position",
        choices=sorted(POSITIONS),
        default="bottom-right",
        help="Watermark placement (default: bottom-right)",
    )
    parser.add_argument(
        "--opacity",
        type=float,
        default=0.35,
        help="Text opacity from 0.05 to 0.60 (default: 0.35)",
    )
    parser.add_argument("--font", help="Path to a CJK-capable TTF/OTF/TTC font")
    parser.add_argument("--repo-root", help=argparse.SUPPRESS)
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    if not 0.05 <= args.opacity <= 0.60:
        print("--opacity must be between 0.05 and 0.60.", file=sys.stderr)
        return 2
    if not args.text.strip():
        print("--text must not be empty.", file=sys.stderr)
        return 2

    try:
        root = find_repo_root(args.repo_root)
        article = resolve_article(root, args.article)
        scan = scan_article(root, article)
        print_scan(root, scan)
        if scan.has_errors:
            print("Aborting because not all body images can be watermarked.", file=sys.stderr)
            return 2
        if not args.apply:
            print("Preview only. Re-run with --apply to write these changes.")
            return 0
        font_path = resolve_font(args.font)
        apply_watermarks(
            root, scan, args.text.strip(), args.position, args.opacity, font_path
        )
        return 0
    except (OSError, ValueError) as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
