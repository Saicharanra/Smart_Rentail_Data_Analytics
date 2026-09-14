# ==============================================================================
# Phase 9: Azure Databricks Workspace Provisioning Script
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

Write-Host "Checking Azure Databricks Workspace '$script:AZURE_DATABRICKS'..." -ForegroundColor Cyan

$dbwCheck = az databricks workspace show --name $script:AZURE_DATABRICKS --resource-group $script:AZURE_RESOURCE_GROUP 2>$null | ConvertFrom-Json

if ($dbwCheck) {
    Write-Host "Databricks Workspace '$script:AZURE_DATABRICKS' already exists. Skipping creation." -ForegroundColor Yellow
} else {
    Write-Host "Provisioning Azure Databricks Workspace '$script:AZURE_DATABRICKS' (SKU: $script:AZURE_DATABRICKS_SKU)..." -ForegroundColor Cyan
    $tagsString = $script:AZURE_TAGS -join " "

    $dbw = az databricks workspace create `
        --name $script:AZURE_DATABRICKS `
        --resource-group $script:AZURE_RESOURCE_GROUP `
        --location $script:AZURE_REGION `
        --sku $script:AZURE_DATABRICKS_SKU `
        --tags $tagsString | ConvertFrom-Json

    Write-Host "Azure Databricks Workspace created successfully." -ForegroundColor Green
    Write-Host "Workspace URL: https://$($dbw.workspaceUrl)" -ForegroundColor Green
}
