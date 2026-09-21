import { MESSAGE_VARIABLES } from "./messaging.const"
import type { MessageRecipientDraft } from "./messaging.type"

export const extractVariables = (message: string) => {
  const matches = message.matchAll(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g)
  return [
    ...new Set(
      [...matches]
        .map((match) => match[1])
        .filter((value): value is string => Boolean(value))
    ),
  ]
}

export const normalizePhoneNumber = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed) return ""
  if (trimmed.startsWith("+")) return `+${trimmed.replace(/\D/g, "")}`

  const digits = trimmed.replace(/\D/g, "")
  if (digits.length === 10) return `+1${digits}`
  if (digits.length > 10) return `+${digits}`
  return digits
}

export const parseManualNumbers = (value = "") => {
  return value
    .split(/[\n,;]+/)
    .map(normalizePhoneNumber)
    .filter(Boolean)
}

export const renderMessage = (
  template: string,
  variables: Record<string, string>
) => {
  return template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, key) => {
    return variables[key] ?? ""
  })
}

export const getRecipientVariables = (
  recipient: MessageRecipientDraft,
  organizationName: string
) => ({
  name: recipient.name,
  teamName: recipient.teamName ?? recipient.name,
  phoneNumber: recipient.phoneNumber,
  organizationName,
})

export const getKnownVariableKeys = () => MESSAGE_VARIABLES.map((v) => v.key)
