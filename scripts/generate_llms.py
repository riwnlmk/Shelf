#!/usr/bin/env python3

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE_URL = "https://riwnlmk.github.io/Shelf"
SITE_NAME = "riwnlmk's Shelf"
SITE_DESCRIPTION = "A personal digital shelf for collecting and sharing knowledge, books, anime, and meaningful life events."
AUTHOR = "Md. Ridwanul Islam Muntakim"

KNOWLEDGE_CATEGORIES = {
    "technology": "Technology",
    "psychology": "Psychology",
    "ruqyah": "Ruqyah Guides",
}

def load_json(filename):
    path = ROOT / "data" / filename
    if not path.exists():
        return []
    with path.open(encoding="utf-8") as file:
        data = json.load(file)
    if not isinstance(data, list):
        raise ValueError(f"{path.relative_to(ROOT)} must contain a JSON array")
    return data

def clean_text(value):
    value = re.sub(r"<[^>]+>", " ", str(value or ""))
    return re.sub(r"\s+", " ", value).strip()

def excerpt_from_blocks(blocks, limit=260):
    for block in blocks or []:
        if block.get("type") == "text":
            excerpt = clean_text(block.get("content"))
            if excerpt:
                if len(excerpt) > limit:
                    excerpt = excerpt[:limit].rsplit(" ", 1)[0].rstrip(" ,;:") + "…"
                return excerpt
    return ""

def markdown_text(value):
    return clean_text(value).replace("[", r"\[").replace("]", r"\]")

def item_link(label, url, description=""):
    line = f"- [{markdown_text(label)}]({url})"
    if description:
        line += f": {markdown_text(description)}"
    return line

def build_llms_txt():
    sections = [
        f"# {SITE_NAME}",
        "",
        f"> {SITE_DESCRIPTION}",
        "",
        f"- Website: {BASE_URL}/",
        f"- Author: {AUTHOR}",
        f"- RSS feed: {BASE_URL}/rss.xml",
        f"- Sitemap: {BASE_URL}/sitemap.xml",
        "",
        "## About",
        "",
        "riwnlmk's Shelf is a personal website organized into Knowledge, Books, Anime, and Events. "
        "Knowledge contains Technology, Psychology, and Ruqyah content. The site also publishes "
        "a combined RSS feed for supported knowledge posts.",
        "",
    ]

    for category, title in KNOWLEDGE_CATEGORIES.items():
        posts = load_json(f"{category}.json")
        sections.extend([f"## Knowledge | {title}", ""])
        if not posts:
            sections.extend(["No entries are currently published in this section.", ""])
            continue
        for post in posts:
            post_id = post.get("id")
            url = f"{BASE_URL}/?{category}={post_id}"
            description = excerpt_from_blocks(post.get("blocks"))
            sections.append(item_link(post.get("title") or f"{title} — {post_id}", url, description))
        sections.append("")

    audio_items = load_json("ruqyah-audio.json")
    sections.extend(["## Ruqyah | Recitations", ""])
    if audio_items:
        for item in audio_items:
            url = f"{BASE_URL}/?recitation={item.get('id')}"
            description = clean_text(item.get("description") or item.get("reciter") or item.get("title"))
            sections.append(item_link(item.get("title") or item.get("name") or f"Recitation {item.get('id')}", url, description))
    else:
        sections.append("No recitations are currently published.")
    sections.append("")

    for filename, heading, query_key in (
        ("books.json", "Books", "book"),
        ("anime.json", "Anime", "anime"),
    ):
        entries = load_json(filename)
        sections.extend([f"## {heading}", ""])
        for item in entries:
            url = f"{BASE_URL}/?{query_key}={item.get('id')}"
            details = []
            if item.get("start"):
                details.append(f"Started: {item['start']}")
            if item.get("end"):
                details.append(f"Finished: {item['end']}")
            if item.get("rating") is not None:
                details.append(f"Rating: {item['rating']}/5")
            if item.get("review"):
                details.append(clean_text(item["review"]))
            sections.append(item_link(item.get("name") or f"{heading} {item.get('id')}", url, " | ".join(details)))
        sections.append("")

    events = load_json("events.json")
    sections.extend(["## Events", ""])
    for event in events:
        url = f"{BASE_URL}/?event={event.get('id')}"
        details = [clean_text(event.get("eventDate") or event.get("date")),
                   clean_text(event.get("eventCategory")),
                   clean_text(event.get("eventLocation"))]
        details = [part for part in details if part]
        sections.append(item_link(event.get("title") or f"Event {event.get('id')}", url, " | ".join(details)))
    if not events:
        sections.append("No events are currently published.")
    sections.extend(["", "## Content and Usage", "",
        "The links above point to individual entries on the website. Content is maintained in the "
        "site's JSON data files and may change as the website is updated.",
        ""])
    output = ROOT / "llms.txt"
    output.write_text("\n".join(sections), encoding="utf-8")
    print(f"Generated llms.txt ({sum(len(load_json(name)) for name in ['technology.json', 'psychology.json', 'ruqyah.json', 'ruqyah-audio.json', 'books.json', 'anime.json', 'events.json'])} entries)")


if __name__ == "__main__":
    build_llms_txt()