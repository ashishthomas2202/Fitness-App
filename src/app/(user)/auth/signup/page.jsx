"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Brand } from "@/components/Brand";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import _ from "lodash";
import { Label } from "@/components/ui/Label";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { render } from "@react-email/render";
import SignupEmail from "@/components/emails/signup";

export default function SignUp() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const schema = yup.object().shape({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    email: yup.string().email("Email is invalid").required("Email is required"),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=])[A-Za-z\d!@#$%^&*()_\-+=]{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
      ),
    confirmPassword: yup
      .string()
      .required("Confirm password is required")
      .oneOf([yup.ref("password"), null], "Passwords must match"),
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = useState(false);

  const sendSignUpEmail = async (email, firstName) => {
    console.log("email:::", email);
    console.log();
    return await axios
      .post("/api/email/send-email", {
        to: email,
        from: {
          name: "FlexFit",
          email: process.env.NEXT_PUBLIC_TRANSACTIONAL_EMAIL,
        },
        subject: "Welcome to FlexFit!",
        html: await render(<SignupEmail firstName={firstName} />),
      })
      .catch((error) => {
        console.error("Error sending email:", error);
      });
  };

  const onSubmit = async (data) => {
    const { firstName, lastName, email, password } = data;

    setLoading(true);

    try {
      await axios
        .post("/api/auth/signup", {
          firstName: _.startCase(firstName),
          lastName: _.startCase(lastName),
          email: email.toLowerCase(),
          password,
        })
        .then(async (response) => {
          if (response?.data?.success) {
            sendSignUpEmail(email, _.startCase(firstName));

            let result = await signIn("credentials", {
              redirect: false,
              email,
              password,
            });
            if (result?.ok) {
              if (searchParams.has("callbackUrl")) {
                router.push(searchParams.get("callbackUrl"));
              } else {
                router.push("/dashboard/profile");
              }
            }
          } else {
            console.log("Error", response.data);
            setErrorMessage(response?.data?.message);
          }
        })
        .catch((error) => {
          console.error("Sign-up error:", error);
          if (error?.response?.data?.error?.field) {
            setError("email", {
              type: "manual",
              message: error?.response?.data?.error?.message,
            });
          } else if (error?.response?.data?.message) {
            setErrorMessage(error?.response?.data?.message);
          } else {
            setErrorMessage("Failed to sign up. Please try again.");
          }
        });
    } catch (err) {
      setErrorMessage("Failed to sign up. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex h-screen min-h-[700px] justify-center items-center">
      <article className="flex-1 h-full relative">
        <Image
          className="object-cover object-left-bottom lg:hidden"
          src="/full-shot-woman-climbing-wall.jpg"
          alt="workout image"
          fill
        />
        <div className="absolute h-full w-full  bg-gradient-to-tl from-blue-900 to-gray-800  blur-xl opacity-50 lg:hidden"></div>
        <div className="absolute h-full w-full flex flex-col justify-evenly items-center z-10 px-2 sm:px-6">
          <header className="">
            <Brand />
          </header>
          <main className="w-full max-w-lg">
            <h1 className="text-4xl sm:text-5xl font-bold mb-2 text-center text-white lg:text-slate-800 lg:dark:text-white">
              Lets Get Started
            </h1>
            <h3 className="text-sm font-light mb-6 text-center text-white lg:text-black lg:dark:text-white">
              Discover tailored workouts to power your fitness journey!
            </h3>
            {errorMessage && (
              <p className=" mb-6 text-center text-red-500 font-light">
                {errorMessage}
              </p>
            )}
            {/* {error && <p>{error}</p>} */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <fieldset className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1">
                  <Label className="font-light text-slate-400 dark:text-neutral-700">
                    First Name
                  </Label>
                  <Input
                    className="bg-white lg:dark:bg-neutral-800 lg:dark:text-white mb-1"
                    type="text"
                    {...register("firstName")}
                    placeholder="Enter your First Name"
                  />
                  <p className="mb-4 text-red-500">
                    {errors?.firstName?.message}
                  </p>
                </div>
                <div className="flex-1">
                  <Label className="font-light text-slate-400 dark:text-neutral-700">
                    Last Name
                  </Label>
                  <Input
                    className="bg-white lg:dark:bg-neutral-800
                  lg:dark:text-white mb-1"
                    type="text"
                    {...register("lastName")}
                    placeholder="Enter your Last Name"
                  />
                  <p className="mb-4 text-red-500">
                    {errors?.lastName?.message}
                  </p>
                </div>
              </fieldset>

              <Label className="font-light text-slate-400 dark:text-neutral-700">
                Email
              </Label>
              <Input
                className="bg-white lg:dark:bg-neutral-800 lg:dark:text-white mb-1"
                type="email"
                {...register("email")}
                placeholder="Enter your email"
              />
              <p className="mb-4 text-red-500">{errors?.email?.message}</p>
              <Label className="font-light text-slate-400 dark:text-neutral-700">
                Password
              </Label>
              <div className="relative">
                <Input
                  className="bg-white lg:dark:bg-neutral-800 lg:dark:text-white mb-1"
                  // type="password"
                  type={passwordVisible ? "text" : "password"}
                  {...register("password")}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute right-4 top-4"
                >
                  {passwordVisible ? (
                    <LuEyeOff size={20} />
                  ) : (
                    <LuEye size={20} />
                  )}
                </button>
              </div>
              <p className="mb-4 text-red-500">{errors?.password?.message}</p>

              <Label className="font-light text-slate-400 dark:text-neutral-700">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  className="bg-white lg:dark:bg-neutral-800 lg:dark:text-white mb-1"
                  type={confirmPasswordVisible ? "text" : "password"}
                  {...register("confirmPassword")}
                  placeholder="Enter your password again"
                />
                <button
                  type="button"
                  onClick={() =>
                    setConfirmPasswordVisible(!confirmPasswordVisible)
                  }
                  className="absolute right-4 top-4"
                >
                  {confirmPasswordVisible ? (
                    <LuEyeOff size={20} />
                  ) : (
                    <LuEye size={20} />
                  )}
                </button>
              </div>
              <p className="mb-4 text-red-500">
                {errors?.confirmPassword?.message}
              </p>
              <Button
                variant="primary"
                className="w-full mt-4 py-6 text-lg font-light"
                type="submit"
                disabled={loading}
              >
                {loading ? "Signing up..." : "Sign Up"}
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
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                await signIn("google", {
                  callbackUrl: searchParams.get("callbackUrl") || "/dashboard",
                });
                setLoading(false);
              }}
            >
              <span className="mr-2">
                <FcGoogle size={20} />
              </span>
              Sign up with Google
            </Button>
          </main>
          <footer>
            <p className="text-white lg:text-black text-lg font-light lg:dark:text-white">
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className="text-violet-500 hover:underline"
              >
                Sign In
              </Link>
            </p>
          </footer>
        </div>
      </article>
      <article className="hidden lg:block lg:flex-1 h-full px-6 py-4">
        <div className="rounded-2xl overflow-hidden relative h-full">
          <Image
            className="object-cover object-left-bottom"
            src="/full-shot-woman-climbing-wall.jpg"
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
    </section>
  );
}
