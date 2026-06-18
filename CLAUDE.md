# Garrek.org — Personal Website

Hand-coded personal site with original design. Respect existing design decisions; do not introduce frameworks, libraries, JS, or tooling that isn't already here, and do not "modernize" the look unless asked.

## Tech Stack

- **Eleventy 3.x** (Node), Liquid templates; `htmlTemplateEngine: "liquid"`, input `src/` → output `_site/`. Config: `eleventy.config.js`.
- **Zero client-side JavaScript** in the output — do not add any.
- **Styling**: single file `src/css/styles.css` — no Sass, preprocessors, or CSS frameworks. Do not split it.
- **Only plugin**: `@11ty/eleventy-plugin-rss` (`feedPlugin`, Atom `/feed.xml`). Do not add plugins without being asked.
- **Feeds**: Atom (plugin) + JSON Feed v1.1, the latter a hand-written Nunjucks template `src/feed-json.njk` → `/feed.json`.
- **Syntax highlighting** intentionally disabled. No analytics, cookie banners, or per-post `<meta>`/SEO tags.

### Build & deploy

- `npm start` — Eleventy dev server with live reload
- `npm run build` — build to `_site/`
- `npx wrangler deploy` — deploy `_site/` to Cloudflare Workers (config `wrangler.toml`, `[assets] directory ./_site`). `wrangler` is fetched on the fly via `npx`, not a project dependency.

## Design

Palette is built around blues, with terracotta `#d4795a` for dark-mode headings; dark-mode background is deep teal `#15252b`. Do not introduce other accent colors. Link underline / `<hr>` / RSS accent is `#2090e0`.

Fonts: Lyon Text (body + headings, with Georgia/Times fallback), Courier Prime (nav, self-hosted), Helvetica/sans-serif (figcaptions), Menlo/Monaco (code).

**Intentional link-hover effect** (styles.css ~313-315): `text-decoration-thickness: 0.6em`, `text-underline-offset: -5px`, `text-decoration-skip-ink: none` — a thick underline overlapping the text. Do not "fix" it.

### Layout

CSS Grid with subgrid; 640px breakpoint.
- **Mobile** (<640px): single column, sticky full-width horizontal nav.
- **Desktop** (≥640px): `grid-template-columns: 180px minmax(0, 2fr)` sidebar nav + content; content `max-width: 800px`. Nav sticky (`top: 4em`) under the sticky header; `main` uses `grid-template-rows: subgrid`.
- Pages wrap content in `.page-title` and `.page-body` divs. Photography gallery goes full-width via `wrapper-photo`.

## Site Structure

Entry: `eleventy.config.js` (collections, filters, passthrough). Browse `src/` — notable bits:

- `src/_includes/` — `head.liquid`, `navigation.liquid`, `footer.liquid` (copyright + `/subscribe/` + RSS + JSON Feed), and `layouts/` (`default.liquid`, `post.liquid`, `gallery.liquid`).
- `src/posts/` — Markdown posts `YYYY-MM-DD-title.md`; `posts.11tydata.js` sets the post layout and computes permalinks.
- `src/feed-json.njk` — JSON Feed template.
- `src/subscribe.html` — Buttondown email form, `permalink: /subscribe/` (linked from footer "Newsletter" and about.html).
- Page files: `index.liquid` (paginated home), `writing.liquid`, `photography.liquid`, `about.html`, `research.html`, `code.html`, `sports.html`, `404.html`.

## Posts

- **Front matter**: only `title` and `date` (layout comes from `posts.11tydata.js`).
- **Permalink**: `/:year/:month/:day/:slug.html` (e.g. `/2025/01/15/post-title.html`), computed in `posts.11tydata.js` to match the old Jekyll URLs.
- **Home pagination**: 10 posts/page (`src/index.liquid` `size: 10`).
- **Figures**: always HTML `<figure>` with `<figcaption>`, never Markdown image syntax `![]()`. Use `<figure class="right">` for right-floated (text wraps, max 40% width).
- **Entities**: em dash `&mdash;` (not `—` or `--`); also `&times;`, `&ndash;`, `&emsp;`.
- **Footnotes**: `[^fn_YYYYMMDD_N]`.
- **References** at end of post: plain Markdown links separated by `<br>`; technical/reference sections use `<hr class="ref">`.
- **Image naming**: size prefixes `small-`, `medium-800px-`, `large-1200px-`.
- Inline HTML in Markdown is fine for figures, line breaks, structured content. Date display is handled by the `date` filter in `eleventy.config.js`.
