import { db } from "@jp/db"
import { waitUntil } from "@vercel/functions"
import { betterAuth } from "better-auth"

import { twilioSendOTP, twilioVerifyOTP } from "@jp/twilio"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import {
  organization as organizationPlugin,
  phoneNumber as phoneNumberPlugin,
  admin as adminPlugin,
  emailOTP,
} from "better-auth/plugins"

import { userAc, userRoles } from "./permissions/user"
import { orgAc, orgRoles } from "./permissions/organization"
import { createAuthMiddleware } from "better-auth/api"
import { getActiveAccount } from "./session"

export const auth = betterAuth({
  baseURL: "http://localhost:3001",
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  logger: {
    disabled: false,
    disableColors: false,
    level: "warn",
    log: (level, message, ...args) => {
      console.log(`[${level}] ${message}`, ...args)
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    disableSignUp: true,
  },
  user: {
    changeEmail: {
      enabled: true,
      updateEmailWithoutVerification: true,
    },
  },
  plugins: [
    adminPlugin({
      ac: userAc,
      roles: userRoles,
    }),
    organizationPlugin({
      allowUserToCreateOrganization: async (user) => {
        const allowedRoles = ['admin','superAdmin']
        return allowedRoles.includes(user.role)
      },
       async sendInvitationEmail(data) {
        const inviteLink = `https://example.com/accept-invitation/${data.id}`;
         console.log('send email:', inviteLink)
      },
      ac: orgAc,
      roles: orgRoles,
      teams: {
        enabled: true,
      },
      membershipLimit: 10000,
      schema: {
        organization: {
          additionalFields: {
            phoneNumber: {
              type: "string",
              required: true,
              input: true,
            },
            email: {
              type: "string",
              required: true,
              input: true,
            },
          },
        },
        team: {
          additionalFields: {
            phoneNumber: {
              type: "string",
              required: true,
              input: true,
            },
            email: {
              type: "string",
              required: true,
              input: true,
            },
            logo: {
              type: "string",
              required: false,
              input: true,
            },
            metadata: {
              type: "json",
              required: false,
              input: true,
            },
            status: {
              type: "string",
              required: false,
              input: false,
              defaultValue: "active",
            },
          },
        },
      },
      organizationHooks: {
        beforeCreateInvitation: async ({
          invitation,
          inviter,
          organization,
        }) => {
          const role = inviter.role
          if (role === "customer") {
            invitation.role = "customer"
          }

          return await Promise.resolve()
        },
      },
    }),
    phoneNumberPlugin({
      allowedAttempts: 3,
      sendOTP: ({ phoneNumber, code }, ctx) => {
        waitUntil(twilioSendOTP({ phoneNumber }))
      },
      verifyOTP: async ({ phoneNumber, code }, ctx) => {
        const isValid = await twilioVerifyOTP({ phoneNumber, code })
        return isValid.status === "approved"
      },
    }),
    emailOTP({
      async sendVerificationOTP(data, ctx) {},
    }),
  ],
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          const { teamId, organizationId } = await getActiveAccount(
            session.userId
          )
          console.log("creating session", teamId, organizationId)
          return {
            data: {
              ...session,
              activeOrganizationId: organizationId,
              activeTeamId: teamId,
            },
          }
        },
      },
    },
  },
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path.startsWith("/sign-in")) {
        let redirectUrl = "/dashboard"
        const newSession = ctx.context.newSession
        if (newSession) {
          const role = newSession.user.role
          const returned = ctx.context.returned as Record<string, any>
          return {
            ...returned,
            url: redirectUrl,
          }
        }
      }
    }),
  },
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
  ],
})

export type AuthType = {
  user: typeof auth.$Infer.Session.user | null
  session: typeof auth.$Infer.Session.session | null
}
