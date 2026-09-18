export const triggerNotification = ({
  status,
  statusDetails,
  statusReason,
}: {
  status: string
  statusDetails?: string
  statusReason?: string
}) => {
  switch (status) {
    case "approved":
      // trigger approved email
      return
    case "under_review":
      // trigger under review email
      return
    case "on_hold":
    case "rejected":
      // trigger application update
      return
  }
}
