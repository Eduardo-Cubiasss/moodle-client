# Errors

A failed call throws. It does not resolve with an error object, and it does
not resolve with `ok: false` for a Moodle-level failure — by the time a
response reaches you, it has already been checked.

Every error extends `Error` and carries:

| Property | |
| --- | --- |
| `name` | the Moodle error code in camelCase, e.g. `invalidToken` |
| `message` | a fixed, human-readable sentence |
| `status` | an HTTP status describing the kind of failure |
| `debugInfo` | Moodle's `debuginfo`, when the site sent one |

## What gets thrown

| Error | Thrown when Moodle reports | `status` |
| --- | --- | --- |
| `InvalidToken` | `invalidtoken` | 401 |
| `AccessException` | `accessexception` | 403 |
| `InvalidParameter` | `invalidparameter` | 400 |
| `InvalidRecord` | `invalidrecord` | 404 |
| `MoodleException` | any other code flagged as a `moodle_exception` | the site's own status |
| `BadRequestError` | any other code | 400 |
| `URLError` | the site could not be reached, or answered with a failing status and no Moodle error in it | 404 |

## Telling them apart

```ts
import {
  moodleClient,
  AccessException,
  InvalidToken,
  MoodleException,
  URLError,
} from "@didactika/moodle-client";

try {
  await moodle.call("core_course_get_courses");
} catch (error) {
  if (error instanceof InvalidToken) {
    // wrong token, or it expired: reissue it
  } else if (error instanceof AccessException) {
    // the token is valid, but its user lacks the capability, or the
    // function is not on the external service this token belongs to
  } else if (error instanceof URLError) {
    // never reached the web service: wrong site URL, site down, proxy
  } else if (error instanceof MoodleException) {
    console.error(error.status, error.message, error.debugInfo);
  } else {
    throw error;
  }
}
```

## Why status codes come from two places

Moodle answers `200 OK` even when the web service call failed, and puts the
failure in the body. That is why `status` on an error is not simply the HTTP
status: for the four codes above it describes the *kind* of failure, and
only `MoodleException` carries whatever the site actually returned.

`URLError` is the other side of that. It means the request never got as far
as the web service — a wrong `rootURL`, a site that is down, a proxy
answering instead — so there is no Moodle error to report. A connection that
fails outright (DNS, refused, TLS) produces the same thing.

## Getting Moodle to explain itself

`debugInfo` is only populated when the site is willing to send it. Turn it
on under *Site administration -> Development -> Debugging*, with the
debugging level set to *DEVELOPER*.

Leave it off in production: `debuginfo` can contain SQL, file paths and
stack traces, and this client will pass all of it straight through to
whatever logs your `catch` block writes to.

## The ones that are not thrown

An empty result is not an error. `core_course_get_courses` with an id that
does not exist returns an empty array with `status: 200`, and you get a
normal response. Check `data` for emptiness yourself — the client does not
guess at which empty answers were meant to be failures.
