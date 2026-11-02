import { defineConfig } from "tsup";

export default defineConfig({
    entry: [
        "src/index.ts",
        "src/generator/cli.ts",
        "src/generator/create-cli.ts",
        "src/generator/delete-cli.ts",
        "src/generator/update-cli.ts",
        "src/schemas/index.ts",
        "src/generator/barrel.ts",
    ],
    format: ["cjs", "esm"],
    dts: true,
    clean: true,
    target: "node20",
    sourcemap: true,
    shims: true,
});
