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

### Errors

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
