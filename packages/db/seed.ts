import "dotenv/config"

import { db, taxRule } from "@jp/db"
import { existsSync, readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { sql } from "drizzle-orm"

type OldTaxRule = {
  id: number
  organization_id: string | null
  name: string
  rate: string
  priority: number
  created_at: string | null
  updated_at: string | null
}

const DIRNAME = dirname(fileURLToPath(import.meta.url))
const BATCH_SIZE = 100
const taxRules = readJson<OldTaxRule>("tax_rule.json")

function readJson<T>(fileName: string): T[] {
  const filePath = join(DIRNAME, fileName)

  if (!existsSync(filePath)) {
    console.warn(`Skipping ${fileName}: file does not exist`)
    return []
  }

  return JSON.parse(readFileSync(filePath, "utf8")) as T[]
}

function toDate(value: string | null) {
  return value ? new Date(value) : null
}

function toTaxRuleValues(oldTaxRule: OldTaxRule) {
  return {
    id: oldTaxRule.id,
    organizationId: oldTaxRule.organization_id,
    name: oldTaxRule.name,
    rate: oldTaxRule.rate,
    priority: oldTaxRule.priority,
    createdAt: toDate(oldTaxRule.created_at),
    updatedAt: toDate(oldTaxRule.updated_at) ?? new Date(),
  }
}

function chunk<T>(items: T[], size: number) {
  const chunks: T[][] = []

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size))
  }

  return chunks
}

async function seed() {
  const values = taxRules.map(toTaxRuleValues)

  for (const batch of chunk(values, BATCH_SIZE)) {
    await db
      .insert(taxRule)
      .values(batch)
      .onConflictDoUpdate({
        target: taxRule.id,
        set: {
          organizationId: sql`excluded.organization_id`,
          name: sql`excluded.name`,
          rate: sql`excluded.rate`,
          priority: sql`excluded.priority`,
          createdAt: sql`excluded.created_at`,
          updatedAt: sql`excluded.updated_at`,
        },
      })
  }

  console.log(`Seed complete: ${values.length} tax rules`)
}

seed()
  .catch((error) => {
    console.error("❌ Seed failed:", error)
    process.exit(1)
  })
  .finally(() => {
    process.exit(0)
  })
