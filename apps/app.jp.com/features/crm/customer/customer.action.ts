"use server"
import { eq } from "drizzle-orm"
import { AppError } from "@jp/utils"
import { customer, db } from "@jp/db"
import {
  deleteCustomerApplicationSchema,
  updateCustomerApplicationSchema,
  processCustomerApplicationSchema,
  updateCustomerApplicationStatusSchema,
} from "./customer.schema"
import { authActionClient } from "@/lib/safe-action"

// update fields
export const updateCustomerApplication = authActionClient({
  "customer-application": ["update"],
})
  .inputSchema(updateCustomerApplicationSchema)
  .action(async ({ ctx, clientInput }) => {
    const { user } = ctx
    const { id, data } = clientInput

    const exist = await db.query.customer.findFirst({
      where: (c, { eq }) => eq(c.id, id),
    })
    if (!exist) throw new AppError("NOT_FOUND")

    await db
      .update(customer)
      .set({
        ...data,
        reviewedBy: user.id,
      })
      .where(eq(customer.id, id))

    return { id: 1 }
  })

// approve or review
export const processCustomerApplication = authActionClient({
  "customer-application": ["update"],
})
  .inputSchema(processCustomerApplicationSchema)
  .action(async ({ ctx, clientInput }) => {
    const { user } = ctx
    const { id, data } = clientInput

    const exist = await db.query.customer.findFirst({
      where: (c, { eq }) => eq(c.id, id),
    })
    if (!exist) throw new AppError("NOT_FOUND")

    await db
      .update(customer)
      .set({
        status: data.status,
        reviewedBy: user.id,
        reviewedAt: new Date(),
      })
      .where(eq(customer.id, id))

    // quee email
    return { id: exist.id }
  })

// hold or reject
export const updateCustomerApplicationStatus = authActionClient({
  "customer-application": ["update"],
})
  .inputSchema(updateCustomerApplicationStatusSchema)
  .action(async ({ ctx, clientInput }) => {
    const { user } = ctx
    const { id, data } = clientInput

    const exist = await db.query.customer.findFirst({
      where: (c, { eq }) => eq(c.id, id),
    })
    if (!exist) throw new AppError("NOT_FOUND")

    await db
      .update(customer)
      .set({
        status: data.status,
        statusReason: data.statusReason,
        statusDetails: data.statusDetails,
        reviewedBy: user.id,
        reviewedAt: new Date(),
      })
      .where(eq(customer.id, id))

    // quee email
    return { id: id }
  })

// delete
export const deleteCustomerApplication = authActionClient({
  "customer-application": ["delete"],
})
  .inputSchema(deleteCustomerApplicationSchema)
  .action(async ({ clientInput }) => {
    const { id } = clientInput

    const exist = await db.query.customer.findFirst({
      where: (c, { eq }) => eq(c.id, id),
    })
    if (!exist) throw new AppError("NOT_FOUND")

    await db.delete(customer).where(eq(customer.id, id))

    return { id: id }
  })
