#!/usr/bin/env python3

from datetime import datetime, timezone
from email.utils import format_datetime
from html import escape
import json
from pathlib import Path
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
BASE_URL = "https://riwnlmk.github.io/Shelf"
CATEGORIES = {
    "technology": "Technology",
    "psychology": "Psychology",
    "ruqyah": "Ruqyah Guides",
}
FEED_TITLE = "riwnlmk's Shelf"
FEED_DESCRIPTION = "New posts from the Technology, Psychology, and Ruqyah Guides sections of riwnlmk's Shelf."
CONTENT_NS = "http://purl.org/rss/1.0/modules/content/"
ATOM_NS = "http://www.w3.org/2005/Atom"
ET.register_namespace("content", CONTENT_NS)
ET.register_namespace("atom", ATOM_NS)

QUOTE_PATTERN = re.compile(
    r"\[\[quote\]\](.*?)\[\[/quote\]\]|>>([\s\S]*?)<<",
    re.IGNORECASE | re.DOTALL,
)
INLINE_CODE_PATTERN = re.compile(r"`([^`\n]+)`")

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

def render_inline(text):
    parts = []
    position = 0
    for match in INLINE_CODE_PATTERN.finditer(text):
        parts.append(escape(text[position:match.start()]))
        parts.append(f"<code>{escape(match.group(1))}</code>")
        position = match.end()
    parts.append(escape(text[position:]))
    return "".join(parts)

def render_text_fragment(text):
    paragraphs = re.split(r"\n[ \t]*\n+", text.strip())
    rendered = []
    for paragraph in paragraphs:
        if paragraph.strip():
            content = render_inline(paragraph).replace("\n", "<br/>\n")
            rendered.append(f"<p>{content}</p>")
    return "\n".join(rendered)

def render_text_block(text):
    rendered = []
    position = 0
    for match in QUOTE_PATTERN.finditer(text):
        before = text[position:match.start()]
        if before.strip():
            rendered.append(render_text_fragment(before))

        quote_text = match.group(1) if match.group(1) is not None else match.group(2)
        quote_html = render_text_fragment(quote_text)
        if quote_html:
            rendered.append(f"<blockquote>{quote_html}</blockquote>")
        position = match.end()

    remainder = text[position:]
    if remainder.strip():
        rendered.append(render_text_fragment(remainder))

    return "\n".join(rendered)

def image_url(src):
    if src.startswith(("https://", "http://")):
        return src
    return f"{BASE_URL}/{src.lstrip('/')}"

def render_content(blocks):
    rendered = []
    for block in blocks or []:
        kind = block.get("type", "text")

        if kind == "text":
            content = render_text_block(block.get("content", ""))
            if content:
                rendered.append(content)

        elif kind == "code":
            lang = escape(block.get("lang", "text"), quote=True)
            code = escape(block.get("code", ""))
            rendered.append(
                f'<pre><code class="language-{lang}">{code}</code></pre>'
            )

        elif kind == "image" and block.get("src"):
            src = escape(image_url(block["src"]), quote=True)
            alt = escape(block.get("alt", ""), quote=True)
            caption = render_inline(block.get("caption", ""))
            rendered.append(f'<figure><img src="{src}" alt="{alt}"/>')
            if caption:
                rendered.append(f"<figcaption>{caption}</figcaption>")
            rendered.append("</figure>")

    return "\n".join(rendered)

def add_text(parent, tag, value):
    element = ET.SubElement(parent, tag)
    element.text = value
    return element

def build_feed():
    posts = []
    for category, category_title in CATEGORIES.items():
        source = ROOT / "data" / f"{category}.json"
        for post in json.loads(source.read_text(encoding="utf-8")):
            posts.append((parse_date(post.get("date")), category, category_title, post))
    posts.sort(key=lambda entry: (entry[0], str(entry[3].get("id", ""))), reverse=True)

    rss = ET.Element("rss", {"version": "2.0"})
    channel = ET.SubElement(rss, "channel")
    add_text(channel, "title", FEED_TITLE)
    add_text(channel, "link", f"{BASE_URL}/")
    add_text(channel, "description", FEED_DESCRIPTION)
    add_text(channel, "language", "bn-BD")
    add_text(channel, "lastBuildDate", format_datetime(datetime.now(timezone.utc)))
    ET.SubElement(channel, f"{{{ATOM_NS}}}link", {
        "href": f"{BASE_URL}/rss.xml", "rel": "self", "type": "application/rss+xml"
    })
    add_text(channel, "generator", "riwnlmk Shelf RSS Generator")

    for published, category, category_title, post in posts:
        item = ET.SubElement(channel, "item")
        title = post.get("title") or f"{category_title} — Post {post.get('id', '')}"
        url = f"{BASE_URL}/?{category}={post.get('id', '')}"
        formatted_content = render_content(post.get("blocks", []))

        add_text(item, "title", title)
        add_text(item, "link", url)
        add_text(item, "guid", url).set("isPermaLink", "true")
        add_text(item, "pubDate", format_datetime(published))
        add_text(item, "category", category_title)
        add_text(item, "description", formatted_content)
        add_text(item, f"{{{CONTENT_NS}}}encoded", formatted_content)
        add_text(item, "author", post.get("user", "riwnlmk"))

    output = ROOT / "rss.xml"
    ET.indent(rss, space="  ")
    ET.ElementTree(rss).write(output, encoding="utf-8", xml_declaration=True)
    print(f"Generated {output.relative_to(ROOT)} ({len(posts)} items)")

if __name__ == "__main__":
    build_feed()