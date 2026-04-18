import { createClient } from "@/lib/supabase/server"

import ArticleList, { type ArticleListItem } from "./article-list"

function hasAiTag(tags: string[] | null) {
  return tags?.some((tag) => tag.toLowerCase() === "ai") ?? false
}

function getPublishedAtTime(publishedAt: string | null) {
  if (!publishedAt) {
    return 0
  }

  const timestamp = new Date(publishedAt).getTime()

  return Number.isNaN(timestamp) ? 0 : timestamp
}

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

  if (error) {
    return <div>Failed to load articles: {error.message}</div>
  }

  const articles = ((data ?? []) as ArticleListItem[])
    .sort((left, right) => {
      const leftHasAiTag = hasAiTag(left.tags)
      const rightHasAiTag = hasAiTag(right.tags)

      if (leftHasAiTag !== rightHasAiTag) {
        return leftHasAiTag ? -1 : 1
      }

      return getPublishedAtTime(right.published_at) - getPublishedAtTime(left.published_at)
    })
    .slice(0, 20)

  return <ArticleList articles={articles} title="Latest Articles" />
}
