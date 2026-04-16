import { createClient } from "@/lib/supabase/server"

import ArticleList, { type ArticleListItem } from "./article-list"

export default async function Articles() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("articles")
    .select(
      `
      *,
      rss_sources (
        name
      )
    `
    )
    .eq("is_latest", true)
    .order("published_at", { ascending: false })
    .limit(20)

  if (error) {
    return <div>Failed to load articles: {error.message}</div>
  }

  const articles = (data ?? []) as ArticleListItem[]

  return <ArticleList articles={articles} title="Latest Articles" />
}
