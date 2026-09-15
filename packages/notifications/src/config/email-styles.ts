import type { TailwindConfig } from "react-email"

export const emailStyles: TailwindConfig = {
  theme: {
    extend: {
      colors: {
        "email-canvas": "#f3f6f1",
        "email-surface": "#ffffff",
        "email-brand": "#244b31",
        "email-brand-soft": "#d5e8c4",
        "email-text": "#243027",
        "email-muted": "#556258",
        "email-subtle": "#69756c",
        "email-border": "#e6ece4",
        "email-outline": "#dce5d8",
        "email-footer": "#f8faf7",
        "email-details": "#f9fafb",
        "email-secondary": "#404040",
        "email-note": "#888888",
      },
    },
  },
}
