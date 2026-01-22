@echo off
REM =============================================================================
REM All-in-One Tool Installer - Batch Launcher
REM =============================================================================
REM This batch file launches the PowerShell installer script
REM Use this if you have issues running the .ps1 file directly
REM =============================================================================

echo.
echo ========================================
echo    All-in-One Tool Installer
echo ========================================
echo.

REM Check for administrator privileges
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: This script requires Administrator privileges!
    echo.
    echo Please right-click this file and select "Run as administrator"
    echo.
    pause
    exit /b 1
)

REM Run the PowerShell script with execution policy bypass
echo Starting PowerShell installer...
echo.

powershell.exe -ExecutionPolicy Bypass -File "%~dp0InstallTools.ps1"

if %errorLevel% neq 0 (
    echo.
    echo Installation encountered errors. Please check the output above.
    echo.
)

pause
