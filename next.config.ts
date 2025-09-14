import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
       {
        protocol: "http",          // ✅ MinIO runs on http, not https (unless you set up TLS)
        hostname: "localhost",     // ✅ host
        port: "9000",              // ✅ MinIO port
        pathname: "/**",           // ✅ allow all paths
      },
    ],
     domains: ["localhost"], 
  },
};

export default nextConfig;
