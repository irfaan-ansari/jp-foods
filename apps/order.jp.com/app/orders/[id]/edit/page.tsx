import { redirect } from "next/navigation"

const RedirectPage = async ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = await params
  redirect(`/orders/${id}/edit/all`)
}

export default RedirectPage
