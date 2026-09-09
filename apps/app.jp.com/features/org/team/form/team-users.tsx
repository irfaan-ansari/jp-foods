import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@jp/ui/components/card"
import { TeamFormValues } from "../team.schema"
import { withForm } from "@/hooks/use-app-form"

import { Button } from "@jp/ui/components/button"
import { ChevronDown, ImageOff, Plus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@jp/ui/components/avatar"
import { FieldTitle } from "@jp/ui/components/field"

import { Letter, Smartphone, TrashBinMinimalistic } from "@solar-icons/react"
import { UserSelector } from "@/features/user/components/user-selector"
import { CopyButton } from "@jp/ui/components/jp"

export const TeamUsers = withForm({
  defaultValues: {} as TeamFormValues,
  render: function ({ form }) {
    return (
      <Card size="sm">
        <CardHeader>
          <CardTitle className="text-base font-bold">Users</CardTitle>
        </CardHeader>
        <CardContent>
          <form.AppField
            name="users"
            mode="array"
            children={(field) => (
              <div className="space-y-4">
                {field.state.value.length > 0 ? (
                  <div className="space-y-1">
                    {field.state.value.map((item, i) => (
                      <div
                        key={item.id}
                        className="relative w-full rounded-xl py-1"
                      >
                        <div className="flex flex-1 items-start gap-3">
                          <Avatar size="lg">
                            <AvatarImage src={item?.image as string} />
                            <AvatarFallback>
                              <ImageOff className="size-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="grid min-w-0 flex-1 space-y-0 @5xl/page-content:block">
                            <FieldTitle className="mb-1 line-clamp-1">
                              {item.name}
                            </FieldTitle>
                            <CopyButton
                              prefix={<Smartphone className="sm" />}
                              value={item.phoneNumber}
                            />
                            <CopyButton
                              prefix={<Letter className="sm" />}
                              value={item.email}
                            />
                          </div>

                          <Button
                            size="icon-sm"
                            variant="destructive"
                            onClick={() => field.removeValue(i)}
                          >
                            <TrashBinMinimalistic />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-1">
                    <span>No users selected</span>
                    <span className="text-xs text-muted-foreground">
                      Click the button below to add user
                    </span>
                  </div>
                )}

                <UserSelector
                  role="customer"
                  selected={
                    (field.state.value.map((item) => item.id) ?? []) as string[]
                  }
                  setSelectedChange={(selected) => {
                    const index = field.state.value.findIndex(
                      (item) => item.id === selected.id
                    )

                    if (index === -1) {
                      field.pushValue({ ...selected })
                    } else {
                      field.removeValue(index)
                    }
                  }}
                >
                  <Button
                    className="w-full justify-start border-dashed"
                    variant="outline"
                  >
                    <Plus /> Select...
                    <ChevronDown className="ml-auto" />
                  </Button>
                </UserSelector>
              </div>
            )}
          />
        </CardContent>
      </Card>
    )
  },
})
