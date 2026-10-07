import { Container } from "@/components/container"
import { ProductCard } from "@/features/catalog/components/product-card"
import { getCatalogProducts } from "@/features/catalog/catalog.data"
import { Button } from "@jp/ui/components/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import React from "react"
import { CatalogSearch } from "@/features/catalog/components/catalog-search"
import { Pagination } from "@/features/catalog/components/pagination"
import { Metadata } from "next"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Catalog",
  description:
    "Browse our foodservice catalog featuring fresh produce and essential supplies for restaurants, food trucks, and commercial kitchens.",
}

const ProductsPages = async ({ searchParams }: { searchParams: any }) => {
  const params = await searchParams

  const {
    data: products,
    pagination,
    authorized,
  } = await getCatalogProducts(params)

  return (
    <React.Fragment>
      <section className="bg-secondary py-16">
        <Container>
          <div className="flex h-full flex-col items-center">
            <div className="mx-auto max-w-xl space-y-6 text-center">
              <h2 className="flex-1 font-heading text-4xl/tight font-semibold text-primary sm:text-5xl/tight md:text-7xl/tight">
                Catalog
              </h2>
              <p className="text-lg">
                Browse our foodservice catalog featuring fresh produce and
                essential supplies for restaurants, food trucks, and commercial
                kitchens.
              </p>
            </div>
          </div>
        </Container>
      </section>
      <section className="my-10 sm:my-14">
        <Container className="space-y-8">
          <div className="flex flex-col gap-5 border-b pb-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-heading text-2xl font-semibold tracking-tight">
                {params.q ? "Search results" : "Explore our products"}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {params.q
                  ? `${pagination.total.toLocaleString()} products matching "${params.q}"`
                  : `${pagination.total.toLocaleString()} products in our catalog`}
              </p>
            </div>
            <CatalogSearch />
          </div>
          {products.length === 0 && (
            <div className="rounded-2xl border border-dashed bg-secondary/30 px-6 py-16 text-center">
              <h3 className="font-heading text-xl font-semibold">
                No products found
              </h3>
              <p className="mt-3 text-base text-muted-foreground">
                Try a different product name or clear your search.
              </p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 2xl:grid-cols-5">
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
