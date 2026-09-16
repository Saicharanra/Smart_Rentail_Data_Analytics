# Phase 10 — ADLS Gen2 Data Lake Implementation Documentation

## 1. Phase Overview & Target Architecture

**Project**: Smart Retail Analytics Platform: An Azure-Based End-to-End Data Engineering and Analytics Framework for Retail Business Intelligence  
**Phase**: Phase 10 — ADLS Gen2 Data Lake Implementation  
**Region**: `Central India` (`centralindia`)  
**Resource Group**: `rg-smart-retail-dev`  
**Storage Account**: `stsmartretaildev2026`  
**Hierarchical Namespace (HNS)**: `Enabled` (ADLS Gen2)  
**Root Data Lake Container**: `retail-data`

Phase 10 implements the Medallion Data Lake architecture foundation inside Azure Data Lake Storage Gen2 (ADLS Gen2). This structure provides raw, cleansed, and business-aggregated data layers to support scalable PySpark ETL processing and enterprise dimensional analytics.

```text
PostgreSQL Database (smart_retail_db)
          │
          ▼ (Phase 11: Azure Data Factory Pipeline Ingestion)
Azure Data Factory (adf-smart-retail-dev)
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       ADLS Gen2 (retail-data)                               │
│                                                                             │
│  ├── bronze/ (Raw ingested data: load_date=YYYY-MM-DD/)                    │
│  ├── silver/ (Cleaned Delta Parquet: process_date=YYYY-MM-DD/)             │
│  └── gold/   (Aggregated Star Schema: process_date=YYYY-MM-DD/)            │
└─────────────────────────────────────────────────────────────────────────────┘
          │
          ▼ (Phases 12-15: Databricks PySpark & Synapse Analytics)
Power BI Dashboards (Phase 16)
```

---

## 2. ADLS Gen2 Medallion Directory Architecture

The root container `retail-data` contains the three tier directory hierarchy:

```text
retail-data/
│
├── bronze/                            # Raw Operational Ingestion Layer
│   ├── customers/                     # Raw customer profiles & segments
│   ├── products/                      # Raw product catalog & prices
│   ├── categories/                    # Raw product categories
│   ├── suppliers/                     # Raw supplier directory
│   ├── stores/                        # Raw store locations & codes
│   ├── inventory/                     # Raw store x product stock matrix
│   ├── orders/                        # Raw customer orders
│   ├── order_items/                   # Raw order line items & purchase prices
│   ├── payments/                      # Raw payment transaction records
│   └── reviews/                       # Raw customer product reviews
│
├── silver/                            # Cleaned & Deduplicated Delta Parquet Layer
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
└── gold/                              # Analytical Business Fact & Dimension Datasets
    ├── sales/                         # Fact_Sales & daily revenue metrics
    ├── customers/                     # Dim_Customer & RFM analytics Tiers
    ├── products/                      # Dim_Product & category performance
    ├── inventory/                     # Inventory turnover & stock alerts
    └── business_metrics/              # Executive KPI aggregates
```

---

## 3. Data Lake Partitioning & Naming Conventions

### 3.1 Directory Partitioning Standard

- **Bronze Layer (Raw Source Ingestion)**:
  `bronze/<entity>/load_date=YYYY-MM-DD/`
  *Example*: `retail-data/bronze/orders/load_date=2026-09-16/orders_raw.parquet`

- **Silver Layer (Cleaned & Conform Datasets)**:
  `silver/<entity>/process_date=YYYY-MM-DD/`
  *Example*: `retail-data/silver/orders/process_date=2026-09-16/part-00000.parquet`

- **Gold Layer (Star Schema Fact & Dimension Analytics)**:
  `gold/<domain>/process_date=YYYY-MM-DD/`
  *Example*: `retail-data/gold/sales/process_date=2026-09-16/fact_sales.parquet`

### 3.2 Analytical File Format Standard

- **Format Recommendation**: Apache Parquet / Delta Lake format.
- **Compression**: Snappy compressed columnar storage providing up to 10x query compression ratio and sub-second pushdown filtering for Azure Databricks PySpark and Synapse Serverless SQL queries.

---

## 4. Security & Access Control Mappings

### 4.1 Least-Privilege RBAC Mappings

No storage account access keys or connection strings are embedded in data pipelines. Access is governed via Azure Managed Identities:

| Azure Principal | Target Scope | RBAC Role | Purpose |
| :--- | :--- | :--- | :--- |
| **Azure Data Factory** (`adf-smart-retail-dev`) | ADLS Gen2 (`stsmartretaildev2026`) | `Storage Blob Data Contributor` | Write raw PostgreSQL entity dumps to `bronze/`. |
| **Azure Databricks** (`dbw-smart-retail-dev`) | ADLS Gen2 (`stsmartretaildev2026`) | `Storage Blob Data Contributor` | Read `bronze/`, write cleaned `silver/` & `gold/`. |
| **Azure Synapse** (`syn-smart-retail-dev`) | ADLS Gen2 (`stsmartretaildev2026`) | `Storage Blob Data Contributor` | Query `gold/` Parquet files via Serverless SQL Pools. |

### 4.2 Security Controls
- **Private Container Access**: Public blob access is disabled on `retail-data`.
- **TLS & Transport Encryption**: Minimum TLS 1.2 and HTTPS transfer enforced (`enableHttpsTrafficOnly = true`).
- **Data Encryption at Rest**: Azure Storage Service Encryption (SSE) with Microsoft-managed keys.

---

## 5. Automation & Validation Scripts (`scripts/azure/phase10/`)

| Script File | Function |
| :--- | :--- |
| `create-adls-container.ps1` | Idempotently verifies or creates container `retail-data`. |
| `create-data-lake-structure.ps1` | Idempotently provisions Medallion directory trees (`bronze/`, `silver/`, `gold/`). |
| `configure-adls-rbac.ps1` | Assigns `Storage Blob Data Contributor` to ADF, Databricks, and Synapse Managed Identities. |
| `validate-adls.ps1` | Automated validation suite running 10 security, structural, and HNS checks with PASS/FAIL report. |
| `deploy-phase10.ps1` | Master orchestration script running Phase 10 deployment and validation. |

---

## 6. Pipeline Integration Roadmap

- **Phase 11**: Azure Data Factory Pipeline Creation (PostgreSQL → ADLS Gen2 `bronze/`).
- **Phase 12**: Azure Databricks PySpark Cluster & Notebook Setup.
- **Phase 13**: Medallion Architecture Implementation (`bronze/` → `silver/` → `gold/` PySpark transformation).
- **Phase 14**: Star Schema Data Modeling (`Fact_Sales`, `Dim_Customer`, `Dim_Product`).
- **Phase 15**: Azure Synapse Analytics Serverless SQL Views.
- **Phase 16**: Power BI Dashboard Integration.
