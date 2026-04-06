import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  basePath: isProd ? "/dronedelivery" : "",
  assetPrefix: isProd ? "/dronedelivery/" : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
