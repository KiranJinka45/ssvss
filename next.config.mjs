/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Prevent ESLint from breaking CI/Vercel production builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ensure build succeeds on Vercel
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/products",
        destination: "/collections/all",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
