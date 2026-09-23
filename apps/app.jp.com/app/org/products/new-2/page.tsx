import { PageContent, PageHeader } from "@/components/page-content"
import { ProductPricingPrototype } from "@/features/org/product/forms/product-pricing-prototype"
import { Badge } from "@jp/ui/components/badge"

export default function ProductPage() {
  return (
    <>
      <PageHeader title="Create Product" backUrl="/org/products">
        <Badge variant="secondary">Pricing preview</Badge>
      </PageHeader>
      <PageContent className="mx-auto max-w-7xl">
        <ProductPricingPrototype />
      </PageContent>
    </>
  )
}
