import { withForm } from "@/hooks/use-app-form"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@jp/ui/components/card"
import React from "react"
import { TeamFormValues } from "../team.schema"

export const TeamPreview = withForm({
  defaultValues: {} as TeamFormValues,
  render: function ({ form }) {
    return (
      <div>
        <Card className="sticky bg-secondary/50 lg:top-22" size="sm">
          <CardHeader>
            <CardTitle>Team Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Team Preview</p>
          </CardContent>
        </Card>
      </div>
    )
  },
})
