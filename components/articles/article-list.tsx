import { Badge } from "@/components/ui/badge"

export type ArticleListItem = {
  id: number
  source_id: number | null
  title: string
  link: string
  guid: string | null
  summary: string | null
  content: string | null
  author: string | null
  published_at: string | null
  image_url: string | null
  tags: string[] | null
  fetched_at: string
  is_latest: boolean
  domain: string | null
  slug: string | null
  rss_sources?: {
    name: string
  } | null
}

function formatPublishedAt(publishedAt: string | null) {
  if (!publishedAt) {
    return null
  }

  const date = new Date(publishedAt)

  if (Number.isNaN(date.getTime())) {
    return publishedAt
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date)
}

type ArticleListProps = {
  articles: ArticleListItem[]
  title?: string
}

export default function ArticleList({ articles, title }: ArticleListProps) {
  return (
    <div className="mt-3 space-y-6">
      {title ? (
        <h1 className="px-2 text-2xl font-medium tracking-tight text-muted-foreground sm:text-3xl">
          {title}
        </h1>
      ) : null}
      {articles.map((article) => (
        <div key={article.id} className="px-1">
          <article className="block space-y-5 rounded-xl p-6 text-card-foreground shadow-sm transition-colors hover:bg-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <div className="flex flex-wrap items-center gap-3">
              {article.rss_sources?.name ? (
                <span className="text-sm text-muted-foreground">
                  {article.rss_sources.name}
                </span>
              ) : null}

              {article.tags?.length ? (
                <div className="flex flex-wrap gap-2.5">
                  {article.tags.map((tag) => (
                    <Badge key={tag} className="opacity-80">
                      {tag}
                    </Badge>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="space-y-3">
              <a
                href={article.link}
                target="_blank"
                rel="noreferrer"
                className="group block space-y-3"
              >
                <h2 className="text-lg leading-snug font-semibold text-balance group-hover:underline group-hover:underline-offset-4">
                  {article.title}
                </h2>
              </a>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                {article.author ? <span>By {article.author}</span> : null}
                {article.published_at ? (
                  <time dateTime={article.published_at}>
                    {formatPublishedAt(article.published_at)}
                  </time>
                ) : null}
              </div>
            </div>

            {article.summary ? (
              <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                {article.summary}
              </p>
            ) : null}
          </article>
        </div>
      ))}
    </div>
  )
}
