# Phase 9 — Azure Cloud Infrastructure Setup Documentation

## 1. Project & Phase Overview

**Project**: Smart Retail Analytics Platform: An Azure-Based End-to-End Data Engineering and Analytics Framework for Retail Business Intelligence  
**Phase**: Phase 9 — Azure Cloud Infrastructure Setup  
**Selected Region**: `Central India` (`centralindia`)  
**Environment**: Development (`rg-smart-retail-dev`)

This phase establishes the foundational cloud infrastructure on Microsoft Azure that will ingest, process, transform, and model operational retail data generated in Phase 8 for enterprise business intelligence dashboards.

---

## 2. Target Data Engineering Architecture

```text
Next.js Application (Operational Storefront & Admin Portal)
          │
          ▼
PostgreSQL Database (smart_retail_db)
          │
          ▼ (Phase 11: Azure Data Factory Data Pipeline)
Azure Data Factory (adf-smart-retail-dev)
          │
          ▼ (Phase 10: Raw CSV/JSON Ingestion)
ADLS Gen2 Data Lake (stsmartretaildev2026 / retail-data / bronze/)
          │
          ▼ (Phase 12-13: Azure Databricks + PySpark Transformation)
Azure Databricks Workspace (dbw-smart-retail-dev)
          │
          ├──► Silver Layer (Cleaned Delta Parquet Tables)
          └──► Gold Layer (Aggregated Business Fact/Dimension Analytics)
          │
          ▼ (Phase 14-15: Data Warehouse & Serverless Analytics)
Azure Synapse Analytics Workspace (syn-smart-retail-dev)
          │
          ▼ (Phase 16: Executive BI Dashboards)
Power BI Dashboards & Visual Reports
```

---

## 3. Azure Cloud Resource Inventory

| Resource Type | Resource Name | Region | Configuration / SKU | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Resource Group** | `rg-smart-retail-dev` | `centralindia` | N/A | Central resource container with project tags. |
| **Storage Account** | `stsmartretaildev2026` | `centralindia` | Standard LRS, HNS Enabled (ADLS Gen2) | Primary Data Lake storage account. |
| **Data Lake Container** | `retail-data` | `centralindia` | Private Access, Hierarchical | Root Data Lake container for Bronze/Silver/Gold. |
| **Azure Data Factory** | `adf-smart-retail-dev` | `centralindia` | V2, System-Assigned Managed Identity | Automated ETL orchestration engine. |
| **Azure Databricks** | `dbw-smart-retail-dev` | `centralindia` | Standard Tier | PySpark distributed data processing engine. |
| **Azure Synapse** | `syn-smart-retail-dev` | `centralindia` | Serverless SQL Pool Foundation | Data warehouse & dimensional analytics hub. |
| **Azure Key Vault** | `kv-smart-retail-dev2026` | `centralindia` | Standard, RBAC Authorization | Secure secret & connection string manager. |

---

## 4. ADLS Gen2 Data Lake Directory Structure

The storage container `retail-data` inside `stsmartretaildev2026` contains the medallion architecture directory hierarchy:

```text
retail-data/
│
├── bronze/                    # Raw ingested operational data (Date partitioned: load_date=YYYY-MM-DD/)
│   ├── customers/
│   ├── products/
│   ├── categories/
│   ├── suppliers/
│   ├── stores/
│   ├── inventory/
│   ├── orders/
│   ├── order_items/
│   ├── payments/
│   └── reviews/
│
├── silver/                    # Cleaned, validated, and deduplicated Delta Parquet tables
│   ├── customers/
│   ├── products/
│   ├── inventory/
│   ├── orders/
│   ├── order_items/
│   ├── payments/
│   └── reviews/
│
└── gold/                      # Business-level aggregated dimensional models & fact datasets
    ├── sales/
    ├── customers/
    ├── products/
    ├── inventory/
    └── business_metrics/
```

---

## 5. Security & RBAC Access Matrix

### 5.1 Managed Identities & Least-Privilege Roles
No access keys or storage account connection strings are hardcoded into application code or data pipelines. Authentication relies on Azure System-Assigned Managed Identities.

| Principal Service | Target Resource | Assigned Role | Access Purpose |
| :--- | :--- | :--- | :--- |
| **Azure Data Factory** (`adf-smart-retail-dev`) | ADLS Gen2 (`stsmartretaildev2026`) | `Storage Blob Data Contributor` | Write raw PostgreSQL tables to `bronze/`. |
| **Azure Databricks** (`dbw-smart-retail-dev`) | ADLS Gen2 (`stsmartretaildev2026`) | `Storage Blob Data Contributor` | Read `bronze/`, write `silver/` and `gold/`. |
| **Azure Synapse** (`syn-smart-retail-dev`) | ADLS Gen2 (`stsmartretaildev2026`) | `Storage Blob Data Contributor` | Query `gold/` Parquet files for SQL analytics. |
| **Key Vault** (`kv-smart-retail-dev2026`) | Resource Group | `Key Vault Secrets Officer` | Store DB connection strings and tokens. |

### 5.2 Network & Encryption Controls
- **HTTPS & TLS**: Mandatory TLS 1.2 minimum on Storage Account and Key Vault endpoints.
- **Encryption at Rest**: Azure Storage Service Encryption (SSE) enabled with Microsoft-managed keys.
- **Git Protection**: `.gitignore` configured to prevent `.env.local` or Azure secrets from being committed to Git repository.

---

## 6. Development Cost Control Guidelines

1. **Databricks Auto-Termination**: Databricks clusters must be configured with a **15–20 minute auto-termination** timeout when idle to avoid unnecessary charges.
2. **Serverless Synapse SQL**: Serverless SQL Pools are used for development rather than provisioned Dedicated SQL Pools.
3. **Locally Redundant Storage (LRS)**: Storage Account uses Standard LRS to minimize storage costs.
4. **Compute Deallocation**: Stop temporary compute instances when not actively performing data engineering pipeline tests.

---

## 7. Roadmap to Future Data Engineering Phases

- **Phase 10**: ADLS Gen2 Integration & Local Upload Scripts.
- **Phase 11**: Azure Data Factory Pipeline Creation (PostgreSQL → Bronze).
- **Phase 12**: Azure Databricks PySpark ETL Engine.
- **Phase 13**: Medallion Architecture Implementation (Bronze → Silver → Gold Delta Lake).
- **Phase 14**: Star Schema Data Modeling (Fact_Sales, Dim_Customer, Dim_Product).
- **Phase 15**: Azure Synapse Analytics SQL Views & Aggregations.
- **Phase 16**: Power BI Dashboard Integration & Final BI Reports.
