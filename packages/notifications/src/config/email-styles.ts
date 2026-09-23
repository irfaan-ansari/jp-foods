import type { TailwindConfig } from "react-email"

export const emailStyles: TailwindConfig = {
  theme: {
    extend: {
      colors: {
        canvas: "#f4f5f2",
        surface: "#ffffff",
        brand: "#365b32",
        "brand-soft": "#d5e8c4",
        text: "#202c24",
        muted: "#556258",
        subtle: "#69756c",
        border: "#e6ece4",
        outline: "#dce5d8",
        footer: "#f8faf7",
        details: "#f7f8f5",
        secondary: "#404040",
        note: "#888888",
      },
      fontFamily: {
        sans: ["Arial", "Helvetica", "sans-serif"],
        inter: ["Inter", "Arial", "sans-serif"],
      },
    },
  },
}
