/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: [
      "@node-rs/argon2",
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
      {
        protocol: "https",
        hostname: "nextjs-template-public.s3.us-east-1.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
