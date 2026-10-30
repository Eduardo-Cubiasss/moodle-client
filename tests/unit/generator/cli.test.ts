import { describe, expect, it, vi } from "vitest";
import { parseCliArgs } from "../../../src/generator/cli";
import { parseCreateCliArgs } from "../../../src/generator/create-cli";
import { parseDeleteCliArgs } from "../../../src/generator/delete-cli";
import { parseUpdateCliArgs } from "../../../src/generator/update-cli";
import { reportProgressError, wasErrorReported } from "../../../src/generator/ui/progress-bar";

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

    it("should parse --force and --namespace together in any order", () => {
        const res1 = parseCliArgs(["--force", "--namespace", "local5"]);
        expect(res1.force).toBe(true);
        expect(res1.namespaces).toEqual(["local5"]);

        const res2 = parseCliArgs(["--namespace", "local5", "--force"]);
        expect(res2.force).toBe(true);
        expect(res2.namespaces).toEqual(["local5"]);

        const res3 = parseCliArgs(["-f", "--namespace=local5"]);
        expect(res3.force).toBe(true);
        expect(res3.namespaces).toEqual(["local5"]);

        const res4 = parseCliArgs(["--namespace", "local5", "-f"]);
        expect(res4.force).toBe(true);
        expect(res4.namespaces).toEqual(["local5"]);
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



describe("One-line (flag) mode parsers", () => {
    it("should collect --namespace for generate, repeated or comma-separated", async () => {
        expect(parseCliArgs(["--namespace", "a"]).namespaces).toEqual(["a"]);
        expect(parseCliArgs(["--namespace=a,b", "--namespace", "c"]).namespaces).toEqual(["a", "b", "c"]);
        expect(parseCliArgs([]).namespaces).toBeUndefined();
    });

    it("should map every schema flag of create to its entry key, in both --flag value and --flag=value forms", async () => {
        const { entry, configPath } = parseCreateCliArgs([
            "--namespace", "funiber",
            "--source.type=moodle-repository",
            "--source.url", "https://gitlab.example.com/moodle.git",
            "--source.branch=UEA_MASTER",
            "--webservices", "core_*,local_*",
            "--outDir", "src/moodle",
            "--config", "pkg.json",
        ]);
        expect(configPath).toBe("pkg.json");
        expect(entry).toEqual({
            namespace: "funiber",
            sourceType: "moodle-repository",
            sourceUrl: "https://gitlab.example.com/moodle.git",
            sourceBranch: "UEA_MASTER",
            webservices: "core_*,local_*",
            outDir: "src/moodle",
        });
    });

    it("should leave entry undefined when no schema flag is given, so the wizard runs", async () => {
        expect(parseCreateCliArgs(["--config", "pkg.json"]).entry).toBeUndefined();
        expect(parseUpdateCliArgs([]).entry).toBeUndefined();
    });

    it("should parse update and delete flags", async () => {
        expect(parseUpdateCliArgs(["--namespace", "x", "--source.branch", "dev"]).entry).toEqual({ namespace: "x", sourceBranch: "dev" });
        expect(parseUpdateCliArgs(["--namespace", "x", "--sync"])).toEqual({ entry: { namespace: "x" }, sync: true });
        expect(parseUpdateCliArgs([]).sync).toBeUndefined();
        expect(parseDeleteCliArgs(["--namespace", "x", "--purge"])).toEqual({ namespace: "x", purge: true });
    });

    it("should parse --help and -h on every command", async () => {
        expect(parseCliArgs(["--help"]).help).toBe(true);
        expect(parseCreateCliArgs(["-h"]).help).toBe(true);
        expect(parseUpdateCliArgs(["--help"]).help).toBe(true);
        expect(parseDeleteCliArgs(["-h"]).help).toBe(true);
    });

    it("should reject unknown options with ERR_CLI_UNKNOWN_OPTION", async () => {
        expect(() => parseCreateCliArgs(["--source.typo", "x"])).toThrow(/Unknown Option/);
        expect(() => parseCreateCliArgs(["--concurrency", "4"])).toThrow(/ERR_CLI_UNKNOWN_OPTION/);
        expect(() => parseCliArgs(["--purge"])).toThrow(/does not accept the option '--purge'/);
        expect(() => parseDeleteCliArgs(["--source.type", "moodle-local"])).toThrow(/ERR_CLI_UNKNOWN_OPTION/);
    });

    it("should reject a value flag without value with ERR_CLI_MISSING_OPTION", async () => {
        expect(() => parseCreateCliArgs(["--namespace"])).toThrow(/ERR_CLI_MISSING_OPTION/);
        expect(() => parseCreateCliArgs(["--namespace", "--source.type", "moodle-local"])).toThrow(/'--namespace' of 'moodle-create-schemas' needs a value/);
    });
});

describe("Error reporting", () => {
    it("should remember errors already printed by the progress bar so the CLI does not print them twice", async () => {
        const err = new Error("boom");
        expect(wasErrorReported(err)).toBe(false);
        const write = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
        const log = vi.spyOn(console, "error").mockImplementation(() => undefined);
        reportProgressError(null, err);
        expect(wasErrorReported(err)).toBe(true);
        expect(wasErrorReported("not an object")).toBe(false);
        write.mockRestore();
        log.mockRestore();
    });
});
