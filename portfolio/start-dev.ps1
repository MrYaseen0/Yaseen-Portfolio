#!/usr/bin/env powershell

$targetDir = 'C:\Yaseen Portfolio\portfolio';
Write-Host "=== STARTING YASEEN PORTFOLIO DEVELOPMENT ===";
Write-Host "Target Directory: $targetDir";

if (Test-Path $targetDir) {
    Write-Host "✅ Directory exists, changing to it...";
    Push-Location $targetDir;
    
    # Display current directory
    $currentDir = Get-Location;
    Write-Host "Current directory: $currentDir";
    
    # Check for package.json
    if (Test-Path 'package.json') {
        Write-Host "✅ package.json found";
        $package = Get-Content 'package.json' | ConvertFrom-Json;
        Write-Host "Project: $($package.name) v$($package.version)";
        
        # Check if node_modules exists
        if (-not (Test-Path 'node_modules')) {
            Write-Host "📦 Installing dependencies...";
            npm.cmd install;
            if ($LASTEXITCODE -ne 0) {
                Write-Host "❌ Dependency installation failed!";
                return;
            }
        }
        
        Write-Host "🚀 Starting development server...";
        Write-Host "The system will be available at:";
        Write-Host "   Frontend: http://localhost:5173";
        Write-Host "   Backend: http://localhost:5000";
        Write-Host "   Admin Dashboard: http://localhost:5173/admin";
        Write-Host "";
        Write-Host "Press Ctrl+C to stop the server";
        Write-Host "";
        
        npm.cmd run dev;
    } else {
        Write-Host "❌ package.json not found in $targetDir";
    }
} else {
    Write-Host "❌ Directory does not exist: $targetDir";
    Write-Host "Please verify the correct path and try again";
}
