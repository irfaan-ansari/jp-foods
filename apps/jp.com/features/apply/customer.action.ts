"use server"
import { db, customer } from "@jp/db"
import {
  customerSubmissionSchema,
  customerInformationSchema,
} from "./customer.submission"

export async function createCustomer(input: unknown, notify = true) {
  return { success: true, error: { message: "fghj" } }
}
