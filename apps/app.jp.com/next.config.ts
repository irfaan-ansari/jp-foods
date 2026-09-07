import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  transpilePackages: [
    "@jp/ui",
    "@jp/db",
    "@jp/auth",
    "@jp/utils",
    "@jp/twilio",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bnl8ryis1b5ogqgd.public.blob.vercel-storage.com",
      },
    ],
  },
}

export default nextConfig
