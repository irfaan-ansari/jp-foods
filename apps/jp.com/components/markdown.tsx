import { cn } from "@jp/ui/lib/utils"
import ReactMarkdown from "react-markdown"

const Markdown = async ({
  className,
  content,
}: {
  className?: string
  content: string
}) => {
  return (
    <div
      className={cn(
        "prose dark:prose-invert max-w-full text-pretty [&_li]:pl-0 [&_ul]:pl-4",
        className
      )}
    >
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  )
}

export default Markdown
