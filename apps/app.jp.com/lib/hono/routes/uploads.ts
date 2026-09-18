import { Hono } from "hono"
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client"

const app = new Hono()

export const uploadRoutes = app.post("/", async (c) => {
  const body = await c.req.json<HandleUploadBody>()

  try {
    const response = await handleUpload({
      body,
      request: c.req.raw,
      onBeforeGenerateToken: async (pathname) => {
        // Authenticate user here if needed
        // const user = c.get("user")
        // if (!user) throw new Error("Not authenticated")

        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp"],
          addRandomSuffix: true,
        }
      },
    })

    return c.json(response)
  } catch (error) {
    return c.json(
      {
        error: error instanceof Error ? error.message : "Upload failed",
      },
      400
    )
  }
})
