import KeywordTreemap from "./keyword-treemap"
import { createClient } from "@/lib/supabase/server"

type KeywordNode = {
  name: string
  value?: number
  children?: KeywordNode[]
}

export default async function KeywordTreemapWrapper() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("tag_counts")
    .select("tag, article_count")
    .order("article_count", { ascending: false })
    .limit(20)
  if (error) {
    console.error(error)

    const fallbackData: KeywordNode = {
      name: "AI News",
      children: [],
    }

    return (
      <div className="h-[560px] w-full">
        <KeywordTreemap keywordData={fallbackData} />
      </div>
    )
  }

  const aiKeywordData: KeywordNode = {
    name: "AI News",
    children: (data ?? []).map((row) => ({
      name: row.tag,
      value: row.article_count,
    })),
  }

  return (
    <div className="h-[560px] w-full">
      <KeywordTreemap keywordData={aiKeywordData} />
    </div>
  )
}
