/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: [
      "@node-rs/argon2",
      "@aws-sdk/client-s3",
      "@aws-sdk/lib-storage",
      "@aws-sdk/s3-request-presigner",
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nextjs-template-public.s3.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
