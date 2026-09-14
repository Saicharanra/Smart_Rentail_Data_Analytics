# ==============================================================================
# Phase 9: Azure Synapse Analytics Workspace Foundation Provisioning Script
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

Write-Host "Checking Azure Synapse Workspace '$script:AZURE_SYNAPSE'..." -ForegroundColor Cyan

$synCheck = az synapse workspace show --name $script:AZURE_SYNAPSE --resource-group $script:AZURE_RESOURCE_GROUP 2>$null | ConvertFrom-Json

if ($synCheck) {
    Write-Host "Synapse Workspace '$script:AZURE_SYNAPSE' already exists. Skipping creation." -ForegroundColor Yellow
} else {
    Write-Host "Provisioning Azure Synapse Analytics Workspace '$script:AZURE_SYNAPSE'..." -ForegroundColor Cyan
    $tagsString = $script:AZURE_TAGS -join " "

    # Synapse requires a default ADLS Gen2 filesystem link
    $storageDlUrl = "https://$script:AZURE_STORAGE_ACCOUNT.dfs.core.windows.net"

    $syn = az synapse workspace create `
        --name $script:AZURE_SYNAPSE `
        --resource-group $script:AZURE_RESOURCE_GROUP `
        --location $script:AZURE_REGION `
        --file-system $script:AZURE_STORAGE_CONTAINER `
        --sql-admin-login-user $script:AZURE_SYNAPSE_SQL_ADMIN `
        --sql-admin-login-password "P@ssw0rd2026!Synapse" `
        --tags $tagsString 2>$null | ConvertFrom-Json

    Write-Host "Azure Synapse Analytics Workspace created successfully." -ForegroundColor Green
}
