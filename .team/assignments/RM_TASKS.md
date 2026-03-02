# Release Manager — Task Assignment

## Agent: RM
## Wave: 4 (after QA PASS)
## Project: Amenthyx Mission Control

---

## Tasks

### T1: Release Checklist + Changelog (#43)
- CHANGELOG.md with all features, organized by category
- Release checklist: all P0 features, tests passing, evidence complete
- Version: v1.0.0 (semver)
- Tag: `v1.0.0`

### T2: npm Package Configuration + GitHub Release (#44)
- package.json: name `@amenthyx/mission-control`, version `1.0.0`
- bin entry for `npx mission-control` (init, start, stop commands)
- .npmignore for tests, evidence, .team/
- GitHub Release via `gh release create v1.0.0`
- Attach build artifacts

### T3: Documentation (#45)
- README.md: overview, quick start, architecture, panels, adapters
- Setup guide: installation, configuration, running
- Adapter guide: Claude Code setup, CLI wrapper usage, file watcher config
- All in `shared/mission-control/docs/`

## Evidence Required
- CHANGELOG.md → committed
- Release checklist → `.team/evidence/release/`
- Evidence manifest → `.team/evidence/manifests/RM_manifest.md`
