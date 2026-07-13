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

  // চেক করুন রুটটি প্রোটেক্টেড কি না
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // অুথ সেশন যাচাই করার লজিক (Better Auth বা অন্য Auth Client)
    const sessionToken = request.cookies.get("better-auth.session_token");

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
    "/admin/:path*" // অ্যাডমিন রুটটি এখানে যুক্ত
  ],
};