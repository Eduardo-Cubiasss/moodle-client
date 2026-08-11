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

Unit tests live in `tests/unit`. Integration tests in `tests/integration` run
against a throwaway local HTTP server, so they need no Moodle install.

## Contributors

Thanks to everyone who has contributed to this project:

[![Contributors](https://contrib.rocks/image?repo=didactika/moodle-client)](https://github.com/didactika/moodle-client/graphs/contributors)

## License

[MIT](LICENSE) — © [Didactika](https://github.com/didactika)
