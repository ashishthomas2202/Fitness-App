"use client";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../lib/firebaseConfig";
import { useRouter } from "next/navigation";
import { doc, updateDoc } from "firebase/firestore";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user lastLogin time in Firestore
      await updateDoc(doc(db, "users", user.uid), {
        lastLogin: new Date(),
      });

      router.push("/"); // Redirect to homepage or dashboard after sign-in
    } catch (err) {
      console.error("Sign-in error:", err.message);
      setError("Failed to sign in. Please check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Sign In</h1>
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
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
};

export default SignIn;
