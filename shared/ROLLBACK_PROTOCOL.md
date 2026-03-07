# Rollback Protocol v3.0

> Amenthyx AI Teams — 60 Specialized Virtual Engineering Teams
> Formalizes how to safely undo deployments, migrations, and configuration changes.

---

## Table of Contents

1. [Overview](#overview)
2. [Rollback Types](#rollback-types)
3. [Rollback Readiness Checklist](#rollback-readiness-checklist)
4. [ROLLBACK_PLAN.md Template](#rollback_planmd-template)
5. [Blue/Green & Canary Strategy](#bluegreen--canary-strategy)
6. [Feature Flags as Rollback](#feature-flags-as-rollback)
7. [Rollback Testing](#rollback-testing)
8. [Release Manager Integration](#release-manager-integration)
9. [Wave 4 (Release) Checklist Additions](#wave-4-release-checklist-additions)
10. [Version Control of Rollback Plans](#version-control-of-rollback-plans)

---

## Overview

Every deployment MUST have a corresponding rollback plan before it reaches production. No exceptions. The Release Manager agent is responsible for verifying rollback readiness as a gate condition in Wave 4 (Release). A deployment without a tested rollback path is a deployment that cannot be approved.

This protocol applies to all 60 AI engineering teams and integrates with the existing v3.0 execution structure: Evidence & Proof Protocol, Atomic Commits, Comprehensive Testing Matrix, and Real-Time PM Kanban.

---

## Rollback Types

### 1. Code Rollback

Revert to a previous git commit or tag on the `ai-team` branch.

```bash
# Option A: Reset to previous release tag
git checkout <previous_tag>

# Option B: Revert a range of commits (preserves history)
git revert --no-commit <bad_commit_start>..<bad_commit_end>
git commit -m "rollback: revert deployment <version>"
```

- Preferred when the issue is isolated to application code.
- Always use `git revert` over `git reset --hard` on shared branches to preserve history.

### 2. Database Rollback

Reverse migrations. Every migration file MUST have a tested `down()` counterpart.

```bash
# Example: reverse the last N migrations
npx prisma migrate rollback --steps <N>
# or
python manage.py migrate <app_name> <previous_migration_number>
# or
npx knex migrate:rollback --count <N>
```

- Data-destructive `down()` migrations (e.g., dropping columns with user data) require a data backup before execution.
- If a `down()` migration is not possible (e.g., data has been transformed irreversibly), this MUST be documented in the rollback plan with an alternative recovery strategy.

### 3. Config Rollback

Restore previous environment variables, feature flags, and configuration files.

```bash
# Restore config snapshot
cp .team/rollback/config_snapshot_<date>.json .env.production

# Restore feature flags
curl -X POST https://flags.internal/api/restore --data @.team/rollback/flags_snapshot_<date>.json
```

- Config snapshots are taken automatically before each deployment.
- Stored at `.team/rollback/config_snapshot_<date>.json`.

### 4. Infrastructure Rollback

Revert Infrastructure-as-Code changes.

```bash
# Terraform: revert to previous state
cd infrastructure/
git checkout <previous_tag> -- .
terraform plan        # Review the rollback diff
terraform apply       # Execute rollback

# Kubernetes: rollback deployment
kubectl rollout undo deployment/<service-name> -n <namespace>
kubectl rollout status deployment/<service-name> -n <namespace>
```

- Always run `terraform plan` before `terraform apply` during rollback to verify the diff.
- K8s rollback history is retained for the last 10 revisions by default.

### 5. Full Rollback

All of the above, executed in coordinated sequence:

1. **Infrastructure** — redirect traffic / scale down new instances
2. **Code** — revert to previous tag
3. **Database** — run `down()` migrations
4. **Config** — restore config snapshot
5. **Verification** — run health checks, smoke tests, confirm metrics

Full rollbacks are the highest-risk operation. They require the Release Manager and at least one senior engineer from the owning team present during execution.

---

## Rollback Readiness Checklist

The Release Manager MUST verify every item before approving a deployment to production.

- [ ] Every DB migration has a tested `down()` counterpart
- [ ] Previous deployment artifact is tagged and accessible in the registry
- [ ] Feature flags can disable new functionality without redeployment
- [ ] Health check endpoints exist and are verified for all affected services
- [ ] Monitoring and alerting is configured for key metrics (error rate, latency, throughput)
- [ ] Data backup taken before migration (with verified restore path)
- [ ] Rollback has been dry-run tested in staging or local environment
- [ ] `ROLLBACK_PLAN.md` committed to `.team/rollback/` for this release
- [ ] Communication plan documented (who to notify, status page procedure)
- [ ] Estimated rollback time documented (must be under 15 minutes for critical services)

A single unchecked item blocks deployment. No exceptions.

---

## ROLLBACK_PLAN.md Template

Every release MUST include this file at `.team/rollback/ROLLBACK_PLAN_<version>.md`.

```markdown
# Rollback Plan — {Release Version}

## Pre-Deployment State
- Git tag: {previous_tag}
- DB migration version: {previous_version}
- Config snapshot: `.team/rollback/config_snapshot_{date}.json`
- Infrastructure state: `.team/rollback/terraform_state_{date}.tfstate`
- Deployment artifact: {registry_url}:{previous_tag}

## Rollback Triggers
Concrete conditions that mandate an immediate rollback:
- Error rate exceeds 5% for 3 consecutive minutes
- Health check fails 3 times consecutively (30-second intervals)
- P0 bug reported within the first 4 hours of deployment
- Latency p99 exceeds 2x the pre-deployment baseline for 5 minutes
- Data integrity issue detected (mismatched counts, corrupt records)

## Rollback Steps

### 1. Code
git checkout {previous_tag}
# or
git revert {bad_commit_range}
# Rebuild and redeploy artifact from previous tag

### 2. Database
# Run down migrations in reverse order
{specific down migration commands with exact migration identifiers}
# Verify row counts and data integrity post-rollback

### 3. Configuration
# Restore config snapshot
cp .team/rollback/config_snapshot_{date}.json .env.production
# Restart services to pick up config changes
{restart commands}

### 4. Infrastructure
# Revert IaC changes
{specific Terraform or K8s rollback commands}
# Verify infrastructure state matches pre-deployment

### 5. Verification
- [ ] All health check endpoints return 200
- [ ] Error rate returned to pre-deployment baseline
- [ ] Smoke test suite passes
- [ ] Key user flows verified manually
- [ ] Monitoring dashboards confirm normal operation

## Communication
- Notify: {team lead, on-call engineer, stakeholders}
- Status page: Update status to "Investigating" on trigger, "Resolved" after verification
- User communication: {template for user-facing message if applicable}
- Internal Slack/channel: Post rollback summary within 30 minutes

## Post-Rollback
- Root cause analysis required within 24 hours
- Incident report written to `.team/incidents/INCIDENT_{ID}.md`
- Learnings captured via RETRO agent and added to team knowledge base
- Re-deployment requires a new rollback plan addressing the root cause
- Kanban board updated: move release card back to "In Progress"
```

---

## Blue/Green & Canary Strategy

### Blue/Green Deployment

When infrastructure supports it, prefer blue/green over direct rollback:

- **Blue** = current production environment
- **Green** = new deployment target
- Deploy to Green, run verification suite, then switch traffic
- Rollback = switch traffic back to Blue (near-instant, sub-second)
- Keep Blue alive for at least 24 hours after switchover

### Canary Deployment

Gradual rollout with monitoring at each stage:

| Stage | Traffic % | Monitor Duration | Rollback Action |
|-------|-----------|-----------------|-----------------|
| 1     | 5%        | 15 minutes      | Redirect all traffic to stable |
| 2     | 25%       | 15 minutes      | Redirect all traffic to stable |
| 3     | 50%       | 15 minutes      | Redirect all traffic to stable |
| 4     | 100%      | Continuous       | Full rollback procedure |

- Rollback from canary stages 1-3 is trivial: redirect traffic back to the stable pool.
- Canary metrics to watch: error rate, latency, resource utilization, business KPIs.
- Automated canary analysis (e.g., Kayenta, Flagger) is recommended where available.

---

## Feature Flags as Rollback

For non-critical issues, prefer toggling a feature flag over a full code rollback.

### Requirements

- Every new user-facing feature MUST be behind a feature flag.
- Feature flags MUST have kill switches that are testable in staging before production deploy.
- Kill switch response time: under 60 seconds from toggle to full deactivation.

### When to Use Feature Flags vs. Code Rollback

| Scenario | Strategy |
|----------|----------|
| UI bug in new feature | Toggle feature flag OFF |
| Performance regression in new feature | Toggle feature flag OFF |
| Data corruption bug | Full code + DB rollback |
| Security vulnerability | Full code rollback (immediate) |
| Infrastructure misconfiguration | Infrastructure rollback |
| Third-party integration failure | Toggle integration flag OFF |

### Flag Hygiene

- Remove feature flags within 2 sprints of full rollout.
- Stale flags (older than 30 days at 100%) are flagged in CI as warnings.
- Flag state snapshots are included in config snapshots before deployment.

---

## Rollback Testing

### Pre-Production Dry Run

Before any production deployment, the Release Manager MUST:

1. Deploy the new version to staging.
2. Execute the full rollback procedure in staging.
3. Verify staging returns to pre-deployment state.
4. Document the dry run with timestamps and evidence.

### Evidence Requirements

Rollback test evidence is stored at `.team/evidence/rollback/` and MUST include:

```
.team/evidence/rollback/
  rollback_test_<version>_<date>.md    # Procedure log with timestamps
  rollback_test_<version>_health.json  # Health check results post-rollback
  rollback_test_<version>_diff.patch   # Git diff confirming clean revert
```

The evidence file must contain:
- Timestamp of rollback initiation and completion
- Total rollback duration (must be under the documented estimate)
- Health check results before and after rollback
- Any issues encountered during the dry run and their resolutions

### Automated Rollback Testing

Teams SHOULD integrate rollback testing into their CI pipeline:

```yaml
# Example: GitHub Actions rollback test stage
rollback-test:
  needs: [deploy-staging]
  runs-on: ubuntu-latest
  steps:
    - name: Deploy new version to staging
      run: ./scripts/deploy.sh staging ${{ github.sha }}
    - name: Verify deployment
      run: ./scripts/health-check.sh staging
    - name: Execute rollback
      run: ./scripts/rollback.sh staging ${{ env.PREVIOUS_TAG }}
    - name: Verify rollback
      run: ./scripts/health-check.sh staging
    - name: Save evidence
      run: ./scripts/save-rollback-evidence.sh
```

---

## Release Manager Integration

The Release Manager agent is the single authority for rollback decisions in production. Responsibilities:

1. **Pre-Deployment**: Verify the Rollback Readiness Checklist is fully satisfied.
2. **During Deployment**: Monitor rollback trigger conditions in real time.
3. **Rollback Decision**: Authorized to initiate rollback unilaterally if any trigger condition is met.
4. **Post-Rollback**: Ensure incident report is filed and RETRO agent is engaged.

### Decision Authority

- **Automated triggers** (error rate, health checks): Rollback initiates automatically if configured; Release Manager is notified.
- **Manual triggers** (P0 bug, stakeholder escalation): Release Manager makes the call within 5 minutes of report.
- **Escalation**: If Release Manager is unavailable, any senior engineer on the team can authorize rollback.

---

## Wave 4 (Release) Checklist Additions

The following items are added to the existing Wave 4 checklist for all 60 teams:

- [ ] `ROLLBACK_PLAN_<version>.md` committed to `.team/rollback/`
- [ ] Rollback Readiness Checklist fully satisfied (all items checked)
- [ ] Rollback dry-run completed in staging with evidence saved
- [ ] Rollback duration under 15 minutes (documented and tested)
- [ ] Feature flags verified as togglable in staging
- [ ] Config snapshot taken and stored in `.team/rollback/`
- [ ] Communication plan reviewed and contacts verified
- [ ] Kanban board updated with rollback status card

These items are blocking. A Wave 4 release cannot proceed to production without all items checked.

---

## Version Control of Rollback Plans

Rollback plans are version-controlled alongside the code they protect:

```
.team/
  rollback/
    ROLLBACK_PLAN_v1.2.0.md
    ROLLBACK_PLAN_v1.3.0.md
    config_snapshot_2026-03-07.json
    flags_snapshot_2026-03-07.json
  evidence/
    rollback/
      rollback_test_v1.3.0_2026-03-06.md
      rollback_test_v1.3.0_health.json
      rollback_test_v1.3.0_diff.patch
  incidents/
    INCIDENT_001.md
```

### Retention Policy

- Rollback plans: Retained for the last 5 releases (older plans archived).
- Config snapshots: Retained for the last 10 deployments.
- Evidence files: Retained indefinitely (part of audit trail).
- Incident reports: Retained indefinitely.

### Commit Convention

Rollback-related commits use the `rollback:` prefix:

```
rollback: add rollback plan for v1.3.0
rollback: update config snapshot pre-deployment
rollback: record dry-run evidence for v1.3.0
```

---

*This protocol is maintained as part of the Amenthyx AI Teams shared documentation. All 60 teams inherit this protocol. Team-specific rollback requirements (e.g., multimedia pipeline state, ML model versioning) should extend this protocol in their respective TEAM.md files.*
