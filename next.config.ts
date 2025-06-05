import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["utfs.io"], // Permite carregar imagens do UploadThing
  },
};

export default nextConfig;
