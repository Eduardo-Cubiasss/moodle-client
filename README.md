# moodle-web-service-client

Package to format service request in Moodle web service format

## Table of Contents

<!-- DON'T EDIT THIS SECTION -->

- [moodle-web-service-client](#moodle-web-service-client)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Debug errors Information](#debug-errors-information)
  - [Examples](#examples)
    - [General Use](#general-use)
    - [General Use with another methods](#general-use-with-another-methods)
  - [Docs](#docs)
  - [Issues](#issues)
    - [🐛 Bugs](#-bugs)
    - [💡 Feature Requests](#-feature-requests)
  - [Contributors](#contributors)
  - [LICENSE](#license)

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/).

Before installing, [download and install Node.js](https://nodejs.org/en/download/).

If this is a brand new project, make sure to create a `package.json` first with
the [ `npm init` command](https://docs.npmjs.com/creating-a-package-json-file).

Installation is done using the
[ `npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```console
$ npm install moodle-web-service-client
```

## Debug errors Information
To activate debug options.

Go to moodle -> site administration -> developer -> debugging 

In debugging messages select developer options.

## Examples

### General Use

If you want to use the default method (POST) you can use the following example.

```ts
import {moodleClient} from "moodle-web-service-client/lib";
 const response = await moodleClient({
  urlRequest: {
    rootURL: 'http://localhost/moodle',
    token: 'aeb315e6dd3affc18352fe46124cdd48',
    webServiceFunction: 'core_course_get_courses',
  },
  content: {
   options: {
    ids: [1, 2, 3],
   },
  },
 });
```

### General Use with another methods

If you want to use another methods like POST, PUT, DELETE, PATCH, etc. You can use the method property.

```ts
import {moodleClient} from "moodle-web-service-client/lib";
 const response = await moodleClient({
  urlRequest: {
    rootURL: 'http://localhost/moodle',
    token: 'aeb315e6dd3affc18352fe46124cdd48',
    webServiceFunction: 'core_course_get_courses',
  },
  content: {
   options: {
    ids: [1, 2, 3],
   },
  },
  method: 'GET',
 });
```

## Docs

[**Read The Docs**](https://docs.moodle.org/dev/Creating_a_web_service_client)

## Issues

Looking to contribute? Look for the label.

### 🐛 Bugs

Please file an issue for bugs, missing documentation, or unexpected behavior.

[**See Bugs**](https://github.com/hector-ae21/moodle-web-service-client/issues)

### 💡 Feature Requests

Please file an issue to suggest new features. Vote on feature requests by adding
a 👍. This helps maintainers prioritize what to work on.

[**See Feature Requests**](https://github.com/hector-ae21/moodle-web-service-client/issues)

## Contributors

<!-- Do not remove or modify this section -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/hector-ae21"><img src="https://avatars.githubusercontent.com/u/87265357?v=4" width="100px;" alt="Hector L. Arrechea"/><br /><sub><b>Hector L. Arrechea</b></sub></a><br /><a title="Code">💻</a> <a title="Documentation">📖</a> <a title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a title="Tests">⚠️</a></td>
    </tr>
  </tbody>
</table>

<!-- ALL-CONTRIBUTORS-LIST:END -->

## LICENSE

[MIT](LICENSE)