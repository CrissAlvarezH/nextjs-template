/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@node-rs/argon2"],
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
