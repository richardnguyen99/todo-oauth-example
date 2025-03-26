import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // see https://stackoverflow.com/questions/79104738/corb-blocking-google-user-profile-picture
  crossOrigin: "anonymous",
};

export default nextConfig;
