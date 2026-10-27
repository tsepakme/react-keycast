# Changelog

Notable changes to `react-keycast` are recorded here.

## [Unreleased]

- Validate `timeout` and `maxKeys` at runtime and reject invalid numeric literals in TypeScript.
- Update the lockfile to `use-hotkeys-ts@1.2.3`; its stricter shortcut validation preserves the `*` wildcard used by the HUD.

## [1.0.13] - 2026-10-26

- Avoid rerendering the HUD when the key cleanup interval removes no entries.
- Add the V8 coverage provider and enable the `test:coverage` script.

## [1.0.12] - 2026-10-22

- Hide the overlay container when there are no keys to display.

## [1.0.11] - 2026-10-22

- Show modifier keys as a standalone entry only when released without forming a chord.
- Prevent a modifier key from appearing separately before its shortcut entry.

## [1.0.10] - 2026-10-21

### Tests

- Expand coverage for key labels, overlay options, filtering, timeouts, and held-key behavior.

### Documentation

- Add a link to the interactive CodeSandbox demo.

## [1.0.9] - 2026-10-20

- Display punctuation and symbols directly when Shift produces them, without a redundant `Shift +` prefix.
- Keep the Shift modifier visible for letters and non-printable keys.

## [1.0.8] - 2026-10-20

- Avoid showing a redundant Shift modifier for printable keys.

## [1.0.7] - 2026-10-20

- Prevent repeated keydown events from adding duplicate entries while a key is held.
- Clear held-key tracking when the window loses focus.
- Normalize modifier key labels and display the space bar as `Space`.

## [1.0.6] - 2026-10-20

- Add GitHub Actions publishing on version tags, with tag/version validation.
- Add patch, minor, and major release scripts.

## [1.0.5] - 2026-10-20

- Add package exports for CommonJS, ES modules, TypeScript declarations, and the stylesheet.
- Externalize React from the build and declare React 17+ as a peer dependency.
- Update the `use-hotkeys-ts` dependency and apply the overlay timeout to key animations.

## [1.0.4] - 2025-06-13

- Add TypeScript declarations for the overlay component and its props.

## [1.0.3] - 2025-06-12

- Update the build process.

## [1.0.2] - 2025-06-11

- Add a TypeScript declaration file for `KeyOverlayProps`.

## [1.0.1] - 2025-06-11

- Initial release.
