import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  basePath: "/dronedelivery",
  assetPrefix: "/dronedelivery/",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
