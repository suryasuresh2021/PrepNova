"use client";

import Link from "next/link";
import { Rocket, Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from "lucide-react";

const footerColumns = [
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Courses", href: "/courses" },
      { label: "Pricing", href: "/#pricing" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/#" },
      { label: "Terms & Conditions", href: "/#" },
    ],
  },
];

const socials = [
  { icon: Facebook, label: "Facebook" },
  { icon: Twitter, label: "Twitter" },
  { icon: Instagram, label: "Instagram" },
  { icon: Linkedin, label: "LinkedIn" },
  { icon: Youtube, label: "YouTube" },
];

const Footer = () => (
  <footer className="bg-slate-950 py-14 text-slate-400">
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <div className="flex items-center gap-2 font-display text-lg font-semibold text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400 text-slate-900">
            <Rocket size={16} aria-hidden="true" />
          </span>
          PrepNova
        </div>
        <p className="font-body mt-4 text-sm leading-relaxed">
          Placement preparation, interview readiness, and competitive exam success — all in one place.
        </p>
        <div className="mt-5 flex gap-3">
          {socials.map(({ icon: Icon, label }) => (
            <a
              key={label}
              href="#"
              aria-label={label}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 transition hover:border-amber-400 hover:text-amber-400"
            >
              <Icon size={16} aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>

      {footerColumns.map((col) => (
        <div key={col.title}>
          <h4 className="font-body text-sm font-semibold text-white">{col.title}</h4>
          <ul className="mt-4 space-y-2">
            {col.links.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="font-body text-sm transition hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div>
        <h4 className="font-body text-sm font-semibold text-white">Contact</h4>
        <ul className="mt-4 space-y-3 font-body text-sm">
          <li className="flex items-start gap-2">
            <Mail size={16} className="mt-0.5 flex-shrink-0" aria-hidden="true" />
            <a href="mailto:prepnova.co.support@gmail.com" className="hover:text-white">
              prepnova.co.support@gmail.com
            </a>
          </li>
          <li className="flex items-start gap-2">
            <Phone size={16} className="mt-0.5 flex-shrink-0" aria-hidden="true" /> +91 00000 00000
          </li>
          <li className="flex items-start gap-2">
            <MapPin size={16} className="mt-0.5 flex-shrink-0" aria-hidden="true" /> Chennai, India
          </li>
        </ul>
      </div>
    </div>
    <div className="mx-auto mt-10 max-w-7xl border-t border-slate-800 px-6 pt-6 font-body text-xs">
      © {new Date().getFullYear()} PrepNova. All rights reserved.
    </div>
  </footer>
);

export default Footer;
