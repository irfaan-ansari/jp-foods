import { PageContent, PageHeader } from "@/components/page-content"
import { SupportContent } from "@/features/support/components/support-content"

export default function SupportPage() {
  return (
    <>
      <PageHeader title="Support" />
      <PageContent>
        <SupportContent />
      </PageContent>
    </>
  )
}
