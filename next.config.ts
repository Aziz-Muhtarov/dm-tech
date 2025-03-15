import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["skillfactory-task.detmir.team"], // Разрешаем Next.js загружать изображения с этого домена
  },
};

export default nextConfig;
