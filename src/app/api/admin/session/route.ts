import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  ADMIN_SESSION_SECONDS_VALUE,
  createAdminSession,
  isAdminConfigured,
  validateAdminCredentials,
  verifyAdminSession,
} from "@/lib/admin-auth";

export async function GET(request: Request) {
  const token = request.headers.get("cookie")?.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${ADMIN_COOKIE}=`))?.slice(ADMIN_COOKIE.length + 1);
  return NextResponse.json({ authenticated: verifyAdminSession(token) });
}

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json({ error: "Admin login is not configured. Set ADMIN_EMAIL, ADMIN_PASSWORD and a 32+ character ADMIN_SESSION_SECRET." }, { status: 503 });
  }

  let credentials: { email?: string; password?: string };
  try {
    credentials = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!validateAdminCredentials(credentials.email ?? "", credentials.password ?? "")) {
    return NextResponse.json({ error: "Email or password is incorrect." }, { status: 401 });
  }

  const response = NextResponse.json({ authenticated: true });
  response.cookies.set(ADMIN_COOKIE, createAdminSession(credentials.email ?? ""), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: ADMIN_SESSION_SECONDS_VALUE,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ authenticated: false });
  response.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 0 });
  return response;
}