# Public website

Migrated from `jimenez/app/(web)`. Route files in `app/(pages)` delegate to feature pages. The existing root layout, auth routes, auth components, and auth form helpers are unchanged.

- `features/home`, `about`, `contact`, `legal`: marketing content and pages.
- `features/catalog`: public product preview, approved-token access, pagination, and read-only product queries.
- `features/customer`: customer application, company information form, schemas, submission actions, document validation.
- `features/careers`: positions, driver and general application forms, schemas, submission action.
- `features/site`: public layout components, isolated form context, maps, uploads, notifications, and scoped CSS.

Routes: /, /about, /products, /contact, /apply, /form, /careers, /careers/[position], /privacy-policy, /terms-and-conditions.
Employment agreement and the employment onboarding placeholder are intentionally excluded.

## Local development

Run `pnpm --filter web dev` from the workspace root. Existing auth configuration is still required. Website integrations additionally use:

- `NEXT_PUBLIC_APP_URL`: canonical website origin (also used to validate upload origins).
- `DATABASE_URL`: the current shared database; no schema migration is required by this website migration.
- `BLOB_READ_WRITE_TOKEN`: Vercel Blob uploads, limited to images/PDFs up to 10 MB.
- `OPENAI_API_KEY`: existing business-document validation workflow.
- `RESEND_API_KEY`: submission notifications.
- Optional `WEBSITE_EMAIL_FROM` and `WEBSITE_NOTIFICATION_EMAIL`: sender and review inbox. Defaults retain the legacy addresses.
- Optional `WEBSITE_ORGANIZATION_ID`: restrict the catalog to one organization. Without it, the legacy combined catalog is retained and deduplicated by item code.

Catalog access accepts /products?token=APPROVED_TOKEN and the existing JP_product_access cookie. Only approved, matching invitations grant full pagination. Public responses include product names and images, never prices. The CRM approval action already creates tokens; delivery of approval links remains owned by CRM.

Submissions are validated on the server before saving. Notifications run after the response; a delivery failure does not turn a saved application into a failed submission. /form retains the legacy behavior of recording submitted company information for review.

Uploads and notification delivery require configured external services. Browser verification does not submit real applications or send email.
