"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Brand } from "@/components/Brand";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";
import Link from "next/link";

import {
  EmailAuthProvider,
  fetchSignInMethodsForEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { googleProvider, auth } from "@/lib/firebaseConfig";

export default function SignIn() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [error, setError] = useState("");

  const schema = yup.object().shape({
    email: yup.string().email("Email is invalid").required("Email is required"),
    password: yup.string().required("Password is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = useState(false);

  // const signInWithGoogle = async () => {
  //   try {
  //     // Sign in with Firebase Google Provider
  //     const result = await signInWithPopup(auth, new GoogleAuthProvider());
  //     const user = result.user;
  //     console.log("user", user);

  //     // Get the Firebase ID Token
  //     const idToken = await user.getIdToken();

  //     const callbackUrl = searchParams.get("callbackUrl");
  //     // Use NextAuth's custom Google provider to handle sign-in
  //     const response = await signIn("custom-google-auth", {
  //       // redirect: , // Disable automatic redirect to the homepage
  //       callbackUrl: callbackUrl || "/dashboard", // Pass the callback URL

  //       email: user.email, // Pass user email
  //       idToken, // Pass Firebase ID Token
  //       name: user.displayName, // Pass user display name
  //       picture: user.photoURL, // Pass user profile picture
  //     }).then((response) => {
  //       console.log("response", response);
  //     });
  //     if (response.ok) {
  //       console.log("Signed in successfully:", response);
  //     } else {
  //       console.error("Sign-in failed:", response.error);
  //     }
  //   } catch (error) {
  //     console.error("Firebase sign-in error:", error);
  //   }
  // };

  const signInWithGoogle = async () => {
    try {
      const user = await signInWithPopup(auth, new GoogleAuthProvider());
      const idToken = await user.user.getIdToken();
      const email = user.user.email;

      // Check if there's an existing email/password account
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);

      console.log("signInMethods", signInMethods);
      if (signInMethods.includes(EmailAuthProvider.PROVIDER_ID)) {
        // If an email/password account exists, ask for the password
        const password = window.prompt(
          "Please provide your password to link your account."
        );

        try {
          // Sign in with email and password
          const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
          );

          // Link the Google credential
          const googleCredential = GoogleAuthProvider.credential(idToken);
          await userCredential.user.linkWithCredential(googleCredential);

          console.log("Accounts linked successfully:", userCredential.user);
        } catch (error) {
          console.error("Error linking accounts:", error);
        }
      } else {
        // No existing email/password account, proceed with Google sign-in
        const response = await signIn("custom-google-auth", {
          redirect: false,
          email,
          idToken,
          name: user.user.displayName,
          picture: user.user.photoURL,
        });

        if (response.ok) {
          const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
          router.push(callbackUrl);
        } else {
          console.error("Sign-in failed:", response.error);
        }
      }
    } catch (error) {
      console.error("Firebase sign-in error:", error);
    }
  };

  // const signInWithGoogle = async () => {
  //   try {
  //     // Sign in with Firebase Google Provider
  //     console.log("auth", auth);
  //     // const result = await signInWithPopup(auth, new GoogleAuthProvider());
  //     let googleProvider = new GoogleAuthProvider();
  //     const result = await firebase.auth().signInWithPopup(googleProvider);
  //     console.log("result", result);
  //     const user = result.user;

  //     // Check if the account already exists with email/password provider
  //     const signInMethods = await fetchSignInMethodsForEmail(auth, user.email);
  //     console.log("signInMethods", signInMethods);

  //     // Get the Firebase ID Token
  //     const idToken = await user.getIdToken();

  //     const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"; // Fallback to dashboard if no callback URL is provided

  //     // Use NextAuth's custom Google provider to handle sign-in
  //     const response = await signIn("custom-google-auth", {
  //       redirect: false, // Disable automatic redirect to prevent page reload
  //       email: user.email, // Pass user email
  //       idToken, // Pass Firebase ID Token
  //       name: user.displayName, // Pass user display name
  //       picture: user.photoURL, // Pass user profile picture
  //       callbackUrl, // Set the callback URL
  //     });

  //     if (response?.ok) {
  //       // Redirect to the callbackUrl manually
  //       router.push(callbackUrl);
  //     } else {
  //       console.error("Sign-in failed:", response.error);
  //     }
  //   } catch (error) {
  //     console.error("Firebase sign-in error:", error);
  //   }
  // };

  const onSubmit = async (data) => {
    const { email, password } = data;

    setLoading(true);
    let result;

    try {
      result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (result.error) {
        setError(result.error);
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      setError("Failed to sign in. Please try again.");
    }

    if (result?.ok) {
      if (searchParams.has("callbackUrl")) {
        router.push(searchParams.get("callbackUrl"));
      } else {
        router.push("/dashboard");
      }
    }
    setLoading(false);
  };

  return (
    <section className="flex h-screen min-h-[700px] justify-center items-center">
      <article className="hidden lg:block lg:flex-1 h-full px-6 py-4">
        <div className="rounded-2xl overflow-hidden relative h-full">
          <Image
            className="object-cover object-right-top"
            src="/muscular-bodybuilder-man-doing-exercises-biceps-with-dumbbells-gym.jpg"
            alt="workout image"
            fill
          />
          <div className="absolute bottom-0 ml-4 mb-4">
            <h1 className="text-white text-4xl xl:text-5xl 2xl:text-6xl font-bold mb-2">
              Push Your Limits
            </h1>
            <h1 className="text-white text-4xl xl:text-5xl 2xl:text-6xl font-bold">
              Unlock Your Potential!
            </h1>
          </div>
        </div>
      </article>
      <article className="flex-1 h-full relative">
        <Image
          className="object-cover object-right-top lg:hidden"
          src="/muscular-bodybuilder-man-doing-exercises-biceps-with-dumbbells-gym.jpg"
          alt="workout image"
          fill
        />
        <div className="absolute h-full w-full bg-gradient-to-tl from-blue-900 to-gray-800 blur-xl opacity-50 lg:hidden"></div>
        <div className="absolute h-full w-full flex flex-col justify-evenly items-center z-10 px-2 sm:px-6">
          <header>
            <Brand />
          </header>
          <main className="w-full max-w-lg">
            <h1 className="text-4xl sm:text-5xl font-bold mb-2 text-center text-white lg:text-slate-800 lg:dark:text-white">
              Welcome Back
            </h1>
            <h3 className="text-sm font-light mb-6 text-center text-white lg:text-black lg:dark:text-white">
              Unlock personalized workout plans and achieve your fitness goals!
            </h3>
            {error && (
              <p className="mb-6 text-center text-red-500 font-light">
                {error}
              </p>
            )}
            <form onSubmit={handleSubmit(onSubmit)}>
              <Input
                className="bg-white lg:dark:bg-gray-700 lg:dark:text-white mb-1"
                type="email"
                {...register("email")}
                placeholder="Enter your email"
              />
              <p className="mb-4 text-red-500">{errors?.email?.message}</p>
              <Input
                className="bg-white lg:dark:bg-gray-700 lg:dark:text-white mb-1"
                type="password"
                {...register("password")}
                placeholder="Enter your password"
              />
              <p className="mb-4 text-red-500">{errors?.password?.message}</p>
              <p className="text-sm text-right cursor-pointer text-white lg:text-black dark:text-white">
                Forgot password?
              </p>
              <Button
                variant="primary"
                className="w-full mt-4 py-6 text-lg font-light"
                type="submit"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
            <div className="flex justify-center items-center gap-5 my-5">
              <hr className="flex-1 border-white lg:border-black lg:dark:border-white" />
              <p className="text-white lg:text-slate-500 font-light text-sm">
                Or
              </p>
              <hr className="flex-1 border-white lg:border-black lg:dark:border-white" />
            </div>
            <Button
              className="w-full py-6 text-base font-light dark:bg-white dark:text-black"
              variant="outline"
              onClick={() =>
                signIn("google", {
                  callbackUrl: searchParams.get("callbackUrl") || "/dashboard",
                })
              }
              type="button"
            >
              <span className="mr-2">
                <FcGoogle size={20} />
              </span>
              Sign in with Google
            </Button>
          </main>
          <footer>
            <p className="text-white lg:text-black text-lg font-light lg:dark:text-white">
              Don't have an account?{" "}
              <Link
                href={`/auth/signup${
                  searchParams.has("callbackUrl")
                    ? `?callbackUrl=${searchParams.get("callbackUrl")}`
                    : ""
                }`}
                className="text-violet-500 hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </footer>
        </div>
      </article>
    </section>
  );
}
