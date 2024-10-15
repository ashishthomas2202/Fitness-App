import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { getServerSession } from "next-auth";
import { authenticate, authenticatedUser, linkGoogleAuth } from "@/lib/user";

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
          placeholder: "email@flexfit.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          const user = await authenticate(email, password);
          if (user) {
            return user;
          } else {
            throw new Error("Invalid email or password. Please try again.");
          }
        } catch (error) {
          throw new Error(
            error.message || "An unexpected error occurred. Please try again."
          );
        }

        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      async profile(profile) {
        // Extract the necessary user information from the Google profile
        const userData = {
          email: profile.email,
          name: profile.name,
          googleId: profile.sub, // Google's unique ID for the user
          picture: profile.picture,
        };

        // Save user data to the database
        const currentUser = await linkGoogleAuth(userData);

        // return profile;
        return {
          id: profile.sub, // Assigning Google ID to 'id'
          email: profile.email,
          name: profile.name,
          picture: profile.picture,
          ...(currentUser || {}),
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user, trigger }) {
      if (user) {
        token.user = {
          ...user, // Add all user properties to the token
          firstName: user.firstName,
          lastName: user.lastName,
          googleId: user.googleId,
          picture: user.picture,
        };
      }

      if (trigger == "update") {
        const currentUser = await authenticatedUser();
        if (currentUser) {
          const jsonData = currentUser.toJSON();
          token.user = {
            ...jsonData,
          };
        }
        token.expires = new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(); // 30 days from now
      }
      return token;
    },
    async session({ session, token }) {
      // if (token.user) {
      //   session.user = token.user;
      // }

      console.log("token:", token);
      session.user = token?.user;
      session.expires = token?.expires;

      return session;
    },
  },
};

export const getServerAuthSession = () => getServerSession(authOptions);
