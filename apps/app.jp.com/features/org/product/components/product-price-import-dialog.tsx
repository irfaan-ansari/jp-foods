"use client"

import React, { useState } from "react"
import {
  AppDialog,
  AppDialogClose,
  AppDialogContent,
  AppDialogHeader,
  AppDialogTitle,
  AppDialogTrigger,
} from "@jp/ui/components/jp/app-dialog"
import { Badge } from "@jp/ui/components/badge"
import { Button } from "@jp/ui/components/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@jp/ui/components/field"
import { Checkbox } from "@jp/ui/components/checkbox"
import { Download, FileSpreadsheet, Upload } from "lucide-react"
import { Input } from "@jp/ui/components/input"

export const ProductPriceImportDialog = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [open, setOpen] = useState(false)

  return (
    <AppDialog open={open} onOpenChange={setOpen}>
      <AppDialogTrigger asChild>{children}</AppDialogTrigger>
      <AppDialogContent className="md:max-w-2xl">
        <AppDialogHeader>
          <AppDialogTitle className="text-base font-bold">
            Bulk Price Import
          </AppDialogTitle>
        </AppDialogHeader>

        <FieldGroup>
          <Field>
            <FieldLabel
              htmlFor="csv-file"
              className="flex flex-col gap-3 rounded-2xl border border-dashed bg-secondary/40 p-4"
            >
              <div className="flex size-12 items-center justify-center rounded-lg border bg-background">
                <Upload className="size-5 text-muted-foreground" />
              </div>
              <div className="space-y-1 text-center">
                <div className="text-sm font-medium">
                  Drop your CSV or XLSX file here
                </div>
                <div className="text-sm text-muted-foreground">
                  Item codes and prices will be reviewed before import.
                </div>
              </div>
              <Input type="file" className="sr-only" id="csv-file" />
              <Button type="button" variant="outline" asChild>
                <span>
                  <FileSpreadsheet />
                  Choose File
                </span>
              </Button>
            </FieldLabel>
          </Field>

          <div className="rounded-2xl border bg-secondary/40 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-medium">Import preview</div>
                <div className="text-sm text-muted-foreground">
                  Rows will appear here after a file is selected.
                </div>
              </div>
              <Badge variant="outline">No file</Badge>
            </div>
            <div className="grid grid-cols-3 rounded-md border bg-background text-sm">
              <div className="border-r px-3 py-2 font-medium">Item Code</div>
              <div className="border-r px-3 py-2 font-medium">Unit</div>
              <div className="px-3 py-2 font-medium">Price</div>
              <div className="border-t border-r px-3 py-2 text-muted-foreground">
                -
              </div>
              <div className="border-t border-r px-3 py-2 text-muted-foreground">
                -
              </div>
              <div className="border-t px-3 py-2 text-muted-foreground">-</div>
            </div>
          </div>
        </FieldGroup>

        <Field className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-4 sm:[&>*]:w-28">
          <AppDialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </AppDialogClose>
          <Button type="button" disabled>
            Import
          </Button>
        </Field>
      </AppDialogContent>
    </AppDialog>
  )
}
