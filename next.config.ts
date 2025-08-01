/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // Add other existing configurations here
  trailingSlash: true, // Often needed for static exports
  //distDir: "out", // Optional: specify output directory
};

module.exports = nextConfig;
