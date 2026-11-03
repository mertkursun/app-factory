module.exports = {
  extends: ["expo", "prettier"],
  plugins: ["prettier"],
  ignorePatterns: ["supabase/functions/**"],
  rules: {
    "prettier/prettier": "error",
    "@typescript-eslint/no-redeclare": "off",
    "import/no-unresolved": ["error", { ignore: ["^react-native-url-polyfill"] }],
  },
};
