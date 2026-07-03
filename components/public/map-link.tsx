"use client";

import { useEffect, useState, type ReactNode } from "react";

type MapLinkProps = {
  address: string;
  children: ReactNode;
};

function googleMapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

function appleMapsUrl(address: string) {
  return `http://maps.apple.com/?q=${encodeURIComponent(address)}`;
}

function isAppleDevice() {
  return /iPhone|iPad|iPod|Macintosh|Mac OS X/i.test(navigator.userAgent);
}

export function MapLink({ address, children }: MapLinkProps) {
  const [href, setHref] = useState(() => googleMapsUrl(address));

  useEffect(() => {
    if (isAppleDevice()) {
      setHref(appleMapsUrl(address));
    }
  }, [address]);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group ml-0 flex w-fit max-w-full items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-white"
    >
      {children}
    </a>
  );
}
