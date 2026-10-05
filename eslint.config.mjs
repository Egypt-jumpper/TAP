import { defineConfig, globalIgnores } from "eslint/config";
import { flatConfig } from "@next/eslint-plugin-next";

export default defineConfig([
  flatConfig.coreWebVitals,
  globalIgnores([".next/**", "node_modules/**"])
]);
