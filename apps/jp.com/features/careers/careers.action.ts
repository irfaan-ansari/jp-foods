"use server"
import { db, jobApplication } from "@jp/db"
import {
  driverSubmissionSchema,
  managerSubmissionSchema,
} from "./careers.submission"

export async function createJobApplication(input: unknown) {
  return { success: true, error: { message: "" } }
}
