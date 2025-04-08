import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["catalog.detmir.st"], // Разрешение на загрузку изображений с этого домена если использую next/image
  },
};

export default nextConfig;
