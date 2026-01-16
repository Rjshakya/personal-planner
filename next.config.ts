import type { NextConfig } from "next";
// @ts-expect-error - next-pwa has no TypeScript types
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  /* config options here */
  // Force webpack for PWA compatibility
  webpack: (config) => config,
};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
})(nextConfig);
