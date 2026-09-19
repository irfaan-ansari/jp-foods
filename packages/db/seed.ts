import "dotenv/config"

import { db, product } from "@jp/db"
import { eq } from "drizzle-orm"

async function seed() {
  const items = await db.query.product.findMany()
  console.log("started")
  const promises = []

  for (const item of items) {
    console.log("item:", item.id)
    if (item.sellUnits && item.sellUnits.length === 0) {
      promises.push(
        db
          .update(product)
          .set({
            sellUnits: [
              {
                name: item.unit,
                unitConversion: "1",
                minQuantity: "1",
                orderIncreament: "1",
              },
            ],
          })
          .where(eq(product.id, item.id))
      )
    }
  }

  await Promise.all(promises)

  console.log("seed complete")
}
seed()
  .catch((error) => {
    console.error("❌ Seed failed:", error)
    process.exit(1)
  })
  .finally(() => {
    process.exit(0)
  })
