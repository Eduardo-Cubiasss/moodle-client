# Changelog

All notable changes to this project are documented in this file. The format
follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this
project uses [Semantic Versioning](https://semver.org/): the first number for
breaking changes, the middle for backward-compatible features, the last for
fixes — security fixes included, always. See the org's
[SECURITY.md](https://github.com/didactika/.github/blob/main/SECURITY.md) for
what that means for which versions get them.

Entries from before this file existed (0.x through 1.1.1) are backfilled from
the real git history — tag dates and the actual diff each release shipped —
not reconstructed from memory.

## [Unreleased]

## [1.1.2] - 2026-08-10

### Changed

- **Renamed** from `moodle-web-service-client` to `@didactika/moodle-client`.
  Same code, same version number — this release exists only to move the
  package under its new name. The old package is deprecated on npm and
  points here.

Published directly to npm under the old name with no corresponding git tag
or commit — the last one this repository's history can account for is
`v1.1.1`. This release brings the two back in sync.

## [1.1.1] - 2023-10-30

Documentation and metadata only; no code changes.

## [1.1.0] - 2023-10-29

### Added

- Structured error types for failed requests — `AccessExceptionError`,
  `BadRequestError`, `InvalidParameterError`, `InvalidRecordError`,
  `InvalidTokenError`, `MoodleExceptionError`, `UrlError` — with a shared
  error handler that maps a Moodle web service error response to the right
  one.

## [1.0.1] - 2023-10-28

### Fixed

- Removed a leftover debug `console.log` of the request content.

## [1.0.0] - 2023-10-28

Initial release.
