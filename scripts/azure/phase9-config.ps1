# ==============================================================================
# Phase 9: Azure Cloud Infrastructure Configuration Parameters
# Smart Retail Analytics Platform
# ==============================================================================

$script:AZURE_REGION           = "centralindia"
$script:AZURE_RESOURCE_GROUP   = "rg-smart-retail-dev"

# Storage & Data Lake Gen2 Defaults
$script:AZURE_STORAGE_ACCOUNT  = "retaildatasai"
$script:AZURE_STORAGE_CONTAINER= "retail-data"
$script:AZURE_STORAGE_SKU      = "Standard_LRS"
$script:AZURE_STORAGE_KEY      = ""

# Load overriding values from root .env file if it exists
$envPath = Join-Path $PSScriptRoot "../../.env"
if (Test-Path $envPath) {
    Get-Content $envPath | ForEach-Object {
        $line = $_.Trim()
        if ($line -and -not $line.StartsWith("#") -and $line.Contains("=")) {
            $parts = $line.Split("=", 2)
            $key = $parts[0].Trim()
            $val = $parts[1].Trim().Trim('"').Trim("'")
            if ($key -eq "AZURE_STORAGE_ACCOUNT_NAME" -and $val) { $script:AZURE_STORAGE_ACCOUNT = $val }
            if ($key -eq "AZURE_STORAGE_CONTAINER" -and $val) { $script:AZURE_STORAGE_CONTAINER = $val }
            if (($key -eq "AZURE_STORAGE_ACCOUNT_KEY" -or $key -eq "AZURE_STORAGE_ACCOUNT_KEY1") -and $val) { 
                if (-not $script:AZURE_STORAGE_KEY) { $script:AZURE_STORAGE_KEY = $val }
            }
            if ($key -eq "AZURE_RESOURCE_GROUP" -and $val) { $script:AZURE_RESOURCE_GROUP = $val }
            if ($key -eq "AZURE_REGION" -and $val) { $script:AZURE_REGION = $val }
        }
    }
}

# Azure Data Factory
$script:AZURE_DATA_FACTORY     = "adf-smart-retail-dev"

# Azure Databricks Workspace
$script:AZURE_DATABRICKS       = "dbw-smart-retail-dev"
$script:AZURE_DATABRICKS_SKU   = "standard"

# Azure Synapse Analytics Workspace
$script:AZURE_SYNAPSE          = "syn-smart-retail-dev"
$script:AZURE_SYNAPSE_SQL_ADMIN= "sqladminuser"

# Azure Key Vault
$script:AZURE_KEY_VAULT        = "kv-smart-retail-dev2026"
$script:AZURE_KEY_VAULT_SKU    = "standard"

# Common Resource Tags
$script:AZURE_TAGS = @(
    "Project=SmartRetailAnalytics",
    "Environment=Development",
    "Phase=Phase9",
    "Purpose=DataEngineering"
)

# Auto-detect Azure CLI executable path if not present in active PATH
if (-not (Get-Command az -ErrorAction SilentlyContinue)) {
    $azSearchPaths = @(
        "C:\Program Files\Microsoft SDKs\Azure\CLI2\wbin",
        "C:\Program Files (x86)\Microsoft SDKs\Azure\CLI2\wbin"
    )
    foreach ($path in $azSearchPaths) {
        if (Test-Path "$path\az.cmd") {
            $env:Path = "$env:Path;$path"
            break
        }
    }
}

Write-Host "Loaded Phase 9 Infrastructure Configuration parameters for region: $script:AZURE_REGION" -ForegroundColor Cyan

