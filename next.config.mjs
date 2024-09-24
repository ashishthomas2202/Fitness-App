/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        port: "",
      },
    ],
  },
  env: {
    FIRESTORE_USE_REST_TRANSPORT: "true", // This forces Firestore to use REST instead of gRPC
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/auth/callback/custom-google-auth",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          // {
          //   key: "Access-Control-Allow-Origin",
          //   value: "https://www.lisug.org",
          // },
        ],
      },
    ];
  },
};

export default nextConfig;
