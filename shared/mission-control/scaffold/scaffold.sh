#!/usr/bin/env bash
# Amenthyx Mission Control — Auto-Scaffold Script
# Called automatically by activation protocol (Wave 0.5)
# Usage: ./scaffold.sh <project_dir> <team_name> <strategy_path> [ai_tool]
#
# Cross-platform: Works on Linux, macOS, and Windows (Git Bash / MSYS2)

set -euo pipefail

PROJECT_DIR="${1:-.}"
TEAM_NAME="${2:-unknown}"
STRATEGY_PATH="${3:-}"
AI_TOOL="${4:-auto}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MC_DIR="$PROJECT_DIR/.mission-control"
BACKEND_PORT=4201
FRONTEND_PORT=4200

echo ""
echo "========================================================"
echo "  AMENTHYX MISSION CONTROL -- Auto-Scaffold v1.0"
echo "========================================================"
echo ""

# ---------------------------------------------------------------------------
# Utility: Generate a UUID across platforms
# ---------------------------------------------------------------------------
generate_uuid() {
    if [ -f /proc/sys/kernel/random/uuid ]; then
        cat /proc/sys/kernel/random/uuid
    elif command -v uuidgen &>/dev/null; then
        uuidgen | tr '[:upper:]' '[:lower:]'
    elif command -v python3 &>/dev/null; then
        python3 -c "import uuid; print(uuid.uuid4())"
    elif command -v python &>/dev/null; then
        python -c "import uuid; print(uuid.uuid4())"
    elif command -v powershell &>/dev/null; then
        powershell -NoProfile -Command "[guid]::NewGuid().ToString()" 2>/dev/null | tr -d '\r'
    else
        echo "session-$(date +%s)-$$"
    fi
}

# ---------------------------------------------------------------------------
# Utility: Check if a port is available (cross-platform)
# ---------------------------------------------------------------------------
check_port() {
    local port=$1
    if command -v lsof &>/dev/null; then
        lsof -i ":$port" &>/dev/null && return 1 || return 0
    elif command -v ss &>/dev/null; then
        ss -tuln 2>/dev/null | grep -q ":$port " && return 1 || return 0
    elif command -v netstat &>/dev/null; then
        netstat -tuln 2>/dev/null | grep -q ":$port " && return 1 || return 0
    elif command -v powershell &>/dev/null; then
        powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue" &>/dev/null && return 1 || return 0
    fi
    return 0  # assume available if we cannot check
}

# ---------------------------------------------------------------------------
# Utility: Resolve path to absolute (cross-platform)
# ---------------------------------------------------------------------------
resolve_path() {
    local target="$1"
    if [[ "$target" == /* ]] || [[ "$target" =~ ^[A-Za-z]:/ ]]; then
        echo "$target"
    else
        echo "$(cd "$(dirname "$target")" 2>/dev/null && pwd)/$(basename "$target")"
    fi
}

PROJECT_DIR="$(resolve_path "$PROJECT_DIR")"

# ---------------------------------------------------------------------------
# Step 1: Copy mission-control into the target project
# ---------------------------------------------------------------------------
if [ -d "$MC_DIR" ]; then
    echo "[*] Mission Control already exists at $MC_DIR"
    echo "    Checking for running instance..."
    if [ -f "$MC_DIR/.dashboard.pid" ]; then
        OLD_PID=$(cat "$MC_DIR/.dashboard.pid" 2>/dev/null || echo "")
        if [ -n "$OLD_PID" ] && kill -0 "$OLD_PID" 2>/dev/null; then
            echo "    Stopping previous instance (PID: $OLD_PID)..."
            kill "$OLD_PID" 2>/dev/null || true
            sleep 2
        fi
        rm -f "$MC_DIR/.dashboard.pid"
    fi
    echo "    Updating existing installation..."
else
    echo "[>] Copying Mission Control to $MC_DIR..."
    mkdir -p "$MC_DIR"
    cp -r "$SCRIPT_DIR"/* "$MC_DIR/" 2>/dev/null || true
    cp -r "$SCRIPT_DIR"/.[!.]* "$MC_DIR/" 2>/dev/null || true
    # Remove scaffold dir from copy (not needed in project)
    rm -rf "$MC_DIR/scaffold"
    rm -rf "$MC_DIR/.git"
fi

# ---------------------------------------------------------------------------
# Step 2: Add .mission-control/ to .gitignore
# ---------------------------------------------------------------------------
GITIGNORE="$PROJECT_DIR/.gitignore"
if [ -f "$GITIGNORE" ]; then
    if ! grep -q ".mission-control/" "$GITIGNORE" 2>/dev/null; then
        echo "" >> "$GITIGNORE"
        echo "# Amenthyx Mission Control (local dashboard)" >> "$GITIGNORE"
        echo ".mission-control/" >> "$GITIGNORE"
        echo "[>] Added .mission-control/ to .gitignore"
    else
        echo "[=] .mission-control/ already in .gitignore"
    fi
else
    echo "# Amenthyx Mission Control (local dashboard)" > "$GITIGNORE"
    echo ".mission-control/" >> "$GITIGNORE"
    echo "[>] Created .gitignore with .mission-control/"
fi

# ---------------------------------------------------------------------------
# Step 3: Ensure evidence directory exists, then install dependencies
# ---------------------------------------------------------------------------
EVIDENCE_DIR="$PROJECT_DIR/.team/evidence"
mkdir -p "$EVIDENCE_DIR"

echo "[>] Installing dependencies..."
cd "$MC_DIR"
npm install --loglevel=warn 2>&1 | tee "$EVIDENCE_DIR/dashboard_install.log" || {
    echo "[!] npm install failed -- dashboard may not work correctly"
    echo "    Check .team/evidence/dashboard_install.log for details"
}

# ---------------------------------------------------------------------------
# Step 4: Auto-detect AI tool
# ---------------------------------------------------------------------------
if [ "$AI_TOOL" = "auto" ]; then
    if [ -d "$PROJECT_DIR/.claude" ] || [ -f "$PROJECT_DIR/CLAUDE.md" ]; then
        AI_TOOL="claude-code"
    elif [ -d "$PROJECT_DIR/.cursor" ]; then
        AI_TOOL="cursor"
    elif [ -d "$PROJECT_DIR/.windsurf" ]; then
        AI_TOOL="windsurf"
    elif [ -d "$PROJECT_DIR/.aider" ] || [ -f "$PROJECT_DIR/.aider.conf.yml" ]; then
        AI_TOOL="aider"
    else
        AI_TOOL="unknown"
    fi
fi
echo "[>] Detected AI tool: $AI_TOOL"

# ---------------------------------------------------------------------------
# Step 5: Generate configuration
# ---------------------------------------------------------------------------
SESSION_ID=$(generate_uuid)

# Determine adapter type
if [ "$AI_TOOL" = "claude-code" ]; then
    ADAPTER_TYPE="hooks"
else
    ADAPTER_TYPE="file-watcher"
fi

cat > "$MC_DIR/mission-control.config.json" << CONFIGEOF
{
  "sessionId": "$SESSION_ID",
  "projectName": "$TEAM_NAME project",
  "teamName": "$TEAM_NAME",
  "strategyPath": "$STRATEGY_PATH",
  "projectDir": "$PROJECT_DIR",
  "teamDir": "$PROJECT_DIR/.team/",
  "agents": [
    { "role": "TL", "name": "Team Leader", "color": "#F59E0B", "category": "management" },
    { "role": "PM", "name": "Project Manager", "color": "#64748B", "category": "management" },
    { "role": "BE", "name": "Backend Engineer", "color": "#3B82F6", "category": "engineering" },
    { "role": "FE", "name": "Frontend Engineer", "color": "#22C55E", "category": "engineering" },
    { "role": "MOB", "name": "Mobile Engineer", "color": "#06B6D4", "category": "engineering" },
    { "role": "DEVOPS", "name": "DevOps Engineer", "color": "#F97316", "category": "engineering" },
    { "role": "INFRA", "name": "Infrastructure Engineer", "color": "#F59E0B", "category": "engineering" },
    { "role": "QA", "name": "QA Engineer", "color": "#A855F7", "category": "quality" },
    { "role": "RM", "name": "Release Manager", "color": "#14B8A6", "category": "management" },
    { "role": "MKT", "name": "Marketing Strategist", "color": "#EC4899", "category": "support" },
    { "role": "LEGAL", "name": "Legal/Compliance", "color": "#6B7280", "category": "support" }
  ],
  "budget": {
    "total": 30,
    "currency": "USD",
    "alertThreshold": 0.8
  },
  "ports": {
    "backend": $BACKEND_PORT,
    "frontend": $FRONTEND_PORT
  },
  "source": {
    "tool": "$AI_TOOL",
    "adapter": "$ADAPTER_TYPE"
  },
  "waves": [
    { "number": 0, "name": "Initialization", "status": "pending", "gate": "pending" },
    { "number": 1, "name": "Planning", "status": "pending", "gate": "pending" },
    { "number": 2, "name": "Engineering", "status": "pending", "gate": "pending" },
    { "number": 3, "name": "QA", "status": "pending", "gate": "pending" },
    { "number": 4, "name": "Release", "status": "pending", "gate": "pending" },
    { "number": 5, "name": "Final Report", "status": "pending", "gate": "pending" }
  ],
  "fileWatcher": {
    "watchPaths": [".team/", ".github/workflows/", "coverage/"],
    "debounceMs": 500
  }
}
CONFIGEOF
echo "[>] Generated mission-control.config.json (session: $SESSION_ID)"

# ---------------------------------------------------------------------------
# Step 6: Configure Claude Code hooks (if detected)
# ---------------------------------------------------------------------------
if [ "$AI_TOOL" = "claude-code" ]; then
    CLAUDE_SETTINGS_DIR="$PROJECT_DIR/.claude"
    mkdir -p "$CLAUDE_SETTINGS_DIR"
    SETTINGS_FILE="$CLAUDE_SETTINGS_DIR/settings.local.json"

    # Only write hooks if settings.local.json does not already exist
    if [ ! -f "$SETTINGS_FILE" ]; then
        cat > "$SETTINGS_FILE" << 'HOOKSEOF'
{
  "hooks": {
    "PostToolUse": [
      {
        "type": "command",
        "command": "curl -s -X POST http://localhost:__BACKEND_PORT__/api/events/claude-code -H 'Content-Type: application/json' -d '{\"event_type\":\"PostToolUse\",\"timestamp\":\"'\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"'\"}' > /dev/null 2>&1 || true"
      }
    ],
    "SubagentStart": [
      {
        "type": "command",
        "command": "curl -s -X POST http://localhost:__BACKEND_PORT__/api/events/claude-code -H 'Content-Type: application/json' -d '{\"event_type\":\"SubagentStart\",\"timestamp\":\"'\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"'\"}' > /dev/null 2>&1 || true"
      }
    ],
    "SubagentStop": [
      {
        "type": "command",
        "command": "curl -s -X POST http://localhost:__BACKEND_PORT__/api/events/claude-code -H 'Content-Type: application/json' -d '{\"event_type\":\"SubagentStop\",\"timestamp\":\"'\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"'\"}' > /dev/null 2>&1 || true"
      }
    ]
  }
}
HOOKSEOF
        # Replace port placeholder with actual port
        if command -v sed &>/dev/null; then
            sed -i "s/__BACKEND_PORT__/$BACKEND_PORT/g" "$SETTINGS_FILE" 2>/dev/null || \
            sed -i '' "s/__BACKEND_PORT__/$BACKEND_PORT/g" "$SETTINGS_FILE" 2>/dev/null || true
        fi
        echo "[>] Configured Claude Code hooks at $SETTINGS_FILE"
    else
        echo "[=] Claude Code settings already exist at $SETTINGS_FILE (skipped)"
    fi
fi

# ---------------------------------------------------------------------------
# Step 7: Find available ports
# ---------------------------------------------------------------------------
while ! check_port $BACKEND_PORT; do
    echo "[!] Port $BACKEND_PORT in use, trying $(( BACKEND_PORT + 2 ))..."
    BACKEND_PORT=$(( BACKEND_PORT + 2 ))
    FRONTEND_PORT=$(( FRONTEND_PORT + 2 ))
done
echo "[>] Using ports: backend=$BACKEND_PORT, frontend=$FRONTEND_PORT"

# Update the config with the final ports (in case they shifted)
if command -v sed &>/dev/null; then
    sed -i "s/\"backend\": [0-9]*/\"backend\": $BACKEND_PORT/" "$MC_DIR/mission-control.config.json" 2>/dev/null || \
    sed -i '' "s/\"backend\": [0-9]*/\"backend\": $BACKEND_PORT/" "$MC_DIR/mission-control.config.json" 2>/dev/null || true
    sed -i "s/\"frontend\": [0-9]*/\"frontend\": $FRONTEND_PORT/" "$MC_DIR/mission-control.config.json" 2>/dev/null || \
    sed -i '' "s/\"frontend\": [0-9]*/\"frontend\": $FRONTEND_PORT/" "$MC_DIR/mission-control.config.json" 2>/dev/null || true
fi

# ---------------------------------------------------------------------------
# Step 8: Start dashboard in background
# ---------------------------------------------------------------------------
echo "[>] Starting Mission Control dashboard..."
cd "$MC_DIR"

# Detect current git branch
GIT_BRANCH="main"
if command -v git &>/dev/null; then
    DETECTED_BRANCH=$(cd "$PROJECT_DIR" && git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "main")
    GIT_BRANCH="$DETECTED_BRANCH"
fi
echo "[>] Git branch: $GIT_BRANCH"

# Use nohup on Unix-like systems, start on Windows
# Pass project-aware env vars so the server watches the right directories
if command -v nohup &>/dev/null; then
    MC_PORT=$BACKEND_PORT MC_PROJECT_DIR="$PROJECT_DIR" MC_WATCH_DIR="$PROJECT_DIR/.team" MC_GIT_CWD="$PROJECT_DIR" MC_GIT_BRANCH="$GIT_BRANCH" nohup npm run dashboard > "$MC_DIR/dashboard.log" 2>&1 &
    DASHBOARD_PID=$!
else
    MC_PORT=$BACKEND_PORT MC_PROJECT_DIR="$PROJECT_DIR" MC_WATCH_DIR="$PROJECT_DIR/.team" MC_GIT_CWD="$PROJECT_DIR" MC_GIT_BRANCH="$GIT_BRANCH" npm run dashboard > "$MC_DIR/dashboard.log" 2>&1 &
    DASHBOARD_PID=$!
fi

echo "$DASHBOARD_PID" > "$MC_DIR/.dashboard.pid"
echo "[>] Dashboard PID: $DASHBOARD_PID"

# ---------------------------------------------------------------------------
# Step 9: Health check (max 30s)
# ---------------------------------------------------------------------------
echo "[>] Waiting for dashboard to start..."
HEALTH_URL="http://localhost:$BACKEND_PORT/api/health"
TIMEOUT=30
ELAPSED=0
while [ $ELAPSED -lt $TIMEOUT ]; do
    if curl -sf "$HEALTH_URL" > /dev/null 2>&1; then
        echo ""
        echo "========================================================"
        echo "  [OK] Mission Control running"
        echo "       Dashboard: http://localhost:$FRONTEND_PORT"
        echo "       API:       http://localhost:$BACKEND_PORT/api"
        echo "       Session:   $SESSION_ID"
        echo "========================================================"
        exit 0
    fi
    sleep 2
    ELAPSED=$(( ELAPSED + 2 ))
    printf "."
done

echo ""
echo "[!] Dashboard did not respond within ${TIMEOUT}s"
echo "    Check logs: $MC_DIR/dashboard.log"
echo "    The team will continue -- dashboard is non-blocking"
exit 0
