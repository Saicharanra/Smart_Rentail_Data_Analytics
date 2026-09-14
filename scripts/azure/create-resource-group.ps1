# ==============================================================================
# Phase 9: Azure Resource Group Creation Script
# ==============================================================================

param (
    [string]$ConfigPath = "$PSScriptRoot/phase9-config.ps1"
)

if (Test-Path $ConfigPath) {
    . $ConfigPath
} else {
    Write-Error "Configuration script not found at $ConfigPath"
    exit 1
}

Write-Host "Checking Azure CLI Login status..." -ForegroundColor Yellow
$account = az account show 2>$null | ConvertFrom-Json
if (-not $account) {
    Write-Host "Please login to Azure using 'az login' before running infrastructure deployment." -ForegroundColor Red
    exit 1
}

Write-Host "Active Subscription: $($account.name) ($($account.id))" -ForegroundColor Green

# Check if Resource Group exists
$rgExists = az group exists --name $script:AZURE_RESOURCE_GROUP
if ($rgExists -eq "true") {
    Write-Host "Resource Group '$script:AZURE_RESOURCE_GROUP' already exists. Skipping creation." -ForegroundColor Yellow
} else {
    Write-Host "Creating Resource Group '$script:AZURE_RESOURCE_GROUP' in '$script:AZURE_REGION'..." -ForegroundColor Cyan
    $tagsString = $script:AZURE_TAGS -join " "
    az group create `
        --name $script:AZURE_RESOURCE_GROUP `
        --location $script:AZURE_REGION `
        --tags $tagsString
    Write-Host "Resource Group '$script:AZURE_RESOURCE_GROUP' created successfully." -ForegroundColor Green
}
