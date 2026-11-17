import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "kb_admin_session";
const SESSION_SECONDS = 60 * 60 * 12;

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function sessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("ADMIN_SESSION_SECRET must contain at least 32 characters.");
  return secret;
}

export function isAdminConfigured() {
  return Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET?.length && process.env.ADMIN_SESSION_SECRET.length >= 32);
}

export function validateAdminCredentials(email: string, password: string) {
  const expectedEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedEmail || !expectedPassword || !isAdminConfigured()) return false;
  return safeEqual(email.trim().toLowerCase(), expectedEmail) && safeEqual(password, expectedPassword);
}

export function createAdminSession(email: string) {
  const payload = Buffer.from(JSON.stringify({ email: email.trim().toLowerCase(), expiresAt: Date.now() + SESSION_SECONDS * 1000 })).toString("base64url");
  const signature = createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function verifyAdminSession(token?: string) {
  if (!token || !isAdminConfigured()) return false;
  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra) return false;

  try {
    const expected = createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
    if (!safeEqual(signature, expected)) return false;
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { email?: string; expiresAt?: number };
    return session.email === process.env.ADMIN_EMAIL?.trim().toLowerCase() && typeof session.expiresAt === "number" && session.expiresAt > Date.now();
  } catch {
    return false;
  }
}

export function hasAdminSession() {
  return verifyAdminSession(cookies().get(ADMIN_COOKIE)?.value);
}

export const ADMIN_SESSION_SECONDS_VALUE = SESSION_SECONDS;