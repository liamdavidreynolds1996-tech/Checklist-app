# =============================================================================
# Package ID Verification Script
# =============================================================================
# This script verifies that all package IDs in the installer are valid
# and available in winget repositories
# =============================================================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Package ID Verification" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if winget is installed
try {
    $wingetVersion = winget --version
    Write-Host "✓ winget version: $wingetVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ winget is not installed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Verifying package IDs..." -ForegroundColor Yellow
Write-Host ""

# Define the same applications list from the installer
$applications = @(
    @{Name="ShareX"; Id="ShareX.ShareX"},
    @{Name="Start11"; Id="Stardock.Start11"},
    @{Name="Notion"; Id="Notion.Notion"},
    @{Name="Firefox"; Id="Mozilla.Firefox"},
    @{Name="Affinity Photo"; Id="Serif.AffinityPhoto.2"},
    @{Name="UniGetUI"; Id="MartiCliment.UniGetUI"},
    @{Name="Everything"; Id="voidtools.Everything"},
    @{Name="AutoDarkMode"; Id="Armin2208.WindowsAutoNightMode"},
    @{Name="Flow Launcher"; Id="Flow-Launcher.Flow-Launcher"}
)

$valid = @()
$invalid = @()
$installed = @()

# Check each package
foreach ($app in $applications) {
    Write-Host "Checking: $($app.Name) [$($app.Id)]" -ForegroundColor White

    try {
        # Search for the package
        $searchResult = winget search --id $app.Id --exact 2>&1

        if ($LASTEXITCODE -eq 0 -and $searchResult -match $app.Id) {
            Write-Host "  ✓ Package ID is valid" -ForegroundColor Green
            $valid += $app.Name

            # Check if already installed
            $installedCheck = winget list --id $app.Id --exact 2>&1
            if ($LASTEXITCODE -eq 0 -and $installedCheck -match $app.Id) {
                Write-Host "  ✓ Already installed on this system" -ForegroundColor Cyan
                $installed += $app.Name
            } else {
                Write-Host "  ℹ Not currently installed" -ForegroundColor Gray
            }
        } else {
            Write-Host "  ✗ Package ID not found in winget" -ForegroundColor Red
            $invalid += $app.Name
        }
    } catch {
        Write-Host "  ✗ Error checking package: $_" -ForegroundColor Red
        $invalid += $app.Name
    }

    Write-Host ""
}

# Display summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Verification Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Valid Package IDs: $($valid.Count)/$($applications.Count)" -ForegroundColor Green
if ($installed.Count -gt 0) {
    Write-Host "Already Installed: $($installed.Count)" -ForegroundColor Cyan
    foreach ($app in $installed) {
        Write-Host "  • $app" -ForegroundColor Cyan
    }
    Write-Host ""
}

if ($invalid.Count -gt 0) {
    Write-Host "Invalid Package IDs: $($invalid.Count)" -ForegroundColor Red
    foreach ($app in $invalid) {
        Write-Host "  • $app" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "Note: Invalid packages may need manual installation or different package IDs" -ForegroundColor Yellow
} else {
    Write-Host "All package IDs are valid! ✓" -ForegroundColor Green
}

Write-Host ""
Read-Host "Press Enter to exit"
