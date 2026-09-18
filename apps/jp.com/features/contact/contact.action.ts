"use server"
import { db, customerInvite } from "@jp/db"
import { CONTACT_SCHEMA } from "./contact.schema"

export async function createInvite(input: unknown) {
  return { success: true, error: { message: "" } }
}
