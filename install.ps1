# ============================================================================
# Amenthyx AI Teams — Installer (Windows PowerShell)
# ============================================================================
# Usage:
#   Right-click > Run with PowerShell
#   or: powershell -ExecutionPolicy Bypass -File install.ps1
# ============================================================================

$ErrorActionPreference = "Stop"

# --- Colors helper ---------------------------------------------------------
function Write-Color($Color, $Tag, $Message) {
    Write-Host "[$Tag]" -ForegroundColor $Color -NoNewline
    Write-Host "  $Message"
}
function Info($msg)  { Write-Color Cyan    "INFO"  $msg }
function Ok($msg)    { Write-Color Green   " OK "  $msg }
function Warn($msg)  { Write-Color Yellow  "WARN"  $msg }
function Err($msg)   { Write-Color Red     "ERROR" $msg }

# --- Banner ----------------------------------------------------------------
Write-Host ""
Write-Host "    _                      _   _                " -ForegroundColor Cyan
Write-Host "   / \   _ __ ___   ___ _ | |_| |__  _   ___  __" -ForegroundColor Cyan
Write-Host "  / _ \ | '_ `` _ \ / _ \ '_ \| __| '_ \| | | \ \/ /" -ForegroundColor Cyan
Write-Host " / ___ \| | | | | |  __/ | | | |_| | | | |_| |>  < " -ForegroundColor Cyan
Write-Host "/_/   \_\_| |_| |_|\___|_| |_|\__|_| |_|\__, /_/\_\" -ForegroundColor Cyan
Write-Host "                                         |___/      " -ForegroundColor Cyan
Write-Host ""
Write-Host "Amenthyx AI Teams - Installer" -ForegroundColor White
Write-Host "59 specialized virtual engineering teams" -ForegroundColor DarkGray
Write-Host ""

# --- Install directory -----------------------------------------------------
$InstallDir = if ($env:AMENTHYX_INSTALL_DIR) { $env:AMENTHYX_INSTALL_DIR } else { "$env:USERPROFILE\.amenthyx" }
$BinDir = "$InstallDir\bin"

if (-not (Test-Path $InstallDir)) { New-Item -ItemType Directory -Path $InstallDir -Force | Out-Null }
if (-not (Test-Path $BinDir))     { New-Item -ItemType Directory -Path $BinDir -Force | Out-Null }
Info "Install directory: $InstallDir"

# --- Check Python ----------------------------------------------------------
$Python = $null
foreach ($cmd in @("python", "python3", "py")) {
    try {
        $ver = & $cmd --version 2>&1
        if ($ver -match "Python (\d+)\.(\d+)") {
            $major = [int]$Matches[1]
            $minor = [int]$Matches[2]
            if ($major -ge 3 -and $minor -ge 8) {
                $Python = $cmd
                break
            }
        }
    } catch { }
}

if (-not $Python) {
    Err "Python 3.8+ is required but not found."
    Err "Install Python: https://www.python.org/downloads/"
    Read-Host "Press Enter to exit"
    exit 1
}
Ok "Python: $(& $Python --version 2>&1)"

# --- Download or copy CLI --------------------------------------------------
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

if (Test-Path "$ScriptDir\shared\amenthyx_cli.py") {
    # Running from repo clone
    Info "Installing from local repository..."

    # Copy shared folder
    if (Test-Path "$InstallDir\shared") { Remove-Item "$InstallDir\shared" -Recurse -Force }
    Copy-Item "$ScriptDir\shared" "$InstallDir\shared" -Recurse

    # Copy teams folder
    if (Test-Path "$ScriptDir\teams") {
        if (Test-Path "$InstallDir\teams") { Remove-Item "$InstallDir\teams" -Recurse -Force }
        Copy-Item "$ScriptDir\teams" "$InstallDir\teams" -Recurse
    }

    # Create launcher batch file
    $LauncherBat = @"
@echo off
set "AMENTHYX_HOME=%USERPROFILE%\.amenthyx"
$Python "%AMENTHYX_HOME%\shared\amenthyx_cli.py" %*
"@
    Set-Content -Path "$BinDir\amenthyx.bat" -Value $LauncherBat -Encoding ASCII

    # Create launcher PowerShell script
    $LauncherPs1 = @"
`$env:AMENTHYX_HOME = if (`$env:AMENTHYX_HOME) { `$env:AMENTHYX_HOME } else { "`$env:USERPROFILE\.amenthyx" }
& $Python "`$env:AMENTHYX_HOME\shared\amenthyx_cli.py" @args
"@
    Set-Content -Path "$BinDir\amenthyx.ps1" -Value $LauncherPs1 -Encoding UTF8

    Ok "CLI installed from local repo"
} else {
    # Download latest release binary
    Info "Downloading latest release..."
    $ReleaseUrl = "https://github.com/Amenthyx/amenthyx-ai-teams/releases/latest/download/amenthyx-windows.exe"
    $DestPath = "$BinDir\amenthyx.exe"
    try {
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
        Invoke-WebRequest -Uri $ReleaseUrl -OutFile $DestPath -UseBasicParsing
        Ok "Binary downloaded: $DestPath"
    } catch {
        Err "Download failed: $_"
        Err "URL: $ReleaseUrl"
        Read-Host "Press Enter to exit"
        exit 1
    }
}

# --- Environment Variables -------------------------------------------------
Write-Host ""
Write-Host "Environment Variables Setup" -ForegroundColor Cyan
Write-Host "Configure optional environment variables for Amenthyx" -ForegroundColor DarkGray
Write-Host ""

# Collect values
Write-Host "1. Anthropic API Key " -ForegroundColor White -NoNewline
Write-Host "(for AI strategy merger - optional)" -ForegroundColor DarkGray
Write-Host "   Get one at: https://console.anthropic.com/settings/keys" -ForegroundColor Cyan
$InputApiKey = Read-Host "   ANTHROPIC_API_KEY [skip]"

Write-Host ""
Write-Host "2. Mission Control Port " -ForegroundColor White -NoNewline
Write-Host "(default: 4201)" -ForegroundColor DarkGray
$InputPort = Read-Host "   MC_PORT [4201]"
if (-not $InputPort) { $InputPort = "4201" }

Write-Host ""
Write-Host "3. Default Project Directory " -ForegroundColor White -NoNewline
Write-Host "(where your projects live)" -ForegroundColor DarkGray
$InputProjectDir = Read-Host "   MC_PROJECT_DIR [skip]"

Write-Host ""
Write-Host "4. Claude Permissions Mode " -ForegroundColor White -NoNewline
Write-Host "(for automated execution)" -ForegroundColor DarkGray
Write-Host "   Options: safe (default) | skip-permissions" -ForegroundColor DarkGray
$InputPermMode = Read-Host "   AMENTHYX_PERMISSIONS_MODE [safe]"
if (-not $InputPermMode) { $InputPermMode = "safe" }

# Preview
Write-Host ""
Write-Host "The following system environment variables will be set:" -ForegroundColor White
Write-Host ""
Write-Host "  AMENTHYX_HOME = $InstallDir" -ForegroundColor DarkGray
Write-Host "  PATH += $BinDir" -ForegroundColor DarkGray
if ($InputApiKey)      { Write-Host "  ANTHROPIC_API_KEY = $('*' * [Math]::Min($InputApiKey.Length, 20))..." -ForegroundColor DarkGray }
if ($InputPort -ne "4201") { Write-Host "  MC_PORT = $InputPort" -ForegroundColor DarkGray }
if ($InputProjectDir)  { Write-Host "  MC_PROJECT_DIR = $InputProjectDir" -ForegroundColor DarkGray }
if ($InputPermMode -ne "safe") { Write-Host "  AMENTHYX_PERMISSIONS_MODE = $InputPermMode" -ForegroundColor DarkGray }
Write-Host ""

$Confirm = Read-Host "Set system environment variables? [Y/n]"
if (-not $Confirm) { $Confirm = "Y" }

if ($Confirm -match "^[Yy]$") {
    # Set User-level environment variables (persist across sessions)
    [Environment]::SetEnvironmentVariable("AMENTHYX_HOME", $InstallDir, "User")
    Ok "Set AMENTHYX_HOME = $InstallDir"

    # Add to PATH if not already there
    $CurrentPath = [Environment]::GetEnvironmentVariable("Path", "User")
    if ($CurrentPath -notlike "*$BinDir*") {
        [Environment]::SetEnvironmentVariable("Path", "$BinDir;$CurrentPath", "User")
        Ok "Added $BinDir to user PATH"
    } else {
        Info "$BinDir already in PATH"
    }

    if ($InputApiKey) {
        [Environment]::SetEnvironmentVariable("ANTHROPIC_API_KEY", $InputApiKey, "User")
        Ok "Set ANTHROPIC_API_KEY"
    }

    if ($InputPort -ne "4201") {
        [Environment]::SetEnvironmentVariable("MC_PORT", $InputPort, "User")
        Ok "Set MC_PORT = $InputPort"
    }

    if ($InputProjectDir) {
        [Environment]::SetEnvironmentVariable("MC_PROJECT_DIR", $InputProjectDir, "User")
        Ok "Set MC_PROJECT_DIR = $InputProjectDir"
    }

    if ($InputPermMode -ne "safe") {
        [Environment]::SetEnvironmentVariable("AMENTHYX_PERMISSIONS_MODE", $InputPermMode, "User")
        Ok "Set AMENTHYX_PERMISSIONS_MODE = $InputPermMode"
    }

    # Also set in current session
    $env:AMENTHYX_HOME = $InstallDir
    $env:Path = "$BinDir;$env:Path"
    if ($InputApiKey) { $env:ANTHROPIC_API_KEY = $InputApiKey }

    Ok "Environment variables saved (User scope - persists across sessions)"
} else {
    Warn "Skipped setting environment variables"
    Write-Host ""
    Write-Host "Set manually in PowerShell:" -ForegroundColor DarkGray
    Write-Host "  [Environment]::SetEnvironmentVariable('AMENTHYX_HOME', '$InstallDir', 'User')" -ForegroundColor DarkGray
    Write-Host "  [Environment]::SetEnvironmentVariable('Path', '$BinDir;' + [Environment]::GetEnvironmentVariable('Path', 'User'), 'User')" -ForegroundColor DarkGray
}

# --- Verify ----------------------------------------------------------------
Write-Host ""
Write-Host "Installation complete!" -ForegroundColor Green
Write-Host ""
Write-Host "  amenthyx list              " -ForegroundColor Cyan -NoNewline
Write-Host "List all 59 teams" -ForegroundColor DarkGray
Write-Host "  amenthyx info fullStack    " -ForegroundColor Cyan -NoNewline
Write-Host "Show team details" -ForegroundColor DarkGray
Write-Host "  amenthyx init              " -ForegroundColor Cyan -NoNewline
Write-Host "Setup wizard" -ForegroundColor DarkGray
Write-Host "  amenthyx health            " -ForegroundColor Cyan -NoNewline
Write-Host "Project health check" -ForegroundColor DarkGray
Write-Host "  amenthyx merge-strategy    " -ForegroundColor Cyan -NoNewline
Write-Host "AI-powered strategy merger" -ForegroundColor DarkGray
Write-Host ""

# Quick test
Write-Host "Testing installation..." -ForegroundColor DarkGray
try {
    if (Test-Path "$BinDir\amenthyx.bat") {
        $result = & cmd /c "$BinDir\amenthyx.bat" version 2>&1
        Ok "CLI works: $result"
    } elseif (Test-Path "$BinDir\amenthyx.exe") {
        $result = & "$BinDir\amenthyx.exe" version 2>&1
        Ok "CLI works: $result"
    }
} catch {
    Warn "Could not verify CLI. Restart your terminal and try: amenthyx version"
}

Write-Host ""
Write-Host "Restart your terminal for PATH changes to take effect." -ForegroundColor Yellow
Write-Host ""
Read-Host "Press Enter to exit"
