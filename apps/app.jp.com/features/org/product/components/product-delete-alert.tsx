import React from "react"
import { toast } from "sonner"
import { InfoCircle, TrashBinMinimalistic } from "@solar-icons/react"
import { deleteProduct } from "../product.action"
import { useQueryClient } from "@tanstack/react-query"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import { useConfirm } from "@jp/ui/components/jp/confirm-dialog"
import { Button } from "@jp/ui/components/button"
import { OrgAccess } from "@/features/auth/components/org-permission"
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@jp/ui/components/alert"

const ProductDeleteAlert = ({ id }: { id: number }) => {
  const { open } = useConfirm()
  const queryClient = useQueryClient()
  const { router, searchParams } = useRouterStuff()

  const handleDelete = async () => {
    open({
      variant: "destructive",
      action: {
        label: "Delete",
        action: async () => {
          const { serverError } = await deleteProduct({ id })
          if (serverError) toast.error(serverError.message)
          else {
            toast.success("Product deleted...")
            queryClient.invalidateQueries({ queryKey: ["products"] })
            queryClient.invalidateQueries({
              queryKey: ["count", "/org/products/count"],
            })
            router.replace(`/org/products?${searchParams}`)
          }
        },
      },
    })
  }

  return (
    <Alert variant="destructive">
      <InfoCircle />
      <AlertTitle>Delete Product</AlertTitle>
      <AlertDescription>
        Are you sure you want to delete this product? This action cannot be
        undone.
      </AlertDescription>
      <AlertAction>
        <OrgAccess permission={{ product: ["delete"] }}>
          {(disabled) => (
            <Button
              size="sm"
              className="relative z-2"
              variant="destructive"
              onClick={(e) => {
                e.stopPropagation()
                handleDelete()
              }}
              disabled={disabled}
            >
              <TrashBinMinimalistic />
              Delete
            </Button>
          )}
        </OrgAccess>
      </AlertAction>
    </Alert>
  )
}

export default ProductDeleteAlert
