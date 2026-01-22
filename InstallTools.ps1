# =============================================================================
# All-in-One Tool Installer
# =============================================================================
# This script installs a curated list of productivity and utility tools
# using Windows Package Manager (winget)
#
# Requirements: Windows 10 1809+ or Windows 11 with winget installed
# Usage: Right-click and "Run with PowerShell" or run from PowerShell terminal
# =============================================================================

# Ensure script runs with appropriate permissions
#Requires -RunAsAdministrator

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   All-in-One Tool Installer" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if winget is installed
try {
    $wingetVersion = winget --version
    Write-Host "✓ Windows Package Manager (winget) detected: $wingetVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Windows Package Manager (winget) is not installed!" -ForegroundColor Red
    Write-Host "Please install winget from: https://aka.ms/getwinget" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "This script will install the following tools:" -ForegroundColor Yellow
Write-Host ""

# Define the list of applications to install
$applications = @(
    @{Name="ShareX"; Id="ShareX.ShareX"; Description="Screenshot and screen recording tool"},
    @{Name="Start11"; Id="Stardock.Start11"; Description="Enhanced Start Menu for Windows"},
    @{Name="Notion"; Id="Notion.Notion"; Description="All-in-one workspace for notes and organization"},
    @{Name="Firefox"; Id="Mozilla.Firefox"; Description="Open-source web browser"},
    @{Name="Affinity Photo"; Id="Serif.AffinityPhoto.2"; Description="Professional photo editing software"},
    @{Name="UniGetUI"; Id="MartiCliment.UniGetUI"; Description="Universal GUI for package managers"},
    @{Name="Everything"; Id="voidtools.Everything"; Description="Fast file search engine"},
    @{Name="AutoDarkMode"; Id="Armin2208.WindowsAutoNightMode"; Description="Automatic dark mode switcher"},
    @{Name="Flow Launcher"; Id="Flow-Launcher.Flow-Launcher"; Description="Quick file search and app launcher"}
)

# Display the list
$counter = 1
foreach ($app in $applications) {
    Write-Host "$counter. $($app.Name) - $($app.Description)" -ForegroundColor White
    $counter++
}

Write-Host ""
Write-Host "Browser Extensions (manual installation required):" -ForegroundColor Yellow
Write-Host "  • Clipboard History Pro - Install from browser extension store" -ForegroundColor Gray
Write-Host "  • OneTab - Install from browser extension store" -ForegroundColor Gray
Write-Host ""

# Prompt user to continue
$response = Read-Host "Do you want to proceed with installation? (Y/N)"
if ($response -ne 'Y' -and $response -ne 'y') {
    Write-Host "Installation cancelled." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Installation..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Track installation results
$successful = @()
$failed = @()
$skipped = @()

# Install each application
foreach ($app in $applications) {
    Write-Host "Installing $($app.Name)..." -ForegroundColor Cyan

    try {
        # Check if already installed
        $installed = winget list --id $app.Id --exact 2>$null
        if ($LASTEXITCODE -eq 0 -and $installed -match $app.Id) {
            Write-Host "  ⚠ $($app.Name) is already installed. Skipping..." -ForegroundColor Yellow
            $skipped += $app.Name
        } else {
            # Install the application
            winget install --id $app.Id --exact --silent --accept-package-agreements --accept-source-agreements

            if ($LASTEXITCODE -eq 0) {
                Write-Host "  ✓ $($app.Name) installed successfully!" -ForegroundColor Green
                $successful += $app.Name
            } else {
                Write-Host "  ✗ Failed to install $($app.Name)" -ForegroundColor Red
                $failed += $app.Name
            }
        }
    } catch {
        Write-Host "  ✗ Error installing $($app.Name): $_" -ForegroundColor Red
        $failed += $app.Name
    }

    Write-Host ""
}

# Display summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Installation Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($successful.Count -gt 0) {
    Write-Host "Successfully Installed ($($successful.Count)):" -ForegroundColor Green
    foreach ($app in $successful) {
        Write-Host "  ✓ $app" -ForegroundColor Green
    }
    Write-Host ""
}

if ($skipped.Count -gt 0) {
    Write-Host "Already Installed ($($skipped.Count)):" -ForegroundColor Yellow
    foreach ($app in $skipped) {
        Write-Host "  ⚠ $app" -ForegroundColor Yellow
    }
    Write-Host ""
}

if ($failed.Count -gt 0) {
    Write-Host "Failed to Install ($($failed.Count)):" -ForegroundColor Red
    foreach ($app in $failed) {
        Write-Host "  ✗ $app" -ForegroundColor Red
    }
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Install browser extensions manually:" -ForegroundColor White
Write-Host "   • Clipboard History Pro: Search in your browser's extension store" -ForegroundColor Gray
Write-Host "   • OneTab: https://www.one-tab.com" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Some applications may require a system restart to function properly." -ForegroundColor White
Write-Host ""
Write-Host "3. Launch Everything and configure it to run at startup for best results." -ForegroundColor White
Write-Host ""

Read-Host "Press Enter to exit"
