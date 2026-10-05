import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  transpilePackages: ["@jp/ui", "@jp/db", "@jp/auth", "@jp/utils"],
  typescript: { ignoreBuildErrors: true },
}

export default nextConfig
