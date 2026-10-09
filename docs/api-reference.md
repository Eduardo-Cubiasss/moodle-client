# API Reference

Everything documented below is exported directly from the package root:

```ts
import {
  MoodleClient,
  moodleClient,
  MoodleResponse,
  InvalidToken,
  AccessException,
  InvalidParameter,
  InvalidRecord,
  MoodleException,
  URLError,
  BadRequestError,
} from "@didactika/moodle-client";

import type {
  HttpMethod,
  IMoodleClientOptions,
  IDataRequest,
  IURLRequest,
  IMoodleResponse,
  IMoodleErrorBody,
  webservice,
} from "@didactika/moodle-client";
```

---

## `MoodleClient`

The primary client instance for connecting to a Moodle site. Create it once and reuse it across your application.

### `new MoodleClient(options)`

Constructs a new Moodle client instance.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `rootURL` | `string` | required | Moodle site base URL, e.g. `https://moodle.example.org`. Trailing slashes are automatically trimmed. |
| `token` | `string` | required | External web service token issued for a Moodle user account. |
| `method` | `HttpMethod` | `"POST"` | Default HTTP method for all calls initiated by this client. |

No network request is performed during instantiation. An invalid or unreachable `rootURL` surfaces as a [`URLError`](errors.md) on the first function call.

```ts
const moodle = new MoodleClient({
  rootURL: "https://moodle.example.org",
  token: process.env.MOODLE_TOKEN!,
});
```

---

### Direct Typed Methods: `client.<namespace>.<webServiceFunction>(content?, method?)`

`MoodleClient` routes property access dynamically through proxy namespaces, mapping directly to Moodle web service functions. This architecture provides IDE autocompletion, JSDocs, parameter validation, and strongly-typed return values.

#### Bundled Default Namespace: `client.webservice.*`

The package includes Moodle 4.5 web service definitions (+700 functions) out of the box under the `webservice` namespace:

```ts
// 1. Function without parameters:
const { data: site } = await moodle.webservice.core_webservice_get_site_info();
console.log(site.sitename, site.release);

// 2. Function with typed parameters:
const { data: courses } = await moodle.webservice.core_course_get_courses({
  options: { ids: [1, 2, 3] },
});

// 3. HTTP method override for an individual call:
const { data: users } = await moodle.webservice.core_user_get_users(
  { criteria: [{ key: "email", value: "teacher@example.org" }] },
  "GET"
);
```

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `content` | `object` | `{}` | Function parameters adhering to the generated TypeScript interface. |
| `method` | `HttpMethod` | client default | Overrides the HTTP method for this specific call. |

**Return Value**: `Promise<MoodleResponse<TReturns>>`, where `TReturns` is the strongly-typed return interface generated for that web service function. Throws on failure (see [Error Classes](#error-classes)).

#### Custom Namespaces: `client.<namespace>.*`

When custom namespaces are configured in `package.json` (such as `customRepo` or `localDev`), running `npx moodle-generate-schemas` produces TypeScript declaration merging that attaches each namespace directly to `MoodleClient`:

```ts
import { MoodleClient } from "@didactika/moodle-client";
import type { webservice, customRepo, localDev } from "@didactika/moodle-client";

// Bundled official Moodle 4.5 functions:
const { data: site } = await moodle.webservice.core_webservice_get_site_info();

// Custom remote repository namespace:
const { data: repoUsers } = await moodle.customRepo.core_user_get_users({
  criteria: [{ key: "id", value: "10" }],
});

// Local development namespace:
const { data: customData } = await moodle.localDev.local_myplugin_get_info();
```

---

### Dynamic Method: `client.call<T>(webServiceFunction, content?, method?)`

Invokes any web service function dynamically by its string name. Useful for calling functions determined at runtime, experimental services, or plugins where schemas have not been generated yet.

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `webServiceFunction` | `string` | required | Exact web service function name, e.g. `"core_course_get_courses"`. |
| `content` | `object` | `{}` | Function parameters, automatically flattened for Moodle REST consumption. |
| `method` | `HttpMethod` | client default | Overrides HTTP method for this call only. |

**Return Value**: `Promise<MoodleResponse<T>>`. `T` defaults to `any` unless explicitly typed:

```ts
interface CourseSummary {
  id: number;
  fullname: string;
  shortname: string;
}

const { data } = await moodle.call<CourseSummary[]>(
  "core_course_get_courses",
  { options: { ids: [1, 2] } }
);
```

---

## Standalone Helper: `moodleClient(data)`

Executes a single, isolated web service call without maintaining a persistent `MoodleClient` instance. Shares the exact same transport pipeline, parameter serialization, and error handling.

```ts
import { moodleClient } from "@didactika/moodle-client";

const response = await moodleClient({
  urlRequest: {
    rootURL: "https://moodle.example.org",
    token: process.env.MOODLE_TOKEN!,
    webServiceFunction: "core_course_get_courses",
  },
  content: { options: { ids: [1, 2, 3] } },
  method: "POST",
});

console.log(response.status, response.data);
```

| Parameter | Type | Description |
| --- | --- | --- |
| `data` | [`IDataRequest`](#idatarequest) | Request configuration containing URL details, function name, parameters, and optional HTTP method. |

**Return Value**: `Promise<MoodleResponse<T>>`.

---

## `MoodleResponse<T>`

Represents the result of a successful web service call.

| Property / Method | Type | Description |
| --- | --- | --- |
| `data` | `T` | Parsed JSON response body, or raw text if the response was not JSON. |
| `status` | `number` | HTTP status code (e.g. `200`). |
| `statusText` | `string` | HTTP status message (e.g. `"OK"`). |
| `ok` | `boolean` | `true` if HTTP status code is within the 2xx range. |
| `headers` | `Headers` | Standard fetch response headers. |
| `isMoodleError` | `boolean` | `true` if the response body contains a Moodle `errorcode`. |
| `throwOnMoodleError()` | `this` | Inspects `data` and throws the appropriate semantic Error class if Moodle reported a failure. |

> [!NOTE]
> `client.call()`, direct typed methods (`client.webservice.*`), and `moodleClient()` automatically execute `throwOnMoodleError()` before resolving. If an error is returned by Moodle, a typed error is thrown rather than resolving with `ok: false`.

---

## Parameter Serialization

Moodle's REST server does not parse raw JSON bodies. It requires flattened PHP array keys in `application/x-www-form-urlencoded` format (or query parameters for `GET` and `HEAD` requests).

Parameter serialization is handled automatically:

```ts
await moodle.webservice.core_course_get_courses({
  options: {
    ids: [1, 2, 3],
  },
});
```

Serialized payload:
```
options[ids][0]=1&options[ids][1]=2&options[ids][2]=3
```

- **Arrays of objects**: `criteria: [{ key: "id", value: "1" }]` becomes `criteria[0][key]=id&criteria[0][value]=1`.
- **Booleans and numbers**: Converted to string representations (`true` -> `"1"`, `false` -> `"0"`).
- **`null` and `undefined`**: Omitted from payload to match Moodle defaults.

---

## Error Classes

All errors thrown by the client inherit from the standard JavaScript `Error` class and include HTTP statuses, Moodle error codes, and optional developer debugging information:

| Error Class | Moodle Code | HTTP Status | Description |
| --- | --- | --- | --- |
| `InvalidToken` | `invalidtoken` | 401 | Web service token is invalid, expired, or revoked. |
| `AccessException` | `accessexception` | 403 | User lacks capability or the function is missing from the external service. |
| `InvalidParameter` | `invalidparameter` | 400 | Required parameter missing or wrong data type supplied. |
| `InvalidRecord` | `invalidrecord` | 404 | Database record not found (e.g. invalid course ID or user ID). |
| `MoodleException` | any other exception code | site status | General Moodle business error; carries `status`, `message`, and `debugInfo`. |
| `URLError` | network/DNS failure | 404 | Site unreachable, invalid URL, or reverse-proxy HTML error. |
| `BadRequestError` | unclassified error | 400 | Generic bad request response. |

### Error Properties

Every thrown error exposes:
- `error.name`: CamelCase error identifier (e.g. `"invalidToken"`).
- `error.message`: Human-readable error description.
- `error.status`: Corresponding HTTP status code.
- `error.debugInfo`: Detailed SQL and stack trace information when Moodle debugging is set to *DEVELOPER*.

See [Error Handling Guide](errors.md) for full catch patterns and debugging strategies.

---

## Core Types

### `IMoodleClientOptions`

```ts
interface IMoodleClientOptions {
  rootURL: string;
  token: string;
  method?: HttpMethod;
}
```

### `IDataRequest`

```ts
interface IDataRequest {
  urlRequest: IURLRequest;
  content: object;
  method?: HttpMethod;
}
```

### `IURLRequest`

```ts
interface IURLRequest {
  rootURL: string;
  token: string;
  webServiceFunction: string;
}
```

### `IMoodleResponse<T>`

```ts
interface IMoodleResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  ok: boolean;
  headers: Headers;
}
```

### `IMoodleErrorBody`

```ts
interface IMoodleErrorBody {
  errorcode: string;
  exception?: string;
  message?: string;
  debuginfo?: string;
}
```

### `HttpMethod`

```ts
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";
```

---

## Schema Generation & Configuration Types

Schema sources are declared under `"moodle-client"` in `package.json`:

```ts
interface MoodleSchemaConfigEntry {
  namespace: string;
  source: MoodleSourceConfig;
  webservices: string[];
  outDir?: string;
  concurrency?: number;
}
```

| Field | Type | Description |
| --- | --- | --- |
| `namespace` | `string` | Unique namespace identifier accessed on `MoodleClient` (e.g. `moodle.<namespace>.*`). |
| `source` | `MoodleSourceConfig` | Origin of the Moodle codebase for PHP reflection extraction. |
| `webservices` | `string[]` | Wildcard patterns or exact function names to include (e.g. `["*"]`, `["core_*"]`). |
| `outDir` | `string` | Output folder in your project where `.webservice.d.ts` files are written. Required for `"local"` and `"repository"`, optional for `"moodle"`. |
| `concurrency` | `number` | Concurrency limit for PHP schema extraction workers (default: `8`). |

### `MoodleSourceConfig`

```ts
type MoodleSourceConfig =
  | MoodleOfficialSource
  | MoodleRepositorySource
  | MoodleLocalSource;

interface MoodleOfficialSource {
  type: "moodle" | "moodle-official" | "official";
  version: string; // e.g. "4.5", "4.4"
}

interface MoodleRepositorySource {
  type: "repository" | "moodle-repository" | "remote" | "git";
  url: string;     // e.g. "https://github.com/my-org/moodle.git"
  branch?: string; // Git branch or tag (defaults to "main")
}

interface MoodleLocalSource {
  type: "local" | "moodle-local";
  path: string;    // Filesystem path to Moodle installation root containing version.php
}
```

---

## CLI Tools Reference

Three CLI executables manage the custom schema lifecycle:

### `npx moodle-create-schemas`

Interactive wizard that configures a new schema source:
- Prompts for `namespace`, source type (**Official**, **Local**, or **Repository**), function patterns, and mandatory `outDir`.
- Appends the configuration entry into `"moodle-client"` in `package.json`.
- Runs generation immediately to create `.webservice.d.ts` files and update module augmentation.
- **Transactional Rollback**: If initial generation fails (e.g. invalid credentials or network error), automatically rolls back `package.json` to its previous state and cleans up any empty/partial directories.

### `npx moodle-generate-schemas`

Compiles TypeScript declarations for all entries in `package.json`:
- **Smart cache**: If schemas exist in `outDir`, synchronizes in milliseconds (~0.2s) without re-downloading.
- **Extraction & Concurrency**: Downloads official releases, shallow-clones Git repositories (with concurrent submodule synchronization, `p-limit(4)`), or reads local folders. Processes up to 2 schemas concurrently (`p-limit(2)`) and extracts signatures with 8 parallel worker processes per schema (`concurrency: 8`).
- **Barrels**: Produces `index.d.ts` with module augmentation to expose each namespace on `MoodleClient`.
- **CLI Flags**:
  - `--force` (`-f`): Bypasses cache, purges existing files, and executes a clean download/clone and extraction.
  - `--config <path>`: Specifies a custom configuration JSON file path instead of `package.json`.

### `npx moodle-delete-schemas`

Interactive wizard to remove a schema namespace:
- Displays a numbered list of configured namespaces.
- Removes the chosen entry from `package.json`.
- Selectively deletes generated `.webservice.d.ts` files and barrels from `outDir` and the package, while safely preserving custom user code.
- Prunes empty output directories and supports removing entries even if `outDir` was already cleaned up.

---

## Related Documentation

- [Getting Started](getting-started.md) — Initial setup, Moodle configuration, and first call.
- [Web Services Guide](webservices-guide.md) — Comprehensive guide on namespaces, CLI tools, and code patterns.
- [Error Handling](errors.md) — Error classes, status codes, and debugging with `debugInfo`.
