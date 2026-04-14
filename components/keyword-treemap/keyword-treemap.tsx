"use client"

import * as d3 from "d3"
import { useEffect, useRef, useState } from "react"

type KeywordNode = {
  name: string
  value?: number
  children?: KeywordNode[]
}

type KeywordTreemapProps = {
  keywordData: KeywordNode
}

const TREEMAP_PADDING = 6
const INNER_PADDING = 12
const COLORS = [
  "#d9485f",
  "#f97316",
  "#f59e0b",
  "#84cc16",
  "#22c55e",
  "#14b8a6",
  "#06b6d4",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
  "#ef4444",
  "#0f766e",
  "#0284c7",
  "#4f46e5",
  "#7c3aed",
  "#65a30d",
  "#ea580c",
]

export default function KeywordTreemap({
  keywordData,
}: KeywordTreemapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })
  const [hoveredLeafName, setHoveredLeafName] = useState<string | null>(null)

  useEffect(() => {
    const element = containerRef.current

    if (!element) {
      return
    }

    const resizeObserver = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize({
        width: Math.floor(width),
        height: Math.floor(height),
      })
    })

    resizeObserver.observe(element)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  const hasSize = size.width > 0 && size.height > 0
  const root = hasSize
    ? d3
        .hierarchy<KeywordNode>(keywordData)
        .sum((d) => d.value ?? 0)
        .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))
    : null

  const layoutRoot =
    root &&
    d3
      .treemap<KeywordNode>()
      .size([size.width, size.height])
      .padding(TREEMAP_PADDING)
      .round(true)(root)

  const leaves = layoutRoot?.leaves() ?? []
  const colorScale = d3
    .scaleOrdinal<string, string>()
    .domain(leaves.map((leaf) => leaf.data.name))
    .range(COLORS)

  const getLabelFontSize = (width: number, height: number) => {
    const availableWidth = Math.max(width - INNER_PADDING * 2, 0)
    const availableHeight = Math.max(height - INNER_PADDING * 2, 0)
    const sizeFromWidth = availableWidth / 7.5
    const sizeFromHeight = availableHeight / 3.2

    return Math.max(9, Math.min(18, sizeFromWidth, sizeFromHeight))
  }

  const getValueFontSize = (labelFontSize: number) => {
    return Math.max(8, labelFontSize - 3)
  }

  return (
    <div ref={containerRef} className="size-full">
      {hasSize ? (
        <svg
          viewBox={`0 0 ${size.width} ${size.height}`}
          className="size-full"
          role="img"
          aria-label="Treemap of AI keywords"
          preserveAspectRatio="none"
        >
          <g>
            {leaves.map((leaf) => {
              const width = leaf.x1 - leaf.x0
              const height = leaf.y1 - leaf.y0
              const labelFontSize = getLabelFontSize(width, height)
              const valueFontSize = getValueFontSize(labelFontSize)
              const labelY = INNER_PADDING + labelFontSize
              const valueY = labelY + valueFontSize + 8
              const showLabel = width > 36 && height > 24
              const showValue = width > 48 && height > valueY + INNER_PADDING

              return (
                <g
                  key={leaf.data.name}
                  transform={`translate(${leaf.x0}, ${leaf.y0})`}
                  className="transition-opacity duration-150"
                  opacity={
                    hoveredLeafName && hoveredLeafName !== leaf.data.name
                      ? 0.35
                      : 1
                  }
                  onMouseEnter={() => {
                    setHoveredLeafName(leaf.data.name)
                  }}
                  onMouseLeave={() => {
                    setHoveredLeafName(null)
                  }}
                >
                  <rect
                    width={width}
                    height={height}
                    fill={colorScale(leaf.data.name)}
                    rx={4}
                  />
                  {showLabel ? (
                    <text
                      x={INNER_PADDING}
                      y={labelY}
                      fill="white"
                      fontSize={labelFontSize}
                      fontWeight={600}
                      pointerEvents="none"
                    >
                      {leaf.data.name}
                    </text>
                  ) : null}
                  {showValue ? (
                    <text
                      x={INNER_PADDING}
                      y={valueY}
                      fill="rgba(255,255,255,0.8)"
                      fontSize={valueFontSize}
                      pointerEvents="none"
                    >
                      {leaf.value}
                    </text>
                  ) : null}
                </g>
              )
            })}
          </g>
        </svg>
      ) : null}
    </div>
  )
}
