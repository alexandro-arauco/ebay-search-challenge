/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.ebayimg.com",
      },
      {
        protocol: "https",
        hostname: "**.ebaystatic.com",
      },
      {
        protocol: "https",
        hostname: "i.ebayimg.com",
      },
    ],
  },
};

module.exports = nextConfig;
