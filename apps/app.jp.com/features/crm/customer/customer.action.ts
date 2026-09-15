"use server"

import { eq } from "drizzle-orm"
import { AppError } from "@jp/utils"
import { customer, db } from "@jp/db"
import {
  deleteCustomerApplicationSchema,
  updateCustomerApplicationSchema,
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

    if (exist.status !== data.status) {
      triggerNotification({
        status: data.status!,
        statusReason: data.statusReason,
        statusDetails: data.statusDetails,
      })
    }

    return { id: 1 }
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

const triggerNotification = ({
  status,
  statusDetails,
  statusReason,
}: {
  status: string
  statusDetails?: string
  statusReason?: string
}) => {
  switch (status) {
    case "approved":
      // trigger approved email
      return
    case "under_review":
      // trigger under review email
      return
    case "on_hold":
    case "rejected":
      // trigger application update
      return
  }
}
