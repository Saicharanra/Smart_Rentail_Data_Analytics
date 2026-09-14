# ==============================================================================
# Phase 9: Azure Cloud Infrastructure Configuration Parameters
# Smart Retail Analytics Platform
# ==============================================================================

$script:AZURE_REGION           = "centralindia"
$script:AZURE_RESOURCE_GROUP   = "rg-smart-retail-dev"

# Storage & Data Lake Gen2
$script:AZURE_STORAGE_ACCOUNT  = "stsmartretaildev2026"
$script:AZURE_STORAGE_CONTAINER= "retail-data"
$script:AZURE_STORAGE_SKU      = "Standard_LRS"

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

Write-Host "Loaded Phase 9 Infrastructure Configuration parameters for region: $script:AZURE_REGION" -ForegroundColor Cyan
