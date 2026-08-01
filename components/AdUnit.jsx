"use client";

import { useEffect } from "react";

const CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

export default function AdUnit({ slot, format = "auto", className = "" }) {
  useEffect(() => {
    if (!CLIENT_ID) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense script hasn't loaded yet or ad blocker present — fail silently
    }
  }, []);

  if (!CLIENT_ID) return null;

  return (
    <div className={`w-full ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
