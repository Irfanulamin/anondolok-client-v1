/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true, // Important for static HTML compatibility
  images: {
    unoptimized: true, // Needed if using <Image> without next/image loader
  },
  // output: "export", // <- Add this line for static export
  //distDir: "out", // Output directory for cPanel public_html
};

module.exports = nextConfig;
