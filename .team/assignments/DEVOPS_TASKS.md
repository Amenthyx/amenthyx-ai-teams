# DevOps Engineer — Task Assignment

## Agent: DEVOPS
## Wave: 2
## Project: Amenthyx Mission Control
## Working Directory: shared/mission-control/

---

## Tasks

### T1: ESLint + Prettier + TypeScript Strict Configuration (#29)
- ESLint config with TypeScript parser (strict rules)
- Prettier config (consistent formatting)
- tsconfig.json: strict: true, noEmit for type-checking
- Separate tsconfig for server vs client if needed

### T2: Pre-commit Hooks (#30)
- Install husky + lint-staged
- Pre-commit: lint, format, type-check
- Pre-push: run tests
- Commit-msg: validate conventional commit format

### T3: GitHub Actions CI Workflow (#28)
- `.github/workflows/mission-control-ci.yml`
- Jobs: lint, type-check, test-backend, test-frontend, e2e, security, build
- Matrix: Node.js 18, 20
- PostgreSQL not needed (SQLite)
- Artifact upload for coverage reports

### T4: Local `act` Validation (#31)
- Install act (document for Windows/Mac/Linux)
- Validate workflow syntax with yamllint + actionlint
- Run `act push` locally — capture all output
- Save evidence to `.team/evidence/ci/`

## Evidence Required
- CI workflow file + act output → `.team/evidence/ci/`
- Lint config files → committed
- Evidence manifest → `.team/evidence/manifests/DEVOPS_manifest.md`
