/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: ':username.hehhi.me' }],
        destination: '/portfolio/:username/:path*',
      },
    ];
  },
};
module.exports = nextConfig;
