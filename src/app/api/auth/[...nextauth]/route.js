import NextAuth from "next-auth";

import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

// Export a helper function to retrieve server-side session
// export const getServerAuthSession = () => getServerSession(authOptions);

export { handler as GET, handler as POST };

// // This file is used to configure the NextAuth.js library
// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";

// const handler = NextAuth({
//   session: {
//     strategy: "jwt",
//     maxAge: 30 * 24 * 60 * 60, // 30 days
//     updateAge: 24 * 60 * 60, // 24 hours
//   },
//   // callbacks: {
//   //   async jwt({ token, account, user }) {
//   // },
//   pages: {
//     signIn: "/auth/signin",
//   },
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
//   ],
// });

// export { handler as GET, handler as POST };
