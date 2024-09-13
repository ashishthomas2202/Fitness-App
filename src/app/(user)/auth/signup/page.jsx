"use client";
import { useState } from "react";

import { useRouter } from "next/navigation";
import axios from "axios";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // try {
    //   const userCredential = await createUserWithEmailAndPassword(
    //     auth,
    //     email,
    //     password
    //   );
    //   const user = userCredential.user;

    //   // Store user details in Firestore
    //   await setDoc(doc(db, "users", user.uid), {
    //     email: user.email,
    //     createdAt: new Date(),
    //     lastLogin: new Date(),
    //     providerId: user.providerData[0]?.providerId || "email-password",
    //   });

    //   router.push("/"); // Redirect to homepage or dashboard after sign-up
    // } catch (err) {
    //   console.error("Sign-up error:", err.message);
    //   setError("Failed to sign up. Please try again.");
    // } finally {
    //   setLoading(false);
    // }
    try {
      await axios
        .post("/api/auth/signup", {
          email,
          password,
        })
        .then((response) => {
          if (response?.data?.success) {
            console.log("Success", response.data);
          } else {
            console.log("Error", response.data);
          }
        });
      //   const userCredential = await createUserWithEmailAndPassword(
      //     auth,
      //     email,
      //     password
      //   );
      //   const user = userCredential.user;
      //   // Store user details in Firestore
      //   await setDoc(doc(db, "users", user.uid), {
      //     email: user.email,
      //     createdAt: new Date(),
      //     lastLogin: new Date(),
      //     providerId: user.providerData[0]?.providerId || "email-password",
      //   });
      //   router.push("/"); // Redirect to homepage or dashboard after sign-up
    } catch (err) {
      console.error("Sign-up error:", err.message);
      //   console.error("Sign-up error:", err.message);
      //   setError("Failed to sign up. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ color: "black" }}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ color: "black" }}
          />
        </label>
        <br />
        <button type="submit" disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default SignUp;

// "use client";
// import { signIn } from "next-auth/react";

// export default function SignUp() {
//   return (
//     <div>
//       <h1>Sign Up</h1>
//       <button onClick={() => signIn("google")}>Sign Up with Google</button>
//     </div>
//   );
// }
