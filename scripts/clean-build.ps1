# Clean Build Script
# This script safely cleans the build artifacts before building

Write-Host "🧹 Cleaning build artifacts..." -ForegroundColor Cyan

# Function to safely remove a directory
function Remove-SafeDirectory {
    param([string]$Path)
    
    if (Test-Path $Path) {
        try {
            Write-Host "  Removing $Path..." -ForegroundColor Yellow
            Remove-Item -Path $Path -Recurse -Force -ErrorAction Stop
            Write-Host "  ✓ Removed $Path" -ForegroundColor Green
        }
        catch {
            Write-Host "  ⚠ Could not remove $Path - trying alternative method..." -ForegroundColor Yellow
            
            # Try using cmd to remove (sometimes works when PowerShell doesn't)
            if ($Path -eq ".next") {
                cmd /c "rmdir /s /q .next" 2>$null
            }
            elseif ($Path -eq "node_modules\.cache") {
                cmd /c "rmdir /s /q node_modules\.cache" 2>$null
            }
            
            if (Test-Path $Path) {
                Write-Host "  ✗ Failed to remove $Path - you may need to close any programs using these files" -ForegroundColor Red
                Write-Host "    Try closing your IDE, file explorer, or OneDrive sync" -ForegroundColor Red
                exit 1
            }
            else {
                Write-Host "  ✓ Removed $Path (using alternative method)" -ForegroundColor Green
            }
        }
    }
    else {
        Write-Host "  ℹ $Path does not exist (already clean)" -ForegroundColor Gray
    }
}

# Clean .next folder
Remove-SafeDirectory ".next"

# Clean node_modules cache
Remove-SafeDirectory "node_modules\.cache"

Write-Host ""
Write-Host "✅ Clean complete! Ready to build." -ForegroundColor Green
Write-Host ""
Write-Host "Run: npm run build" -ForegroundColor Cyan
