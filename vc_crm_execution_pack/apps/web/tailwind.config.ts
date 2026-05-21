import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "var(--border)",
        input: "var(--border)",
        ring: "hsl(var(--ring))",
        background: "var(--app-bg)",
        foreground: "var(--text-primary)",
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "var(--danger)",
          foreground: "hsl(var(--destructive-foreground))",
        },
        card: {
          DEFAULT: "var(--surface)",
          foreground: "var(--text-primary)",
        },
        surface: {
          DEFAULT: "var(--surface)",
          muted: "var(--surface-muted)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },
        vc: {
          navy: "var(--navy)",
          blue: "var(--primary)",
          light: "#DBEAFE",
          success: "var(--success)",
          warning: "var(--warning)",
          danger: "var(--danger)",
          info: "var(--info)",
          green: "var(--success)",
          text: "var(--text-primary)",
          muted: "var(--text-secondary)",
          bg: "var(--app-bg)",
          card: "var(--surface)",
          border: "var(--border)",
          borderStrong: "var(--border-strong)",
        },
      },
      borderRadius: {
        card: "var(--radius-card)",
        control: "var(--radius-control)",
        lg: "var(--radius-control)",
        md: "calc(var(--radius-control) - 2px)",
        sm: "var(--radius-small)",
      },
      boxShadow: {
        flat: "var(--shadow-flat)",
        card: "var(--shadow-card)",
        floating: "var(--shadow-floating)",
        modal: "var(--shadow-modal)",
        soft: "var(--shadow-card)",
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
