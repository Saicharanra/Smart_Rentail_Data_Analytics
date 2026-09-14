# ==============================================================================
# Phase 9: Least-Privilege Managed Identity & RBAC Role Assignment Script
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

Write-Host "Configuring Least-Privilege RBAC Role Assignments..." -ForegroundColor Cyan

# Fetch Storage Account Resource ID
$storageScope = az storage account show --name $script:AZURE_STORAGE_ACCOUNT --resource-group $script:AZURE_RESOURCE_GROUP --query id -o tsv

# 1. Assign Storage Blob Data Contributor to Data Factory Managed Identity
$adfIdentity = az datafactory show --name $script:AZURE_DATA_FACTORY --resource-group $script:AZURE_RESOURCE_GROUP --query "identity.principalId" -o tsv 2>$null

if ($adfIdentity) {
    Write-Host "Assigning 'Storage Blob Data Contributor' to Data Factory Managed Identity ($adfIdentity)..." -ForegroundColor Yellow
    az role assignment create `
        --assignee $adfIdentity `
        --role "Storage Blob Data Contributor" `
        --scope $storageScope 2>$null
    Write-Host "✓ Role assigned to Azure Data Factory identity." -ForegroundColor Green
}

# 2. Assign Storage Blob Data Contributor to Synapse Analytics Managed Identity
$synIdentity = az synapse workspace show --name $script:AZURE_SYNAPSE --resource-group $script:AZURE_RESOURCE_GROUP --query "identity.principalId" -o tsv 2>$null

if ($synIdentity) {
    Write-Host "Assigning 'Storage Blob Data Contributor' to Synapse Managed Identity ($synIdentity)..." -ForegroundColor Yellow
    az role assignment create `
        --assignee $synIdentity `
        --role "Storage Blob Data Contributor" `
        --scope $storageScope 2>$null
    Write-Host "✓ Role assigned to Azure Synapse identity." -ForegroundColor Green
}

Write-Host "Managed Identity RBAC setup completed." -ForegroundColor Green
