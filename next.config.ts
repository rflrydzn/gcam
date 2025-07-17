import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['rddizon.pythonanywhere.com', 'pythonanywhere.com'],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });
    return config;
  }
  /* config options here */
};

export default nextConfig;
