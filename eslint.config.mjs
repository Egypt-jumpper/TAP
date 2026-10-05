import { defineConfig, globalIgnores } from "eslint/config";
import nextPlugin from "@next/eslint-plugin-next";

const { flatConfig } = nextPlugin;

export default defineConfig([
  flatConfig.coreWebVitals,
  globalIgnores([".next/**", "node_modules/**"])
]);
