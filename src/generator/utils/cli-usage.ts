/**
 * `--help` text of each CLI. Option names mirror the keys of a "moodle-client" entry in package.json.
 */

const ENTRY_OPTIONS = `Schema options (mirror the keys of a "moodle-client" entry):
  --namespace <name>          Namespace, used as moodle.<name> (letters, digits, _ or $)
  --source.type <type>        moodle-official | moodle-repository | moodle-local
  --source.version <x.y>      Moodle version            (moodle-official)
  --source.url <url>          Git clone URL             (moodle-repository)
  --source.branch <name>      Branch or tag, default main (moodle-repository)
  --source.path <dir>         Moodle source directory   (moodle-local; never saved)
  --webservices <patterns>    Comma-separated names or prefix_* patterns, default *
  --outDir <dir>              Output directory, required for moodle-repository and moodle-local`;

const LOCAL_PATH_NOTE = `The path of a moodle-local source is never saved in package.json. Without
--source.path it is asked.`;

const COMMON_OPTIONS = `  --config <path>             package.json to read and write (default ./package.json)
  -h, --help                  Show this help`;

export const GENERATE_USAGE = `Usage: moodle-generate-schemas [options]

Generates the TypeScript declarations of every namespace in package.json.
Namespaces with schemas already in their outDir are synchronized from there.

Regenerating a moodle-local namespace needs its path, which is never saved: it is asked
before generating.

Options:
  --namespace <name>          Regenerate only this namespace from scratch (repeatable, or a,b)
  -f, --force                 Regenerate every namespace from scratch
${COMMON_OPTIONS}

Examples:
  npx moodle-generate-schemas
  npx moodle-generate-schemas --namespace myRepo`;

export const CREATE_USAGE = `Usage: moodle-create-schemas [options]

Adds a namespace to package.json and generates it. Without schema options it starts the
interactive wizard; with them it runs without prompts.

${ENTRY_OPTIONS}

${LOCAL_PATH_NOTE}

Options:
${COMMON_OPTIONS}

Examples:
  npx moodle-create-schemas
  npx moodle-create-schemas --namespace moodle45 --source.type moodle-official --source.version 4.5
  npx moodle-create-schemas --namespace myRepo --source.type moodle-repository \\
      --source.url https://git.example.com/org/moodle.git --source.branch main --outDir src/moodle
  npx moodle-create-schemas --namespace localDev --source.type moodle-local \\
      --source.path ~/moodle --webservices "core_*,local_*" --outDir src/moodle`;

export const UPDATE_USAGE = `Usage: moodle-update-schemas [options]

Changes an existing namespace and saves it to package.json. Without --namespace it starts
the interactive wizard, which then asks whether to synchronize the schemas; with it it runs
without prompts and changes only the options given.

${ENTRY_OPTIONS}
  Changing --source.type replaces the whole source: give the new type's options too.

${LOCAL_PATH_NOTE} It is only
needed with --sync.

Options:
  --sync                      After saving, regenerate the namespace's schemas (recommended).
                              If that fails, the previous schemas are restored.
${COMMON_OPTIONS}

Examples:
  npx moodle-update-schemas
  npx moodle-update-schemas --namespace myRepo --source.branch release-2 --sync
  npx moodle-update-schemas --namespace localDev --webservices "core_user_*" --sync
  npx moodle-update-schemas --namespace myRepo --sync      # regenerate as it is`;

export const DELETE_USAGE = `Usage: moodle-delete-schemas [options]

Removes a namespace from package.json and deletes its generated files. Without --namespace
it starts the interactive wizard; with it it runs without prompts.

Options:
  --namespace <name>          Namespace to delete
  --purge                     Also delete files in the namespace directory that moodle-client
                              did not generate (kept by default)
${COMMON_OPTIONS}

Examples:
  npx moodle-delete-schemas
  npx moodle-delete-schemas --namespace myRepo`;
