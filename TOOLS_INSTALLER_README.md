# All-in-One Tool Installer

A PowerShell-based installer script that automates the installation of essential productivity and utility tools for Windows, similar to Ninite.

## 🚀 Quick Start

### Prerequisites
- Windows 10 (version 1809 or later) or Windows 11
- Windows Package Manager (winget) - usually pre-installed on Windows 11
- Administrator privileges

### Installation Methods

#### Method 1: Right-Click Run (Easiest)
1. Download `InstallTools.ps1`
2. Right-click on the file
3. Select "Run with PowerShell"
4. Follow the on-screen prompts

#### Method 2: PowerShell Terminal
1. Open PowerShell as Administrator
2. Navigate to the script directory:
   ```powershell
   cd path\to\script
   ```
3. Run the script:
   ```powershell
   .\InstallTools.ps1
   ```

#### Method 3: Bypass Execution Policy (if needed)
If you encounter execution policy errors:
```powershell
powershell -ExecutionPolicy Bypass -File .\InstallTools.ps1
```

## 📦 Included Tools

### 1. **ShareX**
- **Category:** Screenshot & Screen Recording
- **Description:** Feature-rich screenshot tool with built-in image editor, screen recording, and upload capabilities
- **Website:** https://getsharex.com/
- **Why it's great:** Free, open-source, and incredibly powerful. Supports automatic uploading to 80+ destinations

### 2. **Start11**
- **Category:** Windows Customization
- **Description:** Enhanced Start Menu that brings back classic Windows styles with modern features
- **Website:** https://www.stardock.com/products/start11/
- **Note:** Paid software (trial available)

### 3. **Notion**
- **Category:** Productivity & Organization
- **Description:** All-in-one workspace for notes, tasks, wikis, and databases
- **Website:** https://www.notion.so/
- **Why it's great:** Incredibly flexible, great for personal and team use

### 4. **Firefox**
- **Category:** Web Browser
- **Description:** Privacy-focused open-source web browser
- **Website:** https://www.mozilla.org/firefox/
- **Why it's great:** Better privacy than Chrome/Edge, excellent add-on ecosystem

### 5. **Affinity Photo**
- **Category:** Photo Editing
- **Description:** Professional photo editing software, Adobe Photoshop alternative
- **Website:** https://affinity.serif.com/photo/
- **Note:** Paid software (one-time purchase, no subscription)
- **Why it's great:** Professional-grade features without subscription fees

### 6. **UniGetUI**
- **Category:** Package Manager
- **Description:** Universal GUI for managing multiple package managers (winget, scoop, chocolatey, pip, npm, etc.)
- **Website:** https://github.com/marticliment/UniGetUI
- **Why it's great:** Never worry about updating apps again - update everything from one interface

### 7. **Everything**
- **Category:** File Search
- **Description:** Lightning-fast file and folder search engine
- **Website:** https://www.voidtools.com/
- **Why it's great:** Instant search results (literally instant), uses minimal resources
- **Pro Tip:** Enable "Run at startup" for best experience

### 8. **AutoDarkMode**
- **Category:** System Customization
- **Description:** Automatically switches between light and dark mode based on time or sunset/sunrise
- **Website:** https://github.com/AutoDarkMode/Windows-Auto-Night-Mode
- **Why it's great:** Set it and forget it - your eyes will thank you

### 9. **Flow Launcher**
- **Category:** Application Launcher
- **Description:** Quick search and app launcher (similar to Spotlight on macOS or Wox)
- **Website:** https://www.flowlauncher.com/
- **Why it's great:** Keyboard-driven workflow, extensible with plugins
- **Shortcut:** Usually Alt+Space

## 🌐 Browser Extensions (Manual Installation Required)

These tools must be installed manually from your browser's extension store:

### 10. **Clipboard History Pro**
- **Category:** Browser Extension
- **Description:** Advanced clipboard manager for your browser
- **Installation:** Search in Chrome Web Store or Firefox Add-ons

### 11. **OneTab**
- **Category:** Browser Extension
- **Description:** Save and restore browser tabs, reduce memory usage
- **Website:** https://www.one-tab.com/
- **Installation:**
  - Chrome: https://chrome.google.com/webstore/detail/onetab/chphlpgkkbolifaimnlloiipkdnihall
  - Firefox: https://addons.mozilla.org/firefox/addon/onetab/
- **Why it's great:** Save hundreds of tabs and restore them later, massive memory savings

## 🛠️ Troubleshooting

### "winget not found" Error
If winget is not installed:
1. Install from Microsoft Store: [App Installer](https://apps.microsoft.com/store/detail/app-installer/9NBLGGH4NNS1)
2. Or download from: https://aka.ms/getwinget

### "Execution Policy" Error
Run PowerShell as Administrator and execute:
```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Specific App Failed to Install
Try installing manually with winget:
```powershell
winget install --id <PackageId> --exact
```

Package IDs:
- ShareX: `ShareX.ShareX`
- Start11: `Stardock.Start11`
- Notion: `Notion.Notion`
- Firefox: `Mozilla.Firefox`
- Affinity Photo: `Serif.AffinityPhoto.2`
- UniGetUI: `MartiCliment.UniGetUI`
- Everything: `voidtools.Everything`
- AutoDarkMode: `Armin2208.WindowsAutoNightMode`
- Flow Launcher: `Flow-Launcher.Flow-Launcher`

### Some Apps Require Restart
After installation, restart your computer for all features to work properly.

## 🔧 Customization

To add or remove tools from the installer:

1. Open `InstallTools.ps1` in a text editor
2. Find the `$applications` array
3. Add or remove entries following this format:
   ```powershell
   @{Name="AppName"; Id="Winget.PackageId"; Description="App description"}
   ```
4. To find winget package IDs:
   ```powershell
   winget search "application name"
   ```

## 📝 Notes

- **Start11** and **Affinity Photo** are paid software (trials may be available)
- Browser extensions must be installed manually from extension stores
- Some applications may require a system restart
- The script uses `--silent` flag for unattended installation
- Already installed apps will be skipped automatically

## 🤝 Contributing

To suggest additional tools or improvements:
1. Verify the tool is available in winget: `winget search "tool name"`
2. Test the package ID works: `winget install --id PackageId --exact`
3. Add it to the applications array in the script

## 📄 License

This installer script is provided as-is. Individual applications have their own licenses.

## 🔗 Additional Resources

- [winget documentation](https://docs.microsoft.com/windows/package-manager/)
- [ShareX Documentation](https://getsharex.com/docs/)
- [Everything Search Syntax](https://www.voidtools.com/support/everything/searching/)
- [Flow Launcher Plugins](https://www.flowlauncher.com/docs/#/plugins)

---

**Enjoy your newly optimized Windows setup! 🎉**
