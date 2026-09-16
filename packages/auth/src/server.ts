import { db } from "@jp/db"
import { waitUntil } from "@vercel/functions"
import { betterAuth } from "better-auth"
import { twilioSendOTP, twilioVerifyOTP } from "@jp/notifications"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import {
  organization as organizationPlugin,
  phoneNumber as phoneNumberPlugin,
  admin as adminPlugin,
  emailOTP,
} from "better-auth/plugins"

import { userAc, UserRole, userRoles } from "./permissions/user"
import { orgAc, orgRoles } from "./permissions/organization"
import { createAuthMiddleware } from "better-auth/api"
import { getActiveAccount } from "./utils"
import { PORTAL_URLS } from "./permissions"

const AVATAR = `https://api.dicebear.com/10.x`

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  basepath: "/api/auth",
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
        const allowedRoles = ["admin", "superAdmin"]
        return allowedRoles.includes(user.role)
      },
      async sendInvitationEmail(data) {
        const inviteLink = `https://example.com/accept-invitation/${data.id}`
        console.log("send email:", inviteLink)
      },
      organizationHooks: {
        beforeCreateTeam: async ({ team }) => {
          return {
            data: {
              ...team,
              logo: team.logo || `${AVATAR}/initials/svg?seed=${team.name}`,
            },
          }
        },
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
              input: true,
              defaultValue: "active",
            },
          },
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
    user: {
      create: {
        before: async (user, ctx) => {
          return {
            data: {
              ...user,
              image: user.image || `${AVATAR}/glyphs/svg?seed=${user.name}`,
            },
          }
        },
      },
    },
    session: {
      create: {
        before: async (session) => {
          const { teamId, organizationId } = await getActiveAccount(
            session.userId
          )

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
      if (!ctx.path.startsWith("/sign-in")) return

      const newSession = ctx.context.newSession
      if (!newSession) return
      const returned = ctx.context.returned as Record<string, unknown>

      const role = newSession.user.role as UserRole
      const redirectUrl = PORTAL_URLS[role as keyof typeof PORTAL_URLS].url

      return {
        ...returned,
        redirect: true,
        url: redirectUrl,
      }
    }),
  },
  trustedOrigins: (process.env.BETTER_AUTH_ORIGINS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean),
  advanced: {
    cookiePrefix: "JP",
  },
})

export type AuthType = {
  user: typeof auth.$Infer.Session.user | null
  session: typeof auth.$Infer.Session.session | null
}
