"use server"
import { db, jobApplication } from "@jp/db"

export async function createJobApplication(input: unknown) {
  return { success: true, error: { message: "" } }
}
