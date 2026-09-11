import React from "react"
import { useVercelBlob } from "../shared.data"
import { QueryBoundary } from "@/components/query-boundry"
import { Skeleton } from "@jp/ui/components/skeleton"
import { HeadBlobResult } from "@vercel/blob"
import { FileText, PenNewRound } from "@solar-icons/react"
import { ArrowUpRight, ExternalLink } from "lucide-react"
import { cn } from "@jp/ui/lib/utils"
import { Button } from "@jp/ui/components/button"
import { Card, CardAction, CardHeader } from "@jp/ui/components/card"
import Link from "next/link"

type FileItem = {
  label: string | undefined
  url: string
  onSave?: () => void
}

export const FilePreview = ({
  data,
  className,
}: {
  data: FileItem
  className?: string
}) => {
  const query = useVercelBlob(data.url)

  return (
    <QueryBoundary
      loading={
        <div className={cn("grid gap-2 border shadow-xs", className)}>
          <Skeleton className="aspect-video" />
          <Skeleton className="h-5 w-full" />
        </div>
      }
      query={query}
    >
      {(result) => (
        <div className="relative flex rounded-2xl bg-secondary/40 p-2 shadow-xs ring-1 ring-border">
          <div className="flex gap-2">
            <div className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl border bg-secondary lg:size-16">
              <FileText className="size-4 text-muted-foreground" />
            </div>
            <div className="grid flex-1 items-start gap-1 self-start py-1">
              <span className="font-medium">
                {data.label || result.pathname}
              </span>
              <span className="text-xs text-muted-foreground">
                {data.label || result.pathname}
              </span>
            </div>
          </div>
          <div className="absolute top-1/2 right-2 -translate-y-1/2">
            {result.contentType?.startsWith("image/") && (
              <Button size="icon-sm" variant="secondary">
                <PenNewRound />
              </Button>
            )}
          </div>
        </div>
      )}
    </QueryBoundary>
  )
}

const PreviewItem = ({ data }: { data: HeadBlobResult }) => {
  const contentType = data.contentType
  if (!contentType)
    return (
      <div className="relative flex aspect-video items-center justify-center bg-secondary text-sm text-muted-foreground">
        File not found
      </div>
    )

  switch (true) {
    case contentType.startsWith("imagea/"):
      return (
        <div className="relative aspect-video bg-secondary">
          <img
            src={data.url}
            width={400}
            height={300}
            className="inset-t absolute size-full object-cover"
          />
          <a
            href={data.url}
            target="_blank"
            className="absolute inset-0 flex items-start justify-end bg-linear-to-bl from-secondary to-30% p-4 transition hover:translate-x-0.5 hover:-translate-y-0.5"
          >
            <ExternalLink className="size-4" />
          </a>
        </div>
      )
    default:
      return (
        <div className="relative flex items-center justify-center rounded-xl bg-secondary">
          <FileText className="size-6 text-muted-foreground" />
          <a
            href={data.url}
            target="_blank"
            className="absolute inset-0 flex items-start justify-end bg-linear-to-bl from-secondary to-30% p-4 transition hover:translate-x-0.5 hover:-translate-y-0.5"
          >
            <ExternalLink className="size-4" />
          </a>
        </div>
      )
  }
}
