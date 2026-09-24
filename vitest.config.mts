import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        globals: true,
        environment: "node",
        include: ["tests/**/*.test.ts"],
        alias: [
            { find: /.*src\/generator\/extractor(.*)/, replacement: path.resolve(import.meta.dirname, "./src/generator/extractor$1") },
            { find: /.*src\/generator\/php-adapter(.*)/, replacement: path.resolve(import.meta.dirname, "./src/generator/php-adapter$1") },
            { find: /.*src\/webservice-extractor(.*)/, replacement: path.resolve(import.meta.dirname, "./src/generator/extractor$1") },
            { find: /.*src\/php-adapter(.*)/, replacement: path.resolve(import.meta.dirname, "./src/generator/php-adapter$1") },
        ],
        coverage: {
            provider: "v8",
            include: ["src/**/*.ts"],
            reporter: ["text", "lcov"],
        },
    },
});
