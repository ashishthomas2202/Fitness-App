import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig"; // Your Firebase configuration
import { getServerSession } from "next-auth";

export const authOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/auth/signin", // Custom sign-in page
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "email@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password
          );
          const user = userCredential.user;

          // Return the full user object (or parts of it)
          return {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || '',  // Optional, add any other fields you want
          };
        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    // JWT callback to store the full user object
    async jwt({ token, user }) {
      if (user) {
        token.user = user;  // Store the full user object in the token
      }
      return token;
    },
    // Session callback to store the full user object in the session
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user;  // Store the full user object in the session
      }
      return session;
    },
  },
};

// Helper function to retrieve the server-side session
export const getServerAuthSession = () => getServerSession(authOptions);
