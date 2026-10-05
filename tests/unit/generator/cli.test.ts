import { describe, expect, it } from "vitest";
import { parseCliArgs } from "../../../src/generator/cli";
import { parseCreateCliArgs } from "../../../src/generator/create-cli";
import { parseDeleteCliArgs } from "../../../src/generator/delete-cli";

describe("CLI argument parser", () => {
    it("should return defaults when no arguments provided", () => {
        const result = parseCliArgs([]);
        expect(result.configPath).toBeUndefined();
        expect(result.force).toBe(false);
    });

    it("should parse -f flag", () => {
        const result = parseCliArgs(["-f"]);
        expect(result.force).toBe(true);
        expect(result.configPath).toBeUndefined();
    });

    it("should parse --f flag", () => {
        const result = parseCliArgs(["--f"]);
        expect(result.force).toBe(true);
        expect(result.configPath).toBeUndefined();
    });

    it("should parse --force flag", () => {
        const result = parseCliArgs(["--force"]);
        expect(result.force).toBe(true);
        expect(result.configPath).toBeUndefined();
    });

    it("should parse --config <path>", () => {
        const result = parseCliArgs(["--config", "custom.config.json"]);
        expect(result.configPath).toBe("custom.config.json");
        expect(result.force).toBe(false);
    });

    it("should parse --config=<path>", () => {
        const result = parseCliArgs(["--config=custom.config.json"]);
        expect(result.configPath).toBe("custom.config.json");
        expect(result.force).toBe(false);
    });

    it("should parse -f and --config together in any order", () => {
        const res1 = parseCliArgs(["-f", "--config", "custom.config.json"]);
        expect(res1.force).toBe(true);
        expect(res1.configPath).toBe("custom.config.json");

        const res2 = parseCliArgs(["--config=custom.config.json", "--force"]);
        expect(res2.force).toBe(true);
        expect(res2.configPath).toBe("custom.config.json");
    });
});

describe("Create and Delete CLI argument parsers", () => {
    it("should parse create cli args", () => {
        expect(parseCreateCliArgs([]).configPath).toBeUndefined();
        expect(parseCreateCliArgs(["--config", "my.json"]).configPath).toBe("my.json");
        expect(parseCreateCliArgs(["--config=my.json"]).configPath).toBe("my.json");
    });

    it("should parse delete cli args", () => {
        expect(parseDeleteCliArgs([]).configPath).toBeUndefined();
        expect(parseDeleteCliArgs(["--config", "my.json"]).configPath).toBe("my.json");
        expect(parseDeleteCliArgs(["--config=my.json"]).configPath).toBe("my.json");
    });
});


