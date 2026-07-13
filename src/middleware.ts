import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// প্রোটেক্টেড রুটগুলোর তালিকা
const protectedRoutes = [
  "/dashboard",
  "/manage",
  "/add-property",
  "/admin" // নতুন অ্যাডমিন রুট যুক্ত করা হয়েছে
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // সেশন টোকেন রিড করুন (Better Auth সাধারণত normal বা __Secure- প্রিফিক্স ব্যবহার করতে পারে)
  const sessionToken =
    request.cookies.get("better-auth.session_token") ||
    request.cookies.get("__Secure-better-auth.session_token");

  // যদি ইউজার ইতিমধ্যে লগইন করা থাকে এবং আবার লগইন/রেজিস্টার (/auth) পেইজে যেতে চায়
  if (pathname.startsWith("/auth")) {
    if (sessionToken) {
      // সরাসরি হোম পেইজে রিডাইরেক্ট করুন
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // চেক করুন রুটটি প্রোটেক্টেড কি না
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    if (!sessionToken) {
      // সেশন না থাকলে অথ পেজে রিডাইরেক্ট করুন
      const loginUrl = new URL("/auth", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Matcher কনফিগারেশনে রুটগুলো যুক্ত করা হয়েছে
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/manage/:path*",
    "/add-property/:path*",
    "/admin/:path*", // অ্যাডমিন রুটটি এখানে যুক্ত
    "/auth/:path*"   // অথ রুটটি এখানে যুক্ত করা হয়েছে যাতে লগইন থাকা অবস্থায় আটকানো যায়
  ],
};