# @didactika/moodle-client

Strongly-typed TypeScript client for Moodle web services with full IDE autocompletion and zero runtime dependencies, built on native `fetch`.

[![npm](https://img.shields.io/npm/v/@didactika/moodle-client)](https://www.npmjs.com/package/@didactika/moodle-client)
[![node](https://img.shields.io/node/v/@didactika/moodle-client)](https://nodejs.org)
[![license](https://img.shields.io/npm/l/@didactika/moodle-client)](LICENSE)

---

## Highlights

- ⚡ **Direct Typed Methods Out of the Box**: Call 700+ Moodle web service functions directly with full autocomplete, parameter shapes, and typed responses (e.g. `client.webservice.core_course_get_courses(...)`). Pre-bundled with official Moodle 4.5 schemas by default.
- 🔄 **Dynamic `.call()` Support**: Call any web service dynamically by string name (`client.call("core_course_get_courses", ...)`), with custom generic response typing (`client.call<T>(...)`).
- 🧩 **Multi-Namespace Architecture**: Generate and use multiple Moodle versions (e.g. Moodle 4.4, 4.5) or local plugin codebases side-by-side on the same client instance.
- 📦 **Automatic Parameter Serialization**: Deeply nested JavaScript objects and arrays are automatically flattened into the `parent[child][index]` format Moodle's REST endpoint requires.
- 🛡️ **Semantic Error Handling**: Converts Moodle's JSON body errors (which return HTTP 200 OK) into strongly-typed Error classes (`InvalidToken`, `AccessException`, `InvalidParameter`, `InvalidRecord`, `MoodleException`, etc.).
- 🪶 **Zero Runtime Dependencies**: Built entirely on native Node standard library (`fetch`, `URLSearchParams`). Ships dual CommonJS, ESM, and TypeScript declarations.

---

## Requirements

- **Node.js**: 20 or newer.
- **Moodle site**: A Moodle instance with web services and REST protocol enabled, plus a token:
  1. **Web services enabled**: *Site administration -> General -> Advanced features -> Enable web services*.
  2. **REST protocol enabled**: *Site administration -> Server -> Web services -> Manage protocols*, and switch on *REST protocol*.
  3. **Authorized token**: *Site administration -> Server -> Web services -> External services* (add functions) and *Manage tokens* (issue token for a user).

See [docs/getting-started.md](docs/getting-started.md) for a detailed walkthrough.

---

## Installation

```console
npm install @didactika/moodle-client
```

> **Note**: Previously published as `moodle-web-service-client`. That package is deprecated on npm and points here.

---

## Quick Start

### 1. Initialize the client

```ts
import { MoodleClient } from "@didactika/moodle-client";

const moodle = new MoodleClient({
  rootURL: "https://moodle.example.org",
  token: process.env.MOODLE_TOKEN!,
});
```

### 2. Make your first call with direct typed methods

Out of the box, `moodle.webservice` gives you immediate, strongly-typed access to all standard Moodle 4.5 web services:

```ts
// Autocomplete on parameters and return types out of the box:
const { data: site } = await moodle.webservice.core_webservice_get_site_info();

console.log(`Connected to ${site.sitename} as ${site.fullname} (${site.username})`);
console.log(`Moodle Release: ${site.release}`);
```

### 3. Call functions with parameters

Nested parameters are validated by TypeScript at compile-time and automatically serialized for Moodle at runtime:

```ts
const { data: courses } = await moodle.webservice.core_course_get_courses({
  options: {
    ids: [1, 2, 3],
  },
});

courses.forEach((course) => {
  console.log(`[${course.id}] ${course.shortname} - ${course.fullname}`);
});
```

---

## Three Ways to Call Web Services

`@didactika/moodle-client` offers three calling styles to suit any architecture:

### 1. Direct Typed Methods (Recommended)

Direct methods use lightweight JavaScript proxies that map property paths directly to web services.

```ts
// Function without parameters:
const site = await moodle.webservice.core_webservice_get_site_info();

// Function with typed parameters:
const courses = await moodle.webservice.core_course_get_courses({
  options: { ids: [1, 2] },
});

// Override HTTP method per call (GET / POST):
const userList = await moodle.webservice.core_user_get_users(
  { criteria: [{ key: "email", value: "teacher@example.org" }] },
  "GET"
);
```

**Why choose direct methods?**
- Full IDE autocompletion for function names and parameter keys.
- JSDoc parameter and return documentation displayed right inside your editor.
- Return bodies are strongly typed (`data` is typed as `CoreCourseGetCoursesReturns`, not `any`).
- Zero runtime overhead: powered by dynamic JavaScript Proxies with referential caching.

### 2. Dynamic `.call()` Method

The `.call()` method lets you invoke any web service by its string name. Settle the site, token, and default method once at construction, and call any function dynamically:

```ts
// Body defaults to 'any'
const { data } = await moodle.call("core_course_get_courses", {
  options: { ids: [1, 2, 3] },
});

// Or pass a generic type argument to type the response:
interface Course {
  id: number;
  fullname: string;
  shortname: string;
}

const { data: typedCourses } = await moodle.call<Course[]>(
  "core_course_get_courses",
  { options: { ids: [1, 2, 3] } }
);
```

**When to use `.call()`?**
- When the function name is determined dynamically at runtime.
- When calling custom, third-party, or local plugins where generated schemas have not been generated yet.
- When you want to manually shape or narrow the generic return type.

### 3. One-Shot `moodleClient()` Helper

If you only need to make a single, isolated call without keeping a client instance around:

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

console.log(response.status, response.data);
```

`moodleClient()` goes through the exact same network transport and error-handling pipeline.

---

## Parameter Serialization

Moodle's REST server cannot parse raw JSON request bodies. Instead, it expects flattened PHP array keys in `application/x-www-form-urlencoded` format (or query parameters for `GET`).

Both direct methods and `.call()` automatically flatten plain JavaScript objects and arrays:

```ts
await moodle.webservice.core_course_get_courses({
  options: {
    ids: [1, 2, 3],
  },
});
```

is serialized over the wire as:

```
options[ids][0]=1&options[ids][1]=2&options[ids][2]=3
```

- **Arrays of objects** flatten similarly: `criteria: [{ key: "email", value: "user@example.org" }]` becomes `criteria[0][key]=email&criteria[0][value]=user%40example.org`.
- **`null` and `undefined`** properties are cleanly omitted, matching Moodle expectations.
- **Booleans and numbers** are converted to string representations (`true` -> `"1"`, `false` -> `"0"`).

---

## Response Structure (`MoodleResponse<T>`)

Every successful call resolves to an instance of `MoodleResponse<T>`:

| Property | Type | Description |
|---|---|---|
| `data` | `T` | The parsed JSON response body (or raw string if non-JSON) |
| `status` | `number` | HTTP status code (e.g., `200`) |
| `statusText` | `string` | HTTP status text (e.g., `"OK"`) |
| `ok` | `boolean` | `true` if HTTP status is `2xx` |
| `headers` | `Headers` | Native `fetch` response headers |
| `isMoodleError` | `boolean` | `true` if body contains a Moodle `errorcode` |

---

## Examples

### 1. Retrieve Site Information

```ts
import { MoodleClient } from "@didactika/moodle-client";

const moodle = new MoodleClient({
  rootURL: "https://moodle.example.org",
  token: process.env.MOODLE_TOKEN!,
});

const { data: site } = await moodle.webservice.core_webservice_get_site_info();
console.log(`Connected: ${site.sitename} (Moodle ${site.release})`);
```

### 2. Query Courses with Options

```ts
const { data: courses } = await moodle.webservice.core_course_get_courses({
  options: { ids: [10, 20] },
});

for (const course of courses) {
  console.log(`Course: ${course.fullname} (ID: ${course.id})`);
}
```

### 3. Create a New User

```ts
const { data: newUsers } = await moodle.webservice.core_user_create_users({
  users: [
    {
      username: "john.doe",
      email: "john.doe@example.org",
      firstname: "John",
      lastname: "Doe",
      password: "ChangeMe123!",
      auth: "manual",
    },
  ],
});

console.log("Created user with ID:", newUsers[0]?.id);
```

### 4. Enrol a User into a Course

```ts
await moodle.webservice.enrol_manual_enrol_users({
  enrolments: [
    {
      roleid: 5, // Student role
      userid: newUsers[0].id,
      courseid: 10,
    },
  ],
});

console.log("User enrolled successfully.");
```

### 5. Catching Semantic Moodle Errors

```ts
import {
  MoodleClient,
  InvalidToken,
  AccessException,
  InvalidParameter,
  InvalidRecord,
  MoodleException,
  URLError,
} from "@didactika/moodle-client";

const moodle = new MoodleClient({
  rootURL: "https://moodle.example.org",
  token: "invalid-or-expired-token",
});

try {
  const { data } = await moodle.webservice.core_course_get_courses();
} catch (error) {
  if (error instanceof InvalidToken) {
    console.error("Token is invalid or expired. Re-authenticate.");
  } else if (error instanceof AccessException) {
    console.error("User lacks capability or function not in external service.");
  } else if (error instanceof InvalidParameter) {
    console.error("Invalid parameter supplied:", error.debugInfo);
  } else if (error instanceof InvalidRecord) {
    console.error("Requested record was not found in the database.");
  } else if (error instanceof URLError) {
    console.error("Failed to reach Moodle server (offline, bad URL, or proxy error).");
  } else if (error instanceof MoodleException) {
    console.error(`Moodle error (${error.status}):`, error.message, error.debugInfo);
  } else {
    throw error;
  }
}
```

Check [examples/](examples/) for more runnable scripts.

---

## Semantic Error Handling

Moodle's REST server notoriously returns `HTTP 200 OK` even when a web service fails, returning error details in the JSON body.

`@didactika/moodle-client` automatically inspects every response, parses Moodle error codes, and throws semantic, strongly-typed Error classes:

| Error Class | Thrown When Moodle Reports | HTTP `status` | Description |
|---|---|---|---|
| `InvalidToken` | `invalidtoken` | 401 | The token is wrong, expired, or invalid. |
| `AccessException` | `accessexception` | 403 | Token is valid, but the user lacks permissions or the function is missing from the external service. |
| `InvalidParameter` | `invalidparameter` | 400 | Missing required parameters or incorrect types sent to the function. |
| `InvalidRecord` | `invalidrecord` | 404 | The requested database record (course ID, user ID, etc.) does not exist. |
| `MoodleException` | any other Moodle exception code | site status | General Moodle error; carries `status`, `message`, and `debugInfo`. |
| `URLError` | network failure, DNS error, site unreachable, or proxy HTML error | 404 | Request failed before reaching Moodle REST endpoint. |
| `BadRequestError` | any other unclassified error | 400 | Generic bad request response. |

### Debugging with `debugInfo`

When Moodle's debugging mode is set to *DEVELOPER* (*Site administration -> Development -> Debugging*), Moodle attaches stack traces and detailed SQL hints. When available, `@didactika/moodle-client` exposes this under `error.debugInfo`.

Detailed explanation of error handling can be found in [docs/errors.md](docs/errors.md).

---

## Typed Web Services Generation

> [!NOTE]
> Moodle 4.5 web services are already **bundled out of the box** in the `webservice` namespace (`moodle.webservice.*`).
> You **only** need the generator if you want custom namespaces, schemas for other Moodle versions (e.g. Moodle 4.4), or schemas for a local Moodle instance with custom plugins.

### 1. Configuration in `package.json`

Configure one or more schema sources under the `"moodle-client"` array in your `package.json`:

```json
{
  "name": "my-moodle-app",
  "version": "1.0.0",
  "scripts": {
    "moodle:generate-schemas": "moodle-generate-schemas"
  },
  "moodle-client": [
    {
      "namespace": "webservice",
      "source": {
        "type": "moodle",
        "version": "4.5"
      },
      "webservices": ["*"]
    },
    {
      "namespace": "legacy",
      "source": {
        "type": "moodle",
        "version": "4.4"
      },
      "webservices": ["core_course_*", "mod_assign_*"],
      "outDir": "./schemas/v4.4"
    },
    {
      "namespace": "localDev",
      "source": {
        "type": "local",
        "path": "~/moodle"
      },
      "webservices": ["core_*", "local_*"],
      "outDir": "./schemas/local"
    }
  ]
}
```

#### Configuration Options

- `namespace` (string, required): Unique namespace identifier used on `MoodleClient` (e.g. `moodle.webservice.*`, `moodle.legacy.*`, `moodle.localDev.*`).
- `source` (object, required):
  - **Official release**: `{ "type": "moodle", "version": "4.5" }`
  - **Local instance**: `{ "type": "local", "path": "/path/to/moodle" }`
- `webservices` (string[], required): Service names or wildcard patterns to include (e.g. `["*"]`, `["core_*"]`, `["mod_quiz_*"]`).
- `outDir` (string): Output directory path. Required when `source.type` is `"local"`, optional for `"moodle"`. Generated files are organized under `[outDir]/{namespace}/`.

### 2. Run the Generator

```console
npx moodle-generate-schemas
```

#### CLI Flags:
- `--force` or `-f`: Bypasses existing cached schemas and forces re-extraction and regeneration.
- `--config <path>`: Specifies a custom configuration file path (defaults to current project `package.json`).

### 3. Calling Web Services via Custom Namespaces

Once generated, TypeScript declaration merging automatically attaches each namespace to `MoodleClient`:

```ts
import { MoodleClient } from "@didactika/moodle-client";

const moodle = new MoodleClient({
  rootURL: "https://moodle.example.org",
  token: process.env.MOODLE_TOKEN!,
});

// Default bundled namespace:
const { data: site } = await moodle.webservice.core_webservice_get_site_info();

// Custom Moodle 4.4 namespace:
const { data: legacyCourses } = await moodle.legacy.core_course_get_courses();

// Local development namespace:
const { data: customData } = await moodle.localDev.local_myplugin_get_info();
```

- **Smart Cache & Governance**: The generator detects existing schemas and only regenerates when `--force` is passed.
- **Selective Cleanup**: When regenerating an `outDir` namespace, stale generated webservice files are removed while custom user files in the same directory are safely preserved.
- **Exact PascalCase Naming**: Generated types use unabbreviated Moodle function names (e.g., `core_course_get_courses` produces `CoreCourseGetCoursesParams` and `CoreCourseGetCoursesReturns`).
- **Frankenstyle File Hierarchy**: Schemas are structured following Moodle's component hierarchy (`core/course/get_courses.webservice.d.ts`).

### Generator Diagnostics & Troubleshooting

The generator emits clear, actionable error blocks:

| Error Code | Title | Cause & Recommended Action |
|---|---|---|
| `ERR_CONFIG_INVALID_JSON` | Invalid Configuration File | `package.json` contains malformed JSON syntax. Fix syntax errors. |
| `ERR_CONFIG_DUPLICATE_NAMESPACE` | Duplicate Namespace | Two entries share the same `namespace`. Use unique namespace names. |
| `ERR_CONFIG_MISSING_OUTDIR_LOCAL` | Missing outDir in Local Mode | When using `source.type: "local"`, `outDir` is required. |
| `ERR_MOODLE_VERSION_UNSUPPORTED` | Unsupported Moodle Version | Configured Moodle version is lower than 2.0. Set `"version"` to a supported version (e.g. `"4.5"`). |
| `ERR_PHP_NOT_FOUND` | PHP CLI Not Found | `php` binary was not found in system `PATH`. Install PHP 7.4 or higher. |
| `ERR_MOODLE_PATH_NOT_ROOT` | Invalid Moodle Root Directory | The directory specified in `source.path` has no `version.php`. Point directly to the Moodle installation root. |
| `ERR_NO_SERVICES_FOUND` | No Web Services Found | The codebase contains no `db/services.php` files. Verify that the Moodle installation is complete. |
| `ERR_SERVICE_NOT_FOUND` | Web Service Not Found | A pattern in `webservices` array did not match any declared web service. |

---

## Documentation

- [Getting Started](docs/getting-started.md) — Step-by-step setup on Moodle side, installation, and first call.
- [API Reference](docs/api-reference.md) — Comprehensive documentation of classes, methods, and TypeScript interfaces.
- [Error Handling](docs/errors.md) — Deep dive into Moodle error codes, HTTP statuses, and debugging strategies.
- [Examples](examples/) — Runnable scripts demonstrating common usage patterns.

---

## Migrating from 1.x / `moodle-web-service-client`

- `response.data` structure remains unchanged.
- Deep imports (e.g. `dist/errors/...`) have been replaced by clean named exports directly from `@didactika/moodle-client`.
- Direct typed methods (`client.webservice.*`) are now the recommended way to call web services, replacing manual `call<T>()` castings.

See [CHANGELOG.md](CHANGELOG.md) for full version history.

---

## Contributing

Bug reports and feature requests are welcome on the [issue tracker](https://github.com/didactika/moodle-client/issues).

```console
npm install
npm test
npm run test:coverage
```

---

## Contributors

Thanks to everyone who has contributed to this project:

[![Contributors](https://contrib.rocks/image?repo=didactika/moodle-client)](https://github.com/didactika/moodle-client/graphs/contributors)

---

## License

[MIT](LICENSE) — © [Didactika](https://github.com/didactika)
