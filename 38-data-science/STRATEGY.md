# Data Science Team — Tailored Strategy v3.1

> Pre-configured for **statistical analysis, EDA, hypothesis testing, and predictive modeling with Python, Jupyter, pandas, and scikit-learn**.
> Fill in sections marked **[FILL IN]** with your project specifics. Everything else is ready.
> Activate: `--team dataScience --strategy path/to/this-file.md`

---

## 1. Project Identity

**Project Name**: [FILL IN]
**One-Line Vision**: [FILL IN]
**Problem Statement**: [FILL IN]
**Desired Outcome**: [FILL IN]
**Project Type**: [FILL IN: Greenfield / Extending / Migration / Rewrite / Prototype / MVP / Production]
**Repository**: [FILL IN: GitHub URL or desired repo name]

---

## 2. Target Audience

**Primary Users**: [FILL IN]
**Secondary Users**: [FILL IN]

| Persona | Role | Pain Points | Goals | Tech Savvy |
|---------|------|-------------|-------|------------|
| [FILL IN] | [Job title] | [Top 3] | [Goals] | [Low/Med/High] |
| [FILL IN] | [Job title] | [Top 3] | [Goals] | [Low/Med/High] |

**Anti-Users**: [FILL IN]

---

## 3. Core Features (Prioritized)

### P0 — Must-Have (Launch Blockers)
| # | Feature | Description | Acceptance Criteria | Complexity |
|---|---------|-------------|--------------------|----|
| 1 | [FILL IN] | [What it does] | [Testable criteria] | [S/M/L/XL] |
| 2 | [FILL IN] | [What it does] | [Testable criteria] | [S/M/L/XL] |
| 3 | [FILL IN] | [What it does] | [Testable criteria] | [S/M/L/XL] |

### P1 — Should-Have
| # | Feature | Description | Acceptance Criteria | Complexity |
|---|---------|-------------|--------------------|----|
| 1 | [FILL IN] | [What it does] | [Testable criteria] | [S/M/L/XL] |

### P2 — Nice-to-Have
| # | Feature | Description |
|---|---------|-------------|
| 1 | [FILL IN] | [What it does] |

---

## 4. Technical Constraints *(pre-configured for Data Science Team)*

**Required Tech Stack**:
- **Language**: Python 3.12+ (primary), R 4.x (statistical modeling when needed)
- **Framework**: Jupyter Lab / Jupyter Notebook (interactive analysis), Streamlit / Dash (dashboards)
- **Libraries**: pandas, NumPy, scikit-learn, scipy, statsmodels (analysis); matplotlib, seaborn, plotly (visualization)
- **Database**: DuckDB (local analytical queries) / PostgreSQL 16 (production data warehouse)
- **Feature Store**: [FILL IN if applicable: Feast / custom]

**Hosting/Infrastructure**:
- **Cloud Provider**: AWS / GCP — team's choice
- **Deployment**: Docker (Jupyter server, Streamlit apps) / Kubernetes (production pipelines)
- **Compute**: GPU instances for model training if needed
- **Domain**: [FILL IN or "TBD"]

**Integrations**:
| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| GitHub | VCS + CI/CD | gh CLI | N/A |
| PostgreSQL 16 / DuckDB | Data warehouse | Connection string (env) | Connection pool max 20 |
| Jupyter Hub | Notebook server | OAuth / token | N/A |
| Streamlit Cloud | Dashboard hosting | Deploy token (env) | Per plan |
| [FILL IN if needed] | [Purpose] | [Auth] | [Limits] |

**Existing Codebase**: [FILL IN: path or "greenfield"]

**Package Manager**: poetry (Python) / renv (R)

**Monorepo or Polyrepo**: Monorepo (notebooks, pipelines, dashboards co-located)

---

## 5. Non-Functional Requirements *(pre-configured)*

**Performance**:
- Notebook execution time < 5 minutes for standard EDA pipeline
- Dashboard query response < 2s for interactive filters
- Model training pipeline completes within resource budget
- Data pipeline ETL throughput: [FILL IN based on data volume]

**Security**:
- Authentication: OAuth2 for Jupyter Hub, API keys for data sources
- Authorization: Role-based notebook access (read/write/execute)
- Data sensitivity: [FILL IN]
- Compliance: [FILL IN]
- Encryption: TLS 1.3 in transit, AES-256 at rest for sensitive datasets

**Scalability**:
- Expected data volume: [FILL IN]
- Expected concurrent analysts: [FILL IN]
- Scaling strategy: DuckDB for local analytics, PostgreSQL read replicas for production

**Availability**:
- Uptime target: 99.5% (notebook server), 99.9% (production dashboards)
- RTO: 2 hours
- RPO: 1 hour
- Multi-region: [FILL IN: yes / no / future]

**Accessibility**:
- Dashboards WCAG 2.1 AA compliant
- Reports exportable as PDF / HTML for non-technical stakeholders
- Color-blind friendly palettes in all visualizations (viridis, cividis defaults)

**Observability**:
- Logging: Python logging (structured JSON) for pipelines
- Metrics: Pipeline execution times, data quality scores tracked over time
- Tracing: Data lineage tracking (input data → transformations → output)
- Alerting: Data quality alerts (missing values, schema drift, distribution shift)

---

## 6. Testing Requirements *(pre-configured)*

**Test Coverage Target**: >= 80% line coverage (data pipelines), >= 70% (utility functions)

**Required Test Types**:
- [x] Unit tests (pytest — data transformations, feature engineering functions)
- [x] Data validation tests (Great Expectations / pandera — schema, constraints, distributions)
- [x] Notebook execution tests (papermill — all notebooks run without error)
- [x] Statistical tests (hypothesis test validation, p-value verification)
- [x] Reproducibility tests (same input → same output with fixed random seeds)
- [x] Integration tests (data pipeline end-to-end with sample data)
- [ ] Performance tests (optional — large dataset execution time)
- [ ] A/B test framework validation (optional — if applicable)

**CI/CD Requirements**:
- [x] GitHub Actions (tested locally with `act` before push)
- [x] Pre-commit hooks (black, ruff, mypy, nbstripout via pre-commit)
- [x] Branch protection (require PR reviews, passing CI)
- [ ] Automated notebook execution on PR (papermill + nbconvert)
- [ ] Data quality checks on merge to main

**Testing Tools**: pytest, Great Expectations, pandera, papermill, nbconvert, hypothesis (property-based)

---

## 7. Timeline & Milestones

**Hard Deadline**: [FILL IN: date or "flexible"]

**Milestones**:
| # | Milestone | Target Date | Deliverables | Success Criteria |
|---|-----------|-------------|--------------|-----------------|
| M1 | [FILL IN] | [Date] | [What's delivered] | [How to verify] |
| M2 | [FILL IN] | [Date] | [What's delivered] | [How to verify] |
| M3 | [FILL IN] | [Date] | [What's delivered] | [How to verify] |

**Budget Constraints**:
- Infrastructure: [FILL IN: $/month or "minimize"]
- Third-party APIs: [FILL IN: $/month or "free tier only"]
- Domains/SSL: [FILL IN: $ or "already owned"]

---

## 7.1 Cost Approval & Payment Governance *(pre-configured)*

**Token Budget Tolerance**: [FILL IN: e.g., "< $5 per run" / "< $20 total" / "$X max"]

**Payment Authorization Rules**:
- **Auto-approve threshold**: $0 (always ask — recommended)
- **Requires explicit approval**: All card payments, subscriptions, purchases
- **Forbidden without user present**: Any recurring subscription, any payment > $50

**External Service Payments**:
| Service | Expected Cost | Payment Method | Pre-Approved? |
|---------|--------------|----------------|---------------|
| AWS/GCP (compute) | Variable | Card | No — ask first |
| Streamlit Cloud | Free / ~$25/mo | Card | No — ask first |
| [FILL IN if needed] | [$X] | [Card / credits] | [No — ask first] |

**Cost Estimation Detail Level**: Detailed per-wave breakdown

**If costs exceed estimate**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true):
- [ ] All P0 features implemented and tested
- [ ] >= 80% pipeline test coverage, >= 70% utility coverage
- [ ] Zero CRITICAL/HIGH security vulnerabilities
- [ ] All notebooks reproducible (papermill execution passes)
- [ ] Data validation rules defined and passing (Great Expectations / pandera)
- [ ] All statistical claims include confidence intervals and p-values
- [ ] Dashboards deployed and interactive
- [ ] Documentation complete (README, data dictionary, methodology docs)
- [ ] CI/CD pipeline tested and working
- [ ] All environment variables documented in .env.example, no hardcoded paths

**KPIs**:
| Metric | Target | How to Measure |
|--------|--------|----------------|
| [FILL IN] | [Target] | [Method] |

**Definition of Done**: [FILL IN]

---

## 9. Reference & Inspiration

**Competitor/Reference Products**:
| Product | What to Learn | What to Avoid |
|---------|--------------|---------------|
| [FILL IN] | [Good aspects] | [Bad aspects] |

**Design Inspiration**: [FILL IN]

**Technical References**: [FILL IN]

---

## 10. Out of Scope

**Explicitly NOT building**:
1. [FILL IN]
2. [FILL IN]

**Deferred to future versions**:
1. [FILL IN]

---

## 11. Risk & Constraints

**Known Risks**:
| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Data quality issues invalidating analysis | H | H | Great Expectations validation at ingestion, automated data quality reports |
| Non-reproducible results due to environment drift | M | H | Poetry lock files, fixed random seeds, Docker environments, version-controlled notebooks |
| Hardcoded file paths breaking portability | M | M | Enforce no hardcoded paths via linting, use config files and environment variables |
| Statistical misinterpretation of results | M | H | Peer review of methodology, mandatory confidence intervals, pre-registration of hypotheses |
| [FILL IN] | [H/M/L] | [H/M/L] | [Plan] |

**Hard Constraints** (non-negotiable):
- Reproducible notebooks: every notebook runs end-to-end with `papermill` using fixed seeds
- Version-controlled data pipelines: all ETL logic in tracked Python files, not ad-hoc cells
- No hardcoded paths: all file references via config or environment variables
- Data provenance: every dataset must have documented source, version, and access date

**Soft Constraints** (preferred but negotiable):
- [FILL IN if any]

---

## 11.1 Dynamic Agent Scaling *(pre-configured)*

**Allow PM to spawn extra agents?**: Yes, with TL approval
**Max concurrent agents**: 15

**Scaling triggers**:
- Feature complexity XL and splittable
- Wave falling behind timeline
- QA finds >= 5 blocking bugs

**Agent types the PM may add**:
- [x] Additional Data Engineer (ETL pipelines, data ingestion)
- [x] Additional Data Analyst (EDA, visualization, reporting)
- [x] Additional ML Engineer (model training, feature engineering)
- [x] Additional Statistician (hypothesis testing, experimental design)
- [x] DevOps Specialist (Jupyter Hub, pipeline orchestration, CI/CD)
- [x] Dashboard Developer (Streamlit / Dash interactive dashboards)

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (re-approve if > 20% over)
- PM documents in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements *(pre-configured)*

**Required evidence**:
- [x] Test coverage report (pytest-cov — HTML + lcov)
- [x] Notebook execution results (papermill output notebooks)
- [x] Data validation report (Great Expectations / pandera HTML report)
- [x] Statistical analysis outputs (confidence intervals, p-values, effect sizes)
- [x] Visualization outputs (PNG/SVG exports of key charts)
- [x] Model evaluation metrics (if applicable — confusion matrices, ROC curves, cross-validation)
- [x] Data lineage documentation (source → transformation → output)
- [x] CI/CD pipeline screenshot (all checks green)
- [x] Reproducibility verification (3 independent runs produce identical outputs)
- [x] Architecture diagram (data flow, pipeline stages, storage)

**Reporting Frequency**: Every wave completion

**Final Deliverable**: PPTX + PDF (both)

---

## 12.1 Data Preservation & Uncertainty Policy *(pre-configured)*

**Data Preservation (No-Delete Rule)**:
- **Files**: archive to `.team/archive/` — NEVER delete
- **Table rows**: add `status: archived` — NEVER remove
- **Documents**: add `[ARCHIVED]` marker — NEVER erase
- **Git history**: NEVER rebase/squash published commits
- **Datasets**: ALL intermediate and final datasets versioned (DVC or equivalent)

**Uncertainty Escalation**:
- **Threshold**: < 90% confidence → escalate to TL → user
- **Response time**: [FILL IN: minutes / hours / "whenever available"]
- **Format**: Detailed context + options

---

## 13. GitHub Auto-Sync Policy *(pre-configured)*

**Auto-sync frequency**: Every agent completion
**Auto-push enabled?**: Yes
**Branch**: `team/dataScience/execution`
**Merge to main**: After release sign-off only

**What gets auto-synced**:
- [x] `.team/` planning artifacts
- [x] `.team/evidence/` proof artifacts (notebooks, reports, validation results)
- [x] Source code changes (pipelines, notebooks, dashboards)
- [x] `.team/COMMIT_LOG.md` updates
- [x] `.team/reports/` PPTX + PDF
- [x] `COST_ESTIMATION.md` and revisions

---

## 14. Additional Context

[FILL IN — anything else the team should know]

---

*Data Science Team Strategy v3.1 — Amenthyx AI Teams*
*Pre-configured for Python + R + Jupyter + pandas + scikit-learn + DuckDB data science*
*Cost-First | No-Delete | Ask-When-Unsure | Auto-Synced | Dynamically Scaled | Evidence-Driven*
