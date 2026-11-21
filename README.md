# riwnlmk's Shelf
A personal digital shelf for collecting and sharing knowledge, books, anime, and meaningful life events.

**Live website:** [riwnlmk.github.io/Shelf](https://riwnlmk.github.io/Shelf/)

riwnlmk's Shelf is a lightweight, client-side website built with HTML, CSS, and vanilla JavaScript. Its content is stored in JSON files, so entries can be added or updated without a database or build system. The site is designed to work as a static website and is hosted on GitHub Pages.

## Features

### 1. Knowledge
The Knowledge section organizes written posts into three categories:

- **Technology**: Technical notes, tutorials, and other technology-related content.
- **Psychology**: Posts about psychology and related subjects.
- **Ruqyah**: Islamic Ruqyah guides and written resources.

Knowledge posts support:

- Text content with line breaks.
- Inline code using backticks.
- Blockquotes using either `[[quote]]...[[/quote]]` or `>>...<<`.
- Syntax-highlighted code blocks.
- Images with optional captions.
- Automatic estimated reading time.
- Expandable content with **See more / See less** when a post is long.
- A share action that copies a direct link to the post.

The Technology, Psychology, and Ruqyah categories are loaded independently from their own JSON files.

### 2. Ruqyah resources
Ruqyah has two sub-sections:

- **Guides**: Written Ruqyah content, using the same post format as Knowledge.
- **Recitations**: An audio library with individual audio players.

The audio interface includes play/pause controls, a waveform-style seek bar, elapsed and total time, and playback state indicators. Starting one recitation pauses another active recitation. Recitations can also be searched and shared through a direct link.

### 3. Books
The Books section displays a collection of books in a card grid.

Each book can include:

- Title and cover image.
- Start and end dates.
- A rating.
- A written review.
- Reading progress, including current pages, total pages, and the date of the latest progress update.

When reading progress is present, the card displays a progress bar and page count. The rating, end date, and review control are hidden for that item. A review button is displayed only when a non-empty review is available.

Book covers open in an image lightbox. Each book also has a share action that copies a direct link.

### 4. Anime
The Anime section uses a card layout similar to Books.

An anime entry can include:

- Title and thumbnail.
- Start and end dates.
- A rating.
- A written review.
- Watching progress, including current episodes, total episodes, and the date of the latest update.

When progress is available, the card displays an episode progress bar and hides the rating, end date, and review control. Reviews are shown only when review text exists.

Anime thumbnails can be opened in the image lightbox, and entries can be shared with direct links.

### 5. Events
The Events section is a timeline of personal milestones and other events.

An event can contain:

- Title and event date.
- Event category.
- Optional designation (used for Work events).
- Optional location.
- Optional people associated with the event.
- A Font Awesome icon.

Events use a dedicated event-card layout and can be searched, paginated, and shared individually.

### 6. Search
The Explore field searches the currently relevant content:

- Knowledge posts, including their text and code content.
- Events, including event metadata.
- Ruqyah recitations, including titles and descriptions.
- Books and anime by title.

Press `/` to focus the search field when you are not already typing in an input or textarea. Search results update as you type.

### 7. Direct links and sharing
Content can be opened directly through URL query parameters. This makes individual entries easy to share and bookmark.

| Content | URL parameter |
| --- | --- |
| Technology post | `?technology=ID` |
| Psychology post | `?psychology=ID` |
| Ruqyah guide | `?ruqyah=ID` |
| Ruqyah recitation | `?recitation=ID` |
| Event | `?event=ID` |
| Book | `?book=ID` |
| Anime | `?anime=ID` |

Replace `ID` with the matching entry's `id` from its JSON file. Share controls copy the corresponding direct URL to the clipboard.

### 8. RSS feed
The website provides a combined RSS 2.0 feed:

- **Feed URL:** [rss.xml](https://riwnlmk.github.io/Shelf/rss.xml)

The feed includes posts from Technology, Psychology, and Ruqyah Guides. Items are sorted by publication date, newest first. Each item includes its title, direct link, publication date, category, author, and formatted content.

The feed generator is `script/generate_rss.py`. It reads the category JSON files and creates `rss.xml` in the website root. It supports text, inline code, blockquotes, code blocks, and images in feed content.

A GitHub Actions workflow at `.github/workflows/generate_rss.yml` regenerates and commits the feed when the relevant data files or generator change on the `master` branch. It can also be run manually with `workflow_dispatch`.

### 9. Profile and responsive layout
The interface includes:

- A profile card with cover image, avatar, name, tagline, and social links.
- Skills grouped into Languages, Tools, and Interests.
- Main navigation for Knowledge, Books, Anime, and Events.
- Responsive layouts for desktop, tablet, and mobile screen sizes.
- Accessible labels and status announcements for key interface elements.
- Reduced-motion styling for visitors who prefer less animation.

The profile and skills content is defined in `index.html`; presentation and responsive behavior are handled by `css/style.css`.

## Technology stack
| Technology | Purpose |
| --- | --- |
| HTML5 | Page structure and content sections |
| CSS3 | Styling, layout, responsive design, and animations |
| Vanilla JavaScript | Data loading, rendering, search, pagination, sharing, and media controls |
| JSON | Content storage for posts, books, anime, events, and recitations |
| Python 3 | RSS feed generation |
| GitHub Actions | Automatic RSS feed generation and commit |
| GitHub Pages | Static website hosting |
| Prism.js | Syntax highlighting for code blocks |
| Font Awesome | Interface icons |

There is no frontend framework, package manager, database, or server-side application required by the website.

## Project structure
```text
.
├── index.html
├── robots.txt
├── sitemap.xml
├── rss.xml
├── css/
│   ├── style.css
│   └── all.min.css
├── js/
│   ├── dataLoader.js
│   └── knowledge.js
├── data/
│   ├── technology.json
│   ├── psychology.json
│   ├── ruqyah.json
│   ├── ruqyah-audio.json
│   ├── events.json
│   ├── books.json
│   └── anime.json
├── script/
│   └── generate_rss.py
├── .github/
│   └── workflows/
│       └── generate_rss.yml
├── assets/
│   ├── images/
│   └── icons/
├── favicon/
└── thumbnail/
    ├── books/
    └── anime/
```

The `assets/`, `favicon/`, and `thumbnail/` directories contain image and icon resources referenced by the page and JSON data. Keep those paths and filenames consistent when adding or replacing files.

## Running locally
The website uses `fetch()` to load JSON data. Open it through a local HTTP server rather than directly with a `file://` URL.

For example, with Python:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

Run the command from the project root (the directory containing `index.html`).

## Managing content
Most updates can be made by editing the JSON files in `data/`. The site reads these files at runtime; no compilation step is needed.

### Knowledge post format
A simplified Technology, Psychology, or Ruqyah post looks like this:

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

Supported block types are `text`, `code`, and `image`. Text blocks also support the inline-code and quote conventions described in the Knowledge section.

### Book and anime entries
Books are stored in `data/books.json`; anime entries are stored in `data/anime.json`.

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

For Books, progress values represent pages. For Anime, they represent episodes. The `progress` object is optional. The `review` field is also optional.

### Events
Events are stored in `data/events.json`. The event renderer supports fields such as `title`, `eventDate`, `eventCategory`, `designation`, `eventIcon`, `eventLocation`, and `eventWith`, in addition to the common `id`, `avatar`, `user`, `date`, and `type` fields.

### Ruqyah recitations
Audio entries are stored in `data/ruqyah-audio.json`. Each entry can provide an `id`, `title`, `description`, and audio `src`. The `src` value must point to a browser-accessible audio file.

### Content maintenance notes
- Keep each `id` unique within its corresponding JSON collection.
- Use valid JSON syntax, including double quotes around property names and string values.
- Make sure image and audio paths point to files that are actually deployed.
- When sharing an entry, use its ID from the relevant data file.
- The RSS generator reads `technology.json`, `psychology.json`, and `ruqyah.json`; changes to these files trigger the configured GitHub Actions workflow on `master`.

## RSS generation
To generate the feed manually, run this command from the project root:

```bash
python script/generate_rss.py
```

Python 3 is required. The script uses only Python's standard library. It writes the generated feed to `rss.xml`.

The GitHub Actions workflow requires repository permission to write contents so it can commit an updated feed. The workflow is configured for the `master` branch; update the branch in `.github/workflows/generate_rss.yml` if the repository uses a different default branch.

## llms.txt Generation
The project includes an automated `llms.txt` generator that creates a structured Markdown index of the website's published content. This file helps AI systems and language models discover the website, understand its content structure, and access individual entries through direct links.

### Included Information
The generated `llms.txt` contains:

- **Website information:** Website name, description, author, website URL, RSS feed, and sitemap.
- **Knowledge:** Technology, Psychology, and Ruqyah Guides, with links to individual posts and short excerpts from their text content.
- **Ruqyah Recitations:** Recitation titles, descriptions, and direct links.
- **Books:** Book titles, individual links, reading dates, ratings, and available reviews.
- **Anime:** Anime titles, individual links, watching dates, ratings, and available reviews.
- **Events:** Event titles, individual links, dates, categories, and available locations.

### Generator
The generator is located at:

```text
scripts/generate_llms.py
```

It reads the website's JSON data files from the `data/` directory and writes the generated `llms.txt` file to the project root.

To run it manually from the project root:

```bash
python scripts/generate_llms.py
```

The script uses Python's standard library and does not require external Python packages.

### GitHub Actions Automation
The workflow is located at:

```text
.github/workflows/generate_llms.yml
```

It automatically runs when JSON files in `data/`, the generator script, or the workflow file are changed on the `master` branch. It also supports manual execution through GitHub Actions using `workflow_dispatch`.

After generation, the workflow checks whether `llms.txt` has changed. If it has, the workflow commits and pushes the updated file to the repository.

### Access
The generated file is publicly available at:

https://riwnlmk.github.io/Shelf/llms.txt


## Deployment
The project is suitable for GitHub Pages because it is a static website.

1. Push the project files to the GitHub repository.
2. In the repository settings, open **Pages**.
3. Configure GitHub Pages to publish from the branch and directory containing `index.html`.
4. Ensure the referenced assets, JSON files, and generated `rss.xml` are included in the published directory.
5. Enable the GitHub Actions workflow and allow it to write repository contents so it can update `rss.xml`.

The RSS generator currently uses the public base URL `https://riwnlmk.github.io/Shelf`. If the site is moved to another domain or repository path, update `BASE_URL` in `script/generate_rss.py` and the corresponding site metadata and sitemap URLs.

## Contributing
Contributions, issues, and feature requests are welcome! Feel free to fork the repository and submit a pull request.