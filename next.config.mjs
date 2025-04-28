/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: ['logo.clearbit.com'],
    },
    experimental: {
      serverActions: true,
    },
  }
  
  export default nextConfig