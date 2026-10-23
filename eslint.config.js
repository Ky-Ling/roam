// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

// Code structure rules: see "Code structure" in .claude/CLAUDE.md.
const esToolkit = (helper) => `Use ${helper} from "@/lib/utils" (es-toolkit).`;

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  },
  {
    rules: {
      // Rule 1: blank line between logic and return
      "padding-line-between-statements": ["error", { blankLine: "always", prev: "*", next: "return" }],
      // Rule 2: arrow components, implicit return when there's no logic
      "react/function-component-definition": [
        "error",
        { namedComponents: "arrow-function", unnamedComponents: "arrow-function" },
      ],
      "arrow-body-style": ["error", "as-needed"],
      // Rule 4: one component per file
      "react/no-multi-comp": "error",
      // Rule 6: es-toolkit instead of hand-written checks, imported through @/lib/utils
      "no-restricted-imports": [
        "error",
        { patterns: [{ group: ["es-toolkit", "es-toolkit/*"], message: 'Import from "@/lib/utils" instead.' }] },
      ],
      "no-restricted-syntax": [
        "error",
        {
          selector: "BinaryExpression[operator=/^[!=]==?$/][right.type='Literal'][right.raw='null']",
          message: esToolkit("isNil / isNull"),
        },
        {
          selector: "BinaryExpression[operator=/^[!=]==?$/][right.type='Identifier'][right.name='undefined']",
          message: esToolkit("isNil / isUndefined"),
        },
        {
          selector: "UnaryExpression[operator='typeof']",
          message: esToolkit("isString / isNumber / isBoolean / isFunction"),
        },
        {
          selector: "CallExpression[callee.object.name='Array'][callee.property.name='isArray']",
          message: esToolkit("isArray"),
        },
        { selector: "BinaryExpression[left.property.name='length'][right.value=0]", message: esToolkit("isEmpty") },
        {
          selector: "CallExpression[callee.property.name='filter'][arguments.0.name='Boolean']",
          message: esToolkit("compact"),
        },
      ],
    },
  },
  {
    // Rule 3: state and effects live in use-<name>.ts hooks, not component files
    files: ["src/app/**/*.tsx", "src/components/**/*.tsx", "src/screens/**/*.tsx"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [{ group: ["es-toolkit", "es-toolkit/*"], message: 'Import from "@/lib/utils" instead.' }],
          paths: [
            {
              name: "react",
              importNames: ["useState", "useEffect", "useLayoutEffect", "useReducer", "useRef"],
              message: "Move state and effects into a use-<name>.ts hook.",
            },
          ],
        },
      ],
    },
  },
  {
    // The utils barrel and the helpers it re-exports are the only es-toolkit importers
    files: ["src/lib/**/*.ts"],
    rules: {
      "no-restricted-imports": "off",
    },
  },
]);
