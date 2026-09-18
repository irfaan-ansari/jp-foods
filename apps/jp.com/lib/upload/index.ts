import { upload } from "@vercel/blob/client"
import type { PutBlobResult } from "@vercel/blob"

export const uploadFile = async ({
  file,
  path,
}: {
  file: File | undefined
  path?: string
}): Promise<PutBlobResult> => {
  if (!file) {
    return { url: "" } as PutBlobResult
  }

  return upload(`${path}/${file.name}`, file, {
    access: "public",
    handleUploadUrl: process.env.NEXT_PUBLIC_API_URL + "/api/v1/upload",
  })
}
