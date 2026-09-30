# ==============================================================================
# Phase 10: ADLS Gen2 Container Provisioning Script
# Smart Retail Analytics Platform
# ==============================================================================

param (
    [string]$ConfigPath = "$PSScriptRoot/../phase9-config.ps1"
)

if (Test-Path $ConfigPath) {
    . $ConfigPath
} else {
    Write-Error "Configuration script not found at $ConfigPath"
    exit 1
}

Write-Host "Verifying ADLS Gen2 Storage Container '$script:AZURE_STORAGE_CONTAINER' on Storage Account '$script:AZURE_STORAGE_ACCOUNT'..." -ForegroundColor Cyan

# Check if container exists
$containerExists = az storage container exists `
    --name $script:AZURE_STORAGE_CONTAINER `
    --account-name $script:AZURE_STORAGE_ACCOUNT `
    --auth-mode login 2>$null | ConvertFrom-Json

if ($containerExists.exists -eq $true) {
    Write-Host "[INFO] Container '$script:AZURE_STORAGE_CONTAINER' already exists. Reusing existing container." -ForegroundColor Yellow
} else {
    Write-Host "Creating ADLS Gen2 Container '$script:AZURE_STORAGE_CONTAINER'..." -ForegroundColor Cyan
    az storage container create `
        --name $script:AZURE_STORAGE_CONTAINER `
        --account-name $script:AZURE_STORAGE_ACCOUNT `
        --auth-mode login 2>$null
    Write-Host "[SUCCESS] Container '$script:AZURE_STORAGE_CONTAINER' created successfully." -ForegroundColor Green
}
