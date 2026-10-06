import type { Catalog } from "../catalog.type"

type ProductCardProps = {
  data: Catalog
  priority?: boolean
}

export const ProductCard = ({ data, priority }: ProductCardProps) => {
  return (
    <div className="relative flex flex-col overflow-hidden rounded-2xl bg-secondary shadow-sm hover:[&_img]:scale-104">
      <div className="relative aspect-square overflow-hidden rounded-2xl">
        {data.image && (
          <img
            width={600}
            height={900}
            src={data.image}
            alt={data.title}
            loading={priority ? "eager" : "lazy"}
            className="relative z-1 aspect-square w-full rounded-lg object-contain mix-blend-multiply transition duration-500 ease-out"
          />
        )}
      </div>
      <div className="mt-auto flex-1 space-y-1 rounded-t-2xl bg-background p-4">
        <h3 className="font-heading text-base font-medium">{data.title}</h3>
      </div>
    </div>
  )
}
