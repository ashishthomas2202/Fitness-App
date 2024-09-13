"use client";
import { signIn } from "next-auth/react";

export default function SignUp() {
  return (
    <div>
      <h1>Sign Up</h1>
      <button onClick={() => signIn("google")}>Sign Up with Google</button>
    </div>
  );
}
