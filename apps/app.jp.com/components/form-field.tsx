"use client"

import React, { useState } from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@jp/ui/components/popover"
import { Input } from "@jp/ui/components/input"
import { Button } from "@jp/ui/components/button"
import { Calendar } from "@jp/ui/components/calendar"

import { formatPhone, formatUSD, sanitizeNumber } from "@jp/utils"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldTitle,
} from "@jp/ui/components/field"
import {
  ChevronDownIcon,
  Calendar as CalendarIcon,
  Paperclip,
  Trash2,
  Upload,
  EyeOff,
  Eye,
} from "lucide-react"
import { cn } from "@jp/ui/lib/utils"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@jp/ui/components/select"
import { RadioGroup, RadioGroupItem } from "@jp/ui/components/radio-group"
import { addYears, format } from "date-fns"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@jp/ui/components/input-group"
import { Textarea } from "@jp/ui/components/textarea"
import { Badge } from "@jp/ui/components/badge"
import { useFieldContext } from "@/hooks/use-app-form"

export interface FieldProps {
  label?: string
  description?: string
  placeholder?: string
  className?: string
  props?: React.ComponentProps<"div">
}

const TextField = ({
  label,
  description,
  placeholder,
  className,
  prefix,
  suffix,
  inputMode = "text",
  ...props
}: FieldProps & {
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  inputMode?: "text" | "number" | "decimal"
}) => {
  const field = useFieldContext<string>()

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field className={cn("gap-2", className)} {...props}>
      {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
      <InputGroup>
        {prefix && <InputGroupAddon>{prefix}</InputGroupAddon>}
        {suffix && (
          <InputGroupAddon align="inline-end">{suffix}</InputGroupAddon>
        )}
        <InputGroupInput
          id={field.name}
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => {
            const value = sanitizeNumber({
              value: e.target.value,
              inputMode,
            })

            field.handleChange(value)
          }}
          aria-invalid={isInvalid}
          placeholder={placeholder}
        />
      </InputGroup>

      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}

const TextAreaField = ({
  label,
  description,
  placeholder,
  className,
  ...props
}: FieldProps) => {
  const field = useFieldContext<string>()

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field className={cn("gap-2", className)} {...props}>
      {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}

      <Textarea
        id={field.name}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={isInvalid}
        placeholder={placeholder}
        className="min-h-24 resize-none rounded-xl"
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}

const PasswordField = ({
  label,
  description,
  placeholder,
  className,
  ...props
}: FieldProps) => {
  const field = useFieldContext<string>()
  const [show, setShow] = useState(false)
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field className={cn("gap-2", className)} {...props}>
      {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}

      <InputGroup>
        <InputGroupInput
          id={field.name}
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          aria-invalid={isInvalid}
          placeholder={placeholder}
          autoComplete="off"
          type={show ? "text" : "password"}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            tabIndex={-1}
            size="icon-sm"
            className="rounded-2xl"
            type="button"
            onClick={() => setShow(!show)}
          >
            {show ? <EyeOff /> : <Eye />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}

const DateField = ({
  label,
  description,
  placeholder,
  className,
  ...props
}: FieldProps) => {
  const [open, setOpen] = React.useState(false)
  const field = useFieldContext<string>()

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
  return (
    <Field className={cn("gap-2", className)} {...props}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild aria-invalid={isInvalid}>
          <Button
            variant="outline"
            data-empty={!field.state.value}
            className="justify-start text-sm font-normal aria-invalid:ring-0 data-[empty=true]:text-muted-foreground"
          >
            <CalendarIcon />
            {field.state.value || placeholder}
            <ChevronDownIcon className="ml-auto" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            captionLayout="dropdown"
            endMonth={addYears(new Date(), 20)}
            onSelect={(date) => {
              const dateStr = format(date as Date, "yyyy-MM-dd")
              field.handleChange(dateStr)
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>

      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}

const SelectField = ({
  label,
  description,
  placeholder,
  className,
  options,
  disabled = false,
}: FieldProps & {
  options: { label: string; value: string }[]
  disabled?: boolean
}) => {
  const field = useFieldContext<string>()

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
  return (
    <Field className={cn("gap-2", className)}>
      {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
      <Select
        name={field.name}
        value={field.state.value as string}
        onValueChange={field.handleChange}
        disabled={disabled}
      >
        <SelectTrigger
          className={disabled ? "bg-neutral-200" : ""}
          aria-invalid={isInvalid}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((item, i) => (
              <SelectItem key={item.value + i} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}

const RadioField = ({
  label,
  description,
  className,
  options,
}: FieldProps & { options: Record<string, string | boolean | number>[] }) => {
  const field = useFieldContext<string>()

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
  return (
    <Field className={cn("gap-2", className)}>
      {label && (
        <FieldLegend variant="label" className="m-0">
          {label}
        </FieldLegend>
      )}
      <RadioGroup
        name={field.name}
        value={field.state.value as string}
        onValueChange={field.handleChange}
        className="flex"
      >
        {options.map((opt) => {
          const id = `${field.name}-${opt.value}`
          return (
            <FieldLabel htmlFor={id} key={`field-label-${opt.value}`}>
              <Field orientation="horizontal" className="gap-4">
                <FieldContent>
                  <FieldTitle>{opt.label}</FieldTitle>
                  <FieldDescription>{opt.description}</FieldDescription>
                </FieldContent>

                <RadioGroupItem value={opt.value as string} id={id} />
              </Field>
            </FieldLabel>
          )
        })}
      </RadioGroup>

      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}

const FileField = ({ label, description, className }: FieldProps) => {
  const field = useFieldContext<File>()

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
  return (
    <Field className={className}>
      <FieldLegend variant="label" className="m-0">
        {label}
      </FieldLegend>
      <FieldLabel
        htmlFor={field.name}
        className={`h-11 border border-dashed border-primary bg-primary/20 px-4`}
      >
        {field.state.value ? (
          <>
            <Paperclip className="size-4 shrink-0" />
            <span className="truncate">{field.state.value?.name}</span>
            <Button
              variant="outline"
              type="button"
              size="icon-sm"
              className="ml-auto"
              onClick={(e) => {
                e.preventDefault()
                field.handleChange(undefined as any)
              }}
            >
              <Trash2 />
            </Button>
          </>
        ) : (
          <>
            <Upload className="size-4" /> Upload
          </>
        )}

        <Input
          type="file"
          id={field.name}
          onChange={(e) => {
            field.handleChange(e.target.files?.[0] as File)
          }}
          className="sr-only"
          accept="image/jpeg, image/png, application/pdf"
        />
      </FieldLabel>
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
const PhoneField = ({
  label,
  description,
  placeholder,
  className,
  ...props
}: FieldProps) => {
  const field = useFieldContext<string>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
  const displayValue = formatPhone(field.state.value ?? "")

  return (
    <Field className={cn("gap-2", className)} {...props}>
      {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}

      <InputGroup className="bg-background">
        <InputGroupAddon>
          <Badge
            variant="focus-light"
            className="h-4 rounded-none bg-transparent pl-0 text-sm text-muted-foreground"
          >
            <img src="https://flagsapi.com/US/flat/64.png" width={20} />
            +1
          </Badge>
        </InputGroupAddon>

        <InputGroupInput
          id={field.name}
          name={field.name}
          value={displayValue}
          onBlur={field.handleBlur}
          onChange={(e) => {
            const digits = e.target.value.replace(/\D/g, "").slice(0, 10)
            field.handleChange(digits)
          }}
          aria-invalid={isInvalid}
          type="tel"
          placeholder="123-123-1234"
        />
      </InputGroup>
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}

const CurrencyField = ({
  label,
  description,
  placeholder,
  className,
  ...props
}: FieldProps) => {
  const field = useFieldContext<string>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  const displayValue = formatUSD(field.state.value)

  return (
    <Field className={cn("gap-2", className)} {...props}>
      {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}

      <Input
        id={field.name}
        name={field.name}
        value={displayValue}
        onBlur={field.handleBlur}
        onChange={(e) => {
          field.handleChange(e.target.value)
        }}
        aria-invalid={isInvalid}
        placeholder={placeholder}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}

export {
  TextAreaField,
  TextField,
  DateField,
  SelectField,
  RadioField,
  FileField,
  PhoneField,
  PasswordField,
  CurrencyField,
}
