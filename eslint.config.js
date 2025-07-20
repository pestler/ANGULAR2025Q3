import typescript from "@typescript-eslint/eslint-plugin";
import parser from "@typescript-eslint/parser";
import unicorn from "eslint-plugin-unicorn";
import js from "@eslint/js";
import angular from "@angular-eslint/eslint-plugin";
import angularParser from "@angular-eslint/template-parser";
import angularTemplatePlugin from "@angular-eslint/eslint-plugin-template";
import prettier from "eslint-plugin-prettier";
import globals from "globals";

export default [
  js.configs.recommended,

  {
    files: ["**/*.ts"],
    languageOptions: {
      parser,
      parserOptions: {
        project: "./tsconfig.eslint.json",
        sourceType: "module"
      },
      globals: {
        ...globals.browser,
        ngDevMode: "readonly",
        ngI18nClosureMode: "readonly",
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        console: "readonly",
        fetch: "readonly"
      }
    },
    plugins: {
      "@typescript-eslint": typescript,
      unicorn,
      prettier,
      "@angular-eslint": angular
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/explicit-function-return-type": "error",

      "unicorn/prevent-abbreviations": "off",
      "unicorn/no-null": "off",

      "prettier/prettier": "warn",

      "no-console": ["warn", { allow: ["warn", "error"] }],
      eqeqeq: ["error", "always"],

      "@angular-eslint/component-selector": [
        "error",
        { type: "element", prefix: "app", style: "kebab-case" }
      ],
      "@angular-eslint/directive-selector": [
        "error",
        { type: "attribute", prefix: "app", style: "camelCase" }
      ]
    }
  },

  {
    files: ["**/*.html"],
    languageOptions: {
      parser: angularParser
    },
    plugins: {
      "@angular-eslint/template": angularTemplatePlugin
    },
    rules: {
      "@angular-eslint/template/no-negated-async": "error",
      "@angular-eslint/template/banana-in-box": "error"
    }
  },

  {
    ignores: [
      "**/node_modules/**",
      "**/.angular/**",
      "**/dist/**",
      "**/coverage/**",
      "**/zone*.js"
    ]
  }
];
