#!/usr/bin/env python3

from datetime import datetime, timezone
from email.utils import format_datetime
from html import escape
import json
from pathlib import Path
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
BASE_URL = "https://riwnlmk.github.io/Shelf"
FEEDS = {
    "technology": {
        "title": "riwnlmk's Shelf | Technology",
        "description": "New posts from the Technology section of riwnlmk's Shelf.",
    },
    "psychology": {
        "title": "riwnlmk's Shelf | Psychology",
        "description": "New posts from the Psychology section of riwnlmk's Shelf.",
    },
}
CONTENT_NS = "http://purl.org/rss/1.0/modules/content/"
ATOM_NS = "http://www.w3.org/2005/Atom"
ET.register_namespace("content", CONTENT_NS)
ET.register_namespace("atom", ATOM_NS)

def parse_date(value):
    if not value:
        return datetime.now(timezone.utc)
    for pattern in ("%d %B %Y", "%d %b %Y", "%Y-%m-%d", "%Y-%m-%dT%H:%M:%S%z"):
        try:
            parsed = datetime.strptime(value.strip(), pattern)
            if parsed.tzinfo is None:
                parsed = parsed.replace(tzinfo=timezone.utc)
            return parsed.astimezone(timezone.utc)
        except (ValueError, AttributeError):
            pass
    return datetime.now(timezone.utc)

def plain_text(blocks):
    parts = []
    for block in blocks or []:
        kind = block.get("type", "text")
        if kind == "text":
            parts.append(block.get("content", ""))
        elif kind == "code":
            parts.append(block.get("code", ""))
        elif kind == "image" and block.get("caption"):
            parts.append(block["caption"])
    return "\n\n".join(part for part in parts if part).strip()

def render_content(blocks):
    rendered = []
    for block in blocks or []:
        kind = block.get("type", "text")
        if kind == "text":
            content = escape(block.get("content", "")).replace("\n", "<br/>\n")
            if content:
                rendered.append(f"<p>{content}</p>")
        elif kind == "code":
            lang = escape(block.get("lang", "text"), quote=True)
            code = escape(block.get("code", ""))
            rendered.append(f'<pre><code class="language-{lang}">{code}</code></pre>')
        elif kind == "image" and block.get("src"):
            src = escape(block["src"], quote=True)
            alt = escape(block.get("alt", ""), quote=True)
            caption = escape(block.get("caption", ""))
            image_url = f"{BASE_URL}/{src.lstrip(chr(47))}"
            rendered.append(f'<figure><img src="{image_url}" alt="{alt}"/>')
            if caption:
                rendered.append(f"<figcaption>{caption}</figcaption>")
            rendered.append("</figure>")
    return "\n".join(rendered)

def add_text(parent, tag, value):
    element = ET.SubElement(parent, tag)
    element.text = value
    return element

def build_feed(category, settings):
    source = ROOT / "data" / f"{category}.json"
    posts = json.loads(source.read_text(encoding="utf-8"))
    posts = sorted(posts, key=lambda post: (parse_date(post.get("date")), str(post.get("id", ""))), reverse=True)

    rss = ET.Element("rss", {"version": "2.0"})
    channel = ET.SubElement(rss, "channel")
    add_text(channel, "title", settings["title"])
    add_text(channel, "link", f"{BASE_URL}/")
    add_text(channel, "description", settings["description"])
    add_text(channel, "language", "bn-BD")
    add_text(channel, "lastBuildDate", format_datetime(datetime.now(timezone.utc)))
    ET.SubElement(channel, f"{{{ATOM_NS}}}link", {"href": f"{BASE_URL}/feeds/{category}.xml", "rel": "self", "type": "application/rss+xml"})
    add_text(channel, "generator", "riwnlmk Shelf RSS Generator")

    for post in posts:
        item = ET.SubElement(channel, "item")
        title = post.get("title") or f"{settings['title']} — Post {post.get('id', '')}"
        url = f"{BASE_URL}/?{category}={post.get('id', '')}"
        summary = plain_text(post.get("blocks", []))
        add_text(item, "title", title)
        add_text(item, "link", url)
        add_text(item, "guid", url).set("isPermaLink", "true")
        add_text(item, "pubDate", format_datetime(parse_date(post.get("date"))))
        add_text(item, "description", summary[:500] + ("…" if len(summary) > 500 else ""))
        add_text(item, f"{{{CONTENT_NS}}}encoded", render_content(post.get("blocks", [])))
        add_text(item, "author", post.get("user", "riwnlmk"))

    output = ROOT / "feeds" / f"{category}.xml"
    output.parent.mkdir(parents=True, exist_ok=True)
    ET.indent(rss, space="  ")
    ET.ElementTree(rss).write(output, encoding="utf-8", xml_declaration=True)
    print(f"Generated {output.relative_to(ROOT)} ({len(posts)} items)")

def main():
    for category, settings in FEEDS.items():
        build_feed(category, settings)

if __name__ == "__main__":
    main()