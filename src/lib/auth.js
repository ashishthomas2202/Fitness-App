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
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
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
          return { id: user.uid, email: user.email }; // Return user object if successful
        } catch (error) {
          // console.error("Login error:", error);
          // Handle specific Firebase authentication errors
          switch (error.code) {
            case "auth/too-many-requests":
              throw new Error(
                "Too many failed login attempts. Please try again later or reset your password."
              );
            default:
              throw new Error(
                "An unexpected error occurred. Please try again."
              );
          }
          return null; // Return null if login fails
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.id = token.id;
        session.email = token.email;
        console.log("Session:", session, "\ntoken:", token);
      }
      return session;
    },
  },
};

// Export a helper function to retrieve server-side session
export const getServerAuthSession = () => getServerSession(authOptions);
