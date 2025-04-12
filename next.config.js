/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kinvjsogrrsoufdwrgvy.supabase.co',
      },
    ],
  },
};

module.exports = nextConfig;
