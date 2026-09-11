"use client"
import React from "react"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@jp/ui/components/card"
import { CopyButton } from "@jp/ui/components/jp"
import { IconTile } from "@jp/ui/components/icon-tile"
import { Alert, AlertDescription, AlertTitle } from "@jp/ui/components/alert"
import { type CustomerApplication } from "../customer.type"
import {
  Buildings,
  Letter,
  MapPoint,
  Smartphone,
  User,
} from "@solar-icons/react"
import { CustomerApplicationBadge } from "@/features/crm/customer/components/customer-card"
import { FilePreview } from "@/features/shared/components/file-preview"
import { formatDate } from "@jp/utils"
import CustomerApplicationActions from "./customer-actions"
import { AlertTriangleIcon } from "lucide-react"

export const CustomerDetailsClient = ({
  data,
}: {
  data: CustomerApplication
}) => {
  const companyAddress = [
    data.companyStreet,
    data.companyCity,
    data.companyState,
    data.companyZip,
  ].join(" ")
  const officerAddress = [
    data.officerStreet,
    data.officerCity,
    data.officerState,
    data.officerZip,
  ].join(" ")
  return (
    <div className="grid grid-cols-1 gap-6 @5xl:grid-cols-3">
      <div className="space-y-6 @5xl:col-span-2">
        {/* status */}
        <ApplicationStatusInfo data={data} />
        {/* company details */}
        <Card size="sm">
          <CardHeader className="border-b border-dashed">
            <div className="flex items-center gap-2">
              <IconTile variant="elevated">
                <Buildings className="size-5 text-blue-500" />
              </IconTile>
              <div className="grid">
                <CardTitle>{data.companyName}</CardTitle>
                <CardDescription>{data.companyType}</CardDescription>
              </div>
            </div>
            <CardAction>
              <CustomerApplicationBadge status={data?.status} />
            </CardAction>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <div className="grid gap-1">
              <div className="text-xs text-muted-foreground">
                DBA (Doing Business As)
              </div>
              <div>{data.companyDBA}</div>
            </div>
            <div className="grid gap-1">
              <div className="text-xs text-muted-foreground">EIN / TAX ID</div>
              <div>{data.companyEin}</div>
            </div>
            <div className="grid place-content-start gap-1">
              <div className="text-xs text-muted-foreground">Address</div>
              <div className="flex items-center gap-1">
                <MapPoint className="4" /> {companyAddress}
              </div>
            </div>
            <div className="grid">
              <div className="mb-1 text-xs text-muted-foreground">
                Contact Details
              </div>
              <CopyButton
                prefix={<Smartphone className="4" />}
                value={data.companyPhone}
                className="*:data-[slot=copy-value]:text-foreground"
              />
              <CopyButton
                prefix={<Letter className="4" />}
                value={data.companyEmail}
                className="*:data-[slot=copy-value]:text-foreground"
              />
            </div>
          </CardContent>
        </Card>

        {/* primary contact */}
        <Card size="sm">
          <CardHeader className="border-b border-dashed">
            <CardTitle>Primary Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-1">
              <User className="size-4" /> {data.officerFirst}
              {data.officerLast}
              <span className="text-xs text-muted-foreground">
                ({data.officerRole})
              </span>
            </div>
            <div className="flex gap-3">
              <CopyButton
                value={data.officerMobile}
                prefix={<Smartphone className="4" />}
                className="*:data-[slot=copy-value]:text-foreground"
              />
              <CopyButton
                value={data.officerEmail}
                prefix={<Letter className="4" />}
                className="*:data-[slot=copy-value]:text-foreground"
              />
            </div>
            <div className="flex items-center gap-1">
              <MapPoint className="4" /> {officerAddress}
            </div>
          </CardContent>
        </Card>

        {/* operations & billing */}
        <Card size="sm">
          <CardHeader className="border-b border-dashed">
            <CardTitle>Operations & Billing</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <div className="col-span-2 grid">
              <div className="mb-1 text-xs text-muted-foreground">Ordering</div>
              <div className="flex items-center gap-1">
                <User className="4" /> {data.orderingName}
              </div>
              <div className="grid">
                <CopyButton
                  prefix={<Smartphone className="4" />}
                  value={data.orderingPhone ?? ""}
                  className="*:data-[slot=copy-value]:text-foreground"
                />
              </div>
            </div>
            <div className="grid gap-1">
              <div className="text-xs text-muted-foreground">Guarantor</div>
              <div className="flex items-center gap-1">
                <span>{data.guarantorName}</span>
                <span className="text-xs text-muted-foreground">
                  ({data.guarantorRole})
                </span>
              </div>
            </div>
            <div className="grid gap-1">
              <div className="text-xs text-muted-foreground">
                Account Payable
              </div>
              <div>
                <span>{data.accountPayableEmail}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* delivery & prefrences */}
        <Card size="sm">
          <CardHeader className="border-b border-dashed">
            <CardTitle>Delivery Prefrences</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div>
              <span className="text-muted-foreground">Require Lockbox:</span>
              <span className="pl-1 capitalize">{data.lockboxPermission}</span>
            </div>
            {data.deliverySchedule.map((delivery, i) => (
              <div
                key={delivery.window}
                className={`grid gap-2 border-dashed ${i !== 0 ? "not-first:border-t not-first:pt-3" : ""}`}
              >
                <div>
                  {delivery.day} {delivery.window}
                </div>

                <div className="grid">
                  <div className="mb-1 text-muted-foreground">Receiver</div>
                  <div>{delivery.receivingName}</div>
                  <CopyButton
                    prefix={<Smartphone className="4" />}
                    value={delivery.receivingPhone}
                    className="*:data-[slot=copy-value]:text-foreground"
                  />
                </div>
                <div className="grid gap-1">
                  <div className="text-muted-foreground">Instructions</div>
                  <div>{delivery.instructions}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* documents */}
        <Card size="sm">
          <CardHeader className="border-b border-dashed">
            <CardTitle>Documents</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3">
            <FilePreview
              data={{
                label: "Sale Tax/Certificate",
                url: data.certificateUrl ?? "",
              }}
            />
            <FilePreview
              data={{
                label: "Driver's Licence (Front)",
                url: data.dlFrontUrl ?? "",
              }}
            />
            <FilePreview
              data={{
                label: "Driver's Licence (Back)",
                url: data.dlBackUrl ?? "",
              }}
            />
            <FilePreview
              data={{
                label: "Signature",
                url: data.signatureUrl ?? "",
              }}
            />
          </CardContent>
        </Card>
      </div>
      <div>
        <div className="sticky top-20 space-y-6">
          <CustomerApplicationActions data={data} />

          <Card size="sm" className="bg-secondary/40">
            <CardHeader className="border-b border-dashed">
              <CardTitle>Additional Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="grid">
                <div className="mb-1 text-xs text-muted-foreground">
                  Created At
                </div>
                <div>{formatDate(data.createdAt)}</div>
              </div>
              <div className="grid">
                <div className="mb-1 text-xs text-muted-foreground">
                  Updated At
                </div>
                <div>{formatDate(data.updatedAt)}</div>
              </div>
              <div className="grid">
                <div className="mb-1 text-xs text-muted-foreground">
                  IP & User Agent
                </div>
                <div>{data.ipAddress}</div>
                <div>{data.userAgent}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

const ApplicationStatusInfo = ({ data }: { data: CustomerApplication }) => {
  if (data.status !== "rejected" && data.status !== "on_hold") {
    return null
  }

  return (
    <Alert variant={data.status === "rejected" ? "destructive" : "default"}>
      <AlertTriangleIcon />
      <AlertTitle>{data.statusReason}</AlertTitle>

      {data.statusDetails && (
        <AlertDescription>{data.statusDetails}</AlertDescription>
      )}
    </Alert>
  )
}
