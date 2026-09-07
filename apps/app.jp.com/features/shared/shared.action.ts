"use server"

import { del, head } from "@vercel/blob"

export const deleteBlob = async (url: string) => {
  return await del(url)
}
export const getBlob = async (url: string) => {
  return await head(url)
}
