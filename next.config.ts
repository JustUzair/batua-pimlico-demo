import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // 💥 Ignore ALL type errors during build (still visible in editor)
    ignoreBuildErrors: true,
  },
  eslint: {
    // 💥 Ignore linting errors during build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
