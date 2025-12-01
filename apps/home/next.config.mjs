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
        source: '/',
        destination: 'https://aethermind-agent-os-dashboard.vercel.app/',
        permanent: true,
      },
      {
        source: '/signup',
        destination: 'https://aethermind-agent-os-dashboard.vercel.app/',
        permanent: true,
      },
      {
        source: '/register',
        destination: 'https://aethermind-agent-os-dashboard.vercel.app/',
        permanent: true,
      },
      {
        source: '/dashboard',
        destination: 'https://aethermind-agent-os-dashboard.vercel.app/',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
