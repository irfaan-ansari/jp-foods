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
import {
  Accordion,
  AccordionTrigger,
  AccordionContent,
  AccordionItem,
} from "@jp/ui/components/accordion"

import {
  Calendar,
  CaseRound,
  Letter,
  MapPoint,
  PointOnMap,
  Smartphone,
  SquareAcademicCap,
  User,
  UserId,
} from "@solar-icons/react"
import { CandidateApplicationBadge } from "@/features/crm/candidate/components/candidate-card"

import { formatDate } from "@jp/utils"

import { AlertTriangleIcon, Truck } from "lucide-react"
import { CandidateApplication } from "../candidate.type"
import { CandidateApplicationActions } from "./candidate-actions"
import { FilePreview } from "@/features/shared/components/file-preview"

export const CandidateDetailsClient = ({
  data,
}: {
  data: CandidateApplication
}) => {
  const currentAddress = [
    data.currentAddress?.street,
    data.currentAddress?.city,
    data.currentAddress?.state,
    data.currentAddress?.zip,
  ].join(" ")

  const mailingAddress = [
    data.mailingAddress?.street,
    data.mailingAddress?.city,
    data.mailingAddress?.state,
    data.mailingAddress?.zip,
  ].join(" ")

  const educations = [
    { type: "Collage", ...data.collage },
    { type: "High School", ...data.highSchool },
    ...(data.otherEducations ?? []).map((education) => ({
      type: "Other",
      ...education,
    })),
  ]

  return (
    <div className="grid grid-cols-1 gap-6 @5xl:grid-cols-3">
      <div className="space-y-6 @5xl:col-span-2">
        {/* status */}
        <ApplicationStatusInfo data={data} />
        {/* applicant details */}
        <Card size="sm">
          <CardHeader className="border-b border-dashed">
            <div className="flex items-center gap-2">
              <IconTile variant="elevated">
                <User className="size-5 text-blue-500" />
              </IconTile>
              <div className="grid">
                <CardTitle>
                  {data.firstName} {data.lastName}
                </CardTitle>
                <CardDescription>{data.position}</CardDescription>
              </div>
            </div>
            <CardAction>
              <CandidateApplicationBadge status={data?.status} />
            </CardAction>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <div className="grid gap-1">
              <div className="text-xs text-muted-foreground">
                Applicant Name
              </div>
              <div>{data.applicantName}</div>
            </div>
            <div className="grid gap-1">
              <div className="text-xs text-muted-foreground">DOB</div>
              <div className="flex items-center gap-1">
                <Calendar className="4 shrink-0" /> {data.dob}
              </div>
            </div>
            <div className="grid gap-1">
              <div className="text-xs text-muted-foreground">
                Social Security #
              </div>
              <div>{data.socialSecurity}</div>
            </div>
            <div className="grid gap-1">
              <div className="text-xs text-muted-foreground">Availability</div>
              <div className="flex items-center gap-1">
                <Calendar className="4 shrink-0" /> {data.availableStartDate}
              </div>
            </div>
            <div className="grid place-content-start gap-1">
              <div className="text-xs text-muted-foreground">
                Work Authorization
              </div>
              <div className="uppercase">{data.hasLegalRights}</div>
            </div>
            <div className="grid place-content-start gap-1">
              <div className="text-xs text-muted-foreground">Location</div>
              <div className="flex items-center gap-1">
                <PointOnMap className="4 shrink-0" /> {data.location}
              </div>
            </div>
            <div className="grid gap-2">
              <div className="grid place-content-start gap-1">
                <div className="text-xs text-muted-foreground">
                  Current Address
                </div>
                <div className="flex items-center gap-1">
                  <MapPoint className="4" /> {currentAddress}
                </div>
              </div>
              <div className="grid place-content-start gap-1">
                <div className="text-xs text-muted-foreground">
                  Mailing Address
                </div>
                <div className="flex items-center gap-1">
                  <MapPoint className="4" /> {mailingAddress}
                </div>
              </div>
            </div>
            <div className="grid place-content-start">
              <div className="mb-1 text-xs text-muted-foreground">
                Contact Details
              </div>
              <CopyButton
                prefix={<Smartphone className="4" />}
                value={data.phone}
                className="*:data-[slot=copy-value]:text-foreground"
              />
              <CopyButton
                prefix={<Letter className="4" />}
                value={data.email}
                className="*:data-[slot=copy-value]:text-foreground"
              />
            </div>
          </CardContent>
        </Card>

        {/* employement history */}
        <Card size="sm">
          <CardHeader className="border-b border-dashed">
            <CardTitle>Employement History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Accordion
              type="single"
              defaultValue={data.experience?.[0]?.employerName}
              className="divide-y border-none"
            >
              {data.experience?.map((exp) => (
                <AccordionItem
                  value={exp.employerName}
                  className="**:data-[slot=accordion-content]:px-0 data-open:bg-muted/0"
                >
                  <AccordionContent>
                    <AccordionTrigger className="items-start gap-2 border-none bg-transparent p-0">
                      <IconTile variant="elevated">
                        <CaseRound className="size-4" />
                      </IconTile>
                      <div className="grid flex-1">
                        <div className="font-medium">{exp.employerName}</div>
                        <div className="text-muted-foreground">
                          {exp.position}
                        </div>
                      </div>
                      <div className="grid">
                        <span className="text-xs">
                          {formatDate(exp.fromDate)}-{formatDate(exp.toDate)}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <div className="grid grid-cols-2 gap-3 pt-3 pl-12">
                      <div className="grid gap-1">
                        <div className="text-xs text-muted-foreground">
                          FMCSA Applied
                        </div>
                        <div className="uppercase">{exp.subjectToFmcsa}</div>
                      </div>
                      <div className="grid gap-1">
                        <div className="text-xs text-muted-foreground">
                          Safety-Sensitive (DOT)
                        </div>
                        <div className="uppercase">{exp.safetySensitive}</div>
                      </div>
                      <div className="grid gap-1">
                        <div className="text-xs text-muted-foreground">
                          Salary
                        </div>
                        <div className="uppercase">{exp.salary}</div>
                      </div>
                      <div className="grid gap-1">
                        <div className="text-xs text-muted-foreground">
                          Reason for Leaving
                        </div>
                        <div>{exp.reasonForLeaving}</div>
                      </div>
                      {exp.gap && (
                        <div className="col-span-2 grid gap-1">
                          <div className="text-xs text-muted-foreground">
                            Explain Any Gaps
                          </div>
                          <div>{exp.gap}</div>
                        </div>
                      )}
                      <div className="col-span-2 grid">
                        <div className="mb-1 text-xs text-muted-foreground">
                          Employer Details
                        </div>
                        <CopyButton
                          value={exp.phone}
                          prefix={<Smartphone className="4" />}
                          className="*:data-[slot=copy-value]:text-foreground"
                        />
                        <div className="flex items-center gap-1">
                          <MapPoint className="size-4 shrink-0" />
                          {exp.address}
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* driving experience */}
        {Array.isArray(data.drivingExperiences) &&
          data?.drivingExperiences?.length > 0 && (
            <Card size="sm">
              <CardHeader className="border-b border-dashed">
                <CardTitle>Driving Experience</CardTitle>
              </CardHeader>
              {data.drivingExperiences.map((exp) => (
                <CardContent
                  className="not-last:border-b not-last:pb-4"
                  key={exp.fromDate + exp.toDate}
                >
                  <div className="flex items-start gap-3">
                    <IconTile variant="elevated">
                      <Truck className="size-4" />
                    </IconTile>
                    <div className="grid flex-1">
                      <span className="font-medium">{exp.type}</span>
                      <span className="text-muted-foreground">
                        {exp.category}
                      </span>
                    </div>
                    <div className="grid text-right">
                      <span className="font-medium">
                        {exp.approxMilesTotal} m
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(exp.fromDate)} - {formatDate(exp.toDate)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              ))}
            </Card>
          )}

        {/* licence */}
        <Card size="sm">
          <CardHeader className="border-b border-dashed">
            <CardTitle>License</CardTitle>
          </CardHeader>
          {[data.currentLicense, ...(data.licenses ?? [])].map((lic) => (
            <CardContent className="flex items-start gap-2 not-last:border-b not-last:pb-4">
              <IconTile variant="elevated">
                <UserId className="size-4" />
              </IconTile>
              <div className="grid min-w-0 flex-1">
                <span className="font-medium">#{lic?.licenseNumber}</span>
                <span className="text-muted-foreground">
                  Type/Class: {lic?.licenseType}
                </span>
                <span className="text-muted-foreground">
                  Issuing State: {lic?.state}
                </span>
              </div>
              <div className="grid text-right">
                <span className="font-medium">Expiry</span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(lic?.expiryDate)}
                </span>
              </div>
            </CardContent>
          ))}
        </Card>

        {/* education */}
        <Card size="sm">
          <CardHeader className="border-b border-dashed">
            <CardTitle>Education</CardTitle>
          </CardHeader>
          {educations.map((edu) => (
            <CardContent className="grid gap-3 not-last:border-b not-last:pb-4">
              <div className="flex items-start gap-3">
                <IconTile variant="elevated">
                  <SquareAcademicCap className="size-4" />
                </IconTile>
                <div className="grid min-w-0 flex-1">
                  <div className="flex flex-nowrap items-center gap-2">
                    <span className="font-medium">{edu.institutionName}</span>
                    <span className="text-muted-foreground">({edu.type})</span>
                  </div>
                  <span className="text-muted-foreground">
                    Field: {edu.fieldOfStudy}
                  </span>
                  <span className="text-muted-foreground">
                    Location: {edu.location}
                  </span>
                  <div className="mt-1 grid gap-1">
                    <div className="text-xs text-muted-foreground">Details</div>
                    <div>{edu.details}</div>
                  </div>
                </div>
                <div className="font-medium">{edu.yearCompleted}</div>
              </div>
            </CardContent>
          ))}
        </Card>

        {/* documents */}
        <Card size="sm">
          <CardHeader className="border-b border-dashed">
            <CardTitle>Documents</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {data.documents.map((doc) => (
              <FilePreview
                key={doc.field}
                data={{ label: doc.label, url: doc.url, field: doc.field }}
              />
            ))}
          </CardContent>
        </Card>
      </div>
      <div>
        <div className="sticky top-20 space-y-6">
          <CandidateApplicationActions data={data} />

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

const ApplicationStatusInfo = ({ data }: { data: CandidateApplication }) => {
  if (
    data.status !== "verification_in_progress" &&
    data.status !== "rejected"
  ) {
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
