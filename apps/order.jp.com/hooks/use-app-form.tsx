"use client"

import {
    DateField,
    FileField,
    RadioField,
    SelectField,
    TextField,
    PhoneField,
    PasswordField,
    TextAreaField,
    CurrencyField,
} from "@/components/form-field"
import { createFormHookContexts, createFormHook } from "@tanstack/react-form"

const { fieldContext, formContext, useFieldContext } = createFormHookContexts()

const { useAppForm, withForm } = createFormHook({
    fieldContext,
    formContext,
    fieldComponents: {
        TextField,
        DateField,
        SelectField,
        CurrencyField,
        RadioField,
        FileField,
        PhoneField,
        PasswordField,
        TextAreaField,
    },
    formComponents: {},
})

export { useAppForm, withForm, useFieldContext }
