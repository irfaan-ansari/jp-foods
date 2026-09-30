import "dotenv/config"

import { db, user } from "@jp/db"

async function seed() {
  console.log("seed started")
}

seed()
  .catch((error) => {
    console.error("❌ Seed failed:", error)
    process.exit(1)
  })
  .finally(() => {
    process.exit(0)
  })
