"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@jp/ui/components/dialog"

import React, { useState } from "react"
import { ProductForm } from "../forms/product-form"
import { ProductFormSchema } from "../product.schema"
import { useQueryClient } from "@tanstack/react-query"

export const ProductDialog = ({
  children,
  defaultValue,
  productId,
}: {
  defaultValue?: ProductFormSchema
  productId?: number
  children: React.ReactNode
}) => {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="px-0 md:max-w-4xl">
        <DialogHeader className="px-6">
          <DialogTitle className="text-base font-bold">
            {productId ? "Edit Product" : "New Product"}
          </DialogTitle>
        </DialogHeader>
        <ProductForm data={defaultValue!} id={productId} />
      </DialogContent>
    </Dialog>
  )
}
