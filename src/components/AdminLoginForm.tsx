"use client";

import { FormEvent, useState } from "react";

export default function AdminLoginForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.get("email"), password: form.get("password") }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Could not sign in.");
      window.location.assign("/admin");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not sign in.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label htmlFor="admin-email" className="mb-1.5 block text-xs font-medium text-[#51484b]">Email</label>
        <input id="admin-email" name="email" type="email" required autoComplete="username" className="h-11 w-full rounded-md border border-[#ded8d6] px-3 text-sm outline-none focus:border-[#a4164d]" />
      </div>
      <div>
        <label htmlFor="admin-password" className="mb-1.5 block text-xs font-medium text-[#51484b]">Password</label>
        <input id="admin-password" name="password" type="password" required autoComplete="current-password" className="h-11 w-full rounded-md border border-[#ded8d6] px-3 text-sm outline-none focus:border-[#a4164d]" />
      </div>
      {error && <p role="alert" className="rounded-md border border-[#efd4d7] bg-[#fff6f6] p-3 text-sm text-[#9b3038]">{error}</p>}
      <button disabled={loading} className="h-11 w-full rounded-md bg-[#a4164d] px-4 text-sm font-semibold text-white transition hover:bg-[#83103d] disabled:opacity-60">
        {loading ? "Signing in…" : "Sign in to admin"}
      </button>
    </form>
  );
}