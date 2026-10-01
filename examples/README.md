# Examples

Runnable scripts, in the order they are worth reading.

| | |
| --- | --- |
| [01-site-info.ts](01-site-info.ts) | direct typed call to `core_webservice_get_site_info` — run this first to prove your setup |
| [02-reusing-a-client.ts](02-reusing-a-client.ts) | one client, multiple functions using direct methods and `.call()` |
| [03-typed-responses.ts](03-typed-responses.ts) | strongly-typed responses: bundled types out of the box vs dynamic `call<T>()` |
| [04-handling-errors.ts](04-handling-errors.ts) | telling the failure cases apart with semantic error classes |
| [05-one-shot-call.ts](05-one-shot-call.ts) | `moodleClient()`, without keeping a client around |

They import `@didactika/moodle-client` by name, exactly as your own code
would, so they can be copied out of here unchanged. That also means they are
not type-checked as part of this repository's `npm run typecheck`, which only
covers `src/` and `tests/`.

## Running them

Set the site and a token, then run whichever one you want:

```console
export MOODLE_URL="https://moodle.example.org"
export MOODLE_TOKEN="aeb315e6dd3affc18352fe46124cdd48"

npx tsx examples/01-site-info.ts
```

On PowerShell:

```console
$env:MOODLE_URL = "https://moodle.example.org"
$env:MOODLE_TOKEN = "aeb315e6dd3affc18352fe46124cdd48"

npx tsx examples/01-site-info.ts
```

If any of them fails with an `accessException`, the token is valid but the
function is not on the external service it belongs to, or its user lacks the
capability. [docs/getting-started.md](../docs/getting-started.md) covers
setting that up on the Moodle side.
