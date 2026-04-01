# KM Library 📚

A personal book tracking app with a Krakoa-inspired comic book aesthetic. Built with [Lovable](https://lovable.dev).

**Live site:** [km-library.lovable.app](https://km-library.lovable.app)

## Features

- **ISBN Lookup** — Enter an ISBN to auto-fill title, author, cover, and year from Open Library API
- **Book Summaries** — Automatically fetches descriptions from Open Library; toggle with Show/Hide Summary
- **Duplicate Detection** — Prevents adding books with the same ISBN
- **Three Reading Statuses** — Track books as Read, Currently Reading, or To Be Read
- **Fiction / Nonfiction Toggle** — Classify books as fiction, nonfiction, or unset
- **Tag System** — Create and assign custom tags; cards show the first 3 inline with a "+N" overflow chip
- **Owned Flag** — Mark books you physically own
- **Search & Filter** — Full-text search plus multi-select filters for author, status, tags, owned, and fiction/nonfiction
- **Smart Default Sort** — Favorites first (A–Z), then everything else (A–Z); numeric titles sort after alphabetical
- **Sort Controls** — Sort by title, author, or status
- **Two-Row Card Footer** — Tags and action buttons on separate rows for a cleaner layout
- **Mobile-First Design** — Optimized for phone browsing with compact action buttons
- **Google Analytics** — Site-wide tracking via GA4

## Authentication & Security

This is a single-admin app. One authenticated user (the library owner) can add, edit, and delete books and manage tags. All other visitors have read-only access to browse the collection.

- **Admin login** via email/password (top bar)
- **Password change** available from the admin bar
- **Row Level Security (RLS)** enforced on all tables:
  - `SELECT` is public (read-only for visitors)
  - `INSERT`, `UPDATE`, `DELETE` require authentication

## Tech Stack

- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** + **shadcn/ui**
- **Lovable Cloud** (database, auth & backend)
- **TanStack Query** for data fetching
- **Open Library API** for book metadata

## Design

Inspired by the Krakoa era of X-Men comics — lush greens, glowing magentas, deep purples, and warm ambers. Features a fantasy library hero image with semi-transparent overlaid controls.

Fonts: **Bangers** (display), **Barlow** / **Barlow Condensed** (body).

## Database Schema

| Table | Purpose |
|-------|---------|
| `books` | Core book records (title, author, year, ISBN, status, is_fiction, owned, cover, notes) |
| `tags` | User-defined tag names |
| `book_tags` | Many-to-many junction between books and tags |

### Book Status Values

- `read` — Finished reading
- `currently_reading` — In progress
- `to_be_read` — On the reading list

## CSV Bulk Import Format

For one-time imports, prepare a CSV with these columns:

```
title,author,publish_year,isbn,status,owned,is_fiction,notes
"Book Title","Author Name",2024,"978-0-000-00000-0","read",true,true,"Optional notes"
```

- `status`: `read`, `currently_reading`, or `to_be_read`
- `owned`: `true` or `false`
- `is_fiction`: `true`, `false`, or empty (for unset)

## Development

```sh
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
npm i
npm run dev
```

## Deployment

Open [Lovable](https://lovable.dev) → Share → Publish, or connect a custom domain via Project → Settings → Domains.
