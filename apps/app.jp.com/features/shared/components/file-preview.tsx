import React from "react"
import { useVercelBlob } from "../shared.data"
import { QueryBoundary } from "@/components/query-boundry"
import { Skeleton } from "@jp/ui/components/skeleton"
import { HeadBlobResult } from "@vercel/blob"
import { FileText, PenNewRound } from "@solar-icons/react"
import { ExternalLink } from "lucide-react"
import { cn } from "@jp/ui/lib/utils"
import { Button } from "@jp/ui/components/button"

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
        <div
          className={cn(
            "grid overflow-hidden rounded-2xl border shadow-xs",
            className
          )}
        >
          <PreviewItem data={result} />
          <div className="flex gap-2 p-4">
            <span className="min-w-0 flex-1 text-muted-foreground">
              {data.label || result.pathname}
            </span>

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
  console.log(data)
  const contentType = data.contentType
  if (!contentType)
    return (
      <div className="relative flex aspect-video items-center justify-center bg-secondary text-sm text-muted-foreground">
        File not found
      </div>
    )

  switch (true) {
    case contentType.startsWith("image/"):
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
        <div className="relative flex aspect-video items-center justify-center rounded-xl bg-secondary">
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
