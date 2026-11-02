"use client";

import { FormEvent, useState } from "react";

export default function NewsletterForm() {
  const [done, setDone] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: send the email to Mailchimp / Brevo / your own API.
    setDone(true);
  };

  if (done) {
    return <p className="mt-8 text-sm font-medium text-brand">Thank you! You’re on the list 💗</p>;
  }

  return (
    <form onSubmit={submit} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
      <input type="email" required placeholder="Your email address" className="input flex-1" aria-label="Email address" />
      <button className="btn-primary">Subscribe</button>
    </form>
  );
}
