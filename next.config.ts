import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizeCss: true,
  },
  env: {
    EMAIL_USER: "admin@aghaai.com",
    EMAIL_PASS: "xfrq zfmk dugp ixix",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
