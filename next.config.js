// NextJS doesn't yet support a typescript config file.
// See: https://github.com/vercel/next.js/pull/63051

// Register configuration middleware.
const middleware = [(c) => c];

/** @type {import('next').NextConfig} */
const config = {
  env: {
    VERSION: process.env.npm_package_version,
    NAME: process.env.npm_package_name,
  },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
      },
    ],
  },
};

module.exports = middleware.reduce((c, m) => m(c), config);
