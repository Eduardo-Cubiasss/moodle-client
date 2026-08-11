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

Node 20 or newer, and a Moodle site with web services enabled and a token
for the functions you intend to call.

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
import { moodleClient } from "@didactika/moodle-client";

const response = await moodleClient({
  urlRequest: {
    rootURL: "http://localhost/moodle",
    token: "aeb315e6dd3affc18352fe46124cdd48",
    webServiceFunction: "core_course_get_courses",
  },
  content: {
    options: {
      ids: [1, 2, 3],
    },
  },
});

console.log(response.data);
```

`content` is nested freely and flattened into the `parent[child][index]` keys
Moodle reads, so the example above goes out as `options[ids][0]=1`,
`options[ids][1]=2`, `options[ids][2]=3`. `null` and `undefined` are dropped.

### Choosing the method

`POST` is used when `method` is omitted. `GET` and `HEAD` send their
parameters in the query string; every other method sends a urlencoded body.

```ts
const response = await moodleClient({
  urlRequest: { rootURL, token, webServiceFunction: "core_course_get_courses" },
  content: { options: { ids: [1, 2, 3] } },
  method: "GET",
});
```

### Typing the response

The body is `any` by default. Pass a type argument to have it checked:

```ts
type Course = { id: number; fullname: string };

const { data } = await moodleClient<Course[]>({
  urlRequest: { rootURL, token, webServiceFunction: "core_course_get_courses" },
  content: {},
});
```

### What a call resolves to

| Field | Type | |
| --- | --- | --- |
| `data` | `T` | the parsed JSON body, or the raw text when it is not JSON |
| `status` | `number` | HTTP status code |
| `statusText` | `string` | HTTP status text |
| `ok` | `boolean` | whether the status was a 2xx |
| `headers` | `Headers` | response headers |

## Errors

A failed call throws rather than resolving. Every error carries `name`,
`message`, `status`, and `debugInfo` when Moodle supplied one.

| Error | Thrown when Moodle reports | `status` |
| --- | --- | --- |
| `InvalidToken` | `invalidtoken` | 401 |
| `AccessException` | `accessexception` | 403 |
| `InvalidParameter` | `invalidparameter` | 400 |
| `InvalidRecord` | `invalidrecord` | 404 |
| `MoodleException` | any other code flagged as a `moodle_exception` | the site's own |
| `BadRequestError` | any other code | 400 |
| `URLError` | the site could not be reached, or answered with a failing status and no Moodle error in it | 404 |

```ts
import { moodleClient, InvalidToken, MoodleException } from "@didactika/moodle-client";

try {
  await moodleClient({ urlRequest, content: {} });
} catch (error) {
  if (error instanceof InvalidToken) {
    // the token is wrong or has expired
  } else if (error instanceof MoodleException) {
    console.error(error.status, error.message, error.debugInfo);
  }
}
```

### Getting Moodle to explain itself

`debugInfo` is only populated when the site is willing to send it. Turn it on
under *Site administration -> Development -> Debugging*, with the debugging
level set to *DEVELOPER*. Leave it off in production.

## Migrating from 1.x

`response.data` is unchanged. See the [CHANGELOG](CHANGELOG.md#200---2026-08-11)
for the full list, including the deep imports that were replaced by named
exports from the package root.

## Docs

[Creating a web service client](https://docs.moodle.org/dev/Creating_a_web_service_client)
on the Moodle developer wiki.

## Contributing

Bug reports and feature requests both go to
[the issue tracker](https://github.com/didactika/moodle-client/issues).

```console
npm install
npm test
npm run test:coverage
```

Unit tests live in `tests/unit`. Integration tests in `tests/integration` run
against a throwaway local HTTP server, so they need no Moodle install.

## Authors

Maintained by [Didactika](https://github.com/didactika).

- [Hector L. Arrechea](https://github.com/hector-ae21)

## License

[MIT](LICENSE)
