import { Container } from "@/components/container"
import { Button } from "@jp/ui/components/button"
import Link from "next/link"
import React from "react"

const ProductsPages = () => {
  return (
    <React.Fragment>
      <section className="my-16">
        <Container className="space-y-6">
          <div className="flex items-center justify-between gap-6">
            <span className="font-heading font-medium uppercase">
              {/* Products {pagination.total} */}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 md:gap-8 lg:grid-cols-5">
            {[...Array(24)].map((product, i) => (
              <div
                key={product?.id}
                className="relative rounded-[0.5rem] bg-linear-to-br from-secondary via-background to-secondary shadow-sm hover:[&_img]:scale-110"
              >
                <div className="relative aspect-square overflow-hidden rounded-[0.5rem]">
                  {product?.image && (
                    <img
                      width={600}
                      height={900}
                      src={product?.image}
                      alt={product?.title}
                      loading={i <= 10 ? "eager" : "lazy"}
                      className="relative z-1 aspect-square w-full rounded-lg object-contain transition ease-out"
                    />
                  )}
                </div>
                <div className="mt-auto space-y-1 p-4">
                  <h3 className="font-heading text-base font-medium">
                    {product?.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          {/* pagination */}

          <div className="mt-16 bg-primary px-6 py-16 lg:px-16">
            <div className="space-y-8">
              <div className="mx-auto max-w-2xl space-y-4 text-center text-background">
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
                  <Link href="/contact#contact-form">Request Catalog</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* <PageClient pagination={pagination} /> */}
        </Container>
      </section>
    </React.Fragment>
  )
}

export default ProductsPages
