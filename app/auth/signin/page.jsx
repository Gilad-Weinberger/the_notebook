"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login, signInWithGoogle, user } = useAuth();
  const router = useRouter();

  const checkUserExists = async (userId) => {
    if (!userId) {
      console.error("No user ID provided to checkUserExists");
      return false;
    }

    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      return userDoc.exists();
    } catch (error) {
      console.error("Error checking if user exists:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);

      // Add a slight delay to ensure auth state is updated
      setTimeout(async () => {
        // Try to get the user ID
        const userId = user?.uid || auth.currentUser?.uid;

        if (!userId) {
          console.warn("Could not retrieve user ID after login");
          router.push("/auth/details-form");
          return;
        }

        // Check if user exists in database
        const userExists = await checkUserExists(userId);

        if (userExists) {
          // User exists in database, redirect to subjects
          router.push("/subjects");
        } else {
          // User doesn't exist in database, redirect to details form
          router.push("/auth/details-form");
        }

        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message || "Failed to login");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setGoogleLoading(true);

    try {
      await signInWithGoogle();

      // Add a slight delay to ensure auth state is updated
      setTimeout(async () => {
        // Try to get the user ID
        const userId = user?.uid || auth.currentUser?.uid;

        if (!userId) {
          console.warn("Could not retrieve user ID after Google sign-in");
          router.push("/auth/details-form");
          return;
        }

        // Check if user exists in database
        const userExists = await checkUserExists(userId);

        if (userExists) {
          // User exists in database, redirect to subjects
          router.push("/subjects");
        } else {
          // User doesn't exist in database, redirect to details form
          router.push("/auth/details-form");
        }

        setGoogleLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Google signin error:", error);
      setError(error.message || "Failed to sign in with Google");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" dir="rtl">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">התחברות</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              דואר אלקטרוני
            </label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-right"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              dir="ltr"
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              סיסמה
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-right"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              dir="ltr"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            {loading ? "מתחבר..." : "התחבר"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600 mb-4">או</p>
          <button
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full flex items-center justify-center bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-gray-100 disabled:opacity-50"
          >
            <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {googleLoading ? "מתחבר..." : "התחבר עם גוגל"}
          </button>
        </div>

        <div className="mt-4 text-center">
          <p>
            אין לך חשבון?{" "}
            <Link href="/auth/signup" className="text-blue-600 hover:underline">
              הרשמה
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
