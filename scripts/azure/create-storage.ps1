# ==============================================================================
# Phase 9: Azure ADLS Gen2 Storage Account & Container Structure Setup
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

Write-Host "Creating Azure Storage Account (ADLS Gen2) '$script:AZURE_STORAGE_ACCOUNT'..." -ForegroundColor Cyan

# 1. Create ADLS Gen2 Storage Account
$stCheck = az storage account check-name --name $script:AZURE_STORAGE_ACCOUNT | ConvertFrom-Json
if ($stCheck.nameAvailable -eq $true) {
    $tagsString = $script:AZURE_TAGS -join " "
    az storage account create `
        --name $script:AZURE_STORAGE_ACCOUNT `
        --resource-group $script:AZURE_RESOURCE_GROUP `
        --location $script:AZURE_REGION `
        --sku $script:AZURE_STORAGE_SKU `
        --kind StorageV2 `
        --enable-hierarchical-namespace true `
        --min-tls-version TLS1_2 `
        --https-only true `
        --tags $tagsString
    Write-Host "Storage Account '$script:AZURE_STORAGE_ACCOUNT' created with ADLS Gen2 Hierarchical Namespace enabled." -ForegroundColor Green
} else {
    Write-Host "Storage Account '$script:AZURE_STORAGE_ACCOUNT' already exists or is unavailable. Proceeding..." -ForegroundColor Yellow
}

# 2. Create Container 'retail-data'
Write-Host "Creating Data Lake container '$script:AZURE_STORAGE_CONTAINER'..." -ForegroundColor Cyan
az storage container create `
    --name $script:AZURE_STORAGE_CONTAINER `
    --account-name $script:AZURE_STORAGE_ACCOUNT `
    --auth-mode login 2>$null

# 3. Create ADLS Gen2 Directory Hierarchy (Bronze, Silver, Gold)
Write-Host "Initializing ADLS Gen2 Directory Structure..." -ForegroundColor Cyan

$directories = @(
    # Bronze Layer
    "bronze/customers",
    "bronze/products",
    "bronze/categories",
    "bronze/suppliers",
    "bronze/stores",
    "bronze/inventory",
    "bronze/orders",
    "bronze/order_items",
    "bronze/payments",
    "bronze/reviews",

    # Silver Layer
    "silver/customers",
    "silver/products",
    "silver/inventory",
    "silver/orders",
    "silver/order_items",
    "silver/payments",
    "silver/reviews",

    # Gold Layer
    "gold/sales",
    "gold/customers",
    "gold/products",
    "gold/inventory",
    "gold/business_metrics"
)

foreach ($dir in $directories) {
    Write-Host "Creating directory: $script:AZURE_STORAGE_CONTAINER/$dir" -ForegroundColor Gray
    az storage fs directory create `
        --name $dir `
        --file-system $script:AZURE_STORAGE_CONTAINER `
        --account-name $script:AZURE_STORAGE_ACCOUNT `
        --auth-mode login 2>$null
}

Write-Host "ADLS Gen2 Data Lake structure initialized successfully." -ForegroundColor Green
