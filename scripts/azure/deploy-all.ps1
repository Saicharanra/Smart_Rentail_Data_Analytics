# ==============================================================================
# Master Azure Infrastructure Deployment Script — Phase 9
# Smart Retail Analytics Platform
# ==============================================================================

$ErrorActionPreference = "Stop"
$scriptDir = $PSScriptRoot

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " 🚀 STARTING AZURE INFRASTRUCTURE DEPLOYMENT — PHASE 9    " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$startTime = Get-Date

# Execute Setup Steps Sequentially
& "$scriptDir/create-resource-group.ps1"
& "$scriptDir/create-storage.ps1"
& "$scriptDir/create-data-factory.ps1"
& "$scriptDir/create-databricks.ps1"
& "$scriptDir/create-synapse.ps1"
& "$scriptDir/create-keyvault.ps1"
& "$scriptDir/setup-rbac.ps1"

$elapsed = ((Get-Date) - $startTime).TotalSeconds

Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host " 🎉 PHASE 9 AZURE INFRASTRUCTURE DEPLOYMENT COMPLETE!    " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
Write-Host " Total Execution Time: $([math]::Round($elapsed, 2))s" -ForegroundColor White
Write-Host " Resource Group:        rg-smart-retail-dev" -ForegroundColor White
Write-Host " ADLS Gen2 Storage:     stsmartretaildev2026 (container: retail-data)" -ForegroundColor White
Write-Host " Data Factory:          adf-smart-retail-dev" -ForegroundColor White
Write-Host " Databricks Workspace:  dbw-smart-retail-dev" -ForegroundColor White
Write-Host " Synapse Workspace:     syn-smart-retail-dev" -ForegroundColor White
Write-Host " Key Vault:             kv-smart-retail-dev2026" -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor Green
