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
          // Sign in the user with Firebase Authentication
          const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password
          );
          const user = userCredential.user;

          // Return Firebase user data (uid and email)
          return { uid: user.uid, email: user.email };
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
    // Callback to include the Firebase `uid` in the JWT token
    async jwt({ token, user }) {
      if (user) {
        token.uid = user.uid;  // Add Firebase `uid` to the JWT token
        token.email = user.email;  // Add email
      }
      return token;
    },
    // Callback to include the Firebase `uid` in the session
    async session({ session, token }) {
      if (token) {
        session.user.uid = token.uid;  // Add Firebase `uid` to the session
        session.user.email = token.email;  // Add email
      }
      return session;
    },
  },
};

// Helper function to retrieve the server-side session
export const getServerAuthSession = () => getServerSession(authOptions);
