# ==============================================================================
# Master Azure Data Lake Implementation Script — Phase 10
# Smart Retail Analytics Platform
# ==============================================================================

$ErrorActionPreference = "Stop"
$scriptDir = $PSScriptRoot

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " 🚀 STARTING PHASE 10 — ADLS GEN2 DATA LAKE DEPLOYMENT   " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$startTime = Get-Date

# Execute Phase 10 Scripts Sequentially
& "$scriptDir/create-adls-container.ps1"
& "$scriptDir/create-data-lake-structure.ps1"
& "$scriptDir/configure-adls-rbac.ps1"

Write-Host "`nRunning Automated ADLS Validation Suite..." -ForegroundColor Yellow
& "$scriptDir/validate-adls.ps1"

$elapsed = ((Get-Date) - $startTime).TotalSeconds

Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host " 🎉 PHASE 10 ADLS GEN2 DEPLOYMENT & VALIDATION COMPLETE! " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
Write-Host " Total Execution Time: $([math]::Round($elapsed, 2))s" -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor Green
