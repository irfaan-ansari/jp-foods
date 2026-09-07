import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "bnl8ryis1b5ogqgd.public.blob.vercel-storage.com" },
    ],
  },
  transpilePackages: ["@jp/ui", "@jp/db", "@jp/auth", "@jp/utils"],
}

export default nextConfig
