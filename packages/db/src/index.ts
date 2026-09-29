import { drizzle, NeonHttpDatabase } from "drizzle-orm/neon-http"

import * as authSchema from "./schema/auth"
import * as relations from "./schema/relations"
import * as schema from "./schema/organization"
import * as application from "./schema/application"
import * as invoiceSchema from "./schema/invoice"

const fullSchema = {
  ...schema,
  ...authSchema,
  ...application,
  ...relations,
  ...invoiceSchema,
}
type FullSchema = typeof fullSchema

export const db: NeonHttpDatabase<FullSchema> = drizzle(
  process.env.DATABASE_URL!,
  {
    schema: fullSchema,
  }
)

export * from "./schema/auth"
export * from "./schema/types"
export * from "./schema/relations"
export * from "./schema/application"
export * from "./schema/organization"
export * from "./schema/invoice"
