/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['glezgpnustjohvuvpdbp.supabase.co'],
  },
}

module.exports = nextConfig