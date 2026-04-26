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
  ]),
  {
    rules: {
      // Enforce canonical Tailwind classnames (Tailwind CSS v4)
      "no-restricted-syntax": [
        "error",
        {
          selector: "JSXAttribute[value.type='Literal'][value.value=/bg-gradient-to-[a-z]+/]",
          message: "Use canonical Tailwind classnames: replace 'bg-gradient-to-*' with 'bg-linear-to-*'. Example: 'bg-gradient-to-br' → 'bg-linear-to-br'",
        },
        {
          selector: "TSNonNullExpression",
          message: "Avoid using non-null assertion (!). Use proper type guards instead.",
        },
        {
          selector: "AssignmentExpression[left.object.type='Identifier'][left.property.name='env']",
          message: "Avoid direct process.env mutation. Use bracket notation: process.env['KEY']",
        },
      ],
      // Enforce Cosmic Violet color policy - prevent hardcoded colors
      "no-restricted-properties": [
        "error",
        {
          object: "style",
          property: "backgroundColor",
          message: "Avoid inline styles. Use Tailwind classes with semantic color names from Cosmic Violet theme (primary, secondary, accent, surface, foreground, muted)",
        },
        {
          object: "style",
          property: "color",
          message: "Avoid inline styles. Use Tailwind classes with semantic color names from Cosmic Violet theme (primary, secondary, accent, surface, foreground, muted)",
        },
      ],
      // TypeScript best practices
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": ["error", { 
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_"
      }],
      // React best practices
      "react/no-unescaped-entities": "error",
      "react/jsx-no-useless-fragment": "error",
      // Custom rules for color enforcement
      "no-restricted-syntax": [
        "error",
        {
          selector: "JSXAttribute[value.type='Literal'][value.value=/#[0-9a-fA-F]{3,8}/]",
          message: "Avoid hardcoded hex colors. Use semantic color names from Cosmic Violet theme (primary, secondary, accent, surface, foreground, muted) or UI state colors (red, green, yellow, blue)",
        },
        {
          selector: "JSXAttribute[value.type='Literal'][value.value=/rgb\\(|rgba\\(/]",
          message: "Avoid hardcoded rgb/rgba colors. Use semantic color names from Cosmic Violet theme (primary, secondary, accent, surface, foreground, muted) or UI state colors (red, green, yellow, blue)",
        },
        {
          selector: "JSXAttribute[name.name='className'][value.type='Literal'][value.value=/\\b(text-|bg-|border-)(?!primary|secondary|accent|surface|foreground|muted|red|green|yellow|blue)(black|white|red|blue|green|yellow|orange|purple|pink|gray|slate|zinc|neutral|stone)\\b/]",
          message: "Use Cosmic Violet semantic color names only: primary, secondary, accent, surface, foreground, muted. UI state colors (red, green, yellow, blue) allowed for semantic meaning",
        },
      ],
    },
  },
]);

export default eslintConfig;
