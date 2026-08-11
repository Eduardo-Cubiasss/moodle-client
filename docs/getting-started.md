# Getting started

## Install

```console
npm install @didactika/moodle-client
```

Node 20 or newer. The package has no runtime dependencies — it is built on
`fetch` and `URLSearchParams` from the standard library — and ships
CommonJS, ESM and type declarations, so `require` and `import` both work
with no configuration.

## Preparing the Moodle side

A web service call needs three things from the site, and none of them are
things this package can create for you.

**1. Web services enabled.** *Site administration -> General -> Advanced
features -> Enable web services*.

**2. The REST protocol enabled.** *Site administration -> Server -> Web
services -> Manage protocols*, and switch on *REST protocol*. This client
speaks REST with `moodlewsrestformat=json`; it does nothing with XML-RPC or
SOAP.

**3. A token, on a service that exposes the functions you plan to call.**
*Site administration -> Server -> Web services -> External services* to
define the service and add functions to it, then *Manage tokens* to issue a
token for a user on that service.

The token inherits the permissions of the user it was issued for. A call
that works for you as an administrator and fails for a service account is
almost always a capability problem on the Moodle side, not a problem here —
it will come back as an `AccessException`.

## The first call

```ts
import { MoodleClient } from "@didactika/moodle-client";

const moodle = new MoodleClient({
  rootURL: "https://moodle.example.org",
  token: process.env.MOODLE_TOKEN!,
});

const { data } = await moodle.call("core_webservice_get_site_info");

console.log(data.sitename, data.username);
```

`core_webservice_get_site_info` is the one worth starting with: it needs no
parameters and it tells you which user the token belongs to, so a successful
call confirms the site URL, the protocol and the token in one go.

`rootURL` is the site root — the URL you would type in a browser — not the
path to `server.php`. Trailing slashes are fine either way.

## Passing parameters

Moodle's REST endpoint has no notion of nested JSON: everything arrives as
flat `parent[child][index]` keys. Write the object the natural way and let
the client flatten it.

```ts
await moodle.call("core_course_get_courses", {
  options: {
    ids: [1, 2, 3],
  },
});
```

goes out as:

```
options[ids][0]=1&options[ids][1]=2&options[ids][2]=3
```

`null` and `undefined` are dropped, since Moodle has no representation for
either. Everything else is stringified.

## Two ways to call

`MoodleClient` settles the site, the token and the default method once, and
each call only names the function it wants. Prefer it whenever more than one
call goes to the same site.

```ts
const moodle = new MoodleClient({ rootURL, token });

await moodle.call("core_course_get_courses");
await moodle.call("core_user_get_users", { criteria: [{ key: "email", value: "a@b.c" }] });
```

`moodleClient()` is the one-shot form the package shipped with. It is not
going away, and it goes through exactly the same path.

```ts
import { moodleClient } from "@didactika/moodle-client";

const response = await moodleClient({
  urlRequest: { rootURL, token, webServiceFunction: "core_course_get_courses" },
  content: { options: { ids: [1, 2, 3] } },
});
```

## Where to go next

- [API reference](api-reference.md) — every class, method and type.
- [Errors](errors.md) — what gets thrown and how to tell the cases apart.
- [examples/](../examples) — runnable scripts for the usual shapes.
