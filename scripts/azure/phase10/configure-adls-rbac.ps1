# ==============================================================================
# Phase 10: ADLS Gen2 Managed Identity & Least-Privilege RBAC Configuration
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

Write-Host "Configuring ADLS Gen2 Managed Identity RBAC Security Mappings..." -ForegroundColor Cyan

# Fetch Storage Account Resource ID Scope
$storageScope = az storage account show `
    --name $script:AZURE_STORAGE_ACCOUNT `
    --resource-group $script:AZURE_RESOURCE_GROUP `
    --query id -o tsv 2>$null

if (-not $storageScope) {
    Write-Host "Warning: Storage Account '$script:AZURE_STORAGE_ACCOUNT' not found. Ensure Phase 9 infrastructure is deployed." -ForegroundColor Yellow
    exit 0
}

# 1. Assign Storage Blob Data Contributor to Azure Data Factory Identity
$adfIdentity = az datafactory show `
    --name $script:AZURE_DATA_FACTORY `
    --resource-group $script:AZURE_RESOURCE_GROUP `
    --query "identity.principalId" -o tsv 2>$null

if ($adfIdentity) {
    Write-Host "Assigning 'Storage Blob Data Contributor' to Azure Data Factory Managed Identity ($adfIdentity)..." -ForegroundColor Gray
    az role assignment create `
        --assignee $adfIdentity `
        --role "Storage Blob Data Contributor" `
        --scope $storageScope 2>$null
    Write-Host "[SUCCESS] Role assigned to Azure Data Factory Managed Identity." -ForegroundColor Green
}

# 2. Assign Storage Blob Data Contributor to Azure Synapse Managed Identity
$synIdentity = az synapse workspace show `
    --name $script:AZURE_SYNAPSE `
    --resource-group $script:AZURE_RESOURCE_GROUP `
    --query "identity.principalId" -o tsv 2>$null

if ($synIdentity) {
    Write-Host "Assigning 'Storage Blob Data Contributor' to Azure Synapse Managed Identity ($synIdentity)..." -ForegroundColor Gray
    az role assignment create `
        --assignee $synIdentity `
        --role "Storage Blob Data Contributor" `
        --scope $storageScope 2>$null
    Write-Host "[SUCCESS] Role assigned to Azure Synapse Analytics Managed Identity." -ForegroundColor Green
}

Write-Host "[SUCCESS] Managed Identity RBAC setup completed." -ForegroundColor Green
