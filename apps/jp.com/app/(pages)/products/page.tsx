import { Container } from "@/components/container"
import { ProductCard } from "@/features/catalog/components/product-card"
import { getCatalogProducts } from "@/features/catalog/catalog.data"
import { Button } from "@jp/ui/components/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import React from "react"
import { SearchQueryParam } from "@jp/ui/components/jp/search-input"
import { Pagination } from "@/features/catalog/components/pagination"

export const dynamic = "force-dynamic"

const ProductsPages = async () => {
  const { data: products, pagination, authorized } = await getCatalogProducts()

  return (
    <React.Fragment>
      <section className="bg-lime-100 py-16">
        <Container>
          <div className="flex h-full flex-col items-center">
            <div className="mx-auto max-w-4xl space-y-6 text-center">
              <h2 className="flex-1 font-heading text-4xl/tight font-semibold sm:text-5xl/tight md:text-7xl/tight">
                Catalog
              </h2>
            </div>
          </div>
        </Container>
      </section>
      <section className="my-16">
        <Container className="space-y-16">
          <div className="flex items-center justify-between gap-6">
            <span className="font-heading font-medium">
              Products {pagination.total}
            </span>
            <SearchQueryParam />
          </div>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 md:gap-8 lg:grid-cols-4 2xl:grid-cols-6">
            {products.map((product, i) => (
              <ProductCard key={product.id} data={product} priority={i <= 10} />
            ))}
          </div>

          {authorized && (
            <Pagination
              page={pagination.page}
              limit={pagination.limit}
              total={pagination.total}
              totalPages={pagination.totalPages}
            />
          )}
        </Container>
      </section>
      {!authorized && (
        <section>
          <div className="mt-16 bg-linear-to-b from-lime-200 via-lime-100 to-background py-16">
            <div className="space-y-8">
              <div className="mx-auto max-w-3xl space-y-4 text-center">
                <h2 className="flex-1 font-heading text-4xl/tight font-semibold sm:text-5xl/tight md:text-6xl/tight">
                  Access Complete Catalog
                </h2>
                <p className="text-lg">
                  Get access to our complete product catalog, bulk pricing, and
                  availability. Submit a quick request and our team will review
                  your access.
                </p>
              </div>
              <div className="text-center">
                <Button
                  asChild
                  size="xl"
                  className="bg-foreground hover:bg-foreground/80"
                >
                  <Link href="/contact#contact-form">
                    Request Catalog
                    <ArrowRight />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}
    </React.Fragment>
  )
}

export default ProductsPages
