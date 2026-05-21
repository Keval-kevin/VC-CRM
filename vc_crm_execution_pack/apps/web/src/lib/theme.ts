export const theme = {
  color: {
    appBg: "#F8FAFC",
    surface: "#FFFFFF",
    surfaceMuted: "#F1F5F9",
    border: "#E5E7EB",
    borderStrong: "#CBD5E1",
    textPrimary: "#0F172A",
    textSecondary: "#64748B",
    textMuted: "#94A3B8",
    primary: "#2563EB",
    primaryHover: "#1D4ED8",
    navy: "#0F2A43",
    success: "#16A34A",
    warning: "#D97706",
    danger: "#DC2626",
    info: "#0284C7",
  },
  radius: {
    card: "18px",
    control: "12px",
    small: "8px",
  },
  shadow: {
    flat: "none",
    card: "0 1px 2px rgb(15 23 42 / 0.04), 0 12px 32px rgb(15 23 42 / 0.06)",
    floating: "0 16px 40px rgb(15 23 42 / 0.12)",
    modal: "0 24px 70px rgb(15 23 42 / 0.18)",
  },
} as const;

export type Theme = typeof theme;

