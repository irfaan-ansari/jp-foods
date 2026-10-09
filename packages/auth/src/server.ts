import { db } from "@jp/db"
import { waitUntil } from "@jp/utils/functions"
import { env, TRUSTED_ORIGINS } from "@jp/utils/env"
import { betterAuth } from "better-auth"
import { twilioSendOTP, twilioVerifyOTP } from "@jp/notifications"
import { sendEmail } from "@jp/notifications"
import { VerificationOtpEmail } from "@jp/notifications/templates"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import {
  organization as organizationPlugin,
  phoneNumber as phoneNumberPlugin,
  admin as adminPlugin,
  emailOTP,
  multiSession,
} from "better-auth/plugins"

import { userAc, UserRole, userRoles } from "./permissions/user"
import { orgAc, orgRoles } from "./permissions/organization"
import { APIError, createAuthMiddleware } from "better-auth/api"
import { getActiveAccount, getRootDomain } from "./utils"
import { PORTAL_URLS } from "./permissions"

const AVATAR = `https://api.dicebear.com/10.x`

export const auth = betterAuth({
  baseURL: env.NEXT_PUBLIC_API_URL,
  basepath: "/api/auth",
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  logger: {
    disabled: false,
    disableColors: false,
    level: "warn",
    log: (level, message, ...args) => {
      console.info(`[${level}] ${message}`, ...args)
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
      updateEmailWithoutVerification: false,
    },
    additionalFields: {
      defaultOrganizationId: {
        type: "string",
        required: false,
        input: true,
      },
      defaultTeamId: {
        type: "string",
        required: false,
        input: true,
      },
      lastSeenAt: {
        type: "date",
        required: false,
        input: false,
      },
    },
  },
  plugins: [
    multiSession(),
    adminPlugin({
      ac: userAc,
      roles: userRoles,
      bannedUserMessage:
        "Your account has been banned. Contact support for help.",
    }),
    organizationPlugin({
      allowUserToCreateOrganization: async (user) => {
        const allowedRoles = ["superAdmin"]
        return allowedRoles.includes(user.role)
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
            managerName: {
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
      sendOTP: async ({ phoneNumber, code }, ctx) => {
        try {
          await twilioSendOTP({ phoneNumber })
        } catch {
          throw new APIError("BAD_REQUEST", {
            message: "Failed to send OTP, please try again.",
          })
        }
      },
      verifyOTP: async ({ phoneNumber, code }, ctx) => {
        try {
          const result = await twilioVerifyOTP({ phoneNumber, code })
          return result.status === "approved"
        } catch {
          throw new APIError("BAD_REQUEST", {
            message: "Unable to verify OTP, please try again.",
          })
        }
      },
    }),
    emailOTP({
      changeEmail: {
        enabled: true,
      },
      async sendVerificationOTP({ email, otp, type }, ctx) {
        waitUntil(
          sendEmail({
            to: email,
            subject: "Your Jimenez Produce verification code",
            template: VerificationOtpEmail({ otp }),
          })
        )
      },
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
      const paths = [
        "/sign-in",
        "/multi-session/set-active",
        "/phone-number/verify",
      ]
      if (!paths.some((path) => ctx.path.startsWith(path))) return

      const newSession = ctx.context.newSession
      if (!newSession) return
      const returned = ctx.context.returned as Record<string, unknown>

      const role = newSession.user.role ?? ("user" as UserRole)
      const redirectUrl = PORTAL_URLS[role as keyof typeof PORTAL_URLS].url

      return {
        ...returned,
        redirect: true,
        url: redirectUrl,
      }
    }),
  },
  trustedOrigins: TRUSTED_ORIGINS,
  advanced: {
    cookiePrefix: "JP",
    crossSubDomainCookies: {
      enabled: true,
      domain: getRootDomain(env.NEXT_PUBLIC_API_URL),
    },
    defaultCookieAttributes: {
      secure: true,
      sameSite: "none",
      httpOnly: true,
    },
  },
})

export type AuthType = {
  user: typeof auth.$Infer.Session.user
  session: typeof auth.$Infer.Session.session
}
export type DeviceSessions = Awaited<
  ReturnType<typeof auth.api.listDeviceSessions>
>
