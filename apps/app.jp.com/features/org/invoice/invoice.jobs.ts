import "server-only"

import { randomUUID } from "node:crypto"
import { db, order } from "@jp/db"
import { and, asc, eq, isNull, notExists, or, sql } from "drizzle-orm"
import { renderToBuffer } from "@react-pdf/renderer"
import { IssuedInvoice } from "@jp/pdf"
import { put } from "@vercel/blob"
import { createInvoiceSnapshot } from "./invoice.snapshot"

const BATCH_SIZE = 25
const RUN_BUDGET_MS = 240_000

export async function runInvoiceCron() {
  const started = Date.now()

  return started
}
