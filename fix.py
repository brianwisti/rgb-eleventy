import json
import re
from pathlib import Path
from typing import NamedTuple, Optional

import frontmatter
import yaml
from rich import inspect

SRC_PATH = Path("src")

MEDIA_EXTENSIONS = [".gif", ".jpg", ".png", ".JPG", ".jpeg"]
IGNORED_SECTIONS = ["bookmark", "now"]
IMAGE_PATH = SRC_PATH / "assets" / "img"
MARKDOWN_IMAGE = re.compile(
    r"""
    [#!]
    \[
        (?P<alt> .+?)
    \]
    \(
        (?P<url> [^/].+? )
        (?:
            \s+
            (?P<caption> ".+?")
        )?
    \)
""",
    re.VERBOSE | re.MULTILINE,
)


class FixResult(NamedTuple):
    article: frontmatter.Post
    needs_write: bool


def find_cover(file_path: Path, current_cover: Optional[str]):
    content_dir = file_path.relative_to(SRC_PATH).parent
    content_asset_dir = IMAGE_PATH / content_dir
    possible_covers = list(content_asset_dir.glob("cover.*"))

    if not current_cover and not possible_covers:
        return None

    if current_cover:
        if current_cover.startswith("/"):
            stem = current_cover[1:]
            current_cover_path = SRC_PATH / stem
        else:
            current_cover_path = content_asset_dir / Path(current_cover)

        if not current_cover_path.is_file():
            raise ValueError(
                f"Cover image {current_cover} -> {current_cover_path} does not exist!"
            )

        cover_path = current_cover_path
    else:
        cover_path = possible_covers[0]

    cover_asset_path = cover_path.relative_to(SRC_PATH)
    return f"/{cover_asset_path}"


def fix_article(file_path: Path):
    article = frontmatter.loads(file_path.read_text())
    frontmatter_fix = fix_frontmatter(file_path, article)
    image_fix = fix_images(file_path, article)

    if frontmatter_fix.needs_write or image_fix.needs_write:
        file_path.write_text(frontmatter.dumps(article))
        print(f"Updated {file_path}")


def fix_frontmatter(file_path: Path, article: frontmatter.Post) -> FixResult:
    needs_write = False

    if "layout" in article:
        print(article.metadata)
        article.metadata.pop("layout")
        needs_write = True

    current_cover = article.get("cover")
    new_cover = find_cover(file_path, current_cover)

    if new_cover != current_cover:
        print(
            f"Updating cover for [bold]{file_path}[/bold] to [bold]{new_cover}[/bold]"
        )
        article["cover"] = new_cover
        needs_write = True

    return FixResult(article=article, needs_write=needs_write)


def fix_images(file_path: Path, article: frontmatter.Post) -> FixResult:
    needs_write = False
    content_dir = file_path.relative_to(SRC_PATH).parent
    content_asset_dir = IMAGE_PATH / content_dir
    markdown_updates = {}

    for image_match in MARKDOWN_IMAGE.finditer(article.content):
        image = image_match.groupdict()
        print(image)
        matching_text = article.content[image_match.start() : image_match.end()]
        print(matching_text)
        resource_path = content_asset_dir / image["url"]

        if not resource_path.exists():
            raise ValueError(
                f"nonexistent {resource_path} is referenced in {file_path}"
            )

        asset_path = resource_path.relative_to(SRC_PATH)
        image_url = f"/{asset_path}"

        if caption := image["caption"]:
            image_string = f"{image_url} {caption}"
        else:
            image_string = image_url

        new_markdown = f"![{image['alt']}]({image_string})"
        print(f"{file_path}\n{matching_text} ->\n\t{new_markdown}")
        markdown_updates[matching_text] = new_markdown

    if markdown_updates:
        needs_write = True
        for old, new in markdown_updates.items():
            article.content = article.content.replace(old, new)

    return FixResult(article=article, needs_write=needs_write)


def fix_articles():
    for file_path in SRC_PATH.glob("./**/*.md"):
        fix_article(file_path)


def import_media(src, dest):
    print(f"Import media: {src} -> {dest}")
    ignored_extensions = [".yaml", ".txt", ".html", ".md", ".cache", ".py"]
    media_extensions = [".gif", ".jpg", ".png", ".JPG", ".jpeg"]

    for path in src.glob("**/*.*"):
        if path.suffix not in media_extensions:
            continue

        resource_path = path.relative_to(src)

        if resource_path.parts[0] in IGNORED_SECTIONS:
            continue

        local_resource_path = dest / resource_path

        if local_resource_path.is_file():
            continue

        print(path)
        print(resource_path)
        print(local_resource_path)

        if not local_resource_path.parent.exists():
            raise ValueError(f"Missing parent dir for {local_resource_path}")

        local_resource_path.write_bytes(path.read_bytes())


def import_site_social_data(src, dest=SRC_PATH):
    for data_path in src.glob("**/*.yaml"):
        resource_path = data_path.relative_to(src)

        if resource_path.parts[0] in IGNORED_SECTIONS:
            continue

        article_dir = dest / resource_path.parent
        article_slug = article_dir.name
        dest_path = article_dir / f"{article_slug}.json"
        old_article_data = yaml.safe_load(data_path.read_text())
        if announcements := old_article_data["announcements"]:
            new_article_data = {"announcements": announcements}
            print(data_path)
            print(dest_path)
            dest_path.write_text(json.dumps(new_article_data, indent=2))


def shift_media():
    print(f"Shift media: {SRC_PATH} -> {IMAGE_PATH}")

    for path in SRC_PATH.glob("**/*.*"):
        if path.suffix not in MEDIA_EXTENSIONS:
            continue

        # This is what I get for putting content at the top level of `src`
        if path.is_relative_to(IMAGE_PATH):
            continue

        resource_path = path.relative_to(SRC_PATH)
        resource_dest = IMAGE_PATH / resource_path

        if resource_dest.exists():
            print(f"{resource_path} is in two places at once!")
            continue

        print(path)
        print(resource_path)
        print(resource_dest)
        resource_dest.parent.mkdir(exist_ok=True, parents=True)
        path.rename(resource_dest)


if __name__ == "__main__":
    hugo_path = Path("../rgb-hugo/content")
    # shift_media()
    # fix_articles()
    import_site_social_data(hugo_path)
