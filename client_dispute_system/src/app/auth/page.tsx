"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();


  const handleAuth = async () => {
    if (!email || !password) {
      setErrorMessage("Email and password are required.");
      return;
    }
  
    if (isLogin) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
  
      if (error) {
        setErrorMessage(error.message);
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from("users") 
        .select("role")
        .eq("email", email)
        .single();
  
      if (userError || !userData) {
        setErrorMessage("Failed to fetch user role.");
        return;
      }
  
      const userRole = userData.role;

    if (userRole === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
  
      if (error) setErrorMessage(error.message);
      else setErrorMessage("Check your email to verify your account!");
    }
  };
  


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 flex-col">
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{errorMessage}</span>
        </div>
      )}

      <div className="p-8 bg-white shadow-lg rounded-xl w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-900 text-center mb-6">
          {isLogin ? "Welcome Back!" : "Create an Account"}
        </h2>

        <div className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 p-3 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="border border-gray-300 p-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="bg-orange-500 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-orange-600 transition"
            onClick={handleAuth}
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </div>

        <p className="text-sm text-gray-600 text-center mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            className="text-blue-600 font-medium hover:underline ml-1"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
