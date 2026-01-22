# Quick Reference Guide

## 🚀 One-Command Installation

### Option 1: Run the Batch File (Easiest)
```
Right-click InstallTools.bat → Run as administrator
```

### Option 2: PowerShell One-Liner
```powershell
powershell -ExecutionPolicy Bypass -File .\InstallTools.ps1
```

## 🔧 Individual Tool Installation

If you want to install tools individually using winget:

```powershell
# ShareX - Screenshot tool
winget install ShareX.ShareX

# Start11 - Enhanced Start Menu
winget install Stardock.Start11

# Notion - Notes and organization
winget install Notion.Notion

# Firefox - Web browser
winget install Mozilla.Firefox

# Affinity Photo - Photo editing
winget install Serif.AffinityPhoto.2

# UniGetUI - Package manager GUI
winget install MartiCliment.UniGetUI

# Everything - Fast file search
winget install voidtools.Everything

# AutoDarkMode - Automatic theme switcher
winget install Armin2208.WindowsAutoNightMode

# Flow Launcher - App launcher
winget install Flow-Launcher.Flow-Launcher
```

## 🌐 Browser Extensions

### Firefox
```
1. Open Firefox
2. Go to: about:addons
3. Search for and install:
   - Clipboard History Pro
   - OneTab
```

### Chrome/Edge
```
1. Open Chrome Web Store
2. Search for and install:
   - Clipboard History Pro
   - OneTab (https://chrome.google.com/webstore/detail/onetab/chphlpgkkbolifaimnlloiipkdnihall)
```

## ⚡ Post-Installation Setup

### Everything (File Search)
```
1. Launch Everything
2. Options → General → Check "Run on system startup"
3. Options → General → Check "Start Everything on system startup"
4. Shortcut: Win + S or double-click system tray icon
```

### Flow Launcher
```
1. Launch Flow Launcher
2. Default hotkey: Alt + Space
3. Settings: Type "settings" after opening Flow Launcher
4. Install plugins: Type "plugin store"
```

### AutoDarkMode
```
1. Launch Windows Auto Dark Mode
2. Choose mode:
   - Scheduled: Set specific times
   - Sunset to Sunrise: Automatic based on location
3. Enable for both Windows and Apps
```

### ShareX
```
1. Launch ShareX
2. Common shortcuts:
   - Print Screen: Capture region
   - Ctrl + Print Screen: Capture full screen
   - Alt + Print Screen: Capture active window
3. Configure upload destinations in Task settings
```

### UniGetUI
```
1. Launch UniGetUI
2. It will automatically detect installed package managers
3. Check for updates: Click "Updates" tab
4. Enable "Check for updates on startup" in settings
```

## 🔑 Keyboard Shortcuts

### Flow Launcher
- `Alt + Space` - Open Flow Launcher
- Type app name and press Enter to launch
- `>` prefix for system commands

### ShareX
- `Print Screen` - Region capture
- `Ctrl + Print Screen` - Full screen capture
- `Alt + Print Screen` - Active window
- `Shift + Print Screen` - Custom region

### Everything
- `Ctrl + N` - New search window
- `Ctrl + Shift + C` - Copy full path
- `F11` - Toggle fullscreen
- `Ctrl + 1-9` - Quick filters

### Firefox (with OneTab)
- `Ctrl + Shift + O` - Show OneTab
- Click OneTab icon - Save all tabs

## 🛠️ Troubleshooting Commands

### Check if a tool is installed
```powershell
winget list --name "ToolName"
```

### Update all tools
```powershell
winget upgrade --all
```

### Uninstall a tool
```powershell
winget uninstall --id PackageId
```

### Search for alternative package IDs
```powershell
winget search "tool name"
```

### Verify winget is working
```powershell
winget --version
```

## 📦 Updating Tools

### Using UniGetUI (Recommended)
```
1. Open UniGetUI
2. Click "Updates" tab
3. Select all updates
4. Click "Update selected packages"
```

### Using winget
```powershell
# Update a specific tool
winget upgrade ShareX.ShareX

# Update all tools at once
winget upgrade --all

# Update all tools silently
winget upgrade --all --silent
```

## 🔄 Alternative Installation Methods

### Using Chocolatey (if you prefer)
```powershell
choco install sharex notion firefox vlc everything

# With UniGetUI, you can manage chocolatey packages too!
```

### Using Scoop
```powershell
scoop install firefox notion
```

## 📱 Recommended Settings

### Windows Settings
1. **Dark Mode**: Settings → Personalization → Colors → Dark
2. **Night Light**: Settings → System → Display → Night light (or use AutoDarkMode)
3. **Focus Assist**: Settings → System → Focus assist

### Tool Combinations
- **Clipboard**: Use Clipboard History Pro (browser) + Windows Clipboard History (Win + V)
- **Search**: Everything for files + Flow Launcher for apps
- **Screenshots**: ShareX for advanced + Win + Shift + S for quick captures

## 🌟 Pro Tips

1. **Everything + Flow Launcher Integration**
   - Install Everything Flow Launcher plugin for unified search

2. **ShareX Auto-Upload**
   - Configure ShareX to auto-upload to Imgur/Google Drive
   - Get shareable links automatically

3. **Firefox Container Tabs**
   - Install Multi-Account Containers extension
   - Separate work/personal browsing

4. **Notion Templates**
   - Explore Notion template gallery for productivity setups
   - Use databases for task management

5. **AutoDarkMode + Night Light**
   - Use AutoDarkMode for theme switching
   - Enable Night Light for eye comfort

## 🆘 Getting Help

- **winget issues**: https://github.com/microsoft/winget-cli/issues
- **ShareX**: https://github.com/ShareX/ShareX/issues
- **Everything**: https://www.voidtools.com/forum/
- **Flow Launcher**: https://github.com/Flow-Launcher/Flow-Launcher/issues
- **UniGetUI**: https://github.com/marticliment/UniGetUI/issues

---

**Happy computing! 🎉**
