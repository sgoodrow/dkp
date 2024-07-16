// NextJS doesn't yet support a typescript config file.
// See: https://github.com/vercel/next.js/pull/63051

// Register configuration middleware.
const middleware = [(c) => c];

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.node/,
      use: "node-loader",
    });

    return config;
  },
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
