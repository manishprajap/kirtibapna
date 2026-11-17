import type { Metadata } from "next";
import ContactSection from "@/components/ContactSection";

export const metadata: Metadata = {
  title: "Contact us",
  description: "Get in touch with Kirti Bapna – Andheri West, Mumbai.",
};

export default function ContactPage() {
  return <ContactSection asPage />;
}
