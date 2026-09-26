import "dotenv/config"

import { db, product } from "@jp/db"
import { eq } from "drizzle-orm"

async function seed() {
  const items = await db.query.product.findMany({
    columns: { id: true },
  })

  console.log(`Started updating ${items.length} products...`)

  const BATCH_SIZE = 10

  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const batch = items.slice(i, i + BATCH_SIZE)

    await Promise.all(
      batch.map((item) =>
        db
          .update(product)
          .set({
            sellingUnits: [
              {
                name: "case",
                displayLabel: "",
                isDefault: true,
                qtyPerUnit: "1",
                price: String(Math.floor(Math.random() * 191) + 10),
              },
            ],
          })
          .where(eq(product.id, item.id))
      )
    )
  }

  console.log("Seed complete")
}
seed()
  .catch((error) => {
    console.error("❌ Seed failed:", error)
    process.exit(1)
  })
  .finally(() => {
    process.exit(0)
  })
