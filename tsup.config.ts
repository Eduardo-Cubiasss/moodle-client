import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts", "src/generator/cli.ts"],
    format: ["cjs", "esm"],
    dts: true,
    clean: true,
    target: "node20",
    sourcemap: true,
    shims: true,
});
