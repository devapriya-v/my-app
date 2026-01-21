# Build Permission Error Fix (EPERM)

## Problem
```
Error: EPERM: operation not permitted, unlink 'C:\Users\PC\OneDrive\Documents\Desktop\FSD\my-app\.next\server\app\(auth)'
```

## Root Cause
This is a Windows file permission error that occurs when the build process tries to delete the `.next` folder but can't because:

1. **OneDrive is syncing** the `.next` folder
2. A file explorer window has the folder open
3. An antivirus is scanning the files
4. A previous build process didn't fully release the files
5. The dev server is still running

## Solution Applied

### Immediate Fix
Manually deleted the `.next` folder with force:
```powershell
Remove-Item -Path .next -Recurse -Force
```

Then ran the build successfully.

### Permanent Solution
Created helper scripts to prevent this issue:

#### 1. Clean Script (`scripts/clean-build.ps1`)
A PowerShell script that safely removes build artifacts with fallback methods for locked files.

#### 2. NPM Scripts (in `package.json`)
```json
{
  "scripts": {
    "clean": "powershell -ExecutionPolicy Bypass -File scripts/clean-build.ps1",
    "clean:build": "npm run clean && npm run build"
  }
}
```

## How to Use

### If Build Fails with EPERM Error:

**Option 1: Clean then Build**
```bash
npm run clean:build
```

**Option 2: Clean Manually**
```bash
npm run clean
npm run build
```

**Option 3: Manual PowerShell**
```powershell
Remove-Item -Path .next -Recurse -Force
npm run build
```

## Prevention Tips

### 1. Exclude .next from OneDrive
The `.next` folder doesn't need to be synced to OneDrive. To exclude it:

1. Right-click the `.next` folder
2. Select "Free up space" or "Always keep on this device" → "Free up space"
3. Or add `.next` to OneDrive's exclusion list

### 2. Add to .gitignore
Ensure `.next` is in your `.gitignore` (it should already be there):
```
.next/
```

### 3. Close File Explorers
Before building, close any File Explorer windows showing the project folder.

### 4. Stop Dev Server
Always stop the dev server before building:
```bash
Ctrl+C  # in the terminal running npm run dev
```

## Alternative: Move Project Outside OneDrive

If this issue persists, consider moving your project outside OneDrive:

```powershell
# Move to a local folder
Move-Item "C:\Users\PC\OneDrive\Documents\Desktop\fsd\my-app" "C:\Projects\my-app"
```

Benefits:
- ✅ Faster builds (no OneDrive sync overhead)
- ✅ No file locking issues
- ✅ Better performance
- ✅ Still use Git for version control

## Troubleshooting

### If Clean Script Fails:

1. **Close all programs** that might be using the files:
   - VS Code
   - File Explorer
   - Terminal windows
   - OneDrive

2. **Pause OneDrive sync temporarily**:
   - Right-click OneDrive icon in system tray
   - Click "Pause syncing" → "2 hours"

3. **Use Command Prompt** (sometimes works when PowerShell doesn't):
   ```cmd
   rmdir /s /q .next
   npm run build
   ```

4. **Restart your computer** (last resort)

### If Issue Persists:

Check what's locking the files:
```powershell
# Install Process Explorer from Microsoft
# Or use built-in Resource Monitor:
resmon.exe
# Go to CPU tab → Associated Handles → search for ".next"
```

## Build Status

✅ **Build completed successfully** after cleaning the `.next` folder.

## Available Commands

```bash
# Development
npm run dev              # Start dev server

# Building
npm run build            # Build for production
npm run clean            # Clean build artifacts
npm run clean:build      # Clean and build in one command
npm run start            # Start production server

# Database
npm run db:migrate       # Run migrations
npm run db:wake          # Wake Neon database

# Testing
npm run test:email       # Test email config
```

## Summary

The EPERM error was caused by Windows file locking, likely from OneDrive. The issue is now resolved, and helper scripts have been added to prevent it in the future.

**Recommended workflow going forward:**
```bash
npm run clean:build  # Use this instead of just npm run build
```

This ensures a clean build every time and avoids file locking issues.
