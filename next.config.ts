import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.29.30"],
  experimental: {
    // Lets a project's name carry across from a list into its own page.
    viewTransition: true,
  },
};

export default nextConfig;
