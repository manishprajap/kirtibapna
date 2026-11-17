/**
 * Business details used across the site.
 * Taken from the old website (kritibapna.com) – edit here and it updates everywhere.
 */
export const site = {
  name: "Kirti Bapna",
  tagline: "Ladies Fashion",
  address: "Andheri West, Mumbai – 400053",
  phone: "+91 95944 94123",
  phoneHref: "tel:+919594494123",
  whatsappHref: "https://wa.me/919594494123",
  email: "info@kritibapna.com",
  instagramHandle: "kriti_bapna_kacholia",
  instagramHref: "https://www.instagram.com/kriti_bapna_kacholia/",
};

/**
 * YouTube video ID for the "How to measure" tab in the size pop-up.
 * Source: https://youtu.be/N6rGsleO0H4
 */
export const measureVideoId: string = "N6rGsleO0H4";

/**
 * "We're available on" section.
 * Add a row for every place customers can find you (Myntra, Ajio, Amazon, Nykaa Fashion,
 * a boutique, etc.) – just copy a line and change the name, handle and link.
 */
export const platforms: { name: string; handle: string; href: string }[] = [
  { name: "Nykaa Fashion", handle: "nykaafashion.com", href: "https://www.nykaafashion.com/" },
  { name: "Pernia's Pop-Up Shop", handle: "perniaspopupshop.com", href: "https://www.perniaspopupshop.com/" },
  { name: "Indya", handle: "indyaa.com", href: "https://www.indyaa.com/" },
  { name: "Aza Fashions", handle: "azafashions.com", href: "https://www.azafashions.com/" },
  { name: "Instagram", handle: `@${site.instagramHandle}`, href: site.instagramHref },
  { name: "WhatsApp", handle: site.phone, href: site.whatsappHref },
  // { name: "Myntra", handle: "Kirti Bapna", href: "https://www.myntra.com/..." },
];