import powerbiVisualsConfigs from "eslint-plugin-powerbi-visuals";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
    powerbiVisualsConfigs.configs.recommended,
    {
        ignores: ["node_modules/**", "dist/**", ".vscode/**", ".tmp/**"],
    },
    {
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            parserOptions: {
                tsconfigRootDir: __dirname,
                project: "./tsconfig.json",
            },
        },
    },
];