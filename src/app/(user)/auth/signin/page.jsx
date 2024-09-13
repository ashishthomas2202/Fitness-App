"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Brand } from "@/components/ui/Brand";

export default function SignUp() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [error, setError] = useState("");

  const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = useState(false);

  // const handleSignIn = async (e) => {
  //   setLoading(true);

  //   const result = await signIn("credentials", {
  //     redirect: false,
  //     email,
  //     password,
  //   });

  //   if (!result.ok) {
  //     setError("Failed to sign in. Please check your email and password.");
  //   } else {
  //     // Redirect or handle successful sign-in

  //     if (searchParams.has("callbackUrl")) {
  //       router.push(searchParams.get("callbackUrl"));
  //     } else {
  //       router.push("/dashboard");
  //     }
  //   }
  //   setLoading(false);
  // };

  const onSubmit = async (data) => {
    const { email, password } = data;

    setLoading(true);
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (!result.ok) {
      setError("Failed to sign in. Please check your email and password.");
    } else {
      // Redirect or handle successful sign-in
      if (searchParams.has("callbackUrl")) {
        router.push(searchParams.get("callbackUrl"));
      } else {
        router.push("/dashboard");
      }
    }
    setLoading(false);
  };

  return (
    <section className="flex h-screen mx-2 justify-center items-center">
      <article className="hidden lg:block lg:flex-1"></article>
      <article className="flex-1 text-center">
        <main className="w-full max-w-screen-md">
          <Brand />
          <h1>Sign In</h1>
          {/* {error && <p>{error}</p>} */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              className="mb-4"
              type="email"
              {...register("email")}
              placeholder="Enter your email"
              required
            />
            <p className="text-red-500">{errors?.email?.message}</p>
            <Input
              className="mb-2"
              type="password"
              {...register("password")}
              placeholder="Enter your password"
              required
            />
            <p className="text-red-500">{errors?.email?.message}</p>

            <p className="text-sm text-right cursor-pointer">
              Forgot password?
            </p>
            <Button
              className="w-full mt-4 py-6 text-lg font-light"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <Button
            className="w-full mt-4 py-6 text-lg font-light"
            variant="outline"
            onClick={() => signIn("google")}
          >
            Sign in with Google
          </Button>
        </main>
      </article>
    </section>
  );
}

// "use client";
// import { useState } from "react";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth, db } from "@/lib/firebaseConfig";
// import { useRouter } from "next/navigation";
// import { doc, updateDoc } from "firebase/firestore";

// const SignIn = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const userCredential = await signInWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );
//       const user = userCredential.user;

//       console.log("userCredential", userCredential);
//       // // Update user lastLogin time in Firestore
//       // await updateDoc(doc(db, "users", user.uid), {
//       //   lastLogin: new Date(),
//       // });

//       router.push("/"); // Redirect to homepage or dashboard after sign-in
//     } catch (err) {
//       console.error("Sign-in error:", err.message);
//       setError("Failed to sign in. Please check your email and password.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <h1>Sign In</h1>
//       {error && <p>{error}</p>}
//       <form onSubmit={handleSubmit}>
//         <label>
//           Email:
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             style={{ color: "black" }}
//           />
//         </label>
//         <br />
//         <label>
//           Password:
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             style={{ color: "black" }}
//           />
//         </label>
//         <br />
//         <button type="submit" disabled={loading}>
//           {loading ? "Signing in..." : "Sign In"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default SignIn;
// // "use client";
// // import { signIn } from "next-auth/react";

// // export default function SignIn() {
// //   return (
// //     <div>
// //       <h1>Sign In</h1>
// //       <button onClick={() => signIn("google")}>Sign in with Google</button>
// //     </div>
// //   );
// // }
