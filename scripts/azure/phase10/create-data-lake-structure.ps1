# ==============================================================================
# Phase 10: ADLS Gen2 Data Lake Medallion Directory Hierarchy Initialization
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

Write-Host "Initializing ADLS Gen2 Medallion Directory Architecture in '$script:AZURE_STORAGE_CONTAINER'..." -ForegroundColor Cyan

$directories = @(
    # --------------------------------------------------------------------------
    # BRONZE LAYER: Raw Operational Source Data
    # Partitioning standard: bronze/<entity>/load_date=YYYY-MM-DD/
    # --------------------------------------------------------------------------
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

    # --------------------------------------------------------------------------
    # SILVER LAYER: Cleaned, Deduplicated Delta Parquet Datasets
    # Partitioning standard: silver/<entity>/process_date=YYYY-MM-DD/
    # --------------------------------------------------------------------------
    "silver/customers",
    "silver/products",
    "silver/categories",
    "silver/suppliers",
    "silver/stores",
    "silver/inventory",
    "silver/orders",
    "silver/order_items",
    "silver/payments",
    "silver/reviews",

    # --------------------------------------------------------------------------
    # GOLD LAYER: Business-level Dimensional Star Schema & Fact Datasets
    # Partitioning standard: gold/<domain>/process_date=YYYY-MM-DD/
    # --------------------------------------------------------------------------
    "gold/sales",
    "gold/customers",
    "gold/products",
    "gold/inventory",
    "gold/business_metrics"
)

# Ensure container exists first
Write-Host "Ensuring container '$script:AZURE_STORAGE_CONTAINER' exists on Storage Account '$script:AZURE_STORAGE_ACCOUNT'..." -ForegroundColor Cyan
if ($script:AZURE_STORAGE_KEY) {
    az storage container create --name $script:AZURE_STORAGE_CONTAINER --account-name $script:AZURE_STORAGE_ACCOUNT --account-key $script:AZURE_STORAGE_KEY 2>$null
} else {
    az storage container create --name $script:AZURE_STORAGE_CONTAINER --account-name $script:AZURE_STORAGE_ACCOUNT --auth-mode login 2>$null
}

foreach ($dir in $directories) {
    Write-Host "Creating ADLS Directory: $script:AZURE_STORAGE_CONTAINER/$dir" -ForegroundColor Gray
    if ($script:AZURE_STORAGE_KEY) {
        az storage fs directory create `
            --name $dir `
            --file-system $script:AZURE_STORAGE_CONTAINER `
            --account-name $script:AZURE_STORAGE_ACCOUNT `
            --account-key $script:AZURE_STORAGE_KEY 2>$null
    } else {
        az storage fs directory create `
            --name $dir `
            --file-system $script:AZURE_STORAGE_CONTAINER `
            --account-name $script:AZURE_STORAGE_ACCOUNT `
            --auth-mode login 2>$null
    }
}

Write-Host "[SUCCESS] ADLS Gen2 Medallion Directory Architecture (Bronze, Silver, Gold) initialized successfully on '$script:AZURE_STORAGE_ACCOUNT'." -ForegroundColor Green
