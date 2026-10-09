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
  MoodleClient,
  AccessException,
  InvalidParameter,
  InvalidRecord,
  InvalidToken,
  MoodleException,
  URLError,
} from "@didactika/moodle-client";

const moodle = new MoodleClient({ rootURL, token });

try {
  // Works identically with direct methods or dynamic call():
  await moodle.webservice.core_course_get_courses({ options: { ids: [1] } });
  // or: await moodle.call("core_course_get_courses", { options: { ids: [1] } });
} catch (error) {
  if (error instanceof InvalidToken) {
    // wrong token, or it expired: reissue it
  } else if (error instanceof AccessException) {
    // the token is valid, but its user lacks the capability, or the
    // function is not on the external service this token belongs to
  } else if (error instanceof InvalidParameter) {
    // parameters were invalid, missing or unexpected
    console.error("Invalid parameter:", error.debugInfo);
  } else if (error instanceof InvalidRecord) {
    // requested record (e.g. course or user ID) was not found
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

---

## Schema Generation and CLI Errors

When configuring, downloading, or generating schemas using the CLI commands (`moodle-create-schemas`, `moodle-generate-schemas`, `moodle-delete-schemas`), errors are captured and presented in a structured format:

```text
[moodle-client] ERROR: <Title> (<CODE>)
Details: <Clear description of failure cause>
Action:  <Actionable remediation command or step>
```

### Remediation Strategy

The CLI error architecture distinguishes between corrupt schema declarations and environment or configuration issues:

1. **Corrupted Schemas (`ERR_SCHEMA_MALFORMED`)**: Recommends running `npx moodle-delete-schemas` to select and delete the corrupted schema, then `npx moodle-create-schemas` to regenerate. Triggered only when `.webservice.d.ts` files are 0 bytes or contain no exported types.
2. **Environment, Credentials, and Permissions**: Recommends direct commands to resolve the root cause without deleting configurations:
   - **Git Credentials (`ERR_REPOSITORY_AUTH_FAILED`)**: Instructs configuring Git's credential store: `git config --global credential.helper store` and verifying `~/.git-credentials`.
   - **Repository Inaccessible (`ERR_REPOSITORY_NOT_FOUND`)**: Displays the exact failing URL and advises checking `source.url` in `package.json`.
   - **Permissions (`ERR_MOODLE_PATH_PERMISSION_DENIED`, `ERR_OUTPUT_DIRECTORY_NOT_WRITABLE`)**: Instructs setting filesystem permissions (e.g. `chmod u+rx` or `chmod u+w`).
   - **Missing Binaries (`ERR_GIT_NOT_FOUND`, `ERR_PHP_NOT_FOUND`, `ERR_PHP_VERSION_UNSUPPORTED`)**: Instructs installing or updating required executables in the system PATH.
3. **Unexpected Issues (`ERR_UNKNOWN`)**: Prompts the user to report the issue at `https://github.com/didactika/moodle-client/issues`, noting that reporting helps maintainers and the community improve the library.

### Transactional Rollback on Creation (`moodle-create-schemas`)

If initial schema generation fails during the interactive wizard (e.g. invalid credentials, unreachable host, wrong path):
- `package.json` is automatically reverted to its exact prior state (or removed if created during the run).
- Any empty or partial directories created under `outDir/<namespace>` and `dist/schemas/<namespace>` are cleaned up.
- The terminal input stream (`stdin`) is cleanly released.

### CLI Generator Error Reference

| Code | Title | Category | Trigger | Action |
| --- | --- | --- | --- | --- |
| `ERR_SCHEMA_MALFORMED` | Malformed Web Service Schema | Corrupt Schema | File `.webservice.d.ts` is empty (0 bytes) or lacks exported types. | Run `npx moodle-delete-schemas` to select and delete corrupted schema, then `npx moodle-create-schemas` to recreate. |
| `ERR_OUTPUT_DIRECTORY_NOT_WRITABLE` | Output Directory Not Writable | Permissions | Output directory cannot be written to (`W_OK` check failed). | Grant write permissions (e.g. `chmod u+w '<outDir>'`) or choose another directory. |
| `ERR_OUTPUT_DIRECTORY_EMPTY` | Output Directory Is Empty | State / Cleanup | Output directory exists but has no files when attempting deletion. | Run `npx moodle-generate-schemas` to compile schemas, or remove the configuration from `package.json`. |
| `ERR_MOODLE_PATH_PERMISSION_DENIED` | Moodle Path Permission Denied | Permissions | Directory or `version.php` lacks read or execute permissions. | Grant read and execute permissions (e.g. `chmod u+rx '<moodlePath>'`) and retry. |
| `ERR_REPOSITORY_AUTH_FAILED` | Repository Authentication Failed | Credentials | HTTP 401/403 when cloning remote repository. | Run `git config --global credential.helper store`, verify `~/.git-credentials`, then re-run generation. |
| `ERR_REPOSITORY_NOT_FOUND` | Remote Repository Not Found | Network / Config | Remote repository URL returned HTTP 404. | Check and correct `source.url` in `package.json`, or verify private repository access. |
| `ERR_NETWORK_DISCONNECTED` | Network Connection Failed | Network | Connection timeout, DNS failure, or network unreachable. | Check internet connection, proxy settings, or firewall and retry. |
| `ERR_GIT_NOT_FOUND` | Git Executable Not Found | Dependencies | `git` command is not installed or not in system PATH. | Install Git and ensure the `git` executable is accessible in PATH. |
| `ERR_PHP_NOT_FOUND` | PHP CLI Not Found | Dependencies | `php` command is not installed or not in system PATH. | Install PHP 7.4 or higher (PHP 8.1+ recommended) and ensure `php` is in PATH. |
| `ERR_PHP_VERSION_UNSUPPORTED` | Unsupported PHP Version | Dependencies | Installed PHP version is below required 7.4. | Upgrade PHP CLI installation to PHP 7.4 or higher. |
| `ERR_ARCHIVE_EXTRACTION_FAILED` | Archive Extraction Failed | System / Disk | Error unpacking downloaded Moodle tarball archive. | Check disk space and network integrity, or retry the command. |
| `ERR_CONFIG_FILE_NOT_FOUND` | Configuration File Not Found | Config | `package.json` or custom `--config` file does not exist. | Verify configuration file path. |
| `ERR_CONFIG_INVALID_JSON` | Invalid Configuration File | Config | Configuration file contains malformed JSON syntax. | Fix JSON syntax in configuration file. |
| `ERR_CONFIG_INVALID_ENTRY` | Invalid Configuration Entry | Config | Entry in `moodle-client` array is not an object. | Ensure all elements in `moodle-client` are valid configuration objects. |
| `ERR_CONFIG_MISSING_NAMESPACE` | Missing Configuration Namespace | Config | Entry is missing mandatory `namespace` property. | Specify a unique `namespace` string for each configuration. |
| `ERR_CONFIG_DUPLICATE_NAMESPACE` | Duplicate Configuration Namespace | Config | Multiple entries share the same `namespace`. | Assign a unique `namespace` to each configuration entry. |
| `ERR_CONFIG_MISSING_SOURCE` | Missing Configuration Source | Config | Entry is missing `source` object. | Define `source` with type `local`, `moodle`, or `repository`. |
| `ERR_CONFIG_MISSING_LOCAL_PATH` | Missing Local Path | Config | Local source is missing mandatory `source.path`. | Specify filesystem path to Moodle codebase in `source.path`. |
| `ERR_CONFIG_MISSING_OUTDIR_LOCAL` | Missing outDir in Local Mode | Config | Local source is missing required `outDir`. | Add `"outDir": "./schemas/local"` to the namespace configuration. |
| `ERR_CONFIG_MISSING_REPOSITORY_URL` | Missing Repository URL | Config | Repository source is missing `source.url`. | Specify Git clone URL in `source.url`. |
| `ERR_CONFIG_MISSING_OUTDIR_REPOSITORY` | Missing outDir in Repository Mode | Config | Repository source is missing required `outDir`. | Add `"outDir": "src/schemas"` to the namespace configuration. |
| `ERR_CONFIG_INVALID_SOURCE_TYPE` | Invalid Source Type | Config | Unknown `source.type` value. | Set `source.type` to `moodle-official`, `local`, or `repository`. |
| `ERR_MOODLE_VERSION_UNSUPPORTED` | Unsupported Moodle Version | Config | Moodle version is lower than minimum 2.0. | Set `source.version` to a supported Moodle release (>= 2.0, e.g. "4.5"). |
| `ERR_MOODLE_PATH_NOT_FOUND` | Moodle Path Not Found | Config / Path | Configured `moodlePath` or `source.path` does not exist on disk. | Verify directory exists on disk. |
| `ERR_MOODLE_PATH_NOT_ROOT` | Invalid Moodle Root Directory | Config / Path | Directory exists but does not contain `version.php`. | Set `source.path` directly to the Moodle root directory containing `version.php`. |
| `ERR_NO_SERVICES_FOUND` | No Web Services Found | Extraction | Moodle installation contains no `db/services.php` files. | Verify Moodle installation is complete with standard plugins. |
| `ERR_SERVICE_NOT_FOUND` | Web Service Not Found | Extraction | Configured function pattern matches no services. | Verify service names or wildcards (`*`) in `webservices` array. |
| `ERR_CLASS_NOT_FOUND` | Web Service Class Not Found | Extraction | External PHP class not found or not autoloadable. | Verify plugin containing the external class is installed and autoloadable. |
| `ERR_INTROSPECTION_FAILED` | Web Service Introspection Failed | Extraction | PHP introspection script crashed with fatal error. | Check PHP error logs or external function parameter definitions. |
| `ERR_UNKNOWN` | Operation Failed | Unexpected | Unhandled or uncategorized runtime exception. | Report issue at `https://github.com/didactika/moodle-client/issues`. |

