import "dotenv/config"

import { db, product } from "@jp/db"
import { eq } from "drizzle-orm"

async function seed() {
  console.log("🌱 Seeding database...")
}
seed()
  .catch((error) => {
    console.error("❌ Seed failed:", error)
    process.exit(1)
  })
  .finally(() => {
    process.exit(0)
  })
