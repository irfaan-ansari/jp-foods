export type PermissionProps = {
  children: (disabled: boolean, isPending?: boolean) => React.ReactNode
  fallback?: React.ReactNode
}
