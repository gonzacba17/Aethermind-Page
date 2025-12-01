/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/signup',
        destination: 'https://aethermind-agent-os-dashboard-x6zq.vercel.app/',
        permanent: false,
      },
      {
        source: '/register',
        destination: 'https://aethermind-agent-os-dashboard-x6zq.vercel.app/',
        permanent: false,
      },
      {
        source: '/dashboard',
        destination: 'https://aethermind-agent-os-dashboard-x6zq.vercel.app/',
        permanent: false,
      },
    ]
  },
}

export default nextConfig
