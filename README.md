# KM Library 📚

A personal book tracking app with a Krakoa-inspired comic book aesthetic.

## Features

- **ISBN Lookup** — Enter an ISBN to auto-fill title, author, cover, and year from Open Library API
- **Genre Selection** — Pick up to 5 subjects from Open Library's subject data
- **Duplicate Detection** — Prevents adding books with the same ISBN
- **Three Reading Statuses** — Track books as Read, Currently Reading, or To Be Read
- **Tag System** — Create and assign custom tags for flexible organization
- **Owned Flag** — Mark books you physically own
- **Search & Filter** — Full-text search plus multi-select filters for author, genre, status, and tags
- **Sort Controls** — Sort by title, author, genre, or status
- **Mobile-First Design** — Optimized for phone browsing with compact action buttons

## Tech Stack

- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** + **shadcn/ui**
- **Lovable Cloud** (database & backend)
- **TanStack Query** for data fetching
- **Open Library API** for book metadata

## Design

Inspired by the Krakoa era of X-Men comics — lush greens, glowing magentas, deep purples, and warm ambers. Features a fantasy library hero image with semi-transparent overlaid controls.

## Database Schema

| Table | Purpose |
|-------|---------|
| `books` | Core book records (title, author, genre, year, ISBN, status, owned, cover, notes) |
| `tags` | User-defined tag names |
| `book_tags` | Many-to-many junction between books and tags |

### Book Status Values

- `read` — Finished reading
- `currently_reading` — In progress
- `to_be_read` — On the reading list

## CSV Bulk Import Format

For one-time imports, prepare a CSV with these columns:

```
title,author,genre,publish_year,isbn,status,owned,notes
"Book Title","Author Name","Genre1; Genre2",2024,"978-0-000-00000-0","read",true,"Optional notes"
```

- `genre`: semicolon-separated (e.g. `"Fiction; Mystery"`)
- `status`: `read`, `currently_reading`, or `to_be_read`
- `owned`: `true` or `false`

## Development

```sh
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
npm i
npm run dev
```

## Deployment

Open [Lovable](https://lovable.dev) → Share → Publish, or connect a custom domain via Project → Settings → Domains.
