import "dotenv/config"

import { db, order, product } from "@jp/db"
import { eq } from "drizzle-orm"

async function seed() {
  console.log("seed started")

  console.log("✅ Seed completed")
}

seed().catch((error) => {
  console.error("❌ Seed failed:", error)
  process.exit(1)
})
