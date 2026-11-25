"use client";

import type { CSSProperties } from "react";
import { CircleCheckIcon, OctagonXIcon } from "lucide-react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

/**
 * Toast container in the Hearthwick style: graphite toasts that stand out
 * on the cream page. The site has a single light theme, so the theme is
 * fixed rather than following the OS setting.
 */
function Toaster(props: ToasterProps) {
  return (
    <Sonner
      theme="light"
      position="bottom-center"
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon aria-hidden="true" className="size-4 text-primary" />
        ),
        error: (
          <OctagonXIcon aria-hidden="true" className="size-4 text-primary" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--secondary)",
          "--normal-text": "var(--secondary-foreground)",
          "--normal-border": "var(--secondary)",
          "--border-radius": "var(--radius)",
        } as CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "font-sans",
          title: "font-semibold",
          description: "text-muted-on-graphite!",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
