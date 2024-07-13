// NextJS doesn't yet support a typescript config file.
// See: https://github.com/vercel/next.js/pull/63051

// Register configuration middleware.
const middleware = [(c) => c];

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
};

module.exports = middleware.reduce((c, m) => m(c), config);
