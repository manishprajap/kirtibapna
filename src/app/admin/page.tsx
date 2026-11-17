import AdminOperations from "@/components/AdminOperations";
import { hasAdminSession } from "@/lib/admin-auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin",
};

export default function AdminPage() {
  if (!hasAdminSession()) redirect("/admin/login");
  return <AdminOperations />;
}