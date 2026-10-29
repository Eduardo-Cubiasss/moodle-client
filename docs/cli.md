# CLI Reference

Four commands manage the schema namespaces declared under `"moodle-client"` in
`package.json`:

| Command | What it does |
| --- | --- |
| [`moodle-create-schemas`](#moodle-create-schemas) | adds a namespace and generates it |
| [`moodle-update-schemas`](#moodle-update-schemas) | changes a namespace and, with `--sync`, regenerates only that one |
| [`moodle-delete-schemas`](#moodle-delete-schemas) | removes a namespace and its generated files |
| [`moodle-generate-schemas`](#moodle-generate-schemas) | generates every namespace (or the ones you name) |

`create`, `update` and `delete` work in two modes:

- **Wizard:** run the command with no schema options and it asks for each value.
- **One line:** pass the values as options and it runs without asking anything, which
  makes it usable in scripts and CI.

```bash
npx moodle-create-schemas                       # wizard
npx moodle-create-schemas --namespace moodle45 \
    --source.type moodle-official --source.version 4.5   # one line
```

Every command accepts `--help` (`-h`). Any option that is not listed there is rejected
with `ERR_CLI_UNKNOWN_OPTION`, so a mistyped option never goes unnoticed. Commands exit
with `0` on success and `1` on any error, after printing it in the format described in
[errors.md](errors.md#schema-generation-and-cli-errors).

---

## Contents

- [Local paths](#local-paths)
- [Schema options](#schema-options)
- [Source types](#source-types)
- [Namespace names](#namespace-names)
- [`moodle-create-schemas`](#moodle-create-schemas)
- [`moodle-update-schemas`](#moodle-update-schemas)
- [`moodle-delete-schemas`](#moodle-delete-schemas)
- [`moodle-generate-schemas`](#moodle-generate-schemas)
- [Where files are written](#where-files-are-written)
- [Running inside Docker](#running-inside-docker)

---

## Local paths

The path of a `moodle-local` source is **never saved** in `package.json`: it is different
on every machine. Its entry keeps only `{ "type": "moodle-local" }`, and the path is given
each time the namespace has to be generated (`moodle-generate-schemas --force` or
`--namespace`, a namespace without schemas in its `outDir`, `moodle-create-schemas`, and
`moodle-update-schemas --sync`). It comes from:

- `--source.path <dir>`, in `create` and `update`;
- otherwise, a question in the terminal, one per local namespace to generate:

```text
Please enter the path to your Moodle directory for 'localDev' (it is not saved)
~ Example: ~/projects/moodle ~
Path: _
```

Without a terminal to ask on (CI, a script, `docker exec` without `-t`), a missing path fails
with `ERR_LOCAL_PATH_REQUIRED` instead of waiting for an answer. The path is never read from
an environment variable or a `.env` file.

Synchronizing schemas that are already in `outDir` (a plain `moodle-generate-schemas`) never
asks for it. A `path` saved by an older version is ignored, and dropped the next time
`moodle-update-schemas` saves that entry.

---

## Schema options

`create` and `update` share these options. Each one is named after the key it sets in a
`"moodle-client"` entry:

| Option | Entry key | Notes |
| --- | --- | --- |
| `--namespace <name>` | `namespace` | Required. See [Namespace names](#namespace-names). |
| `--source.type <type>` | `source.type` | `moodle-official`, `moodle-repository` or `moodle-local`. |
| `--source.version <x.y>` | `source.version` | `moodle-official` only. `4.5.2` is stored as `4.5`. Must be 2.0 or later. |
| `--source.url <url>` | `source.url` | `moodle-repository` only. `http://`, `https://`, `git@` or `ssh://`. |
| `--source.branch <name>` | `source.branch` | `moodle-repository` only. Branch or tag; defaults to `main`. |
| `--source.path <dir>` | | `moodle-local` only. Must exist. `~/` is expanded. **Never saved**: see [Local paths](#local-paths). |
| `--webservices <list>` | `webservices` | Comma-separated names or `prefix_*` patterns. Defaults to `*`. Quote it in the shell: `"core_*,local_*"`. |
| `--outDir <dir>` | `outDir` | Required for `moodle-repository` and `moodle-local`. |
| `--config <path>` | | The `package.json` to read and write; defaults to `./package.json`. |

Both `--option value` and `--option=value` work.

A source option that does not belong to the chosen type (for example `--source.url` with
`moodle-official`) is rejected rather than ignored.

---

## Source types

Only three values are accepted for `source.type`:

| Type | Required fields | Optional fields | `outDir` |
| --- | --- | --- | --- |
| `moodle-official` | `version` | | optional |
| `moodle-repository` | `url` | `branch` (default `main`) | required |
| `moodle-local` | | (the path is never saved) | required |

The short names used by pre-release builds are rejected with `ERR_CONFIG_INVALID_SOURCE_TYPE`. The
error names the replacement for each one:

| Old value | Use instead |
| --- | --- |
| `moodle`, `official` | `moodle-official` |
| `repository`, `remote`, `git` | `moodle-repository` |
| `local` | `moodle-local` |

To migrate an old entry, run `npx moodle-update-schemas --namespace <name> --sync`. It
rewrites the type, keeps every other field and regenerates the namespace.

---

## Namespace names

A namespace becomes a property of the client (`moodle.<namespace>`) and part of the
generated type names. It must therefore be a valid JavaScript identifier:

- letters, digits, `_` or `$`;
- not starting with a digit.

`moodle50`, `moodle5_0` and `localDev` are valid. `moodle5.0`, `local-dev` and `5moodle`
are not.

`webservice` is **reserved**. It is the namespace bundled with the package (Moodle 4.5),
part of the library rather than of your configuration:

- it never appears in `package.json`;
- `create`, `update` and `generate --namespace` reject it.

An entry named `webservice` in `package.json`, for example one added by hand, makes every
generation fail with `ERR_CONFIG_RESERVED_NAMESPACE`. Remove it with
`npx moodle-delete-schemas --namespace webservice`: this only deletes the entry, never the
bundled schemas.

An invalid name is rejected when it is created, and an existing one makes
`moodle-generate-schemas` fail with `ERR_CONFIG_INVALID_NAMESPACE`. Otherwise the
generated declarations would not compile.

---

## `moodle-create-schemas`

Adds one namespace to `package.json` and generates it right away.

```bash
# Official release, no files in the project
npx moodle-create-schemas --namespace moodle45 \
    --source.type moodle-official --source.version 4.5

# Remote Git repository
npx moodle-create-schemas --namespace myRepo \
    --source.type moodle-repository \
    --source.url https://git.example.com/org/moodle.git \
    --source.branch release \
    --outDir src/moodle

# Local checkout, only some services
npx moodle-create-schemas --namespace localDev \
    --source.type moodle-local --source.path ~/moodle \
    --webservices "core_user_*,local_myplugin_*" \
    --outDir src/moodle
```

- **One-line mode** starts as soon as any schema option is given. It needs
  `--namespace`, `--source.type` and the fields that type requires; `--webservices`
  defaults to `*`.
- **The wizard** asks the same questions and can create several namespaces in one session.
- **A local source** is generated from the path given (`--source.path` or the question),
  and saved without it.

If generation fails (bad credentials, unreachable host, wrong path…), `package.json` is
restored exactly as it was, and the directories created for the new namespace are
removed.

---

## `moodle-update-schemas`

Changes an existing namespace, saves it to `package.json` and then, if you choose,
**synchronizes** it: it regenerates the schemas of that namespace only. The other
namespaces keep their schemas.

> Always synchronize after an update: answer `y` in the wizard, or add `--sync` to the
> one-line command. Until you do, the generated types still describe the previous
> configuration.

```bash
# Change one field and synchronize
npx moodle-update-schemas --namespace myRepo --source.branch release-2 --sync
npx moodle-update-schemas --namespace localDev --webservices "core_user_*" --sync

# Move the generated files to another directory
npx moodle-update-schemas --namespace myRepo --outDir src/schemas --sync

# Switch source type: give the new type's fields
npx moodle-update-schemas --namespace myRepo \
    --source.type moodle-local --source.path ~/moodle --sync

# Regenerate it as it is (also migrates an old source type)
npx moodle-update-schemas --namespace myRepo --sync
```

### One-line mode

It starts when `--namespace` is given, and only the options you pass change.

- **Changing `--source.type`** replaces the whole source, so the fields the new type
  requires must be given too.
- **Option values** are validated before anything is written: an invalid value changes
  nothing.

| Options given | Result |
| --- | --- |
| field options, `--sync` | saves the changes, then regenerates the namespace |
| field options | saves the changes only, and prints how to synchronize later |
| `--namespace` and `--sync` only | regenerates the namespace with its current configuration |
| `--namespace` only | nothing, unless the entry used an old source type: then the migrated type is saved |

A local source is saved without its path. To regenerate it, `--sync` takes the path from
`--source.path` or a question; without `--sync`, `--source.path` is not used.

### Wizard

The wizard lists the namespaces, then asks every field with its **current value already
typed in the line**:

```text
Please enter the branch or tag (empty for main)
Branch: release
```

- Press Enter to keep the value, or edit it like any text.
- Delete it completely to clear an optional field (`outDir` of an official source). For
  a required field, an empty value is rejected and the question is asked again.

It then shows only the fields that changed, saves them, and asks whether to synchronize:

```text
myRepo
  source.branch: main -> release
[moodle-client] Configuration of 'myRepo' saved to package.json.
-------------------------------------------------------------------------------------
Do you want to synchronize the schemas for myRepo? (y/n)
Response: y
```

Press Ctrl+C before the summary to leave without saving.

### If synchronization fails

Before regenerating, the namespace's current generated files are copied aside. If
generation fails (bad credentials, unreachable host…):

- those files are restored, so the previous schemas keep working;
- the configuration you saved **stays saved**. The command fails with `ERR_SYNC_FAILED`,
  which names the cause.

Fix the cause and retry with `npx moodle-generate-schemas --namespace <name>`, or correct
the options with `npx moodle-update-schemas --namespace <name> ... --sync`.

If `outDir` changed, the namespace is removed from the old directory only after a
successful synchronization. Files there that moodle-client did not generate are kept.

### Other invalid entries

Synchronizing one namespace does not depend on the others. If another entry is invalid
(for example it still uses an old source type), it is skipped with a warning, and its
existing schemas are left untouched:

```text
[moodle-client] Warning: skipped 'myRepo', its configuration is invalid; its schemas were left untouched.
  Configuration 'myRepo' uses source type 'repository', which is no longer supported. Use 'moodle-repository' instead.
```

The same applies to `moodle-create-schemas` and `moodle-generate-schemas --namespace`.
Only a full `moodle-generate-schemas` fails on any invalid entry.

---

## `moodle-delete-schemas`

Removes a namespace from `package.json` and deletes its generated files: those in
`outDir/<namespace>` and the copies inside the package. It then refreshes the master
barrel.

```bash
npx moodle-delete-schemas --namespace myRepo
npx moodle-delete-schemas --namespace myRepo --purge
```

| Option | Effect |
| --- | --- |
| `--namespace <name>` | Namespace to delete; runs without prompts. |
| `--purge` | Also delete files in `outDir/<namespace>` that moodle-client did not generate. Without it they are kept, and the command says so. |

With `--namespace webservice`, only an entry of that name is removed from `package.json`.
The bundled schemas themselves cannot be deleted.
| `--config <path>` | The `package.json` to use. |

The wizard asks for the namespace from a numbered list. If `outDir/<namespace>` contains
files that were not generated, it asks whether to delete them too. The `outDir` directory
itself is never deleted.

---

## `moodle-generate-schemas`

Generates the declarations of every namespace in `package.json`.

```bash
npx moodle-generate-schemas                          # all namespaces, using caches
npx moodle-generate-schemas --namespace myRepo      # regenerate only myRepo
npx moodle-generate-schemas --namespace myRepo,localDev
npx moodle-generate-schemas --force                  # regenerate everything
```

| Option | Effect |
| --- | --- |
| `--namespace <name>` | Regenerate these namespaces from scratch; the rest are handled as usual (copied from their cache when it exists). Repeatable, or comma-separated. An unknown name fails with `ERR_NAMESPACE_NOT_FOUND`. |
| `-f`, `--force` | Regenerate every namespace from scratch. |
| `--config <path>` | The `package.json` to use. |

Without `--force` or `--namespace`, a namespace whose `outDir` already contains schemas is
copied from there in well under a second, without downloading or extracting anything.

The bundled `webservice` namespace (see [Namespace names](#namespace-names)) is always
available and never regenerated, so a project with no `"moodle-client"` entries generates
nothing. Generating never edits `package.json`: only `create`, `update` and `delete` change
it.

---

## Where files are written

For each namespace, generation writes to:

| Location | When |
| --- | --- |
| `<outDir>/<namespace>/…/*.webservice.d.ts` | when the entry has `outDir` |
| `<outDir>/index.d.ts` | master barrel of that `outDir`, unless you wrote your own `index.d.ts` there |
| `node_modules/@didactika/moodle-client/dist/schemas/<namespace>/` | always: this is what `moodle.<namespace>` resolves to |

Regeneration only replaces files moodle-client generated. Your own files in the same
directories are left alone.

---

## Running inside Docker

Regenerating a local namespace asks for its path, so attach a terminal (`-it`), and give
the path as the container sees it:

```bash
docker exec -it <container> npx moodle-generate-schemas --force
```

The commands write into `node_modules/@didactika/moodle-client/dist/schemas`. If you run
them in a container as `root` on a mounted project, those files end up owned by root.
The next run on the host, as your user, then fails with `EACCES` when it tries to replace
them.

To avoid it, run the container with your user and group ids (the output of `id -u` and
`id -g` on the host), for example in `docker-compose.yml`:

```yaml
services:
  app:
    user: "1000:1000"
```

Otherwise, always run the commands from the same side, either always in the container or
always on the host.

To repair files that already belong to root, change their owner from the container:

```bash
docker exec <container> chown -R "$(id -u):$(id -g)" /path/to/project
```
