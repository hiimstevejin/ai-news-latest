import ArticleList, {
  type ArticleListItem,
} from "@/components/articles/article-list"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { createClient } from "@/lib/supabase/server"

import SourceFilters from "./source-filters"

const PAGE_SIZE = 20

type SearchParamValue = string | string[] | undefined

type SourcePageProps = {
  searchParams: Promise<{
    page?: SearchParamValue
    q?: SearchParamValue
    source?: SearchParamValue
    tag?: SearchParamValue
  }>
}

type SourceRecord = {
  id: number
  name: string
}

function getSingleParam(value: SearchParamValue) {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "")
}

function normalizePage(value: string) {
  const page = Number.parseInt(value, 10)

  return Number.isFinite(page) && page > 0 ? page : 1
}

function getPaginationWindow(currentPage: number, totalPages: number) {
  const windowSize = 10
  const groupStart = Math.floor((currentPage - 1) / windowSize) * windowSize + 1
  const groupEnd = Math.min(groupStart + windowSize - 1, totalPages)

  return Array.from(
    { length: Math.max(groupEnd - groupStart + 1, 0) },
    (_, index) => groupStart + index
  )
}

function buildPageHref(params: Awaited<SourcePageProps["searchParams"]>, page: number) {
  const nextParams = new URLSearchParams()
  const query = getSingleParam(params.q).trim()
  const source = getSingleParam(params.source)
  const tag = getSingleParam(params.tag)

  if (query) {
    nextParams.set("q", query)
  }

  if (source) {
    nextParams.set("source", source)
  }

  if (tag) {
    nextParams.set("tag", tag)
  }

  if (page > 1) {
    nextParams.set("page", String(page))
  }

  const search = nextParams.toString()

  return search ? `/articles?${search}` : "/articles"
}

function applyArticleFilters(
  query: any,
  filters: {
    query: string
    sourceId: string
    tag: string
  }
) {
  let nextQuery = query

  if (filters.query) {
    const escapedQuery = filters.query.replaceAll(",", " ").trim()
    nextQuery = nextQuery.or(
      `title.ilike.%${escapedQuery}%,summary.ilike.%${escapedQuery}%,content.ilike.%${escapedQuery}%`
    )
  }

  if (filters.sourceId) {
    nextQuery = nextQuery.eq("source_id", Number(filters.sourceId))
  }

  if (filters.tag) {
    nextQuery = nextQuery.contains("tags", [filters.tag])
  }

  return nextQuery
}

export default async function SourcePage({ searchParams }: SourcePageProps) {
  const params = await searchParams
  const query = getSingleParam(params.q).trim()
  const sourceId = getSingleParam(params.source)
  const tag = getSingleParam(params.tag)
  const page = normalizePage(getSingleParam(params.page))
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1
  const supabase = await createClient()

  const { data: sourceData, error: sourceError } = await supabase
    .from("rss_sources")
    .select("id, name")
    .order("name", { ascending: true })

  if (sourceError) {
    return <div>Failed to load sources: {sourceError.message}</div>
  }

  const { data: tagRows, error: tagError } = await supabase
    .from("articles")
    .select("tags")
    .not("tags", "is", null)

  if (tagError) {
    return <div>Failed to load tags: {tagError.message}</div>
  }

  const filteredArticlesQuery = applyArticleFilters(
    supabase
      .from("articles")
      .select(
        `
        *,
        rss_sources (
          name
        )
      `
      )
      .order("published_at", { ascending: false })
      .range(from, to),
    { query, sourceId, tag }
  )

  const filteredCountQuery = applyArticleFilters(
    supabase.from("articles").select("*", { count: "exact", head: true }),
    { query, sourceId, tag }
  )

  const [
    { data: articleData, error: articleError },
    { count, error: countError },
  ] = await Promise.all([filteredArticlesQuery, filteredCountQuery])

  if (articleError) {
    return <div>Failed to load articles: {articleError.message}</div>
  }

  if (countError) {
    return <div>Failed to load article count: {countError.message}</div>
  }

  const articles = (articleData ?? []) as ArticleListItem[]
  const totalEntries = count ?? 0
  const totalPages = Math.max(Math.ceil(totalEntries / PAGE_SIZE), 1)
  const currentPage = Math.min(page, totalPages)
  const pageWindow = getPaginationWindow(currentPage, totalPages)
  const showLeadingEllipsis = pageWindow.length > 0 && pageWindow[0] > 1
  const showTrailingEllipsis =
    pageWindow.length > 0 && pageWindow[pageWindow.length - 1] < totalPages
  const firstEntry = totalEntries === 0 ? 0 : from + 1
  const lastEntry = totalEntries === 0 ? 0 : from + articles.length
  const sources = ((sourceData ?? []) as SourceRecord[]).map((source) => ({
    label: source.name,
    value: String(source.id),
  }))
  const tags = Array.from(
    new Set(
      (tagRows ?? []).flatMap((row) =>
        Array.isArray(row.tags) ? row.tags.filter(Boolean) : []
      )
    )
  )
    .sort((left, right) => left.localeCompare(right))
    .map((keyword) => ({
      label: keyword,
      value: keyword,
    }))

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight">Articles</h1>
        <p className="text-lg text-muted-foreground">
          Browse all AI articles. Use filters to narrow down results.
        </p>
      </section>

      <SourceFilters
        initialQuery={query}
        initialSource={sourceId}
        initialTag={tag}
        sources={sources}
        tags={tags}
      />

      <div className="px-1 text-sm text-muted-foreground">
        Showing {firstEntry} to {lastEntry} of {totalEntries} entries.
      </div>

      <ArticleList articles={articles} title="Most Recent Articles" />

      {totalEntries > 0 ? (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={buildPageHref(params, Math.max(currentPage - 1, 1))}
                className={
                  currentPage <= 1 ? "pointer-events-none opacity-50" : undefined
                }
              />
            </PaginationItem>

            {showLeadingEllipsis ? (
              <>
                <PaginationItem>
                  <PaginationLink href={buildPageHref(params, 1)}>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              </>
            ) : null}

            {pageWindow.map((pageNumber) => (
              <PaginationItem key={pageNumber}>
                <PaginationLink
                  href={buildPageHref(params, pageNumber)}
                  isActive={pageNumber === currentPage}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            ))}

            {showTrailingEllipsis ? (
              <>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href={buildPageHref(params, totalPages)}>
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            ) : null}

            <PaginationItem>
              <PaginationNext
                href={buildPageHref(params, Math.min(currentPage + 1, totalPages))}
                className={
                  currentPage >= totalPages
                    ? "pointer-events-none opacity-50"
                    : undefined
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      ) : null}
    </main>
  )
}
