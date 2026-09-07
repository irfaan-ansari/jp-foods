type PluralizeOptions = {
  plural?: string
  case?: "lowercase" | "uppercase" | "capitalize"
}

// pluralize
export function pluralize(
  count: number,
  singular: string | undefined,
  options: PluralizeOptions = {}
) {
  if (!singular) return ""

  let word = count === 1 ? singular : (options.plural ?? getPlural(singular))

  switch (options.case) {
    case "uppercase":
      word = word.toUpperCase()
      break

    case "capitalize":
      word = word.charAt(0).toUpperCase() + word.slice(1)
      break

    case "lowercase":
      word = word.toLowerCase()
      break
  }

  return word
}

// get plural
function getPlural(word: string) {
  if (/(s|x|z|ch|sh)$/i.test(word)) {
    return `${word}es`
  }

  if (/[^aeiou]y$/i.test(word)) {
    return `${word.slice(0, -1)}ies`
  }

  if (/(?:f|fe)$/i.test(word)) {
    return `${word.replace(/fe?$/i, "")}ves`
  }

  return `${word}s`
}

// capitalize
export function capitalize(value: string): string {
  if (!value) return ""

  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
}
