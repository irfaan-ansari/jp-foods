import "dotenv/config"
import { defineConfig } from "drizzle-kit"

export default defineConfig({
  out: "./src/migrations",
  schema: [
    "./src/schema/application.ts",
    "./src/schema/auth.ts",
    "./src/schema/relations.ts",
    "./src/schema/organization.ts",
  ],
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
console.log(process.env.DATABASE_URL)
