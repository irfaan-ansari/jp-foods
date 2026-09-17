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
            <FieldLabel>Upload price file</FieldLabel>
            <div className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-lg border border-dashed bg-secondary/50 px-6 py-8 text-center">
              <div className="flex size-12 items-center justify-center rounded-lg border bg-background">
                <Upload className="size-5 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium">
                  Drop your CSV or XLSX file here
                </div>
                <div className="text-sm text-muted-foreground">
                  Item codes and prices will be reviewed before import.
                </div>
              </div>
              <Button type="button" variant="outline" disabled>
                <FileSpreadsheet />
                Choose File
              </Button>
            </div>
            <FieldDescription>
              Use the template format to prevent skipped rows.
            </FieldDescription>
          </Field>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field className="rounded-lg border p-4">
              <div className="flex items-center justify-between gap-3">
                <FieldLabel>Template columns</FieldLabel>
                <Badge variant="secondary">Required</Badge>
              </div>
              <div className="grid gap-2 text-sm">
                {["item_code", "unit_name", "price"].map((column) => (
                  <div
                    key={column}
                    className="flex items-center justify-between rounded-md bg-secondary px-3 py-2"
                  >
                    <span className="font-medium">{column}</span>
                    <span className="text-muted-foreground">Column</span>
                  </div>
                ))}
              </div>
            </Field>

            <Field className="rounded-lg border p-4">
              <FieldLabel>Import settings</FieldLabel>
              <div className="grid gap-3">
                <label className="flex items-start gap-3 text-sm">
                  <Checkbox checked disabled />
                  <span>
                    <span className="block font-medium">
                      Match by item code
                    </span>
                    <span className="text-muted-foreground">
                      Existing product prices will be updated.
                    </span>
                  </span>
                </label>
                <label className="flex items-start gap-3 text-sm">
                  <Checkbox disabled />
                  <span>
                    <span className="block font-medium">Skip blank prices</span>
                    <span className="text-muted-foreground">
                      Keep current pricing when a price cell is empty.
                    </span>
                  </span>
                </label>
              </div>
            </Field>
          </div>

          <div className="rounded-lg border bg-secondary/40 p-4">
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

          <Field className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
            <Button type="button" variant="outline" disabled>
              <Download />
              Download Template
            </Button>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:**:w-28">
              <AppDialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </AppDialogClose>
              <Button type="button" disabled>
                Import
              </Button>
            </div>
          </Field>
        </FieldGroup>
      </AppDialogContent>
    </AppDialog>
  )
}
