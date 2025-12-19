const tsParser = require("@typescript-eslint/parser");
const tsPlugin = require("@typescript-eslint/eslint-plugin");
const tseslint = require("typescript-eslint");
const stylisticTs = require("@stylistic/eslint-plugin-ts");


module.exports = [
    {
        files: ["**/*.ts"],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                tsconfigRootDir: __dirname,
                project: ["./tsconfig.json"],
                sourceType: "module",
            },
        },
        plugins: {
            "@typescript-eslint": tsPlugin,
            "@stylistic/ts": stylisticTs,
        },
        rules: {
            // Correctness
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": [
                "warn",
                { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
            ],

            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-non-null-assertion": "warn",
            "@typescript-eslint/no-inferrable-types": "warn",

            "@typescript-eslint/consistent-type-imports": [
                "warn",
                { prefer: "type-imports" },
            ],

            // Robustness / smells
            eqeqeq: ["warn", "always"],
            "no-constant-condition": "warn",
            "no-implicit-coercion": "warn",

            "no-shadow": "off",
            "@typescript-eslint/no-shadow": "warn",

            // Maintainability
            // "no-console": "warn",
            "no-debugger": "warn",
            "prefer-const": "warn",
            "no-var": "error",

            // Style (light)
            curly: ["warn", "all"],
            "brace-style": ["warn", "1tbs"],
            "comma-dangle": ["warn", "always-multiline"],
            "comma-spacing": ["warn", { before: false, after: true }],
            // Async hygiene
            "@typescript-eslint/no-floating-promises": "warn",
            "@typescript-eslint/await-thenable": "warn",
            // format
            "no-multiple-empty-lines": ["warn", { max: 1, maxEOF: 0, maxBOF: 0 }],
            "no-trailing-spaces": "warn",
            "no-mixed-spaces-and-tabs": "warn",
            "no-multi-spaces": "warn",
            "space-in-parens": ["warn", "never"],
            "space-infix-ops": "warn",
            "lines-between-class-members": ["warn", "always", { exceptAfterSingleLine: true }],
            "@stylistic/ts/type-annotation-spacing": ["warn", { before: false, after: true }],
            "no-unused-expressions": "warn",
            "no-restricted-syntax": [
                "warn",
                {
                    selector: "Program > ExpressionStatement",
                    message: "Avoid executable top-level code"
                }
            ],
            // "@typescript-eslint/type-annotation-spacing": ["warn", {
            //     before: false,
            //     after: true
            // }],
            //"@typescript-eslint/type-annotation-spacing": "warn",
        },
    },
];