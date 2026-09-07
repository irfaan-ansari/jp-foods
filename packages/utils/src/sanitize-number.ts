export const sanitizeNumber = ({
  value,
  inputMode,
}: {
  value: string | undefined
  inputMode: string
}) => {
  const stringValue = String(value)
  switch (inputMode) {
    case "number":
      return stringValue.replace(/[^\d-]/g, "")

    case "decimal":
      return stringValue
        .replace(/[^\d.-]/g, "")
        .replace(/(?!^)-/g, "")
        .replace(/(\..*)\./g, "$1")

    default:
      return value as string
  }
}
