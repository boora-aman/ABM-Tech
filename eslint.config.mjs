import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // The Remotion project is separate, with its own dependencies. On the VPS
    // they are never installed, so linting or typechecking it from here fails
    // on its imports and takes the site build down with it.
    "video/**",
  ]),
]);

export default eslintConfig;
