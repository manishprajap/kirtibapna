"use client";

import { FormEvent, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { measureVideoId } from "@/lib/site";

const tabs = ["I know my size", "I don’t know my size", "How to measure"] as const;

const fields = [
  "Shoulder", "Top Length", "Bust", "Bottom Length", "Under Bust", "Kurta Length", "Armhole", "Front Neck Depth",
  "Sleeve Length", "Back Neck Length", "Bicep", "Crotch Length", "Elbow", "Thigh Circumference", "Wrist",
  "Knee Circumference", "Waist", "Calf Circumference", "Lower Waist", "Ankle Circumference", "Hip",
];

// Required fields per form.
const requiredKnown = [...fields, "email", "mobile"];
const requiredUnknown = ["name", "email", "phone"];

// Set to false to hide the red * on required fields.
const SHOW_ASTERISK = true;

const REQUIRED_MSG = "Please fill out this field.";
const EMAIL_MSG = "Please enter a valid email address.";

const box = "w-full border border-neutral-400 bg-white px-4 py-3 text-sm text-neutral-900 outline-none placeholder:text-neutral-700 focus:border-black";

type Errors = Record<string, string>;
type Props = { productName: string; onClose: () => void };

/** Input with optional red * and an inline error message below it. */
function Field({
  name,
  placeholder,
  type = "text",
  required = false,
  inputMode,
  error,
  onClear,
}: {
  name: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  inputMode?: "decimal";
  error?: string;
  onClear: (name: string) => void;
}) {
  return (
    <div>
      <div className="relative">
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          inputMode={inputMode}
          aria-required={required}
          aria-invalid={!!error}
          className={`${box} ${required && SHOW_ASTERISK ? "pr-8" : ""}`}
          onChange={() => error && onClear(name)}
        />
        {required && SHOW_ASTERISK && (
          <span aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-base font-semibold text-red-600">
            *
          </span>
        )}
      </div>
      {error && (
        <p role="alert" className="mt-1.5 text-[13px] text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

/** Custom-tailored pop-up: own measurements / "help me choose" request / how-to-measure video. */
export default function SizeGuide({ productName, onClose }: Props) {
  const [tab, setTab] = useState(0);
  const [unit, setUnit] = useState<"in" | "cm">("in");
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const clearError = (name: string) =>
    setErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });

  const submitWith = (required: string[]) => (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: Errors = {};
    for (const name of required) {
      const value = String(data.get(name) ?? "").trim();
      if (!value) next[name] = REQUIRED_MSG;
      else if (name === "email" && !/^\S+@\S+\.\S+$/.test(value)) next[name] = EMAIL_MSG;
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    // TODO: send `Object.fromEntries(data)` + productName to your email service / API.
    void productName;
    setSent(true);
  };

  const hasErrors = Object.keys(errors).length > 0;

  const banner = hasErrors && (
    <div role="alert" className="flex items-center gap-4 bg-[#e0b252] px-6 py-5 text-sm text-white">
      <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9.5" />
        <path d="M12 7v6M12 16.5v.5" />
      </svg>
      One or more fields have an error. Please check and try again.
    </div>
  );

  return createPortal(
    <div role="dialog" aria-modal="true" aria-label="Size guide" className="fixed inset-0 z-[130] overflow-y-auto bg-black/70 p-4" onClick={onClose}>
      <button onClick={onClose} aria-label="Close" className="fixed right-5 top-4 text-3xl leading-none text-white">✕</button>
      <div onClick={(e) => e.stopPropagation()} className="mx-auto my-10 w-full max-w-[800px] bg-white p-7 text-neutral-900 sm:p-[30px]">
        <div role="tablist" className="flex flex-wrap gap-x-1">
          {tabs.map((t, i) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === i}
              onClick={() => { setTab(i); setSent(false); setErrors({}); }}
              className={`-mb-px border border-b-0 px-5 py-4 text-sm uppercase ${tab === i ? "border-black bg-[#f4f4f4]" : "border-transparent"}`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="border border-black bg-[#f4f4f4] p-6">
          {sent ? (
            <div className="py-16 text-center">
              <p className="font-display text-3xl">Thank you!</p>
              <p className="mt-2 text-sm text-neutral-600">We’ve received your details and will get back to you shortly.</p>
            </div>
          ) : tab === 0 ? (
            <form onSubmit={submitWith(requiredKnown)} noValidate className="space-y-5">
              <div className="flex gap-5 text-sm">
                {(["in", "cm"] as const).map((u) => (
                  <label key={u} className="flex items-center gap-1.5">
                    <input type="radio" name="unit" checked={unit === u} onChange={() => setUnit(u)} /> {u === "in" ? "Inches" : "Centimeter"}
                  </label>
                ))}
              </div>
              <p className="text-sm">Tell us your body measurements</p>
              <div className="grid items-start gap-x-8 gap-y-4 sm:grid-cols-2">
                {fields.map((f) => (
                  <Field key={f} name={f} placeholder={f} inputMode="decimal" required error={errors[f]} onClear={clearError} />
                ))}
              </div>
              <p className="text-sm">Your Contact Details</p>
              <div className="grid items-start gap-x-8 gap-y-4 sm:grid-cols-2">
                <Field name="email" type="email" required placeholder="Email ID" error={errors.email} onClear={clearError} />
                <Field name="mobile" type="tel" required placeholder="Mobile Number" error={errors.mobile} onClear={clearError} />
              </div>
              <button className="bg-black px-5 py-3.5 text-sm font-semibold uppercase text-white">Submit</button>
              {banner}
            </form>
          ) : tab === 1 ? (
            <form onSubmit={submitWith(requiredUnknown)} noValidate className="space-y-4">
              <Field name="name" required placeholder="Full Name" error={errors.name} onClear={clearError} />
              <Field name="email" type="email" required placeholder="Email ID" error={errors.email} onClear={clearError} />
              <Field name="phone" type="tel" required placeholder="Phone Number" error={errors.phone} onClear={clearError} />
              <Field name="height" placeholder="Height" onClear={clearError} />
              <textarea name="request" rows={6} placeholder="Any Special Request" className={box} />
              <button className="bg-black px-5 py-3.5 text-sm font-semibold uppercase text-white">Submit</button>
              {banner}
            </form>
          ) : measureVideoId ? (
            <div className="aspect-video w-full">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${measureVideoId}`}
                title="How to measure yourself"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="py-16 text-center text-sm text-neutral-700">
              <p>Measuring video coming soon.</p>
              <a href="https://www.youtube.com/results?search_query=how+to+measure+yourself+while+shopping+online" target="_blank" rel="noopener noreferrer" className="mt-3 inline-block underline">
                Watch a guide on YouTube →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}