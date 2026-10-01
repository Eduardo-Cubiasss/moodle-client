# API reference

Everything below is exported from the package root:

```ts
import { MoodleClient, MoodleResponse, InvalidToken } from "@didactika/moodle-client";
```

## `MoodleClient`

A client for one Moodle site. Build it once and reuse it.

### `new MoodleClient(options)`

| Option | Type | Default | |
| --- | --- | --- | --- |
| `rootURL` | `string` | required | the site root, e.g. `https://moodle.example.org`. Trailing slashes are trimmed |
| `token` | `string` | required | a web service token issued on that site |
| `method` | `HttpMethod` | `"POST"` | default method for every call this client makes |

Nothing is validated at construction and nothing reaches the network: an
unusable `rootURL` surfaces as a [`URLError`](errors.md) on the first call.

### Direct Typed Methods: `client.<namespace>.<webServiceFunction>(content?, method?)`

`MoodleClient` dynamically routes property accesses through proxy namespaces, mapping directly to Moodle web service functions with full TypeScript autocomplete, JSDocs, parameter shapes, and return types.

The default bundled namespace is `webservice`, covering all standard Moodle 4.5 web service functions:

```ts
// Autocomplete on parameters and return types:
const { data: courses } = await moodle.webservice.core_course_get_courses({
  options: { ids: [1, 2, 3] },
});

// Method override per call:
const { data: site } = await moodle.webservice.core_webservice_get_site_info(
  undefined,
  "GET"
);
```

| Parameter | Type | Default | |
| --- | --- | --- | --- |
| `content` | `object` | `{}` | typed function parameters (generated from Moodle schema) |
| `method` | `HttpMethod` | the client's default | overrides HTTP method for this call only |

Returns `Promise<MoodleResponse<TReturns>>`, where `TReturns` is the strongly-typed return interface generated for that specific function. Throws on failure (see [Errors](errors.md)).

Additional namespaces (such as `client.legacy.*`, `client.v44.*`) can be configured in `package.json` and generated via `npx moodle-generate-schemas`.

### `client.call<T>(webServiceFunction, content?, method?)`

The dynamic calling method. Call any function by string name, with an optional generic type argument for the response body.

| Parameter | Type | Default | |
| --- | --- | --- | --- |
| `webServiceFunction` | `string` | required | e.g. `core_course_get_courses` |
| `content` | `object` | `{}` | parameters, nested as deeply as the function needs |
| `method` | `HttpMethod` | the client's default | overrides it for this call only |

Returns `Promise<MoodleResponse<T>>`. Throws rather than resolving when the
call fails — see [Errors](errors.md).

`T` types the response body. It defaults to `any`, so nothing breaks if you
leave it out:

```ts
type Course = { id: number; fullname: string };

const { data } = await moodle.call<Course[]>("core_course_get_courses");
```

`GET` and `HEAD` send their parameters in the query string, because PHP
never reads a request body into `$_GET`. Every other method sends a
`application/x-www-form-urlencoded` body.

## `moodleClient(data)`

One call without keeping a client around. Same path, same behaviour, same
errors.

```ts
const response = await moodleClient<Course[]>({
  urlRequest: {
    rootURL: "https://moodle.example.org",
    token: "aeb315e6dd3affc18352fe46124cdd48",
    webServiceFunction: "core_course_get_courses",
  },
  content: { options: { ids: [1, 2, 3] } },
  method: "GET",
});
```

Takes an [`IDataRequest`](#idatarequest), returns `Promise<MoodleResponse<T>>`.

## `MoodleResponse<T>`

What a successful call resolves to.

| Member | Type | |
| --- | --- | --- |
| `data` | `T` | the parsed JSON body, or the raw text when the body was not JSON |
| `status` | `number` | HTTP status code |
| `statusText` | `string` | HTTP status text |
| `ok` | `boolean` | whether the status was a 2xx |
| `headers` | `Headers` | response headers |
| `isMoodleError` | `boolean` | whether the body carries a Moodle `errorcode` |
| `throwOnMoodleError()` | `this` | raises whatever Moodle reported, or returns itself |

`call()` already applies `throwOnMoodleError()` before resolving, so a
response you hold in your hands has passed it.

A body that is not JSON is kept as text rather than throwing a parse error
over it — that is how a maintenance page or a proxy's HTML error reaches you
intact instead of as a `SyntaxError`.

## Types

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

The interface `MoodleResponse` implements. Use it when you want to accept a
response without depending on the class.

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

The JSON body Moodle returns when a call fails.

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

Moodle's REST server only really honours `GET` and `POST`. The rest are
accepted because the signature has always allowed them.

### `MoodleSchemaConfigEntry`

Structure of each entry in the `"moodle-client"` configuration array in `package.json`:

```ts
interface MoodleSchemaConfigEntry {
  namespace: string;
  source: MoodleSourceConfig;
  webservices: string[];
  outDir?: string;
  concurrency?: number;
}
```

### `MoodleSourceConfig`

Source of the Moodle codebase for schema generation:

```ts
type MoodleSourceConfig =
  | { type: "moodle"; version: string }
  | { type: "local"; path: string };
```
