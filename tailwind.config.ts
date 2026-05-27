import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        neon: "0 0 20px rgba(34, 211, 238, 0.45), 0 0 60px rgba(168, 85, 247, 0.25)",
        "neon-soft": "0 0 14px rgba(34, 211, 238, 0.25)",
      },
      colors: {
        cyber: {
          50: "#f0fbff",
          100: "#d8f4ff",
          200: "#aaf0ff",
          300: "#73e6ff",
          400: "#32d5ff",
          500: "#00bcd4",
          600: "#00a3c7",
          700: "#0087a8",
          800: "#006d86",
          900: "#004a58",
          violet: "#a855f7",
          lime: "#a3e635",
          magenta: "#ec4899",
        },
      },
      backgroundImage: {
        "scanlines":
          "linear-gradient(to bottom, rgba(255,255,255,0.06), rgba(255,255,255,0.00) 60%)",
      },
      backdropBlur: {
        xs: "2px",
      },
      borderRadius: {
        "2xl": "1rem",
      },
    },
  },
  plugins: [],
} satisfies Config;
