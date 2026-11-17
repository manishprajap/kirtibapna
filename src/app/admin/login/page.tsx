import { redirect } from "next/navigation";
import { hasAdminSession, isAdminConfigured } from "@/lib/admin-auth";
import AdminLoginForm from "@/components/AdminLoginForm";

export const metadata = { title: "Admin sign in" };

export default function AdminLoginPage() {
  if (hasAdminSession()) redirect("/admin");

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-[420px] rounded-lg border border-[#e9e5e3] bg-white p-7 shadow-sm sm:p-9">
        <div className="mb-8">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#a4164d] text-sm font-semibold text-white">K</span>
          <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#a4164d]">Kriti Bapna</p>
          <h1 className="mt-2 text-2xl font-semibold text-[#2a1a21]">Admin sign in</h1>
          <p className="mt-2 text-sm leading-6 text-[#71676a]">Use your configured admin credentials to manage the store.</p>
        </div>
        {!isAdminConfigured() ? (
          <p className="rounded-md border border-[#e7d9c2] bg-[#fffaf0] p-4 text-sm leading-6 text-[#765b31]">
            Admin access is not configured. Set <code>ADMIN_EMAIL</code>, <code>ADMIN_PASSWORD</code>, and a 32-character <code>ADMIN_SESSION_SECRET</code> in your local environment.
          </p>
        ) : <AdminLoginForm />}
      </div>
    </main>
  );
}