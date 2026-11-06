/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#0F9B8E", deep: "#0B6E66", light: "#2BC4B4", fg: "#FFFFFF" },
        background: "#F7F5EE",
        surface: { DEFAULT: "#FFFFFF", tint: "#E3F3EF" },
        text: { DEFAULT: "#0F1F1D", secondary: "#4B5B58" },
        muted: "#7E8B88",
        border: "#E4E0D5",
        success: { DEFAULT: "#1D9E5F", bg: "#DDF4E6", text: "#146B41" },
        warning: { DEFAULT: "#E39B07", bg: "#FDF0C7", text: "#7A4F00" },
        danger: { DEFAULT: "#E03E3E", bg: "#FDE2E2", text: "#9B1C1C" },
      },
      fontFamily: {
        display: ["BricolageGrotesque_800ExtraBold"],
        "display-bold": ["BricolageGrotesque_700Bold"],
        body: ["PlusJakartaSans_400Regular"],
        caption: ["PlusJakartaSans_500Medium"],
        label: ["PlusJakartaSans_600SemiBold"],
        title: ["PlusJakartaSans_700Bold"],
        "title-bold": ["PlusJakartaSans_800ExtraBold"],
      },
      borderRadius: {
        xs: "11px",
        sm: "14px",
        md: "18px",
        lg: "20px",
        xl: "24px",
        pill: "999px",
      },
    },
  },
  plugins: [],
};
