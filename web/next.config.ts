import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // see https://stackoverflow.com/questions/79104738/corb-blocking-google-user-profile-picture
  crossOrigin: "anonymous",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
