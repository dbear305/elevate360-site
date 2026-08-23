"use client";

import { track } from "@vercel/analytics";
import type { AnchorHTMLAttributes } from "react";

type TrackedLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  eventName: string;
  eventLocation: string;
};

export function TrackedLink({
  eventName,
  eventLocation,
  onClick,
  ...props
}: TrackedLinkProps) {
  return (
    <a
      {...props}
      onClick={(event) => {
        track(eventName, { location: eventLocation });
        onClick?.(event);
      }}
    />
  );
}
