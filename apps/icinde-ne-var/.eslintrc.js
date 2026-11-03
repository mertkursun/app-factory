module.exports = {
  extends: ["expo", "prettier"],
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": "error",
    "@typescript-eslint/no-redeclare": "off",
    "import/no-unresolved": ["error", { ignore: ["^react-native-url-polyfill"] }],
  },
};
