"use client";

import { FormEvent, useState } from "react";
import { Reveal } from "./motion";
import { site } from "@/lib/site";

/** Contact block: details card + message form. Used on the home page and on /contact. */
export default function ContactSection({ asPage = false }: { asPage?: boolean }) {
  const [sent, setSent] = useState(false);
  const Heading = asPage ? "h1" : "h2";

  const submit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: connect to your email service / CRM (Resend, Nodemailer, Formspree...)
    setSent(true);
  };

  return (
    <div className="container-x py-16">
      <Reveal className="mb-12 text-center">
        <p className="eyebrow">We’d love to hear from you</p>
        <Heading className="mt-3 text-5xl font-semibold">Contact us</Heading>
      </Reveal>

      <div className="grid items-stretch gap-10 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-6 rounded-3xl bg-surface p-9 text-white ring-1 ring-blush">
          <h2 className="text-3xl font-semibold">{site.name}</h2>
          <p className="text-sm text-white/70">{site.tagline}</p>
          <ul className="space-y-4 text-sm text-white/80">
            <li><span className="block text-xs uppercase tracking-widest text-accent-light">Address</span>{site.address}</li>
            <li><span className="block text-xs uppercase tracking-widest text-accent-light">Phone / WhatsApp</span><a href={site.phoneHref} className="link-u">{site.phone}</a></li>
            <li><span className="block text-xs uppercase tracking-widest text-accent-light">Email</span><a href={`mailto:${site.email}`} className="link-u">{site.email}</a></li>
            <li><span className="block text-xs uppercase tracking-widest text-accent-light">Instagram</span><a href={site.instagramHref} target="_blank" rel="noopener noreferrer" className="link-u">@{site.instagramHandle}</a></li>
          </ul>
        </div>

        <div className="min-w-0">
          {sent ? (
            <div className="flex h-full min-h-[22rem] flex-col items-center justify-center rounded-3xl border border-blush bg-surface p-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-2xl text-emerald-400">✓</div>
              <h2 className="text-3xl font-semibold">Message sent</h2>
              <p className="mt-2 text-sm text-ink/60">Thank you! We’ll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="h-full space-y-5 rounded-3xl border border-blush bg-surface p-8">
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
    </div>
  );
}
