"use client"
import { createFormHook } from "@tanstack/react-form"
import { fieldContext, formContext } from "./context"
import * as fields from "./fields"
export { useFieldContext, useFormContext } from "./context"
export { formOptions, useStore } from "@tanstack/react-form"
export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  formComponents: {},
  fieldComponents: fields,
})
