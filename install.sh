#!/usr/bin/env bash
# ============================================================================
# Amenthyx AI Teams — Installer (Linux / macOS)
# ============================================================================
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/Amenthyx/amenthyx-ai-teams/main/install.sh | bash
#   or: bash install.sh
# ============================================================================

set -euo pipefail

# --- Colors ----------------------------------------------------------------
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
DIM='\033[2m'
NC='\033[0m'

info()  { echo -e "${BLUE}[INFO]${NC}  $1"; }
ok()    { echo -e "${GREEN}[OK]${NC}    $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC}  $1"; }
err()   { echo -e "${RED}[ERROR]${NC} $1"; }

# --- Banner ----------------------------------------------------------------
echo ""
echo -e "${BOLD}${CYAN}"
echo "    _                      _   _                "
echo "   / \   _ __ ___   ___ _ | |_| |__  _   ___  __"
echo "  / _ \ | '_ \` _ \ / _ \ '_ \| __| '_ \| | | \ \/ /"
echo " / ___ \| | | | | |  __/ | | | |_| | | | |_| |>  < "
echo "/_/   \_\_| |_| |_|\___|_| |_|\__|_| |_|\__, /_/\_\\"
echo "                                         |___/      "
echo -e "${NC}"
echo -e "${BOLD}Amenthyx AI Teams — Installer${NC}"
echo -e "${DIM}59 specialized virtual engineering teams${NC}"
echo ""

# --- Detect platform -------------------------------------------------------
OS="$(uname -s)"
ARCH="$(uname -m)"
case "$OS" in
  Linux*)  PLATFORM="linux"   ; BINARY="amenthyx-linux" ;;
  Darwin*) PLATFORM="macos"   ; BINARY="amenthyx-macos" ;;
  *)       err "Unsupported OS: $OS. Use install.ps1 for Windows."; exit 1 ;;
esac
info "Platform: ${PLATFORM} (${ARCH})"

# --- Install directory -----------------------------------------------------
INSTALL_DIR="${AMENTHYX_INSTALL_DIR:-$HOME/.amenthyx}"
BIN_DIR="${INSTALL_DIR}/bin"
mkdir -p "$BIN_DIR"
info "Install directory: ${INSTALL_DIR}"

# --- Check Python ----------------------------------------------------------
PYTHON=""
for cmd in python3 python; do
  if command -v "$cmd" &>/dev/null; then
    PY_VER=$("$cmd" --version 2>&1 | grep -oP '\d+\.\d+' | head -1)
    PY_MAJOR=$(echo "$PY_VER" | cut -d. -f1)
    PY_MINOR=$(echo "$PY_VER" | cut -d. -f2)
    if [ "$PY_MAJOR" -ge 3 ] && [ "$PY_MINOR" -ge 8 ]; then
      PYTHON="$cmd"
      break
    fi
  fi
done

if [ -z "$PYTHON" ]; then
  err "Python 3.8+ is required but not found."
  err "Install Python: https://www.python.org/downloads/"
  exit 1
fi
ok "Python: $($PYTHON --version)"

# --- Download or copy CLI --------------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ -f "${SCRIPT_DIR}/shared/amenthyx_cli.py" ]; then
  # Running from repo clone
  info "Installing from local repository..."
  cp -r "${SCRIPT_DIR}/shared" "${INSTALL_DIR}/shared"
  cp -r "${SCRIPT_DIR}/teams" "${INSTALL_DIR}/teams" 2>/dev/null || true

  # Create launcher script
  cat > "${BIN_DIR}/amenthyx" << 'LAUNCHER'
#!/usr/bin/env bash
AMENTHYX_HOME="${AMENTHYX_HOME:-$HOME/.amenthyx}"
exec python3 "${AMENTHYX_HOME}/shared/amenthyx_cli.py" "$@"
LAUNCHER
  chmod +x "${BIN_DIR}/amenthyx"
  ok "CLI installed from local repo"
else
  # Download latest release binary from GitHub
  info "Downloading latest release..."
  RELEASE_URL="https://github.com/Amenthyx/amenthyx-ai-teams/releases/latest/download/${BINARY}"
  if command -v curl &>/dev/null; then
    curl -fsSL -o "${BIN_DIR}/amenthyx" "$RELEASE_URL" || {
      err "Download failed. Check your internet connection."
      err "URL: ${RELEASE_URL}"
      exit 1
    }
  elif command -v wget &>/dev/null; then
    wget -q -O "${BIN_DIR}/amenthyx" "$RELEASE_URL" || {
      err "Download failed."
      exit 1
    }
  else
    err "curl or wget is required for download."
    exit 1
  fi
  chmod +x "${BIN_DIR}/amenthyx"
  ok "Binary downloaded: ${BIN_DIR}/amenthyx"
fi

# --- Environment variables -------------------------------------------------
echo ""
echo -e "${BOLD}${CYAN}Environment Variables Setup${NC}"
echo -e "${DIM}Configure optional environment variables for Amenthyx${NC}"
echo ""

# Shell profile detection
SHELL_NAME="$(basename "$SHELL")"
case "$SHELL_NAME" in
  zsh)  PROFILE="$HOME/.zshrc" ;;
  bash)
    if [ -f "$HOME/.bash_profile" ]; then
      PROFILE="$HOME/.bash_profile"
    else
      PROFILE="$HOME/.bashrc"
    fi
    ;;
  fish) PROFILE="$HOME/.config/fish/config.fish" ;;
  *)    PROFILE="$HOME/.profile" ;;
esac
info "Shell profile: ${PROFILE}"

# Collect env var values
echo ""
echo -e "${BOLD}1. Anthropic API Key${NC} ${DIM}(for AI strategy merger — optional)${NC}"
echo -e "   Get one at: ${CYAN}https://console.anthropic.com/settings/keys${NC}"
read -rp "   ANTHROPIC_API_KEY [skip]: " INPUT_ANTHROPIC_KEY

echo ""
echo -e "${BOLD}2. Mission Control Port${NC} ${DIM}(default: 4201)${NC}"
read -rp "   MC_PORT [4201]: " INPUT_MC_PORT
INPUT_MC_PORT="${INPUT_MC_PORT:-4201}"

echo ""
echo -e "${BOLD}3. Default Project Directory${NC} ${DIM}(where your projects live)${NC}"
read -rp "   MC_PROJECT_DIR [skip]: " INPUT_PROJECT_DIR

echo ""
echo -e "${BOLD}4. Claude Permissions Mode${NC} ${DIM}(for automated execution)${NC}"
echo "   Options: safe (default) | skip-permissions (adds --dangerously-skip-permissions)"
read -rp "   AMENTHYX_PERMISSIONS_MODE [safe]: " INPUT_PERM_MODE
INPUT_PERM_MODE="${INPUT_PERM_MODE:-safe}"

# Build env block
ENV_BLOCK=""
ENV_BLOCK+="\n# --- Amenthyx AI Teams ---\n"
ENV_BLOCK+="export AMENTHYX_HOME=\"${INSTALL_DIR}\"\n"
ENV_BLOCK+="export PATH=\"\${AMENTHYX_HOME}/bin:\$PATH\"\n"

if [ -n "$INPUT_ANTHROPIC_KEY" ]; then
  ENV_BLOCK+="export ANTHROPIC_API_KEY=\"${INPUT_ANTHROPIC_KEY}\"\n"
fi

if [ "$INPUT_MC_PORT" != "4201" ]; then
  ENV_BLOCK+="export MC_PORT=\"${INPUT_MC_PORT}\"\n"
fi

if [ -n "$INPUT_PROJECT_DIR" ]; then
  ENV_BLOCK+="export MC_PROJECT_DIR=\"${INPUT_PROJECT_DIR}\"\n"
fi

if [ "$INPUT_PERM_MODE" = "skip-permissions" ]; then
  ENV_BLOCK+="export AMENTHYX_PERMISSIONS_MODE=\"skip-permissions\"\n"
fi

ENV_BLOCK+="# --- End Amenthyx ---\n"

# Write to profile
echo ""
echo -e "${BOLD}The following will be added to ${PROFILE}:${NC}"
echo -e "${DIM}${ENV_BLOCK}${NC}"
read -rp "Proceed? [Y/n]: " CONFIRM
CONFIRM="${CONFIRM:-Y}"

if [[ "$CONFIRM" =~ ^[Yy]$ ]]; then
  # Remove old Amenthyx block if present
  if grep -q "# --- Amenthyx AI Teams ---" "$PROFILE" 2>/dev/null; then
    sed -i.bak '/# --- Amenthyx AI Teams ---/,/# --- End Amenthyx ---/d' "$PROFILE"
    info "Removed previous Amenthyx config from ${PROFILE}"
  fi

  echo -e "$ENV_BLOCK" >> "$PROFILE"
  ok "Environment variables written to ${PROFILE}"
else
  warn "Skipped writing to ${PROFILE}"
  echo -e "${DIM}Add manually:${NC}"
  echo -e "$ENV_BLOCK"
fi

# --- Verify installation ---------------------------------------------------
echo ""
echo -e "${BOLD}${GREEN}Installation complete!${NC}"
echo ""
echo -e "  ${CYAN}amenthyx list${NC}              List all 59 teams"
echo -e "  ${CYAN}amenthyx info fullStack${NC}    Show team details"
echo -e "  ${CYAN}amenthyx init${NC}              Setup wizard"
echo -e "  ${CYAN}amenthyx health${NC}            Project health check"
echo -e "  ${CYAN}amenthyx merge-strategy${NC}    AI-powered strategy merger"
echo ""
echo -e "${DIM}Restart your terminal or run:${NC}"
echo -e "  ${CYAN}source ${PROFILE}${NC}"
echo ""
