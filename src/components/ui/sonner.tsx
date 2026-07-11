"use client";

import { Toaster as Sonner, ToasterProps } from "sonner";

export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      theme="dark"
      position="bottom-right"
      className="font-sans"
      toastOptions={{
        classNames: {
          toast:
            "!bg-card !border-border !text-foreground !rounded-lg !shadow-xl",
          title: "!font-sans !font-medium",
          description: "!text-muted-foreground",
          actionButton: "!bg-primary !text-primary-foreground",
          success: "!border-status-verified/30",
          error: "!border-destructive/30",
        },
      }}
      {...props}
    />
  );
}
