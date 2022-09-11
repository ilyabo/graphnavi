/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: true,
  reactStrictMode: false,
  swcMinify: false,
  experimental: {
    esmExternals: "loose",
  },
  images: {
    domains: ["avatars.githubusercontent.com"],
  },
};

const withTM = require("next-transpile-modules")(["@cosmograph/cosmos"]);

module.exports = withTM(nextConfig);
