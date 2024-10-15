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
            <h1 className="text-4xl sm:text-5xl font-bold mb-2 text-center text-white lg:text-neutral-800 lg:dark:text-white">
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
                className="bg-white lg:dark:bg-neutral-800 lg:dark:text-white mb-1"
                type="email"
                {...register("email")}
                placeholder="Enter your email"
              />
              <p className="mb-4 text-red-500">{errors?.email?.message}</p>
              <Input
                className="bg-white lg:dark:bg-neutral-800 lg:dark:text-white mb-1"
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
              <p className="text-white lg:text-neutral-500 font-light text-sm">
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
              Don&apos;t have an account?{" "}
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
