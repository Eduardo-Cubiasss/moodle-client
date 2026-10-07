# Web Services and Schema Generation Guide

This guide covers direct consumption of typed Moodle Web Services in `@didactika/moodle-client` and how to configure custom schema environments using the CLI tools.

---

## 1. Out-of-the-Box Usage: Default Web Services (`moodle.webservice.*`)

The package includes **700+ pre-bundled, strongly-typed Moodle official web services** under the default `webservice` namespace. You do not need to generate or configure anything to start using them immediately.

### 1.1 Initialization and First Call

```typescript
import { MoodleClient } from "@didactika/moodle-client";

const moodle = new MoodleClient({
  rootURL: "https://moodle.example.com",
  token: process.env.MOODLE_TOKEN!,
});

// Full IDE autocompletion for function names, parameter shapes, and return types
const { data: site } = await moodle.webservice.core_webservice_get_site_info();
console.log(site.sitename, site.username);
```

### 1.2 Passing Typed Parameters

TypeScript interfaces enforce correct input types at compile-time while the client flattens nested objects into Moodle's required REST parameter format:

```typescript
import { MoodleClient } from "@didactika/moodle-client";
import type { webservice } from "@didactika/moodle-client";

const moodle = new MoodleClient({
  rootURL: "https://moodle.example.com",
  token: process.env.MOODLE_TOKEN!,
});

const params: webservice.CoreCourseGetCoursesParams = {
  options: {
    ids: [1, 2, 3],
  },
};

const response = await moodle.webservice.core_course_get_courses(params);
const courses: webservice.CoreCourseGetCoursesReturns = response.data;

for (const course of courses) {
  console.log(`[${course.id}] ${course.fullname}`);
}
```

---

## 2. CLI Commands: Environment Configuration

When you need schemas for different Moodle versions, local plugin directories, or remote Git repositories, use the following CLI tools:

### 2.1 Create Schema Configurations (`moodle-create-schemas`)

Launches an interactive prompt to register new schema sources in your `package.json`:

```bash
npx moodle-create-schemas
```

* **Namespace:** Identifier used on the client instance (`moodle.<namespace>.<function>`).
* **Source:**
  * `[1] Moodle Official (GitHub):` Official Moodle releases (e.g. `4.4`, `5.0`).
  * `[2] Moodle Local (Directory):` Local filesystem path to a Moodle installation.
  * `[3] Remote Repository (Configurable):` Remote Git repository URL (HTTPS/SSH) and branch.
* **Webservices Pattern:** Filter function names (e.g. `*` for all, or `core_user_*`).
* **Output Directory (`outDir`):** Mandatory for `Local` and `Remote Repository` (e.g. `src/schemas`).

### 2.2 Generate and Synchronize Schemas (`moodle-generate-schemas`)

Reads configurations from `package.json`, extracts PHP service signatures, and compiles TypeScript `.d.ts` declaration files:

```bash
npx moodle-generate-schemas
```

* **Smart Cache Skip:** When schemas already exist in `outDir`, generation is skipped and synchronized in ~0.2 seconds.
* **Force Regeneration (`--force`):**
  ```bash
  npx moodle-generate-schemas --force
  ```
  Bypasses cache, purges outdated schema files, and re-clones/re-extracts from scratch.

### 2.3 Delete Schema Configurations (`moodle-delete-schemas`)

Interactively removes a configured namespace:

```bash
npx moodle-delete-schemas
```

* Select the namespace from a numbered menu.
* Removes the configuration entry from `package.json` and deletes generated schema files, preserving custom user files.

---

## 3. Configuration in `package.json`

Configured schema sources are saved in the `"moodle-client"` array of your `package.json`:

```json
{
  "name": "my-app",
  "dependencies": {
    "@didactika/moodle-client": "^2.3.10"
  },
  "moodle-client": [
    {
      "namespace": "webservice",
      "source": {
        "type": "moodle",
        "version": "4.5"
      },
      "webservices": ["*"]
    },
    {
      "namespace": "customRepo",
      "source": {
        "type": "repository",
        "url": "https://gitlab.example.com/org/moodle.git",
        "branch": "main"
      },
      "webservices": ["*"],
      "outDir": "src/schemas"
    },
    {
      "namespace": "localDev",
      "source": {
        "type": "local",
        "path": "../moodle-dev"
      },
      "webservices": ["local_myplugin_*"],
      "outDir": "src/schemas"
    }
  ]
}
```

### Configuration Options:

| Property | Type | Description |
| --- | --- | --- |
| `namespace` | `string` | Unique identifier on client instance (`moodle.<namespace>`). |
| `source.type` | `string` | `"moodle"` (or `"official"`), `"local"`, or `"repository"`. |
| `source.version` | `string` | Moodle version string (required for `"moodle"`). |
| `source.path` | `string` | Local directory path (required for `"local"`). |
| `source.url` | `string` | Git clone URL (required for `"repository"`). |
| `source.branch` | `string` | Git branch or tag (optional for `"repository"`, default: `"main"`). |
| `webservices` | `string[]` | Function matching patterns (e.g. `["*"]`). |
| `outDir` | `string` | Project output directory (required for `local` and `repository`). |

---

## 4. Code Examples

### 4.1 Multiple Namespaces on a Single Client

After running `npx moodle-generate-schemas`, custom namespaces are automatically merged into `MoodleClient`:

```typescript
import { MoodleClient } from "@didactika/moodle-client";
import type { webservice, customRepo, localDev } from "@didactika/moodle-client";

const moodle = new MoodleClient({
  rootURL: "https://moodle.example.com",
  token: process.env.MOODLE_TOKEN!,
});

// 1. Pre-bundled official namespace 'webservice' (included out-of-the-box, no generation required):
// Calls official core Moodle functions with complete autocomplete and strict compile-time types.
const { data: siteInfo } = await moodle.webservice.core_webservice_get_site_info();

// 2. Custom namespace 'customRepo' generated from a remote Git repository configured in package.json:
// Invokes functions from an institutional repository/fork, completely typed and isolated.
const { data: users } = await moodle.customRepo.core_user_get_users({
  criteria: [{ key: "id", value: "1" }],
});

// 3. Custom namespace 'localDev' generated from a local development folder containing custom plugins:
// Gives instant type-checking and autocomplete for local plugin functions (e.g. local_myplugin_*).
const { data: customData } = await moodle.localDev.local_myplugin_get_info();

console.log(siteInfo.sitename, users.users.length, customData);
```

### 4.2 Entity Creation (Write Operations)

```typescript
const { data: newCourses } = await moodle.webservice.core_course_create_courses({
  courses: [
    {
      fullname: "TypeScript Architecture",
      shortname: "TS-ARCH",
      categoryid: 1,
    },
  ],
});

console.log("Course created with ID:", newCourses[0]?.id);
```

### 4.3 Semantic Error Handling

```typescript
import {
  MoodleClient,
  InvalidToken,
  AccessException,
  InvalidParameter,
} from "@didactika/moodle-client";

try {
  await moodle.webservice.core_course_get_courses();
} catch (error) {
  if (error instanceof InvalidToken) {
    console.error("Token is invalid or expired.");
  } else if (error instanceof AccessException) {
    console.error("User lacks permission for this function.");
  } else if (error instanceof InvalidParameter) {
    console.error("Invalid parameter:", error.debugInfo);
  } else {
    console.error("Error:", error);
  }
}
```
