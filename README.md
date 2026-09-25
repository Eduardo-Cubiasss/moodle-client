# @didactika/moodle-client

Typed client for Moodle web services. It formats a plain JavaScript object
into the shape Moodle's REST endpoint expects, sends it, and turns whatever
error the site reports back into a real `Error` you can narrow.

[![npm](https://img.shields.io/npm/v/@didactika/moodle-client)](https://www.npmjs.com/package/@didactika/moodle-client)
[![node](https://img.shields.io/node/v/@didactika/moodle-client)](https://nodejs.org)
[![license](https://img.shields.io/npm/l/@didactika/moodle-client)](LICENSE)

No runtime dependencies: it is built on `fetch` and `URLSearchParams` from
the Node standard library.

## Requirements

Node 20 or newer, and a Moodle site with web services and the REST protocol
enabled, plus a token for the functions you intend to call.
[docs/getting-started.md](docs/getting-started.md) walks through setting
that up.

## Installation

```console
npm install @didactika/moodle-client
```

Ships CommonJS, ESM and type declarations, so `require` and `import` both
work without any configuration.

> Previously published as `moodle-web-service-client`. That package is
> deprecated on npm and points here.

## Usage

```ts
import { MoodleClient } from "@didactika/moodle-client";

const moodle = new MoodleClient({
  rootURL: "https://moodle.example.org",
  token: process.env.MOODLE_TOKEN!,
});

// Call the web service using the strongly-typed generated method:
const { data: courses } = await moodle.core_course_get_courses({
  options: { ids: [1, 2, 3] },
});

// Or call it dynamically via .call():
const { data } = await moodle.call("core_course_get_courses", {
  options: { ids: [1, 2, 3] },
});
```

Build the client once and reuse it: the site, the token and the default
method are settled at construction, so each call only names the function it
wants.

`content` is nested freely and flattened into the `parent[child][index]`
keys Moodle reads, so the example above goes out as `options[ids][0]=1`,
`options[ids][1]=2`, `options[ids][2]=3`. `null` and `undefined` are dropped.

### A single call

`moodleClient()` is the one-shot form the package shipped with. Same path,
same behaviour, same errors.

```ts
import { moodleClient } from "@didactika/moodle-client";

const response = await moodleClient({
  urlRequest: {
    rootURL: "https://moodle.example.org",
    token: process.env.MOODLE_TOKEN!,
    webServiceFunction: "core_course_get_courses",
  },
  content: { options: { ids: [1, 2, 3] } },
});
```

### Typing the response

The body is `any` by default. Pass a type argument to have it checked:

```ts
type Course = { id: number; fullname: string };

const { data } = await moodle.call<Course[]>("core_course_get_courses");
```

## Typed Web Services Generation

Instead of typing responses by hand, you can generate strongly-typed methods, interfaces, and declaration merges for all Moodle web services directly from official Moodle source or your local instance.

### 1. Generate Web Services

Run the generator command:

```console
npm run moodle:generate-webservices
```

Or specify a custom configuration file:

```console
npm run moodle:generate-webservices -- --config path/to/custom-config.json
```

If no configuration file exists, the command automatically creates `moodle-client.config.json` with the latest official Moodle version and generates all available webservices.

### 2. Configuration (`moodle-client.config.json`)

You can customize the generation behavior using a configuration file in your project root:

#### Remote Mode (Default)
Downloads a shallow git clone (`--depth 1`) of the official Moodle version tag, extracts AST schemas directly, and cleans up the temporary repository:

```json
{
  "version": "4.5",
  "webservices": ["*"],
  "outDir": "./moodle-schemas"
}
```

#### Local Mode (For Custom Plugins)
Point `moodlePath` to your local Moodle repository to extract schemas including your custom plugins (`local_*`, `mod_*`, etc.):

```json
{
  "moodlePath": "/path/to/local/moodle",
  "webservices": ["core_course_*", "local_custom_*"],
  "outDir": "./moodle-schemas"
}
```

### 3. Key Design Principles

- **Automatic OutDir Cleanup**: Every time `npm run moodle:generate-webservices` executes, the destination folder (`outDir`) is wiped and regenerated. This guarantees that if you narrow your `webservices` filter (e.g. from `["*"]` to `["core_course_*"]`), no orphaned or stale schemas remain.
- **Full PascalCase Exact Naming**: Type names preserve the full, unabbreviated Moodle function name in PascalCase (for example, `core_course_get_courses` produces `CoreCourseGetCoursesParameters` and `CoreCourseGetCoursesReturns`).
- **Dynamic Frankenstyle Hierarchy**: Web services are dynamically mapped to hierarchical directories without hardcoded plugin prefixes (e.g., `core_course_get_courses` -> `core/course/get_courses.webservice-client.ts`, `mod_quiz_get_user_attempts` -> `mod/quiz/get_user_attempts.webservice-client.ts`).
- **Zero Runtime Overhead**: The generated `index.ts` extends `MoodleClient` via TypeScript Declaration Merging. The underlying client delegates calls dynamically through a lightweight JavaScript `Proxy`, eliminating redundant function boilerplate and bundle bloat.
- **Isolated Types**: Interfaces and type definitions are cleanly isolated under `src/generator/interfaces/`, keeping business logic and AST processing files pure.

### 4. Usage with Full TypeScript Autocomplete

Import the generated schemas once to activate TypeScript declaration merging on `MoodleClient`:

```ts
import { MoodleClient, InvalidParameter } from "@didactika/moodle-client";
import "./moodle-schemas"; // activates strongly-typed methods on MoodleClient

const moodle = new MoodleClient({
  rootURL: "https://moodle.example.org",
  token: process.env.MOODLE_TOKEN!,
});

try {
  // Methods without mandatory parameters can be called cleanly:
  const { data: site } = await moodle.core_webservice_get_site_info();
  console.log(`Connected to ${site.sitename} as ${site.username}`);

  // Strongly-typed parameters and return values:
  const { data: courses } = await moodle.core_course_get_courses({
    options: { ids: [1, 2] },
  });

  courses.forEach((course) => console.log(course.fullname));
} catch (error) {
  if (error instanceof InvalidParameter) {
    console.error("Invalid parameter:", error.debugInfo);
  }
}
```

Generated files are organized in clean hierarchical directories matching Moodle's Frankenstyle convention:
```
moodle-schemas/
├── core/
│   ├── course/
│   │   └── get_courses.webservice-client.ts
│   └── user/
│       └── get_users.webservice-client.ts
├── mod/
│   └── quiz/
│       └── get_user_attempts.webservice-client.ts
└── index.ts
```

### 5. Schema Generation Errors & Troubleshooting

When executing `npm run moodle:generate-webservices` (or `npx moodle-client`), all errors during configuration loading, codebase extraction, and code generation are reported as clean, structured diagnostic blocks without raw stack traces:

```text
[moodle-client] ERROR: <Title> (<CODE>)
Details: <Clear description of the issue>
Action:  <Exact action required to resolve it>
```

#### Configuration & Filesystem Errors (moodle-client context)

These errors occur directly when parsing configuration files or writing generated output:

| Error Code | Title | Details & Recommended Action |
|---|---|---|
| `ERR_CONFIG_INVALID_JSON` | Invalid Configuration File | `moodle-client.config.json` contains malformed JSON. Fix syntax errors or delete the file to regenerate a clean default. |
| `ERR_CONFIG_MISSING_OUTDIR_LOCAL` | Missing outDir in Local Mode | When `moodlePath` is defined, `outDir` is required to avoid overwriting internal schemas. Add `"outDir": "./moodle-schemas"` to `moodle-client.config.json`. |
| `ERR_CONFIG_FILE_NOT_FOUND` | Configuration File Not Found | The custom file passed via `--config <path>` does not exist on disk. Verify the path or omit `--config`. |
| `ERR_MOODLE_VERSION_UNSUPPORTED` | Unsupported Moodle Version | Configured Moodle version is lower than 2.0. Web services schema generation requires Moodle 2.0 or higher. Set `"version"` to a supported version (e.g. `"4.5"`). |
| `ERR_WRITE_PERMISSION_DENIED` | Write Permission Denied | Permission denied when creating directories or writing schema files to `outDir`. Check user permissions on the output folder. |

#### Schema Generator Errors (Engine Context)

The generator delegates introspection and AST extraction to `@didactika/moodle-client-schemas`. Errors originating from the generator engine are caught and formatted consistently:

| Error Code | Title | Details & Recommended Action |
|---|---|---|
| `ERR_PHP_NOT_FOUND` | PHP CLI Not Found | The `php` binary was not found in system `PATH`. Install PHP 7.4 or higher. |
| `ERR_PHP_VERSION_UNSUPPORTED` | Unsupported PHP Version | Detected PHP version is `< 7.4`. Upgrade your PHP CLI installation to PHP 7.4+. |
| `ERR_NETWORK_DISCONNECTED` | Network Disconnected | Failed to reach GitHub to download Moodle repository archive (DNS resolution failed or connection timeout). Check internet connection or use a local instance with `moodlePath`. |
| `ERR_ARCHIVE_EXTRACTION_FAILED` | Archive Extraction Failed | Downloaded tarball archive could not be unpacked (corrupted stream or extraction failure). Check network stability and disk space. |
| `ERR_GIT_NOT_FOUND` | Git Executable Not Found | Archive download failed and Git is not installed in `PATH` to perform fallback shallow clone. Install Git or restore network connectivity. |
| `ERR_MOODLE_PATH_NOT_FOUND` | Moodle Path Not Found | The path in `moodlePath` does not exist on disk. Check that the path is spelled correctly. |
| `ERR_MOODLE_PATH_NOT_ROOT` | Invalid Moodle Root Directory | The directory in `moodlePath` has no `version.php` at its root (nor under `public/`). Point `moodlePath` directly to the Moodle installation root. |
| `ERR_MOODLE_PATH_MULTIPLE_INSTANCES` | Multiple Moodle Instances Detected | The directory contains multiple Moodle installations in subdirectories. Specify the exact subdirectory of the desired instance in `moodlePath`. |
| `ERR_MOODLE_PATH_PERMISSION_DENIED` | Moodle Path Permission Denied | Permission denied when reading the local Moodle codebase. Check read permissions for the current user. |
| `ERR_NO_SERVICES_FOUND` | No Web Services Found | Scanned codebase contains no `db/services.php` files. Verify that the Moodle installation is complete. |
| `ERR_SERVICE_NOT_FOUND` | Web Service Not Found | A pattern in `webservices` array did not match any declared web service. Verify service names in `moodle-client.config.json`. |
| `ERR_CLASS_NOT_FOUND` | Web Service Class Not Found | The PHP class declaring the external function could not be resolved on disk. Ensure all plugin files are present. |
| `ERR_INTROSPECTION_FAILED` | Web Service Introspection Failed | PHP reflection threw a fatal error or uncaught exception while executing `_parameters()` or `_returns()`. Check PHP syntax and runtime dependencies in the external class. |

## Runtime HTTP Errors

A failed call throws. Each Moodle error code has its own class, so
`instanceof` is enough to route them:

```ts
import { InvalidToken, MoodleException } from "@didactika/moodle-client";

try {
  await moodle.call("core_course_get_courses");
} catch (error) {
  if (error instanceof InvalidToken) {
    // the token is wrong or has expired
  } else if (error instanceof MoodleException) {
    console.error(error.status, error.message, error.debugInfo);
  }
}
```

The full list, and why the status codes come from two different places, is
in [docs/errors.md](docs/errors.md).

## Documentation

- [Getting started](docs/getting-started.md) — install, what to enable on
  the Moodle side, and the first call.
- [API reference](docs/api-reference.md) — every class, method and type.
- [Errors](docs/errors.md) — what gets thrown, and how to tell the cases
  apart.
- [Examples](examples) — runnable scripts for the usual shapes.

## Migrating from 1.x

`response.data` is unchanged. See the [CHANGELOG](CHANGELOG.md) for the full
list, including the deep imports that were replaced by named exports from the
package root.

## Contributing

Bug reports and feature requests both go to
[the issue tracker](https://github.com/didactika/moodle-client/issues). The
org's [contributing guide](https://github.com/didactika/.github/blob/main/CONTRIBUTING.md)
covers the rest.

```console
npm install
npm test
npm run test:coverage
```

Unit tests live in `tests/unit` (covering client, error handling, AST parsing, PHP runtime adapters, config managers, and code generation emitters). Integration tests in `tests/integration` cover end-to-end extraction pipelines and HTTP flows. All 310+ tests run natively via Vitest without needing an external cloud service or separate package.

## Contributors

Thanks to everyone who has contributed to this project:

[![Contributors](https://contrib.rocks/image?repo=didactika/moodle-client)](https://github.com/didactika/moodle-client/graphs/contributors)

## License

[MIT](LICENSE) — © [Didactika](https://github.com/didactika)
