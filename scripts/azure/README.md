# Azure Cloud Infrastructure Scripts — Phase 9

This directory contains reproducible PowerShell scripts utilizing Azure CLI (`az`) to provision the cloud infrastructure for the **Smart Retail Analytics Platform**.

---

## 1. Prerequisites

1. **Azure CLI**: Install Azure CLI from [https://learn.microsoft.com/en-us/cli/azure/install-azure-cli](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli).
2. **Azure Account & Subscription**: Active Azure account with Contributor or Owner role on your subscription.
3. **PowerShell**: PowerShell 7+ or Windows PowerShell 5.1.

---

## 2. Authentication & Deployment

### Step 1: Login to Azure
```powershell
az login
az account set --subscription "<YOUR_SUBSCRIPTION_ID_OR_NAME>"
```

### Step 2: Run Deployment Automation
```powershell
./scripts/azure/deploy-all.ps1
```

---

## 3. Modular Script Inventory

| Script File | Purpose |
| :--- | :--- |
| `phase9-config.ps1` | Centralized parameter definition (region, naming, tags). |
| `create-resource-group.ps1` | Provisions Resource Group `rg-smart-retail-dev` in `centralindia`. |
| `create-storage.ps1` | Provisions ADLS Gen2 Storage Account `stsmartretaildev2026` & container `retail-data` with Bronze/Silver/Gold directories. |
| `create-data-factory.ps1` | Provisions Azure Data Factory `adf-smart-retail-dev` with Managed Identity. |
| `create-databricks.ps1` | Provisions Azure Databricks Workspace `dbw-smart-retail-dev` (Standard SKU). |
| `create-synapse.ps1` | Provisions Azure Synapse Analytics Workspace `syn-smart-retail-dev` foundation. |
| `create-keyvault.ps1` | Provisions Azure Key Vault `kv-smart-retail-dev2026` with RBAC authorization. |
| `setup-rbac.ps1` | Assigns `Storage Blob Data Contributor` to ADF and Synapse Managed Identities. |
| `deploy-all.ps1` | Master orchestration script running all deployment steps. |

---

## 4. Cost Control & Compute Shutdown Guidelines

- **Databricks Clusters**: Do not leave compute clusters running continuously. Configure auto-termination after **15–20 minutes** of inactivity.
- **Synapse Analytics**: Utilize Serverless SQL Pools for development rather than provisioned Dedicated SQL Pools to prevent hourly charges.
- **Storage**: Standard LRS (Locally Redundant Storage) is used to minimize storage fees.
