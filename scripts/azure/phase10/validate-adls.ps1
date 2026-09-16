# ==============================================================================
# Phase 10: ADLS Gen2 Data Lake Automated Validation Suite
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

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " 🔍 RUNNING PHASE 10 ADLS GEN2 VALIDATION SUITE          " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$results = [ordered]@{
    "1. Azure CLI Authentication & Subscription" = "FAIL"
    "2. Resource Group Existence ($script:AZURE_RESOURCE_GROUP)" = "FAIL"
    "3. Storage Account Existence ($script:AZURE_STORAGE_ACCOUNT)" = "FAIL"
    "4. Hierarchical Namespace (HNS / ADLS Gen2)" = "FAIL"
    "5. Data Lake Container ($script:AZURE_STORAGE_CONTAINER)" = "FAIL"
    "6. Bronze Layer Directory Hierarchy (10 Entities)" = "FAIL"
    "7. Silver Layer Directory Hierarchy (10 Entities)" = "FAIL"
    "8. Gold Layer Directory Hierarchy (5 Domains)" = "FAIL"
    "9. Security Configuration (TLS 1.2 & HTTPS Only)" = "FAIL"
    "10. Managed Identity RBAC Mappings" = "FAIL"
}

# 1. Check Azure Login
$account = az account show 2>$null | ConvertFrom-Json
if ($account) {
    $results["1. Azure CLI Authentication & Subscription"] = "PASS [Subscription: $($account.name)]"
}

# 2. Check Resource Group
$rgExists = az group exists --name $script:AZURE_RESOURCE_GROUP 2>$null
if ($rgExists -eq "true") {
    $results["2. Resource Group Existence ($script:AZURE_RESOURCE_GROUP)"] = "PASS"
}

# 3. Check Storage Account & 4. HNS & 9. Security
$st = az storage account show --name $script:AZURE_STORAGE_ACCOUNT --resource-group $script:AZURE_RESOURCE_GROUP 2>$null | ConvertFrom-Json
if ($st) {
    $results["3. Storage Account Existence ($script:AZURE_STORAGE_ACCOUNT)"] = "PASS"
    
    if ($st.isHnsEnabled -eq $true) {
        $results["4. Hierarchical Namespace (HNS / ADLS Gen2)"] = "PASS [HNS Enabled]"
    } else {
        $results["4. Hierarchical Namespace (HNS / ADLS Gen2)"] = "FAIL [HNS Disabled]"
    }

    if ($st.minimumTlsVersion -eq "TLS1_2" -and $st.enableHttpsTrafficOnly -eq $true) {
        $results["9. Security Configuration (TLS 1.2 & HTTPS Only)"] = "PASS [TLS 1.2 & HTTPS Enforced]"
    }
}

# 5. Check Container
$container = az storage container exists --name $script:AZURE_STORAGE_CONTAINER --account-name $script:AZURE_STORAGE_ACCOUNT --auth-mode login 2>$null | ConvertFrom-Json
if ($container -and $container.exists -eq $true) {
    $results["5. Data Lake Container ($script:AZURE_STORAGE_CONTAINER)"] = "PASS"

    # 6. Check Bronze Layer Directories
    $bronzeEntities = @("customers", "products", "categories", "suppliers", "stores", "inventory", "orders", "order_items", "payments", "reviews")
    $bronzePass = $true
    foreach ($ent in $bronzeEntities) {
        $dirExists = az storage fs directory exists --name "bronze/$ent" --file-system $script:AZURE_STORAGE_CONTAINER --account-name $script:AZURE_STORAGE_ACCOUNT --auth-mode login 2>$null | ConvertFrom-Json
        if (-not $dirExists -or $dirExists.exists -ne $true) {
            $bronzePass = $false
            break
        }
    }
    if ($bronzePass) { $results["6. Bronze Layer Directory Hierarchy (10 Entities)"] = "PASS" }

    # 7. Check Silver Layer Directories
    $silverEntities = @("customers", "products", "categories", "suppliers", "stores", "inventory", "orders", "order_items", "payments", "reviews")
    $silverPass = $true
    foreach ($ent in $silverEntities) {
        $dirExists = az storage fs directory exists --name "silver/$ent" --file-system $script:AZURE_STORAGE_CONTAINER --account-name $script:AZURE_STORAGE_ACCOUNT --auth-mode login 2>$null | ConvertFrom-Json
        if (-not $dirExists -or $dirExists.exists -ne $true) {
            $silverPass = $false
            break
        }
    }
    if ($silverPass) { $results["7. Silver Layer Directory Hierarchy (10 Entities)"] = "PASS" }

    # 8. Check Gold Layer Directories
    $goldDomains = @("sales", "customers", "products", "inventory", "business_metrics")
    $goldPass = $true
    foreach ($dom in $goldDomains) {
        $dirExists = az storage fs directory exists --name "gold/$dom" --file-system $script:AZURE_STORAGE_CONTAINER --account-name $script:AZURE_STORAGE_ACCOUNT --auth-mode login 2>$null | ConvertFrom-Json
        if (-not $dirExists -or $dirExists.exists -ne $true) {
            $goldPass = $false
            break
        }
    }
    if ($goldPass) { $results["8. Gold Layer Directory Hierarchy (5 Domains)"] = "PASS" }
}

# 10. Check Managed Identity RBAC
$storageScope = az storage account show --name $script:AZURE_STORAGE_ACCOUNT --resource-group $script:AZURE_RESOURCE_GROUP --query id -o tsv 2>$null
if ($storageScope) {
    $roles = az role assignment list --scope $storageScope --role "Storage Blob Data Contributor" 2>$null | ConvertFrom-Json
    if ($roles -and $roles.Count -gt 0) {
        $results["10. Managed Identity RBAC Mappings"] = "PASS [$($roles.Count) Role Assignments Found]"
    }
}

Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host "          ADLS GEN2 VALIDATION SUMMARY REPORT             " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green

$overallStatus = "PASS"
foreach ($key in $results.Keys) {
    $status = $results[$key]
    if ($status -like "*PASS*") {
        Write-Host " [PASS] $key - $status" -ForegroundColor Green
    } else {
        Write-Host " [FAIL] $key - $status" -ForegroundColor Red
        $overallStatus = "FAIL"
    }
}

Write-Host "==========================================================" -ForegroundColor Green
Write-Host " PHASE 10 ADLS STATUS: $overallStatus" -ForegroundColor ($overallStatus -eq "PASS" ? "Green" : "Red")
Write-Host "==========================================================`n" -ForegroundColor Green
