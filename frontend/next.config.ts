// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      "res.cloudinary.com",
      "lh3.googleusercontent.com",
      "images.unsplash.com",
      "localhost",
    ],
  },
};

export default nextConfig;
