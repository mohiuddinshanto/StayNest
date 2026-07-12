'use client';

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Home } from "lucide-react";
import { signIn, signUp } from "@/lib/auth-client";
import toast from "react-hot-toast";

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (mode === "register" && !name.trim()) {
      e.name = "Full name is required";
    }
    if (!email.trim()) {
      e.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      e.email = "Please enter a valid email";
    }
    if (!password) {
      e.password = "Password is required";
    } else if (password.length < 8) {
      e.password = "Password must be at least 8 characters";
    }
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      toast.error("Please fix validation errors");
      return;
    }
    setErrors({});

    if (mode === "login") {
      setLoading(true);
      const toastId = toast.loading("Signing in...");
      try {
        await signIn.email(
          {
            email,
            password,
          },
          {
            onSuccess: () => {
              toast.success("Welcome back to StayNest!", { id: toastId });
              router.push(redirectUrl);
              router.refresh();
            },
            onError: (ctx) => {
              setLoading(false);
              toast.error(ctx.error.message || "Invalid credentials", { id: toastId });
            },
          }
        );
      } catch (err: any) {
        setLoading(false);
        toast.error(err.message || "An unexpected error occurred", { id: toastId });
      }
    } else {
      setLoading(true);
      const toastId = toast.loading("Creating account...");
      try {
        await signUp.email(
          {
            email,
            password,
            name,
          },
          {
            onSuccess: () => {
              toast.success("Account created successfully! Welcome to StayNest.", { id: toastId });
              router.push(redirectUrl);
              router.refresh();
            },
            onError: (ctx) => {
              setLoading(false);
              toast.error(ctx.error.message || "Failed to create account", { id: toastId });
            },
          }
        );
      } catch (err: any) {
        setLoading(false);
        toast.error(err.message || "An unexpected error occurred", { id: toastId });
      }
    }
  };

  const googleLogin = async () => {
    setLoading(true);
    const toastId = toast.loading("Redirecting to Google...");
    try {
      await signIn.social(
        {
          provider: "google",
          callbackURL: window.location.origin + redirectUrl,
        },
        {
          onError: (ctx) => {
            setLoading(false);
            toast.error(ctx.error.message || "Google Sign In failed", { id: toastId });
          },
        }
      );
    } catch (err: any) {
      setLoading(false);
      toast.error(err.message || "An error occurred with Google Sign In", { id: toastId });
    }
  };

  const demoLogin = async () => {
    setEmail("alex@example.com");
    setPassword("demo12345");
    setLoading(true);
    const toastId = toast.loading("Logging in as demo user...");

    const performSignIn = async () => {
      await signIn.email(
        {
          email: "alex@example.com",
          password: "demo12345",
        },
        {
          onSuccess: () => {
            toast.success("Welcome back, Demo User!", { id: toastId });
            router.push(redirectUrl);
            router.refresh();
          },
          onError: async (ctx) => {
            // Try to sign up if credentials fail
            toast.loading("Demo account not found. Registering new demo account...", { id: toastId });
            try {
              await signUp.email(
                {
                  email: "alex@example.com",
                  password: "demo12345",
                  name: "Alex Johnson",
                },
                {
                  onSuccess: () => {
                    toast.success("Demo account registered and logged in!", { id: toastId });
                    router.push(redirectUrl);
                    router.refresh();
                  },
                  onError: (signUpCtx) => {
                    setLoading(false);
                    toast.error(signUpCtx.error.message || "Failed to register demo account", { id: toastId });
                  }
                }
              );
            } catch (signUpErr: any) {
              setLoading(false);
              toast.error(signUpErr.message || "Failed to register demo account", { id: toastId });
            }
          },
        }
      );
    };

    try {
      await performSignIn();
    } catch (err: any) {
      setLoading(false);
      toast.error(err.message || "Failed to login as demo user", { id: toastId });
    }
  };


  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-20 pb-12 px-4 text-left">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Home size={26} className="text-white" />
          </div>
          <h1
            className="text-3xl font-extrabold text-slate-800"
            style={{ fontFamily: "var(--font-heading), Plus Jakarta Sans, sans-serif" }}
          >
            {mode === "login" ? "Welcome Back" : "Join StayNest"}
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
            {mode === "login"
              ? "Sign in to access your account"
              : "Create your account to get started"}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {/* Mode Toggle */}
          <div className="flex bg-slate-50 rounded-xl p-1 mb-6">
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  setErrors({});
                }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all border-none cursor-pointer ${
                  mode === m
                    ? "bg-white shadow-sm text-slate-800"
                    : "text-slate-500 hover:text-slate-700 bg-transparent"
                }`}
              >
                {m === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          {/* Google Login */}
          <button
            onClick={googleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 border-2 border-gray-200 rounded-xl text-slate-600 font-medium text-sm hover:border-gray-300 hover:bg-slate-50 bg-white transition-colors mb-4 cursor-pointer disabled:opacity-60"
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path
                fill="#FFC107"
                d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.1 6.7 29.4 4.5 24 4.5 12.7 4.5 3.5 13.7 3.5 25S12.7 45.5 24 45.5 44.5 36.3 44.5 25c0-1.7-.2-3.3-.9-4.9z"
              />
              <path
                fill="#FF3D00"
                d="M6.3 15.5l6.6 4.8C14.7 16.6 19 13.5 24 13.5c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.1 6.7 29.4 4.5 24 4.5c-7.7 0-14.3 4.4-17.7 11z"
              />
              <path
                fill="#4CAF50"
                d="M24 45.5c5.3 0 10-2.1 13.5-5.4l-6.2-5.3C29.3 36.5 26.8 37.5 24 37.5c-5.2 0-9.6-3.2-11.4-7.9l-6.6 5.1C9.7 41.1 16.3 45.5 24 45.5z"
              />
              <path
                fill="#1976D2"
                d="M43.6 20.1H42V20H24v8h11.3c-.9 2.4-2.4 4.4-4.4 5.8l6.2 5.3c-.4.4 6.9-5 6.9-14.1 0-1.7-.2-3.3-.9-4.9z"
              />
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 border-t border-gray-100" />
            <span className="text-xs text-slate-400 font-medium">OR</span>
            <div className="flex-1 border-t border-gray-100" />
          </div>

          {/* Form */}
          <div className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="text-sm font-semibold text-slate-600 mb-1.5 block">
                  Full Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Johnson"
                  disabled={loading}
                  className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-colors h-11 ${
                    errors.name
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>
            )}
            <div>
              <label className="text-sm font-semibold text-slate-600 mb-1.5 block">
                Email Address
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="you@example.com"
                disabled={loading}
                className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-colors h-11 ${
                  errors.email
                    ? "border-red-400 bg-red-50"
                    : "border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600 mb-1.5 block">
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Minimum 8 characters"
                disabled={loading}
                className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-colors h-11 ${
                  errors.password
                    ? "border-red-400 bg-red-50"
                    : "border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 border-none cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : null}
              {mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </div>

          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-xs text-amber-700 mb-2 font-semibold">
              Try Demo Account
            </p>
            <button
              onClick={demoLogin}
              disabled={loading}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg text-sm transition-colors border-none cursor-pointer disabled:opacity-60"
            >
              Login as Demo User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center pt-20 bg-slate-50">
          <div className="w-10 h-10 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
        </div>
      }
    >
      <AuthContent />
    </Suspense>
  );
}
