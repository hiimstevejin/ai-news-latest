import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const highlights = [
  "Aggregates articles from rss feeds",
  "Stores normalized article data including tags, source metadata, and publish time",
  "Prioritizes AI-tagged content on the homepage",
  "Supports source and tag filtering on the articles archive",
  "Includes a dedicated /sources page to browse all tracked feeds",
]

const technologies = [
  "Next.js",
  "React",
  "Supabase",
  "TypeScript",
  "SQL",
  "Serverless Function",
  "Tailwind CSS",
  "shadcn/ui",
]

const structure = [
  {
    path: "client/",
    description: "Next.js frontend application",
  },
  {
    path: "client/app/",
    description: "App Router pages including home, articles, and sources",
  },
  {
    path: "client/components/",
    description: "UI building blocks and article rendering components",
  },
  {
    path: "client/lib/supabase/",
    description: "Server-side Supabase client setup",
  },
  {
    path: "lambda/sync-rss.ts",
    description: "RSS ingestion and article upsert logic",
  },
  {
    path: "lambda/fill_rss_source.sql",
    description: "Seed data for the rss_sources table",
  },
  {
    path: "lambda/cron_job.sql",
    description: "Scheduled sync trigger setup",
  },
]

const prerequisites = [
  "Node.js 20+",
  "pnpm",
  "A Supabase project with articles and rss_sources tables configured",
]

const usage = [
  "Visit / to see the latest feed, with ai-tagged articles surfaced first",
  "Visit /articles to browse the archive with pagination, search, source filtering, and tag filtering",
  "Visit /sources to see all configured RSS sources with name, URL, and category",
]

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight">About</h1>
        <div className="space-y-2">
          <p className="max-w-3xl text-lg text-muted-foreground">
            I built this project to catch up with latest ai trends.
          </p>
        </div>
        <Button asChild>
          <Link
            href="https://github.com/hiimstevejin"
            target="_blank"
            rel="noreferrer"
          >
            Built by Steve Jin
          </Link>
        </Button>
      </section>

      <section className="space-y-4">
        <div className="space-y-3">
          <h3 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
            Current Highlights
          </h3>
          <ul className="space-y-2 text-sm sm:text-base">
            {highlights.map((highlight) => (
              <li key={highlight}>- {highlight}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-medium">Built With</h2>
        <div className="flex flex-wrap gap-2">
          {technologies.map((technology) => (
            <Badge key={technology} variant="outline" className="px-3 py-1">
              {technology}
            </Badge>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-medium">Getting Started</h2>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            To run the frontend locally, you only need the client app and a
            Supabase project with the expected tables and data.
          </p>

          <div className="space-y-3">
            <h3 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
              Prerequisites
            </h3>
            <ul className="space-y-2 text-sm sm:text-base">
              {prerequisites.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
              Installation
            </h3>
            <div className="space-y-3">
              <div>
                <p className="mb-2 text-sm font-medium">
                  1. Clone the repository
                </p>
                <pre className="overflow-x-auto bg-muted px-3 py-2 text-sm">
                  <code>{`git clone <your-repo-url>
cd ai-news`}</code>
                </pre>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium">
                  2. Install frontend dependencies
                </p>
                <pre className="overflow-x-auto bg-muted px-3 py-2 text-sm">
                  <code>{`cd client
pnpm install`}</code>
                </pre>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium">
                  3. Copy the example environment file
                </p>
                <pre className="overflow-x-auto bg-muted px-3 py-2 text-sm">
                  <code>cp .env.example .env.local</code>
                </pre>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium">
                  4. Set the required environment variables in .env.local
                </p>
                <pre className="overflow-x-auto bg-muted px-3 py-2 text-sm">
                  <code>{`NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<your-supabase-publishable-key>`}</code>
                </pre>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium">
                  5. Start the development server
                </p>
                <pre className="overflow-x-auto bg-muted px-3 py-2 text-sm">
                  <code>pnpm dev</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-medium">Usage</h2>
        <ul className="space-y-2 text-sm sm:text-base">
          {usage.map((item) => (
            <li key={item}>- {item}</li>
          ))}
        </ul>
        <p className="text-muted-foreground">
          This project is currently maintained as a solo project by Steve Jin.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-medium">Inspiration</h2>
        <p className="text-muted-foreground">
          This project was inspired by{" "}
          <a
            href="https://trendcloud.io/"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4 hover:text-foreground"
          >
            TrendCloud
          </a>
          . The goal here is similar in spirit: make it easier to scan what is
          happening in AI without manually checking many separate sources.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-medium">Contact</h2>
        <p>Steve Jin</p>
        <p className="text-muted-foreground">
          GitHub:{" "}
          <a
            href="https://github.com/hiimstevejin"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4 hover:text-foreground"
          >
            hiimstevejin
          </a>
        </p>
      </section>
    </main>
  )
}
