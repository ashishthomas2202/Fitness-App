/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    FIRESTORE_USE_REST_TRANSPORT: "true", // This forces Firestore to use REST instead of gRPC
  },
};

export default nextConfig;
