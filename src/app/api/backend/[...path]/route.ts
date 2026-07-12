import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function proxyRequest(
  req: NextRequest,
  params: Promise<{ path: string[] }>
) {
  const { path: urlPath } = await params;
  const targetPath = urlPath.join("/");
  const url = new URL(req.url);
  const targetUrl = `${BACKEND_URL}/${targetPath}${url.search}`;

  const headers = new Headers();
  const contentType = req.headers.get("content-type");
  if (contentType) {
    headers.set("Content-Type", contentType);
  }

  // সেশন টোকেন সংগ্রহ
  let token = getSessionCookie(req);
  if (!token) {
    const sessionCookie = req.cookies.get("better-auth.session_token") || req.cookies.get("__Secure-better-auth.session_token");
    token = sessionCookie ? sessionCookie.value : null;
  }

  // --- আপডেট: সিগনেচার অংশ বাদ দেওয়া (যদি থাকে) ---
  if (token && token.includes(".")) {
    token = token.split(".")[0];
  }

  // প্রয়োজনে ডিবাগ করার জন্য নিচে লগটি ব্যবহার করুন:
  // console.log("Sending token to backend:", token);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const init: RequestInit = {
    method: req.method,
    headers,
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = await req.text();
  }

  const res = await fetch(targetUrl, init);
  const body = await res.text();

  return new NextResponse(body, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("Content-Type") || "application/json",
    },
  });
}

// এক্সপোর্টসমূহ অপরিবর্তিত রাখা হয়েছে
export async function GET(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(req, context.params);
}

export async function POST(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(req, context.params);
}

export async function PUT(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(req, context.params);
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(req, context.params);
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(req, context.params);
}