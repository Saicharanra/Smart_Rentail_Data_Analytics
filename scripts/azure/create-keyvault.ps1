# ==============================================================================
# Phase 9: Azure Key Vault Provisioning Script
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

Write-Host "Checking Azure Key Vault '$script:AZURE_KEY_VAULT'..." -ForegroundColor Cyan

$kvCheck = az keyvault show --name $script:AZURE_KEY_VAULT --resource-group $script:AZURE_RESOURCE_GROUP 2>$null | ConvertFrom-Json

if ($kvCheck) {
    Write-Host "Key Vault '$script:AZURE_KEY_VAULT' already exists. Skipping creation." -ForegroundColor Yellow
} else {
    Write-Host "Provisioning Azure Key Vault '$script:AZURE_KEY_VAULT' in '$script:AZURE_REGION'..." -ForegroundColor Cyan
    $tagsString = $script:AZURE_TAGS -join " "

    $kv = az keyvault create `
        --name $script:AZURE_KEY_VAULT `
        --resource-group $script:AZURE_RESOURCE_GROUP `
        --location $script:AZURE_REGION `
        --sku $script:AZURE_KEY_VAULT_SKU `
        --enable-rbac-authorization true `
        --tags $tagsString | ConvertFrom-Json

    Write-Host "Azure Key Vault created successfully." -ForegroundColor Green
    Write-Host "Vault URI: $($kv.properties.vaultUri)" -ForegroundColor Green
}
