# Cross-Team Handoff Protocol v1.0

## Amenthyx AI Teams — Formal Inter-Team Delivery Framework

---

## 1. Overview

When multiple specialized AI engineering teams collaborate on a single project, the boundaries between teams become the highest-risk areas for defects, delays, and miscommunication. The **Cross-Team Handoff Protocol** formalizes how Team A's output becomes Team B's input, replacing informal "throw it over the wall" handoffs with structured, version-controlled contracts.

This protocol applies to all 60 Amenthyx AI Teams across the 5-wave execution model:

```
Planning --> Research --> Engineering --> QA --> Release
```

Every boundary crossing between teams requires a **Handoff Contract** — a versioned document that specifies deliverables, acceptance criteria, interface specifications, and rollback plans.

---

## 2. Core Principles

1. **Contracts Over Conversations** — Every inter-team dependency is documented in a contract file, not communicated verbally or via ad-hoc messages.
2. **Producer Proves, Consumer Validates** — Team A (producer) must prove their deliverables meet the contract. Team B (consumer) must validate inputs before beginning work.
3. **Interface Stability Guarantee** — Once a contract is accepted, Team A cannot change the agreed interface without a formal contract amendment and Team B's acknowledgment.
4. **Boundary Tests Are Mandatory** — Every contract includes tests that verify the handoff boundary functions correctly.
5. **Atomic Contracts** — Each contract covers one directional handoff. Fan-out (one team handing off to multiple teams) requires separate contracts per consumer.

---

## 3. Contract Storage & Version Control

All contracts live in the project repository under a dedicated directory:

```
.team/
  contracts/
    CONTRACT_apiDesign_backend_v1.md
    CONTRACT_apiDesign_backend_v2.md
    CONTRACT_backend_frontend_v1.md
    CONTRACT_backend_mobile_v1.md
    CONTRACT_design_engineering_v1.md
  schemas/
    api_spec_v1.yaml
    data_schema_v1.json
    component_api_v1.ts
```

### Naming Convention

```
CONTRACT_{FROM_TEAM}_{TO_TEAM}_v{VERSION}.md
```

- Team names use their activation keywords (camelCase).
- Version increments on any material change to deliverables or interfaces.
- Previous versions are never deleted — they remain for audit trail.

### Version Control Rules

- Contracts are committed to the same repository as the project code.
- Contract changes require a dedicated commit with prefix: `contract: {from} -> {to} v{N}`.
- Contract amendments after acceptance require both TLs to sign off in the commit message.

---

## 4. Handoff Phases

### Phase 1: Pre-Handoff (Team A — Producer)

| Step | Action | Owner |
|------|--------|-------|
| 1.1 | Complete all deliverables listed in the contract | Team A engineers |
| 1.2 | Write or update the contract document | Team A TL |
| 1.3 | Run all boundary tests and record evidence | Team A QA |
| 1.4 | Validate deliverables against acceptance criteria | Team A TL |
| 1.5 | Commit contract + evidence to `.team/contracts/` | Team A TL |
| 1.6 | Notify Team B TL that handoff is ready | Team A TL |

**Evidence Required**: Screenshots, test output logs, schema validation results, or CI pipeline green status — following the Evidence & Proof Protocol from the v3.0 team structure.

### Phase 2: Handoff Gate (TL Checkpoint)

The Handoff Gate is a formal checkpoint where the producing team's TL and the consuming team's TL jointly verify the contract:

- [ ] All deliverables listed in the contract exist at specified locations
- [ ] Interface specifications are complete (no TBD or placeholder values)
- [ ] Boundary tests pass
- [ ] Sample data or mock responses are provided
- [ ] Known limitations are documented honestly
- [ ] Rollback plan is defined
- [ ] Contract version is committed to the repository

**Gate Outcome**:
- **PASS** — Team B begins post-handoff work.
- **CONDITIONAL PASS** — Minor issues noted; Team A fixes within 24 hours while Team B begins non-blocked work.
- **REJECT** — Contract is incomplete or deliverables fail acceptance criteria. See Section 8 for conflict resolution.

### Phase 3: Post-Handoff (Team B — Consumer)

| Step | Action | Owner |
|------|--------|-------|
| 3.1 | Read and internalize the full contract | Team B engineers |
| 3.2 | Run boundary tests independently | Team B QA |
| 3.3 | Validate all inputs match expected formats | Team B TL |
| 3.4 | Begin implementation against the guaranteed interface | Team B engineers |
| 3.5 | Report any contract violations immediately | Team B TL |

**Interface Stability**: Once Team B passes the gate, they can assume the interface will NOT change. If Team A discovers they need to change the interface, they must issue a contract amendment (new version) and negotiate with Team B.

---

## 5. Contract Types

### 5.1 API Contract

Used when one team defines APIs that another team consumes.

**Must Include**:
- OpenAPI 3.0+ specification (YAML or JSON)
- Complete endpoint list with methods, paths, and descriptions
- Authentication and authorization requirements
- Rate limiting policies
- Request/response schemas with examples
- Error code catalog with meanings and recommended client handling
- Pagination strategy
- Versioning strategy (URL path, header, query param)

### 5.2 Data Contract

Used when teams share data stores, event streams, or data pipelines.

**Must Include**:
- Schema definitions (JSON Schema, Protobuf, Avro, or SQL DDL)
- Sample data (minimum 3 representative records)
- Data validation rules and constraints
- Migration scripts if modifying existing schemas
- Nullability and default value specifications
- Data retention and cleanup policies

### 5.3 UI Contract

Used when design or component library teams hand off to frontend/mobile teams.

**Must Include**:
- Component API specification (props, events, slots)
- Design tokens (colors, spacing, typography, breakpoints)
- Accessibility requirements (ARIA roles, keyboard navigation, screen reader behavior)
- Responsive behavior specifications
- State management expectations (loading, error, empty states)
- Interactive behavior (animations, transitions, gestures)

### 5.4 Infrastructure Contract

Used when DevOps/platform teams hand off to engineering teams.

**Must Include**:
- Docker/container configurations
- Required environment variables with descriptions and example values
- Port allocations and service discovery
- Health check endpoint specifications
- Resource limits (CPU, memory, storage)
- Logging and monitoring requirements
- Deployment pipeline configuration

### 5.5 Documentation Contract

Used when one team produces documentation that another team extends.

**Must Include**:
- What documentation Team A provides (API docs, architecture decisions, runbooks)
- Documentation format and tooling (Markdown, Docusaurus, Storybook)
- What sections Team B is responsible for extending
- Review and approval process for documentation changes

---

## 6. Contract Document Template

```markdown
# Handoff Contract: {Team A Name} -> {Team B Name}

## Metadata
| Field            | Value                          |
|------------------|--------------------------------|
| From             | {Team A name} (`--team {key}`) |
| To               | {Team B name} (`--team {key}`) |
| Date             | {YYYY-MM-DD}                   |
| Project          | {Project name}                 |
| Contract Version | v{N}                          |
| Status           | DRAFT | PROPOSED | ACCEPTED | AMENDED |

## Deliverables

| # | Artifact              | Format   | Location              | Validated |
|---|-----------------------|----------|-----------------------|-----------|
| 1 | REST API spec         | OpenAPI  | `.team/schemas/api.yaml` | YES/NO |
| 2 | Database migrations   | SQL      | `db/migrations/`      | YES/NO    |
| 3 | Type definitions      | TypeScript | `shared/types/`     | YES/NO    |

## Interface Specification

[Embed or link to the full API spec, schema definitions, or component API.
For large specs, reference the file in `.team/schemas/` rather than inlining.]

## Acceptance Criteria

- [ ] All endpoints return valid responses for happy-path requests
- [ ] Error responses follow the agreed error schema
- [ ] Authentication tokens are validated correctly
- [ ] Response times are under {N}ms at p95
- [ ] Schema validation passes for all sample data

## Assumptions

[What Team B can rely on NOT changing after contract acceptance.]

- The `/users` endpoint will always return `id`, `email`, and `role` fields.
- Authentication uses Bearer JWT tokens with RS256 signing.
- All timestamps are ISO 8601 in UTC.

## Known Limitations

[What Team A could not complete, deferred, or intentionally excluded.]

- Bulk delete endpoint is not implemented (deferred to Sprint 4).
- File upload is limited to 10MB per request.
- WebSocket support is not included in this contract version.

## Boundary Tests

[Tests that verify the handoff boundary works correctly.]

- `tests/contracts/test_api_contract.py` — validates all endpoints against OpenAPI spec
- `tests/contracts/test_data_schema.py` — validates sample data against JSON Schema
- `tests/contracts/test_auth_boundary.py` — validates auth token handling at boundary

## Rollback Plan

[What happens if Team B discovers the handoff is broken mid-implementation.]

1. Team B TL raises a contract violation issue in the project kanban board.
2. Team A TL acknowledges within 4 hours.
3. If fixable: Team A patches and issues contract amendment (new version).
4. If not fixable: Both TLs escalate to orchestrating TL for re-sequencing.
```

---

## 7. Multi-Team Sequencing

### Linear Chains

```
Team A (API Design) ──contract──> Team B (Backend) ──contract──> Team C (Frontend)
```

Each arrow is a separate contract. Team C cannot begin until Team B's contract to Team C is accepted. Team B may begin before Team A's handoff is fully validated if the Handoff Gate gives a CONDITIONAL PASS for non-blocking items.

### Fan-Out (One-to-Many)

```
                    ┌──contract──> Team C (Frontend)
Team B (Backend) ───┤
                    └──contract──> Team D (Mobile)
```

Team B writes **separate contracts** for Team C and Team D. The contracts may share interface specifications (e.g., the same OpenAPI spec) but have independent acceptance criteria and boundary tests tailored to each consumer.

### Fan-In (Many-to-One)

```
Team A (Backend)  ──contract──┐
                              ├──> Team D (Integration Testing)
Team B (Frontend) ──contract──┘
```

Team D receives multiple contracts and must validate all of them before beginning integration work. The Handoff Gate requires ALL incoming contracts to pass.

### TL Orchestration for Multi-Team Projects

The orchestrating TL (typically the Project Lead or the team closest to the final deliverable) is responsible for:

1. **Dependency Mapping** — Identify all inter-team dependencies and draw the contract graph.
2. **Sequencing** — Order team activations so that producers finish before consumers need their inputs.
3. **Parallel Paths** — Identify independent branches that can execute concurrently.
4. **Critical Path** — Flag the longest chain of sequential handoffs as the critical path; prioritize those contracts.
5. **Buffer Allocation** — Add buffer time at each Handoff Gate for rejection and rework cycles.

---

## 8. Conflict Resolution

When Team B rejects a contract at the Handoff Gate:

### Severity Levels

| Level | Description | Resolution |
|-------|-------------|------------|
| **Minor** | Formatting issues, missing examples, incomplete docs | Team A fixes within 24 hours; no re-gate required |
| **Moderate** | Missing endpoints, schema mismatches, failing boundary tests | Team A fixes and re-submits; full re-gate required |
| **Critical** | Fundamental architecture mismatch, wrong technology choice, impossible acceptance criteria | Escalate to orchestrating TL; may require re-planning |

### Resolution Process

1. Team B TL documents the rejection with specific failed criteria.
2. Team A TL reviews and classifies severity.
3. If severity is disputed, the orchestrating TL makes the final call.
4. Team A produces a revised contract (incremented version number).
5. The Handoff Gate is re-run.
6. Maximum 2 rejection cycles before mandatory escalation to orchestrating TL.

---

## 9. Contract Validation Checklist

Before submitting a contract for Handoff Gate review, Team A TL must verify:

### Completeness

- [ ] All metadata fields are filled (no TBD or placeholder values)
- [ ] Every deliverable has a format, location, and validation status
- [ ] Interface specification is complete and machine-readable where applicable
- [ ] All acceptance criteria are testable (not vague or subjective)
- [ ] Assumptions are explicit and bounded
- [ ] Known limitations are documented honestly
- [ ] Boundary tests exist and pass
- [ ] Rollback plan is actionable

### Quality

- [ ] API specs validate against OpenAPI linter (if applicable)
- [ ] Schemas validate against JSON Schema meta-schema (if applicable)
- [ ] Sample data passes schema validation
- [ ] Boundary tests cover happy path, error cases, and edge cases
- [ ] Evidence artifacts are committed alongside the contract

### Consistency

- [ ] Contract version matches the latest deliverable versions
- [ ] Shared types/interfaces are identical across producer and consumer codebases
- [ ] Environment variable names match between infrastructure and application contracts
- [ ] Error codes are consistent across all API endpoints

---

## 10. Example Contracts

### Example A: API Design -> Backend

```
CONTRACT_apiDesign_backend_v1.md

Deliverables:
  1. OpenAPI 3.0 spec — YAML — .team/schemas/api_v1.yaml
  2. Error code catalog — Markdown — .team/docs/error_codes.md
  3. Auth flow diagram — PNG — .team/docs/auth_flow.png

Acceptance Criteria:
  - OpenAPI spec passes spectral lint with zero errors
  - All endpoints have request/response examples
  - Error catalog covers all 4xx and 5xx codes used in the spec
  - Auth flow supports both access token and refresh token patterns
```

### Example B: Backend -> Frontend

```
CONTRACT_backend_frontend_v1.md

Deliverables:
  1. Running API server — Docker — docker-compose.yml (service: api)
  2. TypeScript type definitions — .ts — shared/types/api.ts
  3. Postman collection — JSON — .team/schemas/postman_collection.json
  4. WebSocket event catalog — Markdown — .team/docs/ws_events.md

Acceptance Criteria:
  - API server starts with `docker compose up api` and responds on port 8080
  - All TypeScript types compile without errors
  - Postman collection executes all requests successfully against running server
  - WebSocket events match documented schema
```

### Example C: Design -> Engineering

```
CONTRACT_uxDesign_frontend_v1.md

Deliverables:
  1. Design tokens — JSON — shared/tokens/design_tokens.json
  2. Component specifications — Markdown — .team/docs/components/
  3. Figma export assets — SVG/PNG — assets/design/
  4. Accessibility audit — Markdown — .team/docs/a11y_audit.md

Acceptance Criteria:
  - Design tokens cover color, spacing, typography, and breakpoints
  - Every component spec includes props, events, states, and responsive behavior
  - All assets are optimized (SVG cleaned, PNG compressed)
  - Accessibility audit confirms WCAG 2.1 AA compliance targets
```

---

## 11. Integration with v3.0 Team Structure

This protocol integrates with the existing 16-section v3.0 team structure:

- **Section 4 (Evidence & Proof Protocol)** — Handoff evidence follows the same standards. Boundary test results are treated as evidence artifacts.
- **Section 6 (Atomic Commits)** — Contract commits use the `contract:` prefix and are atomic (one contract per commit).
- **Section 8 (Comprehensive Testing Matrix)** — Boundary tests are added to the testing matrix under the "Integration" category.
- **Section 14 (Real-Time PM Kanban)** — Handoff Gates are tracked as kanban cards with BLOCKED/IN_REVIEW/PASSED/REJECTED status.
- **ACTIVATION_PROTOCOL.md** — When activating a team with `--team`, the activation step includes checking for incoming contracts in `.team/contracts/`.

---

## 12. Quick Reference

| Situation | Action |
|-----------|--------|
| Starting a multi-team project | Orchestrating TL maps dependencies, creates contract stubs |
| Team A finishes work | Team A TL writes contract, runs boundary tests, commits |
| Handoff Gate | Both TLs verify checklist, gate passes/fails |
| Team B finds contract violation mid-work | Raise issue, Team A patches, new contract version |
| Interface change needed after acceptance | Contract amendment (new version), both TLs sign off |
| Contract rejected twice | Mandatory escalation to orchestrating TL |
| Fan-out handoff | One contract per consumer team, shared specs allowed |

---

*This protocol is part of the Amenthyx AI Teams shared infrastructure. All 60 teams follow this protocol for inter-team handoffs.*
