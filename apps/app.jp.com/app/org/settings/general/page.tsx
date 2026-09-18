"use client"

import React from "react"
import { toast } from "sonner"
import { authClient } from "@jp/auth/client"
import { Button } from "@jp/ui/components/button"
import { PageHeader, PageContent } from "@/components/page-content"
import { OrganizationForm } from "@/features/org/components/organization-form"
import { Field, FieldDescription, FieldLabel } from "@jp/ui/components/field"
import { useOrganization } from "@/features/org/organization.data"
import { ErrorState, useConfirm } from "@jp/ui/components/jp"
import { Logout, TrashBinTrash } from "@solar-icons/react"
import { OrgAccess } from "@/features/auth/components/org-permission"

const GeneralPage = () => {
  const { open } = useConfirm()

  const { data, isPending, isError, error } = useOrganization()

  const {
    name = "",
    logo = "",
    phoneNumber = "",
    email = "",
    metadata = {},
  } = data?.data || {}

  const { street = "", city = "", state = "", zip = "" } = metadata

  const handleDelete = () => {
    if (isPending || !data) return
    open({
      variant: "destructive",
      title: "Delete organization?",
      description:
        "This will permanently delete the organization and all associated data. This action cannot be undone. Please proceed with caution.",
      action: {
        action: async () => {
          const { error } = await authClient.organization.delete({
            organizationId: data.data.id,
          })
          if (error) toast.error(error.message)
          else window.location.reload()
        },
      },
    })
  }
  const handleLeave = () => {
    if (isPending || !data) return
    open({
      variant: "warning",
      title: "Leave organization?",
      description:
        "You will lose access to this organization and all of its resources.",
      action: {
        action: async () => {
          const { error } = await authClient.organization.leave({
            organizationId: data.data.id,
          })
          if (error) toast.error(error.message)
          else window.location.reload()
        },
      },
    })
  }

  return (
    <React.Fragment>
      <PageHeader title="General" />
      <PageContent className="mx-auto max-w-5xl space-y-6" loading={isPending}>
        {isError ? (
          <ErrorState title={error.message} description={error.description} />
        ) : (
          <>
            <OrganizationForm
              defaultValues={{
                logo: logo as string,
                name,
                phoneNumber,
                email,
                street,
                city,
                state,
                zip,
              }}
            />

            {/* leave */}

            <div className="overflow-hidden rounded-2xl border border-warning/50">
              <div className="p-6">
                <Field>
                  <FieldLabel className="text-base font-semibold">
                    Leave Organization
                  </FieldLabel>
                  <FieldDescription>
                    You will lose access to this organization and its associated
                    resources. This action cannot be undone.
                  </FieldDescription>
                </Field>
              </div>
              <div className="border-t border-warning/50 bg-warning/10 px-6 py-4 text-right">
                <Button
                  className="bg-warning text-primary-foreground hover:bg-warning/80"
                  variant="destructive"
                  onClick={handleLeave}
                >
                  <Logout /> Leave Organization
                </Button>
              </div>
            </div>

            {/* delete */}
            <div className="overflow-hidden rounded-2xl border border-destructive/50">
              <div className="p-6">
                <Field>
                  <FieldLabel className="text-base font-semibold">
                    Delete Organization
                  </FieldLabel>
                  <FieldDescription>
                    Permanently delete this organization and all associated
                    data. This action cannot be undone. Please proceed with
                    caution.
                  </FieldDescription>
                </Field>
              </div>
              <div className="border-t border-destructive/50 bg-destructive/10 px-6 py-4 text-right">
                <OrgAccess permission={{ organization: ["update"] }}>
                  {(disabled) => (
                    <Button
                      className="bg-destructive text-primary-foreground hover:bg-destructive/80"
                      variant="destructive"
                      onClick={handleDelete}
                      disabled={disabled}
                    >
                      <TrashBinTrash /> Delete Organization
                    </Button>
                  )}
                </OrgAccess>
              </div>
            </div>
          </>
        )}
      </PageContent>
    </React.Fragment>
  )
}

export default GeneralPage
