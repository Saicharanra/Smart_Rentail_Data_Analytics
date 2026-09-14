# ==============================================================================
# Phase 9: Azure Data Factory Provisioning Script
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

Write-Host "Checking Azure Data Factory '$script:AZURE_DATA_FACTORY'..." -ForegroundColor Cyan

$adfCheck = az datafactory show --name $script:AZURE_DATA_FACTORY --resource-group $script:AZURE_RESOURCE_GROUP 2>$null | ConvertFrom-Json

if ($adfCheck) {
    Write-Host "Data Factory '$script:AZURE_DATA_FACTORY' already exists. Skipping creation." -ForegroundColor Yellow
} else {
    Write-Host "Provisioning Azure Data Factory '$script:AZURE_DATA_FACTORY' in '$script:AZURE_REGION'..." -ForegroundColor Cyan
    $tagsString = $script:AZURE_TAGS -join " "
    
    $adf = az datafactory create `
        --name $script:AZURE_DATA_FACTORY `
        --resource-group $script:AZURE_RESOURCE_GROUP `
        --location $script:AZURE_REGION `
        --tags $tagsString | ConvertFrom-Json

    Write-Host "Azure Data Factory '$script:AZURE_DATA_FACTORY' created successfully." -ForegroundColor Green
    Write-Host "Managed Identity Principal ID: $($adf.identity.principalId)" -ForegroundColor Green
}
