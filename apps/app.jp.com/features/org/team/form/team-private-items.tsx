import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@jp/ui/components/card"
import { TeamFormValues } from "../team.schema"
import { withForm } from "@/hooks/use-app-form"
import { ProductSelector } from "../../product/components/product-selector"
import { Button } from "@jp/ui/components/button"
import { ChevronDown, ImageOff, Plus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@jp/ui/components/avatar"
import { FieldTitle } from "@jp/ui/components/field"
import { TrashBinMinimalistic } from "@solar-icons/react"

export const TeamPrivateItems = withForm({
  defaultValues: {} as TeamFormValues,
  render: function ({ form }) {
    return (
      <Card size="sm">
        <CardHeader>
          <CardTitle className="text-base font-bold">Private Items</CardTitle>
        </CardHeader>
        <CardContent>
          <form.AppField
            name="privateItems"
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
                          <div className="min-w-0 flex-1 space-y-0">
                            <FieldTitle className="line-clamp-1">
                              {item.title}
                            </FieldTitle>
                            <span className="text-xs text-muted-foreground">
                              {item.itemCode}
                            </span>
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
                    <span>No private items selected</span>
                    <span className="text-xs text-muted-foreground">
                      Click the button below to add private items
                    </span>
                  </div>
                )}

                <ProductSelector
                  status="private"
                  selected={
                    (field.state.value.map((item) => item.id) ?? []) as number[]
                  }
                  setSelectedChange={(selected) => {
                    const index = field.state.value.findIndex(
                      (item) => item.id === selected.id
                    )
                    if (index === -1) {
                      field.pushValue(selected)
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
                </ProductSelector>
              </div>
            )}
          />
        </CardContent>
      </Card>
    )
  },
})
