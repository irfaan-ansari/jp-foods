import { runInvoiceCron } from "@/features/org/invoice/invoice.jobs"

export const runtime = "nodejs"
export const maxDuration = 300

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (!process.env.INVOICE_BLOB_READ_WRITE_TOKEN) {
    return Response.json(
      { error: "Invoice storage is not configured" },
      { status: 503 }
    )
  }
  try {
    const result = await runInvoiceCron()
    return Response.json(result, {
      status: result.failed ? 500 : 200,
      headers: { "Cache-Control": "no-store" },
    })
  } catch (error) {
    console.error("invoice.cron.failed", error)
    return Response.json({ error: "Invoice job failed" }, { status: 500 })
  }
}
