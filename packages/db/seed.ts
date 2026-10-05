import "dotenv/config"

import { db, product } from "@jp/db"
import { eq } from "drizzle-orm"

const batchSize = 25

async function seed() {
  await db
    .update(product)
    .set({ pricingBasis: "fixed", stockUOM: "LB", sellUOM: "CS" })
  console.log("seed started")
}

seed().catch((error) => {
  console.error("❌ Seed failed:", error)
  process.exit(1)
})
