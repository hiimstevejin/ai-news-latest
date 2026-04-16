"use client"

import { SearchIcon } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  startTransition,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type FilterOption = {
  label: string
  value: string
}

type SourceFiltersProps = {
  initialQuery: string
  initialSource: string
  initialTag: string
  sources: FilterOption[]
  tags: FilterOption[]
}

export default function SourceFilters({
  initialQuery,
  initialSource,
  initialTag,
  sources,
  tags,
}: SourceFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(initialQuery)
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const updateFilters = (next: {
    query?: string
    source?: string
    tag?: string
  }) => {
    const params = new URLSearchParams(searchParams.toString())
    const nextQuery = next.query ?? query
    const nextSource = next.source ?? initialSource
    const nextTag = next.tag ?? initialTag

    if (nextQuery) {
      params.set("q", nextQuery)
    } else {
      params.delete("q")
    }

    if (nextSource && nextSource !== "all") {
      params.set("source", nextSource)
    } else {
      params.delete("source")
    }

    if (nextTag && nextTag !== "all") {
      params.set("tag", nextTag)
    } else {
      params.delete("tag")
    }

    params.delete("page")

    startTransition(() => {
      router.replace(
        params.toString() ? `${pathname}?${params.toString()}` : pathname
      )
    })
  }

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextQuery = event.target.value
    setQuery(nextQuery)

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = window.setTimeout(() => {
      updateFilters({ query: nextQuery.trim() })
    }, 300)
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={handleQueryChange}
          placeholder="Search articles..."
          className="h-12 rounded-xl bg-card pl-11 text-base"
          aria-label="Search articles"
        />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row lg:justify-end">
        <Select
          value={initialSource || "all"}
          onValueChange={(value) => {
            updateFilters({ source: value })
          }}
        >
          <SelectTrigger className="h-12 w-full rounded-xl bg-card sm:w-[180px]">
            <SelectValue placeholder="All Sources" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            {sources.map((source) => (
              <SelectItem key={source.value} value={source.value}>
                {source.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={initialTag || "all"}
          onValueChange={(value) => {
            updateFilters({ tag: value })
          }}
        >
          <SelectTrigger className="h-12 w-full rounded-xl bg-card sm:w-[180px]">
            <SelectValue placeholder="All Keywords" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Keywords</SelectItem>
            {tags.map((tag) => (
              <SelectItem key={tag.value} value={tag.value}>
                {tag.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
