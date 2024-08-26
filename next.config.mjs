/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@node-rs/argon2"],
  },
  images: {
    // TODO this is deprecated, use patterns instead
    domains: ["nextjs-template-public.s3.us-east-1.amazonaws.com"],
  },
};

export default nextConfig;
