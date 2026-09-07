import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  transpilePackages: ["@jp/ui", "@jp/db", "@jp/auth", "@jp/utils"],
}

export default nextConfig
