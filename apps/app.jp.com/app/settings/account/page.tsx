"use client"
import React from "react"
import { TrashBinTrash } from "@solar-icons/react"
import { Button } from "@jp/ui/components/button"
import { PageHeader, PageContent } from "@/components/page-content"
import { Field, FieldDescription, FieldLabel } from "@jp/ui/components/field"
import { authClient } from "@jp/auth/client"
import { ErrorState } from "@jp/ui/components/jp"
import { ProfileForm } from "@/features/profile/forms/profile-form"

const GeneralPage = () => {
  const { data, isPending, error } = authClient.useSession()

  return (
    <React.Fragment>
      <PageHeader title="Profile" />
      <PageContent className="mx-auto max-w-5xl space-y-6" loading={isPending}>
        {error ? (
          <ErrorState title={error.error} description={error.message} />
        ) : (
          <>
            <ProfileForm user={data?.user!} />
            <div className="overflow-hidden rounded-2xl border border-destructive/50">
              <div className="p-6">
                <Field>
                  <FieldLabel className="text-base font-semibold">
                    Delete Account
                  </FieldLabel>
                  <FieldDescription>
                    Permanently delete your workspace, custom domain, and all
                    associated links + their stats. This action cannot be undone
                    - please proceed with caution.
                  </FieldDescription>
                </Field>
              </div>
              <div className="border-t border-destructive/50 bg-destructive/10 px-6 py-4 text-right">
                <Button
                  className="bg-destructive text-primary-foreground hover:bg-destructive/80"
                  variant="destructive"
                >
                  <TrashBinTrash /> Delete
                </Button>
              </div>
            </div>
          </>
        )}
      </PageContent>
    </React.Fragment>
  )
}

export default GeneralPage
