export const ACTIVE_USER_WINDOW = 5 * 60 * 1000

export const isUserActive = (lastSeenAt: Date | string | null | undefined) => {
  if (!lastSeenAt) return false

  return Date.now() - new Date(lastSeenAt).getTime() <= ACTIVE_USER_WINDOW
}
