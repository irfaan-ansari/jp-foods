import React from "react"

import { ExternalLink } from "lucide-react"
import { HeadBlobResult } from "@vercel/blob"
import { Button } from "@jp/ui/components/button"
import { FileText, PenNewRound } from "@solar-icons/react"
import { Document } from "@/features/crm/candidate/candidate.type"
import { cn } from "@jp/ui/lib/utils"

export const FilePreview = ({
  data,
  className,
}: {
  data: Document
  className?: string
}) => {
  return (
    <div
      className={cn(
        "group relative flex items-center gap-3 rounded-2xl border bg-card p-2.5 shadow-xs transition-colors hover:bg-secondary/50",
        className
      )}
    >
      <div className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl border bg-secondary/50 lg:size-14">
        <FileText className="size-5 text-muted-foreground" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{data.label}</div>

        <div className="mt-0.5 flex items-center gap-1.5">
          <span className="truncate text-xs text-muted-foreground">
            {data.url}
          </span>

          <ExternalLink className="size-3 shrink-0 text-muted-foreground/70" />
        </div>
      </div>

      {data.url?.startsWith("image/") && (
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          className="relative z-10 shrink-0"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            // edit
          }}
        >
          <PenNewRound className="size-4" />
          <span className="sr-only">Edit</span>
        </Button>
      )}

      <a
        href={data.url}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0 rounded-2xl"
        aria-label={`Open ${data.label}`}
      />
    </div>
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
