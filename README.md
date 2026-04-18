<br />
<div align="center">
  <h3 align="center">AI News</h3>

  <p align="center">
    A personal AI news aggregator that pulls articles from curated RSS feeds, stores them in Supabase, and presents them in a clean Next.js interface.
    <br />
    <a href="https://github.com/hiimstevejin"><strong>Built by Steve Jin</strong></a>
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#project-structure">Project Structure</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#inspiration">Inspiration</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

## About The Project

AI News is a focused reader for keeping up with AI coverage from multiple RSS sources in one place. The app fetches feeds into a Supabase-backed database, tags and stores articles.

Current highlights:

- Aggregates articles from the rss feeds
- Stores normalized article data including tags, source metadata, and publish time
- Prioritizes AI-tagged content on the homepage
- Supports source and tag filtering on the articles archive
- Includes a dedicated `/sources` page to browse all tracked feeds

### Built With

- [![Next][Next.js]][Next-url]
- [![React][React.js]][React-url]
- Supabase
- TypeScript
- SQL
- Serverless Function
- Tailwind CSS
- shadcn/ui

## Project Structure

- `client/` - Next.js frontend application
- `client/app/` - App Router pages including home, articles, and sources
- `client/components/` - UI building blocks and article rendering components
- `client/lib/supabase/` - Server-side Supabase client setup
- `lambda/sync-rss.ts` - RSS ingestion and article upsert logic
- `lambda/fill_rss_source.sql` - seed data for the `rss_sources` table
- `lambda/cron_job.sql` - scheduled sync trigger setup

## Getting Started

To run the frontend locally, you only need the `client` app and a Supabase project with the expected tables and data.

### Prerequisites

- Node.js 20+
- pnpm
- A Supabase project with `articles` and `rss_sources` tables configured

### Installation

1. Clone the repository.
   ```sh
   git clone <your-repo-url>
   cd ai-news
   ```
2. Install frontend dependencies.
   ```sh
   cd client
   pnpm install
   ```
3. Copy the example environment file.
   ```sh
   cp .env.example .env.local
   ```
4. Set the required environment variables in `.env.local`.
   ```env
   NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<your-supabase-publishable-key>
   ```
5. Start the development server.
   ```sh
   pnpm dev
   ```

## Usage

Once the app is running and your database has data:

- Visit `/` to see the latest feed, with `ai`-tagged articles surfaced first
- Visit `/articles` to browse the archive with pagination, search, source filtering, and tag filtering
- Visit `/sources` to see all configured RSS sources with name, URL, and category

This project is currently maintained as a solo project by Steve Jin.

## Inspiration

This project was inspired by [TrendCloud](https://trendcloud.io/). The goal here is similar in spirit: make it easier to scan what is happening in AI without manually checking many separate sources.

## Contact

Steve Jin

- GitHub: [hiimstevejin](https://github.com/hiimstevejin)

<!-- MARKDOWN LINKS & IMAGES -->

[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
