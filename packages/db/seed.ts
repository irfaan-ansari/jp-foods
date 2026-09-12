import "dotenv/config"

import { db, productSellUnit } from "@jp/db"

async function seed() {
  console.log("🌱 Seeding database...")

  const products = await db.query.product.findMany({
    with: {
      sellUnits: true,
    },
  })

  const promises = []

  for (const product of products) {
    if (product.sellUnits.length > 0) continue

    const price = (Math.random() * (200 - 100) + 100).toFixed(2)

    promises.push(
      db.insert(productSellUnit).values({
        productId: product.id,
        name: "case",
        isBaseUnit: true,
        price: price.toString(),
      })
    )
  }

  await Promise.all(promises)

  console.log("✅ Seed complete")
}
seed()
  .catch((error) => {
    console.error("❌ Seed failed:", error)
    process.exit(1)
  })
  .finally(() => {
    process.exit(0)
  })
