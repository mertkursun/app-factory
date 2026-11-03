/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#0F766E", foreground: "#FFFFFF" },
        background: "#FAFAF7",
        surface: { DEFAULT: "#FFFFFF", secondary: "#F0FDFA" },
        text: { DEFAULT: "#1C1917", secondary: "#57534E" },
        muted: "#78716C",
        border: { DEFAULT: "#E7E5E4", strong: "#D6D3D1" },
        success: { DEFAULT: "#16A34A", light: "#DCFCE7", text: "#15803D" },
        warning: { DEFAULT: "#CA8A04", light: "#FEF9C3", text: "#854D0E" },
        danger: { DEFAULT: "#DC2626", light: "#FEE2E2", text: "#991B1B" },
      },
      fontFamily: {
        display: ["PlusJakartaSans_800ExtraBold"],
        title: ["PlusJakartaSans_700Bold"],
        body: ["PlusJakartaSans_400Regular"],
        caption: ["PlusJakartaSans_500Medium"],
        label: ["PlusJakartaSans_600SemiBold"],
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "20px",
        xl: "28px",
      },
    },
  },
  plugins: [],
};
