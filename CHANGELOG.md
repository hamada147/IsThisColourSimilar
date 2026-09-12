# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.1] - 2026-09-12

### Fixed

- **CIEDE2000 rotation term (`ΔΘ`)** was computed as `exp(+x²)` instead of
  `exp(-x²)` because the negation was applied before squaring. This threw off
  every result where the mean hue was not exactly 275°.
- **Hue-angle normalization** was missing: `atan2` returns `(-180°, 180°]` and the
  stray `% 360` was a no-op, so negative hue angles were never mapped into
  `[0°, 360°)`. This corrupted the mean-hue (`h̄'`) branch of the formula.
- **8-digit `#RRGGBBAA` hex parsing** extracted the wrong bytes (channels were
  shifted by one byte); the top byte is now read with an unsigned `>>> 24` shift.
- **`adjustLightness`** now preserves the caller's original alpha instead of
  always returning `1`, matching its documented behaviour.

Together these fixes take the implementation from **22 of 34 failing** official
Sharma, Wu & Dalal reference pairs to **all 34 passing**.

### Added

- CommonJS export so the library works with `require()` in Node.js (browser
  `<script>` global usage is unchanged).
- Test suite (`node:test`) covering all 34 CIEDE2000 reference pairs plus the
  colour-space conversions, run against both the readable and minified builds.
- Coverage reporting via `c8` and Allure report generation.
- GitHub Actions CI running the suite with coverage on every push and PR.

### Changed

- Relicensed from Apache-2.0 to **MIT** (the `package.json` `license` field
  previously and incorrectly declared `ISC`).
- Updated dev toolchain: TypeScript `^7.0.2`, esbuild `^0.28.2`.
- `package.json` metadata: correct `main`/`types`, `keywords`, `engines`,
  `files` allowlist.
