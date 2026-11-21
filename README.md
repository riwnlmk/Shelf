# riwnlmk's Shelf

A personal digital shelf for collecting and sharing knowledge, books, anime, and meaningful life events.

**Live website:** [riwnlmk.github.io/Shelf](https://riwnlmk.github.io/Shelf/)

riwnlmk's Shelf is a lightweight, client-side website built with HTML, CSS, and vanilla JavaScript. Content is stored in JSON files, so entries can be added or updated without a database or build system. The website is designed for static hosting and is published through GitHub Pages.

## Features

### 1. Knowledge

The Knowledge section contains two categories:

- **Technology:** Technical notes, tutorials, and other technology-related content.
- **Psychology:** Posts about psychology and related subjects.

Knowledge posts support:

- Text content with line breaks.
- Inline code using backticks.
- Blockquotes using either `[[quote]]...[[/quote]]` or `>>...<<`.
- Code blocks with syntax highlighting.
- Images with optional captions.
- Automatic estimated reading time.
- Expandable content with **See more / See less** for longer posts.
- Direct sharing through a link copied to the clipboard.

Each category is loaded independently from its JSON file in `data/`.

### 2. Books

The Books section displays a collection of books in a card grid. An entry can include a title, cover image, start and end dates, rating, review, and reading progress.

Reading progress can include the current page, total pages, and the date of the latest update. When progress is available, the card displays a progress bar and page count. The rating, end date, and review control are hidden for that item. A review button appears only when review text is available.

Book covers can be opened in an image lightbox, and each entry can be shared through a direct link.

### 3. Anime

The Anime section uses a card layout similar to Books. An entry can include a title, thumbnail, start and end dates, rating, review, and watching progress.

Watching progress can include the current episode, total episodes, and the date of the latest update. When progress is available, the card displays an episode progress bar and hides the rating, end date, and review control. Reviews are shown only when review text exists.

Anime thumbnails can be opened in the image lightbox, and entries can be shared through direct links.

### 4. Events

The Events section presents personal milestones and other events in a timeline. An event can include:

- Title and event date.
- Event category.
- Optional designation, such as a job title.
- Optional location.
- Optional people associated with the event.
- A Font Awesome icon.

Events use a dedicated card layout and can be searched, paginated, and shared individually.

### 5. Search

The Explore field searches the content relevant to the active section:

- Knowledge posts, including text and code content.
- Events, including event metadata.
- Books and anime by title.

Search results update as the query is typed. Press `/` to focus the search field when not already typing in an input or textarea.

### 6. Direct links and sharing

Individual entries can be opened directly using URL query parameters. This makes content easy to share and bookmark.

| Content | URL parameter |
| --- | --- |
| Technology post | `?technology=ID` |
| Psychology post | `?psychology=ID` |
| Event | `?event=ID` |
| Book | `?book=ID` |
| Anime | `?anime=ID` |

Replace `ID` with the matching entry's `id` from its JSON file. Share controls copy the corresponding direct URL to the clipboard.

### 7. RSS feed

The website publishes a combined RSS 2.0 feed containing posts from Technology and Psychology.

- **Feed URL:** [rss.xml](https://riwnlmk.github.io/Shelf/rss.xml)

Feed items are sorted by publication date, newest first. Each item includes its title, direct link, publication date, category, author, and formatted content. Supported content includes text, inline code, blockquotes, code blocks, and images.

The generator is `scripts/generate_rss.py`. It reads `data/technology.json` and `data/psychology.json`, then writes `rss.xml` to the project root.

The GitHub Actions workflow at `.github/workflows/generate_rss.yml` runs when a JSON file in `data/` or the RSS generator/workflow changes on the `master` branch. It also supports manual execution through `workflow_dispatch`. If the generated feed changes, the workflow commits and pushes the updated `rss.xml`.

### 8. llms.txt

The project includes an automated `llms.txt` generator. It creates a structured Markdown index to help AI systems and language models discover the website, understand its content, and access individual entries.

The generated file includes:

- Website name, description, author, website URL, RSS feed, and sitemap.
- Technology and Psychology posts with direct links and short text excerpts.
- Book titles, links, reading dates, ratings, and available reviews.
- Anime titles, links, watching dates, ratings, and available reviews.
- Event titles, links, dates, categories, and available locations.

The generator is `scripts/generate_llms.py`. It reads the website's JSON files from `data/` and writes `llms.txt` to the project root.

The GitHub Actions workflow at `.github/workflows/generate_llms.yml` runs when JSON data, the generator, or the workflow changes on the `master` branch. It also supports manual execution through `workflow_dispatch`. If the generated file changes, the workflow commits and pushes the updated `llms.txt`.

**Generated file:** [llms.txt](https://riwnlmk.github.io/Shelf/llms.txt)

### 9. Profile and responsive layout

The interface includes:

- A profile card with cover image, avatar, name, tagline, and social links.
- Skills grouped into Languages, Tools, and Interests.
- Main navigation for Knowledge, Books, Anime, and Events.
- Responsive layouts for desktop, tablet, and mobile screens.
- Accessible labels and status announcements for key interface elements.
- Reduced-motion styling for visitors who prefer less animation.

Profile and skills content is defined in `index.html`. Styling, layout, and responsive behavior are handled by `css/style.css`.

## Technology stack

| Technology | Purpose |
| --- | --- |
| HTML5 | Page structure and content sections |
| CSS3 | Styling, layout, responsive design, and animations |
| Vanilla JavaScript | Data loading, rendering, search, pagination, sharing, and media controls |
| JSON | Content storage for knowledge posts, books, anime, and events |
| Python 3 | RSS feed and llms.txt generation using the standard library |
| XML (RSS 2.0) | Publishing a combined feed for Knowledge posts |
| Markdown (llms.txt) | Structured website and content information for AI systems and language models |
| GitHub Actions | Automated RSS feed and llms.txt generation and updates |
| GitHub Pages | Static website hosting |
| Prism.js | Syntax highlighting for code blocks |
| Font Awesome | Interface icons |

The website does not require a frontend framework, package manager, database, or server-side application. Both content generators use Python's standard library and require no external Python packages.

## Project structure

```text
.
├── assets/
├── favicon/
├── css/
│   ├── all.min.css
│   └── style.css
├── data/
│   ├── anime.json
│   ├── books.json
│   ├── events.json
│   ├── psychology.json
│   └── technology.json
├── index.html
├── js/
│   ├── dataLoader.js
│   └── knowledge.js
├── LICENSE
├── llms.txt
├── media/
├── README.md
├── robots.txt
├── rss.xml
├── scripts/
│   ├── generate_llms.py
│   └── generate_rss.py
├── sitemap.xml
└── thumbnail/
```

The `assets/`, `favicon/`, and `thumbnail/` directories contain image and icon resources referenced by the website and its JSON data. Keep their paths and filenames consistent when adding or replacing files.

## Running locally

The website uses `fetch()` to load JSON data. Run it through a local HTTP server instead of opening `index.html` directly with a `file://` URL.

With Python 3:

```bash
python -m http.server 8000
```

Run the command from the project root, where `index.html` is located, then open:

```text
http://localhost:8000/
```

## Managing content

Most content updates can be made by editing the JSON files in `data/`. The website reads these files at runtime, so no compilation step is needed.

### Knowledge posts

Technology posts are stored in `data/technology.json`, and Psychology posts are stored in `data/psychology.json`.

A simplified post looks like this:

```json
{
  "id": 1,
  "avatar": "assets/images/riwnlmk.png",
  "user": "Md. Ridwanul Islam Muntakim",
  "date": "19 November 2026",
  "title": "Example post title",
  "blocks": [
    {
      "type": "text",
      "content": "A paragraph of post content."
    },
    {
      "type": "code",
      "lang": "python",
      "code": "print('Hello, world!')"
    },
    {
      "type": "image",
      "src": "assets/images/example.png",
      "caption": "An optional image caption."
    }
  ]
}
```

Supported block types are `text`, `code`, and `image`. Text blocks support inline code and the blockquote conventions described in the Knowledge section.

### Books and anime

Books are stored in `data/books.json`, and anime entries are stored in `data/anime.json`.

A simplified entry with progress looks like this:

```json
{
  "id": 1,
  "name": "Example title",
  "thumb": "thumbnail/books/example.jpg",
  "start": "2026-01-01",
  "end": "2026-01-10",
  "rating": 4.5,
  "review": "An optional written review.",
  "progress": {
    "current": 120,
    "total": 300,
    "date": "2026-01-06"
  }
}
```

For Books, progress values represent pages. For Anime, they represent episodes. The `progress` object and `review` field are optional.

### Events

Events are stored in `data/events.json`. The event renderer supports fields such as `title`, `eventDate`, `eventCategory`, `designation`, `eventIcon`, `eventLocation`, and `eventWith`, in addition to the common `id`, `avatar`, `user`, `date`, and `type` fields.

### Content maintenance notes

- Keep each `id` unique within its JSON collection.
- Use valid JSON syntax, including double quotes around property names and string values.
- Ensure image paths point to files that are included in the deployed website.
- Use the matching entry ID when sharing an item.
- Technology and Psychology posts are included in the combined RSS feed.
- Both content generators run automatically through their respective GitHub Actions workflows when relevant files change on `master`.

## Generating the RSS feed manually

Run this command from the project root:

```bash
python scripts/generate_rss.py
```

The script uses Python 3's standard library and writes the generated feed to `rss.xml`.

The RSS workflow needs permission to write repository contents. The workflow currently targets the `master` branch; if the repository uses another default branch, update the branch name in `.github/workflows/generate_rss.yml`.

## Generating llms.txt manually

Run this command from the project root:

```bash
python scripts/generate_llms.py
```

The script uses Python 3's standard library and writes the generated index to `llms.txt`.

The llms.txt workflow also needs permission to write repository contents. Its branch configuration is in `.github/workflows/generate_llms.yml`.

## Deployment

The project is suitable for GitHub Pages because it is a static website.

1. Push the project files to the GitHub repository.
2. Open **Pages** in the repository settings.
3. Configure GitHub Pages to publish from the branch and directory containing `index.html`.
4. Ensure the referenced assets, JSON files, generated `rss.xml`, and generated `llms.txt` are included in the published directory.
5. Enable the GitHub Actions workflows and allow them to write repository contents so they can commit generated files.

The RSS generator uses `https://riwnlmk.github.io/Shelf` as its public base URL. If the website moves to another domain or repository path, update `BASE_URL` in `scripts/generate_rss.py` and `scripts/generate_llms.py`, along with the corresponding site metadata and sitemap URLs.

## Contributing

Contributions, issues, and feature requests are welcome. Feel free to fork the repository and submit a pull request.