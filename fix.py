from pathlib import Path

import frontmatter

def fix_frontmatter(file_path: Path):
    post = frontmatter.loads(file_path.read_text())
    needs_write = False

    if "layout" in post:
        print(post.metadata)
        post.metadata.pop("layout")
        needs_write = True
    
    if "cover" not in post:
        for child in file_path.parent.glob("cover.*"):
            print(f"{file_path}: {child.name}")
            post["cover"] = child.name
            needs_write = True


    if needs_write:
        file_path.write_text(frontmatter.dumps(post))
        print(f"Updated {file_path}")

def fix_articles(root_path: Path):
    for file_path in root_path.glob("./**/*.md"):
        fix_frontmatter(file_path)

def import_media(src, dest):
    print(f"Import media: {src} -> {dest}")
    ignored_extensions = [".yaml", ".txt", ".html", ".md", ".cache", ".py"]
    media_extensions = [".gif", ".jpg", ".png", ".JPG", ".jpeg"]
    ignored_sections = ["bookmark", "now"]

    for path in src.glob("**/*.*"):
        if path.suffix not in media_extensions:
            continue

        resource_path = path.relative_to(src)

        if resource_path.parts[0] in ignored_sections:
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
        

if __name__ == "__main__":
    hugo_path = Path("../rgb-hugo/content")
    root_path = Path("src")
    fix_articles(root_path)
    import_media(hugo_path, root_path)
