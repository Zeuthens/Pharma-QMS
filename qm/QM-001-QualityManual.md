---
qm_id: QM-001
title: Quality Manual
revision: R10
revision_date: 2026-10-17
status: Published
owner_role: qa_lead
approver_role: management_representative
iso_9001_clauses:
  - 4.3
  - 4.4
  - 5.1
  - 5.2
  - 5.3
  - 6.2
related_issue: "TODO: link the Pharma-QMS adoption issue"
---

## 1. Purpose
Describe why Zeuthen maintains a Quality Management System (QMS), what the QMS covers, how the controlled document set fits together, and how quality objectives are translated into operating procedures and records.

## 2. Scope
Applies to the Zeuthen QMS (Pharma-QMS) for non-device software products with AI features used in a pharmaceutical GxP context, currently the IMPD automation product (repository `Zeuthens/impd-automation`), which drafts Investigational Medicinal Product Dossier (IMPD) content and is licensed to Egebro Consult. It also applies to the company-level governance baseline maintained in this repository (`Zeuthens/Pharma-QMS`). Products in scope are not medical devices (see `matrices/regulatory_market_scope.yml`); the QMS follows the "App with AI" adoption profile recorded in `matrices/adoption_profiles.yml`.

## 3. Organization and Context
- Legal Entity: Zeuthen (TODO: confirm legal form, registered address, and CVR number in `matrices/company_profile.yml`)
- QMS Owner: GitHub `Zeuthens`, Ulrik Ledgaard Zeuthen
- Operating Model: Small team, remote (TODO: confirm)
- Regulatory Role: Software supplier / licensor of a non-device software product used by customers in a GxP-regulated pharmaceutical context
- Product Type: Non-device software with AI features (IMPD automation); not a medical device
- Customers / Licensees: Egebro Consult (pharmaceutical regulatory consultancy; first licensee) (TODO: confirm)
- Market: European Union (Denmark) (TODO: confirm)
- Cloud hosting: Microsoft Azure and AWS are planned but not yet used; the current local mock-up uses only GitHub and Anthropic (TODO: update when hosting is decided)
- Intended Use Policy: Each product must define its intended use, users, claims, and its non-device determination before development and release under controlled procedures.
- Infrastructure Policy: Each product must define and approve its infrastructure architecture and controls against applicable security, availability, and traceability requirements within the product dossier.

## 4. QMS Intent and Quality Policy
Zeuthen maintains this QMS to:
- apply ISO 9001:2015+Amd 1:2024 quality management expectations for organization context, customer focus, process performance, and continual improvement
- apply risk-based software lifecycle, configuration, and release controls (`SOP-020`) and risk management (`SOP-018`) to software products, including AI-specific and cybersecurity-related risks
- apply ISO/IEC 27001:2022 information security governance for QMS, product, supplier, and operational information assets
- apply ISO/IEC 42001:2023 AI management controls for AI components inside Zeuthen software products (including IMPD automation) and AI-bearing supplier interfaces
- apply GDPR data-protection controls (`SOP-023`) where personal data is processed
- support customers' GxP obligations for computerized systems by applying GAMP 5 and EU GMP Annex 11 expectations as the GxP context, as mapped in `matrices/gamp5_gxp_gap_analysis.yml`
- maintain product safety and performance through controlled lifecycle processes
- retain objective evidence and traceability for quality decisions

Quality Policy:
> Zeuthen commits to delivering reliable, secure, and well-controlled AI-enabled software for pharmaceutical regulatory work through a risk-based, evidence-driven quality management system and continuous improvement. (TODO: confirm wording at QMS approval.)

The approved policy baseline is maintained in `matrices/company_profile.yml`.
The QMS uses a risk-based approach in which processes are defined, measured, and continuously improved.

## 5. Quality Objectives
The quality objective framework is maintained in `matrices/company_profile.yml` and is reviewed through management review. The current company-level objectives are to:
- merge controlled pull requests only after required approval on the current head commit
- release only baselines with complete V&V, risk, and release traceability evidence
- close critical quality actions on time
- complete required controlled-document training on time
- maintain management review cadence
- monitor customer feedback, satisfaction signals, and process-performance trends
- ensure products perform against defined performance criteria and complaint thresholds
- maintain information security and AI management controls for applicable QMS and product lifecycle scope

Each objective must have an accountable role, a measurable indicator, and a target threshold.

## 6. QMS Structure and Process Interaction
The QMS is structured as:
1. `QM-001` Quality Manual: purpose, scope, policy, objectives, and system architecture.
2. `SOP-005` QMS Governance: governance cadence, ownership, document hierarchy, communication, and governance interfaces.
3. Operational SOPs: controlled procedures for document control, CAPA, audit, management review, training, design control, change control, suppliers, feedback, nonconformity, metrics, infrastructure, risk, usability (optional), software lifecycle control, information security, AI management, and data protection. The medical-device procedures of the source baseline (medical device file, regulatory incident reporting, post-market surveillance) are not applicable to this profile and are not part of this QMS.
4. WIs: detailed execution instructions for selected lifecycle activities.
5. Matrices and records: traceability baselines, role/training assignments, and objective evidence.

High-level process interaction:

| QMS Area | Primary Controlled Documents | Main Outputs |
|---|---|---|
| QMS framing and policy | `QM-001`, `SOP-005`, `SOP-004`, `SOP-016` | Scope statement, policy, objectives, management review decisions |
| Document and training control | `SOP-001`, `SOP-011` | Controlled revisions, training assignments, training logs |
| Product lifecycle control | `SOP-008`, `SOP-009`, `SOP-020`, `WI-001`, `WI-002` | Product records, development plans, release baselines, V&V evidence |
| Risk and usability | `SOP-018`, `SOP-019` (optional) | Risk file, usability file, residual risk decisions |
| Information security, AI, and privacy | `SOP-021`, `SOP-022`, `SOP-023` | ISMS and AIMS registers, statements of applicability, privacy records |
| Suppliers, customers, and nonconformity | `SOP-010`, `SOP-012`, `SOP-015` | Supplier approvals, customer feedback and complaints, nonconformity handling |
| Improvement and oversight | `SOP-002`, `SOP-003`, `SOP-004`, `SOP-016` | CAPAs, audits, reviews, metrics and improvement actions |

## 7. Roles and Responsibility Overview
| Role | System-Level Responsibility |
|---|---|
| Management Representative | Acts for top management within the small-team model, approves the quality policy/objective baseline, and confirms QMS adequacy and effectiveness. |
| QA Lead | Maintains the controlled QMS baseline, owns regulatory pathway and dossier completeness expectations, verifies process interaction completeness, and drives quality-system improvements. |
| Engineering Lead | Owns lifecycle planning, technical release readiness, and engineering process implementation. |
| Usability Lead | Owns safety-related usability engineering inputs and file completeness for user-facing products. |
| Technical QMS Maintainer | Maintains quality tooling, automation, and technical QMS infrastructure under controlled change. |
| Auditor | Verifies conformance and effectiveness of selected QMS processes and must remain independent of the activities being audited. |

Detailed governance responsibilities are defined in `sops/SOP-005-QMSGovernance.md`.

## 8. Standards and Regulatory Framework
Regulatory applicability is maintained in `matrices/regulatory_market_scope.yml`. The QMS baseline is aligned to:
- ISO 9001:2015, including ISO 9001:2015/Amd 1:2024
- ISO/IEC 27001:2022, including ISO/IEC 27001:2022/Amd 1:2024
- ISO/IEC 42001:2023
- Regulation (EU) 2016/679 (GDPR)
- GxP context: ISPE GAMP 5 (Second Edition) and EU GMP Annex 11 (computerized systems), applied as the expectations of pharmaceutical customers that use the product in GxP processes

Some SOPs retain clause references to medical-device standards (for example ISO 13485, IEC 62304, ISO 14971, IEC 62366-1) inherited from the source baseline. In this QMS those references describe good practice only; they are not certification or conformity claims.

Jurisdiction references currently maintained in the regulatory scope baseline include:
- European Union (Denmark): non-device determination for IMPD automation, GDPR, and the GxP context of the EU medicinal-products framework

## 9. Document Architecture and Record Model
Document-control rules are defined in `SOP-001`, governance rules in `SOP-005`, and role-specific training expectations in `SOP-011` plus `matrices/training_matrix.yml`.

The record model is:
- company-level QMS documents and selected quality records are maintained in a controlled central repository that constitutes the authoritative QMS baseline
- standardized templates and controlled document structures are published from this repository to support consistent implementation across products and studies
- product-specific records (for example for `Zeuthens/impd-automation`) are maintained in designated controlled repositories and linked to the relevant product release evidence

QMS tooling and validation baselines are maintained in:
- `matrices/qms_tooling_inventory.yml`
- `records/validation/` (TODO: create the Zeuthen QMS tooling validation record under `SOP-006` before operational use)

## 10. Traceability
| Standard Clause | Quality Manual Coverage | Linked Baseline |
|---|---|---|
| ISO 9001:2015 4.3, 4.4 | Defines QMS scope, structure, and interaction model | `matrices/quality_manual_traceability.yml` |
| ISO 9001:2015 5.1, 5.2 | Defines management commitment and quality policy context | `matrices/company_profile.yml`, `sops/SOP-004-ManagementReview.md` |
| ISO 9001:2015 6.2 | Defines quality objectives and planning context | `matrices/company_profile.yml`, `sops/SOP-016-QualityMetricsAndDataAnalysis.md` |
| ISO 9001:2015 5.3, 7.4 | Defines system-level responsibilities and communication overview | `sops/SOP-005-QMSGovernance.md`, `sops/SOP-011-CompetenceTrainingAndAwareness.md` |
| ISO 9001:2015 4-10 | Defines the general quality-management overlay for context, interested parties, customer focus, organizational knowledge, process performance, and improvement | `matrices/iso_9001_gap_analysis.yml`, `sops/SOP-005-QMSGovernance.md`, `sops/SOP-012-FeedbackAndComplaintHandling.md`, `sops/SOP-016-QualityMetricsAndDataAnalysis.md` |

## 11. Related Controlled Documents
- SOP-001 Document and Record Control
- SOP-004 Management Review
- SOP-005 QMS Governance
- SOP-011 Competence, Training, and Awareness
- SOP-016 Quality Metrics and Data Analysis
- `matrices/company_profile.yml`
- `matrices/quality_manual_traceability.yml`
- `matrices/regulatory_market_scope.yml`

## 12. Revision History
| Revision | Revision Date | Change Summary |
|---|---|---|
| R00 | 2026-03-08 | Initial release split from SOP-005 so the QMS intent, scope, policy, objectives, and process structure are available as a standalone Quality Manual. |
| R01 | 2026-03-10 | Updated baseline naming, licensing, and repository references. |
| R02 | 2026-03-25 | Tightened company-level scope wording, added risk-based quality framing and product performance objectives, and clarified auditor independence plus repository-of-record language. |
| R03 | 2026-03-27 | Consolidated the standalone regulatory-lead baseline role into the QA-lead governance model and aligned the system-level role overview accordingly. |
| R04 | 2026-04-23 | Added IEC 82304-1:2016 health software product-safety scope to the QMS intent and standards framework. |
| R05 | 2026-04-27 | Added ISO/IEC 27001:2022 information security governance to the QMS intent and standards framework. |
| R06 | 2026-04-27 | Added ISO/IEC 42001:2023 AI management controls for AI components inside the company's software products to the QMS intent and standards framework. |
| R07 | 2026-04-27 | Renamed YAML metadata field `effective_date` to `revision_date` to align controlled-document metadata with the tag-based publication model. The effective date is derived from the published QMS release tag rather than from the document front matter. |
| R08 | 2026-05-04 | Standardize standards citations to specific versions. |
| R09 | 2026-05-26 | Added the ISO 9001 general quality-management extension for organization context, customer focus, process performance, and continual improvement. |
| R10 | 2026-10-17 | Adopted into Pharma-QMS for Zeuthen from the upstream baseline release QMS-2026-07-09-R005; tailored for the App with AI profile; pending approval. |
