"use server"

import { orgActionClient } from "@/lib/safe-action"
import {
  createTaxRuleSchema,
  deleteTaxRuleSchema,
  updateTaxRuleSchema,
} from "./tax-rule.schema"
import { db, taxRule } from "@jp/db"
import { eq } from "drizzle-orm"
import { AppError } from "@jp/utils/error"

export const createTaxRule = orgActionClient({ taxRule: ["create"] })
  .inputSchema(createTaxRuleSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { name, rate } = parsedInput.data

    const [result] = await db
      .insert(taxRule)
      .values({
        name,
        rate,
        organizationId: ctx.organizationId,
      })
      .returning({ id: taxRule.id })

    return { id: result?.id }
  })

export const updateTaxRule = orgActionClient({ taxRule: ["update"] })
  .inputSchema(updateTaxRuleSchema)
  .action(async ({ ctx, parsedInput }) => {
    const { data, id } = parsedInput
    const { name, rate } = data

    const existing = await db.query.taxRule.findFirst({
      where: (tr, { and, eq }) =>
        and(eq(tr.id, id), eq(tr.organizationId, ctx.organizationId)),
    })

    if (!existing) {
      throw new AppError("NOT_FOUND")
    }

    await db
      .update(taxRule)
      .set({
        name,
        rate,
      })
      .where(eq(taxRule.id, id))

    return { id }
  })

export const deleteTaxRule = orgActionClient({ taxRule: ["delete"] })
  .inputSchema(deleteTaxRuleSchema)
  .action(async ({ ctx, parsedInput }) => {
    const { id } = parsedInput

    const existing = await db.query.taxRule.findFirst({
      where: (tr, { and, eq }) =>
        and(eq(tr.id, id), eq(tr.organizationId, ctx.organizationId)),
    })

    if (!existing) {
      throw new AppError("NOT_FOUND")
    }

    await db.delete(taxRule).where(eq(taxRule.id, id))

    return { id }
  })
