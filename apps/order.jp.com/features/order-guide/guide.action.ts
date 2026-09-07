"use server"

import { orgActionClient } from "@/lib/safe-action"
import { createGuideSchema } from "./guide.schema"
import { db, orderGuide, orderGuideItem } from "@jp/db"

export const createGuide = orgActionClient({ orderGuide: ["create"] })
  .inputSchema(createGuideSchema)
  .action(async ({ clientInput, ctx }) => {
    const { teamId, organizationId } = ctx

    const { name, description, productIds } = clientInput.data

    const [createdGuide] = await db
      .insert(orderGuide)
      .values({ name, description, organizationId, teamId })
      .returning({ id: orderGuide.id })

    const toInsertItems = productIds.map((id, i) => ({
      productId: id,
      position: i + 1,
      orderGuideId: createdGuide?.id,
    }))

    await db.insert(orderGuideItem).values(toInsertItems)

    return { success: true, id: createdGuide?.id }
  })
