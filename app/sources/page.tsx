import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/server"

type SourceRecord = {
  id: number
  name: string
  url: string
  category: string | null
}

export default async function SourcesPage() {
  const supabase = await createClient()
  const { data, count, error } = await supabase
    .from("rss_sources")
    .select("id, name, url, category", { count: "exact" })
    .order("name", { ascending: true })

  if (error) {
    return <div>Failed to load sources: {error.message}</div>
  }

  const sources = (data ?? []) as SourceRecord[]
  const totalSources = count ?? sources.length

  return (
    <main className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight">Sources</h1>
        <p className="text-lg text-muted-foreground">
          {totalSources} total source{totalSources === 1 ? "" : "s"}.
        </p>
      </section>

      <section className="space-y-4">
        {sources.map((source) => (
          <article
            key={source.id}
            className="space-y-3 rounded-lg border bg-card p-4 text-card-foreground"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <h2 className="text-lg font-medium">{source.name}</h2>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="break-all text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
                >
                  {source.url}
                </a>
              </div>

              <Badge variant="outline">{source.category ?? "Uncategorized"}</Badge>
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}
