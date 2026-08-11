# Changelog

All notable changes to this project are documented in this file. The format
follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this
project uses [Semantic Versioning](https://semver.org/): the first number for
breaking changes, the middle for backward-compatible features, the last for
fixes — security fixes included, always. See the org's
[SECURITY.md](https://github.com/didactika/.github/blob/main/SECURITY.md) for
what that means for which versions get them.

Entries from before this file existed (0.x through 1.1.1) are backfilled from
the real git history — tag dates and the actual diff each release shipped —
not reconstructed from memory.

## [Unreleased]

## [2.1.0] - 2026-08-11

Nothing here breaks 2.0.0: `moodleClient()` keeps the same signature and
goes through the same path. The client is object-oriented now, and the one
thing worth adopting is `MoodleClient`.

### Added

- **`MoodleClient`.** A client for one site, built once and reused: the
  site, the token and the default method are settled at construction, so
  each call only names the function it wants.

  ```ts
  const moodle = new MoodleClient({ rootURL, token });
  await moodle.call("core_course_get_courses", { options: { ids: [1, 2] } });
  ```

- **`MoodleResponse`** is exported. Beyond the fields it already had, it
  answers `isMoodleError` and can re-run `throwOnMoodleError()` — useful
  when a response is passed around after the call that produced it.
- `IMoodleClientOptions`, for typing what a client is built with.
- Documentation of our own under `docs/`: getting started (including what to
  enable on the Moodle side), an API reference, and a page on errors.
- Runnable scripts under `examples/`, from a one-line site-info call to
  narrowing every error case.

### Changed

- The internals are classes rather than free functions: `MoodleEndpoint`
  owns the URL, `RequestContent` owns the flattening, `MoodleResponse` owns
  deciding whether the site reported a failure. Deciding that lives on the
  response because Moodle reports web service errors inside a 200 body, so
  it is a judgement about the body rather than about the status code.
- `moodleClient()` resolves to a `MoodleResponse` instead of a plain object.
  It still satisfies `IMoodleResponse`, so nothing that reads `data`,
  `status`, `statusText`, `ok` or `headers` notices.
- The README points at our own documentation rather than at Moodle's
  developer wiki, which is linked from the pages where it is relevant.

## [2.0.0] - 2026-08-11

### Removed

- **axios and form-data.** The package now has no runtime dependencies at
  all. `npm audit` reported 23 high-severity advisories against the axios
  line this package was pinned to, and none of them had a fix available
  inside the range it could install.
- Deep import paths. Only `dist/` is published now, so `.../lib/errors/...`
  and `.../types/core` — which used to be reachable by accident — are gone.
  Everything is exported from the package root instead, see Added.

### Changed

- **Node 20 or newer is required**, for `fetch` and `URLSearchParams` from
  the standard library.
- **A call resolves to `{ data, status, statusText, ok, headers }`** instead
  of an axios response. `response.data` is unchanged, which is the part
  callers actually read; `headers` is a `Headers` instance now.
- Parameters are sent as `application/x-www-form-urlencoded` rather than
  multipart. PHP populates `$_POST` identically from either, so Moodle
  receives exactly the same thing without the multipart framing.
- `method` is typed as `HttpMethod` instead of axios' `Method`, and
  `IDataRequest.content` as `object` instead of `Object`.
- Built with tsup into `dist/`, shipping CommonJS, ESM and type
  declarations, replacing the CommonJS-only `lib/`.

### Added

- `moodleClient<T>()` accepts a type argument for the response body. It
  defaults to `any`, which is how axios typed it.
- The seven error classes and every public type are exported from the
  package root, so errors can be narrowed with `instanceof`.
- A test suite: unit tests for URL building, content flattening and error
  mapping, plus integration tests that run against a real local HTTP server
  instead of a stubbed `fetch`.

### Fixed

- **`GET` and `HEAD` requests reached Moodle with no parameters at all.**
  They were handed to axios as a request body, and PHP never reads a body
  into `$_GET`, so every non-POST call arrived empty. Parameters now go in
  the query string, which is what makes the documented `method: 'GET'`
  example work.
- A `null` anywhere in `content` threw instead of being skipped:
  `typeof null === "object"` sent the flattener into `Object.entries(null)`.
- The token and the function name are escaped when building the URL rather
  than concatenated into the query string raw.
- Trailing slashes in `rootURL` are trimmed without a backtracking regular
  expression, which code scanning flagged as a polynomial ReDoS on caller
  input.

### Migrating from 1.x

Read `response.data` exactly as before — it is unchanged. What is gone is
the rest of the axios response object: `config`, `request` and the raw
`headers` plain object have no equivalent, and `headers` is now a `Headers`,
so `response.headers['content-type']` becomes
`response.headers.get('content-type')`.

Replace deep imports with named ones from the package root:

```ts
// before
import { InvalidToken } from "moodle-web-service-client/lib/errors/invalid-token-error";
// after
import { InvalidToken } from "@didactika/moodle-client";
```

Error handling needs no changes: the same seven classes are thrown, with the
same names, messages and status codes. Calls that already used
`method: 'GET'` will start sending their parameters for the first time — if
anything downstream depended on that call arriving empty, it will now behave
differently, and correctly.

## [1.1.2] - 2026-08-10

### Changed

- **Renamed** from `moodle-web-service-client` to `@didactika/moodle-client`.
  Same code, same version number — this release exists only to move the
  package under its new name. The old package is deprecated on npm and
  points here.

Published directly to npm under the old name with no corresponding git tag
or commit — the last one this repository's history can account for is
`v1.1.1`. This release brings the two back in sync.

## [1.1.1] - 2023-10-30

Documentation and metadata only; no code changes.

## [1.1.0] - 2023-10-29

### Added

- Structured error types for failed requests — `AccessExceptionError`,
  `BadRequestError`, `InvalidParameterError`, `InvalidRecordError`,
  `InvalidTokenError`, `MoodleExceptionError`, `UrlError` — with a shared
  error handler that maps a Moodle web service error response to the right
  one.

## [1.0.1] - 2023-10-28

### Fixed

- Removed a leftover debug `console.log` of the request content.

## [1.0.0] - 2023-10-28

Initial release.
