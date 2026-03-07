# Version Migration Protocol

## Purpose

This protocol governs how existing `.team/` project folders are migrated when the Amenthyx AI Teams framework is updated (e.g., v3.0 to v3.1 to v4.0). Migration must be safe, reversible, and data-preserving.

---

## 1. Version Detection

Every `.team/` folder MUST contain a `VERSION` file at `.team/VERSION`.

### VERSION File Format

```
amenthyx-ai-teams: v3.1
```

- Single line, key-value format.
- The key is always `amenthyx-ai-teams`.
- The value follows semantic versioning: `vMAJOR.MINOR`.
- If `.team/VERSION` does not exist, assume `v3.0` (the first version before this protocol was introduced).

### Reading the Version

```python
def read_version(team_dir: str) -> str:
    version_file = os.path.join(team_dir, "VERSION")
    if not os.path.exists(version_file):
        return "v3.0"
    with open(version_file, "r") as f:
        line = f.read().strip()
    return line.split(":")[1].strip()
```

---

## 2. Migration Principles

1. **Never delete** -- migration only adds or transforms. Existing files are never removed.
2. **Atomic migration** -- either all steps succeed or the entire migration is rolled back.
3. **Backup first** -- a full copy of `.team/` is created at `.team/rollback/migration_backup_<from>_<to>/` before any changes.
4. **Idempotent** -- running the same migration twice produces the same result without errors.
5. **Forward-only chain** -- migrations are applied sequentially (v3.0 to v3.1, then v3.1 to v4.0). No version skipping.

---

## 3. Backward Compatibility Guarantees

- All files and directories from prior versions remain valid and functional.
- New directories are added empty (or with a `.gitkeep`) and do not interfere with existing workflows.
- TEAM.md additions are appended; existing sections are never rewritten by migration.
- Agents that do not recognize new directories simply ignore them.

---

## 4. Migration Checklist: v3.0 to v3.1

| Step | Action | Details |
|------|--------|---------|
| 1 | Create `.team/plans/` | Judge protocol -- stores evaluation plans |
| 2 | Create `.team/retros/` | Retrospective protocol -- post-wave retros |
| 3 | Create `.team/reviews/` | Code Review protocol -- CR artifacts |
| 4 | Create `.team/learnings/` | Agent Memory protocol -- cross-session learnings |
| 5 | Create `.team/contracts/` | Cross-Team Handoff -- inter-team contracts |
| 6 | Create `.team/rollback/` | Rollback Protocol -- migration backups and rollback data |
| 7 | Update TEAM.md | Append new agent role sections: JUDGE, CR, RETRO, DEPGUARD |
| 8 | Create `.team/VERSION` | Write `amenthyx-ai-teams: v3.1` |

### What Changes Between v3.0 and v3.1

- **New directories (6):** `plans/`, `retros/`, `reviews/`, `learnings/`, `contracts/`, `rollback/`
- **New required files:** `.team/VERSION`
- **Schema changes:** TEAM.md gains four new agent role blocks (JUDGE, CR, RETRO, DEPGUARD) appended after existing roles
- **No breaking changes** to existing directory structure or file formats

---

## 5. Migration Script Template (Python)

```python
#!/usr/bin/env python3
"""Amenthyx AI Teams -- .team/ Migration Script"""

import os
import shutil
import sys
from datetime import datetime

MIGRATIONS = {
    "v3.0": "v3.1",
    # "v3.1": "v4.0",  # future
}

NEW_DIRS_V3_0_TO_V3_1 = [
    "plans", "retros", "reviews", "learnings", "contracts", "rollback"
]

NEW_ROLES_V3_1 = """
## JUDGE Agent
Evaluates plans, gates wave transitions, and validates deliverables.

## CR Agent (Code Review)
Performs structured code reviews with evidence-backed feedback.

## RETRO Agent (Retrospective)
Conducts post-wave retrospectives and captures improvement actions.

## DEPGUARD Agent (Dependency Guardian)
Monitors dependency health, licensing, and security vulnerabilities.
"""


def read_version(team_dir: str) -> str:
    version_file = os.path.join(team_dir, "VERSION")
    if not os.path.exists(version_file):
        return "v3.0"
    with open(version_file, "r") as f:
        return f.read().strip().split(":")[1].strip()


def write_version(team_dir: str, version: str):
    with open(os.path.join(team_dir, "VERSION"), "w") as f:
        f.write(f"amenthyx-ai-teams: {version}\n")


def backup(team_dir: str, from_v: str, to_v: str) -> str:
    backup_name = f"migration_backup_{from_v}_{to_v}"
    backup_dir = os.path.join(team_dir, "rollback", backup_name)
    os.makedirs(os.path.dirname(backup_dir), exist_ok=True)
    if os.path.exists(backup_dir):
        shutil.rmtree(backup_dir)
    shutil.copytree(team_dir, backup_dir, ignore=shutil.ignore_patterns("rollback"))
    return backup_dir


def rollback(team_dir: str, backup_dir: str):
    """Restore .team/ from backup, preserving the rollback/ folder."""
    rollback_dir = os.path.join(team_dir, "rollback")
    rollback_backup = rollback_dir + "_tmp"
    if os.path.exists(rollback_dir):
        shutil.move(rollback_dir, rollback_backup)
    for item in os.listdir(team_dir):
        path = os.path.join(team_dir, item)
        if path == rollback_backup:
            continue
        if os.path.isdir(path):
            shutil.rmtree(path)
        else:
            os.remove(path)
    for item in os.listdir(backup_dir):
        src = os.path.join(backup_dir, item)
        dst = os.path.join(team_dir, item)
        if os.path.isdir(src):
            shutil.copytree(src, dst)
        else:
            shutil.copy2(src, dst)
    if os.path.exists(rollback_backup):
        shutil.move(rollback_backup, rollback_dir)
    print("[ROLLBACK] Restored from backup.")


def migrate_v3_0_to_v3_1(team_dir: str):
    # Step 1-6: Create new directories
    for d in NEW_DIRS_V3_0_TO_V3_1:
        dir_path = os.path.join(team_dir, d)
        os.makedirs(dir_path, exist_ok=True)
        gitkeep = os.path.join(dir_path, ".gitkeep")
        if not os.path.exists(gitkeep):
            open(gitkeep, "w").close()

    # Step 7: Append new roles to TEAM.md
    team_md = os.path.join(team_dir, "TEAM.md")
    if os.path.exists(team_md):
        with open(team_md, "r") as f:
            content = f.read()
        if "## JUDGE Agent" not in content:
            with open(team_md, "a") as f:
                f.write(NEW_ROLES_V3_1)

    # Step 8: Write VERSION
    write_version(team_dir, "v3.1")


def migrate(team_dir: str):
    if not os.path.isdir(team_dir):
        print(f"[ERROR] {team_dir} does not exist.")
        sys.exit(1)

    current = read_version(team_dir)
    print(f"[INFO] Current version: {current}")

    while current in MIGRATIONS:
        target = MIGRATIONS[current]
        print(f"[MIGRATE] {current} -> {target}")

        backup_dir = backup(team_dir, current, target)
        try:
            fn_name = f"migrate_{current.replace('.', '_')}_to_{target.replace('.', '_')}"
            migration_fn = globals().get(fn_name)
            if not migration_fn:
                print(f"[ERROR] No migration function: {fn_name}")
                sys.exit(1)
            migration_fn(team_dir)
            print(f"[OK] Migrated to {target}")
            current = target
        except Exception as e:
            print(f"[ERROR] Migration failed: {e}")
            rollback(team_dir, backup_dir)
            sys.exit(1)

    print(f"[DONE] Version is now {current}. No further migrations available.")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python migrate.py <path-to-.team-directory>")
        sys.exit(1)
    migrate(sys.argv[1])
```

---

## 6. Rollback Procedure

If migration fails at any step:

1. The script automatically restores `.team/` from the pre-migration backup stored in `.team/rollback/migration_backup_<from>_<to>/`.
2. The `rollback/` directory itself is preserved across rollbacks (never overwritten).
3. Manual rollback: copy the backup directory contents back over `.team/`, then delete the failed `VERSION` entry.

---

## 7. Data Preservation Rules

| Scenario | Action |
|----------|--------|
| New directory needed | Create with `.gitkeep`, never overwrite existing |
| File format changed | Create new file alongside old; mark old as `_deprecated` |
| Field added to schema | Append field with sensible default; never remove existing fields |
| File renamed | Copy to new name, keep original in place |
| Directory restructured | New structure created in parallel; old structure left intact |

---

## 8. Post-Migration Verification

After migration completes, the script (or agent) should verify:

1. `.team/VERSION` contains the expected target version string.
2. All new directories exist and contain `.gitkeep`.
3. TEAM.md contains the expected new agent role sections.
4. No existing files were deleted or truncated (compare file counts against backup).
5. The project still activates correctly with `--team <name> --strategy <path>`.

---

## 9. Future Migration Registration

To add a new migration (e.g., v3.1 to v4.0):

1. Add the version mapping to the `MIGRATIONS` dict: `"v3.1": "v4.0"`.
2. Define the checklist of changes in this document under a new section.
3. Implement the function `migrate_v3_1_to_v4_0(team_dir)` in the migration script.
4. Test with a fresh v3.1 `.team/` folder and verify rollback works.
