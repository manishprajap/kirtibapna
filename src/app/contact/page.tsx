"use client";

import { FormEvent, useState } from "react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: connect to your email service / CRM (Resend, Nodemailer, Formspree...)
    setSent(true);
  };

  return (
    <div className="container-x py-16">
      <div className="mb-12 text-center">
        <p className="eyebrow">We’d love to hear from you</p>
        <h1 className="mt-3 text-5xl font-semibold">Contact us</h1>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-6 rounded-3xl bg-brand-dark p-9 text-white">
          <h2 className="text-3xl font-semibold">Kriti Bapna</h2>
          <p className="text-sm text-white/70">Designer womenswear</p>
          <ul className="space-y-4 text-sm text-white/80">
            <li><span className="block text-xs uppercase tracking-widest text-accent-light">Address</span>Andheri West, Mumbai – 400053</li>
            <li><span className="block text-xs uppercase tracking-widest text-accent-light">Phone / WhatsApp</span>+91 95944 94123</li>
            <li><span className="block text-xs uppercase tracking-widest text-accent-light">Email</span>info@kritibapna.com</li>
          </ul>
        </div>

        {sent ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-blush bg-white p-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-700">✓</div>
            <h2 className="text-3xl font-semibold">Message sent</h2>
            <p className="mt-2 text-sm text-ink/60">Thank you! We’ll get back to you within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-5 rounded-3xl border border-blush bg-white p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <div><label className="label" htmlFor="n">Name</label><input id="n" required className="input" /></div>
              <div><label className="label" htmlFor="e">Email</label><input id="e" type="email" required className="input" /></div>
            </div>
            <div><label className="label" htmlFor="s">Subject</label><input id="s" className="input" /></div>
            <div><label className="label" htmlFor="m">Message</label><textarea id="m" rows={6} required className="input" /></div>
            <button className="btn-primary">Send message</button>
          </form>
        )}
      </div>
    </div>
  );
}
