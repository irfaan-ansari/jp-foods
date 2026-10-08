// Share catalog access between the configured API and public website siblings.
export function getCatalogCookieDomain(apiURL: string, publicURL: string) {
  const apiHost = new URL(apiURL).hostname
  const publicHost = new URL(publicURL).hostname
  if (apiHost === publicHost) return undefined

  const parent = apiHost.split(".").slice(1).join(".")
  if (parent.split(".").length < 2) return undefined

  return publicHost === parent || publicHost.endsWith(`.${parent}`)
    ? parent
    : undefined
}
