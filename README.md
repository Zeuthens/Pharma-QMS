# Pharma-QMS

Pharma-QMS is the quality management system of **Zeuthen**. It is a GitHub-native QMS: controlled documents, records, approvals, electronic signatures, and training are managed through this repository (`Zeuthens/Pharma-QMS`), its pull requests, issues, and GitHub Actions workflows.

- **QMS owner:** [@Zeuthens](https://github.com/Zeuthens) (TODO: confirm full legal name; candidate: Ulrik Ledgaard Zeuthen)
- **Company:** Zeuthen (legal form, address, and CVR number: TODO in [`matrices/company_profile.yml`](matrices/company_profile.yml))
- **Operating model:** small team, remote (TODO: confirm)
- **Market:** European Union (Denmark) (TODO: confirm)
- **Adopted from:** an open QMS baseline, release `QMS-2026-07-09-R005` (attribution and licensing in [`NOTICE`](NOTICE) and [`LICENSE`](LICENSE); adoption record in [`adoption/upstream-baseline.json`](adoption/upstream-baseline.json))

## Scope

- **Adoption profile:** *App with AI* - core QMS baseline plus information security (`SOP-021`, ISO/IEC 27001), AI management (`SOP-022`, ISO/IEC 42001), and data protection (`SOP-023`, GDPR). Usability engineering (`SOP-019`) is included as optional good practice. Swiss nFADP is not applicable. See [`matrices/adoption_profiles.yml`](matrices/adoption_profiles.yml).
- **GxP context:** in scope. The product is used by pharmaceutical customers in GxP-regulated work, so the GAMP 5 / EU GMP Annex 11 overlay [`matrices/gamp5_gxp_gap_analysis.yml`](matrices/gamp5_gxp_gap_analysis.yml) is kept.
- **Product in scope:** *IMPD automation* ([`Zeuthens/impd-automation`](https://github.com/Zeuthens/impd-automation)), an AI solution that drafts Investigational Medicinal Product Dossier content. It is licensed to **Egebro Consult**, a pharmaceutical regulatory consultancy and the first licensee/customer (TODO: confirm).
- **Not a medical device:** the product drafts regulatory dossiers for medicinal products and has no medical purpose (determination and TODO confirmation in [`matrices/regulatory_market_scope.yml`](matrices/regulatory_market_scope.yml)). Medical-device procedures and gap analyses of the source baseline are not part of this QMS.

## Start Here

| I need to... | Open |
|---|---|
| Read the top-level QMS description | [QM-001 Quality Manual](qm/QM-001-QualityManual.md) |
| Find a procedure | [Published library](#published-library) |
| See role-based training requirements | [Training matrix](matrices/training_matrix.yml) |
| See recorded training status | [Training status report](records/training/training_status.md) |
| See my open training issues | [My open training issues](https://github.com/Zeuthens/Pharma-QMS/issues?q=is%3Aopen+is%3Aissue+label%3Atraining-diff+assignee%3A%40me+sort%3Aupdated-desc) |
| Browse record families and templates | [Records index](records/README.md) |
| Understand workflows and signatures | [System architecture](docs/architecture/README.md) |

## Adoption Status

Pharma-QMS is **not yet approved for operational use**. Before it governs product, supplier, release, or validation evidence, the following must be completed:

1. **Resolve TODO placeholders** in [`matrices/company_profile.yml`](matrices/company_profile.yml) (legal form, address, CVR number, policy approval), [`matrices/regulatory_market_scope.yml`](matrices/regulatory_market_scope.yml) (confirm the non-device determination and GxP expectations with Egebro Consult), [`matrices/training_matrix.yml`](matrices/training_matrix.yml) (add team members, assign an independent auditor), [`matrices/qms_tooling_inventory.yml`](matrices/qms_tooling_inventory.yml), and [`records/suppliers/approved_supplier_list.yml`](records/suppliers/approved_supplier_list.yml) (evaluate GitHub and Anthropic; Microsoft Azure and AWS are planned, not yet used). `tools/check_adoption_readiness.sh --skip-gh` fails until these are resolved.
2. **BLOCKER - second signer:** Zeuthens is currently the only signer in all signer roles ([`matrices/signer_registry.json`](matrices/signer_registry.json)). No gate has been weakened (controlled-document changes require two signatures, including a non-author reviewer). By adoption decision, controlled changes to `sops/`, `qm/`, `records/`, and `matrices/` **cannot be signed until a second qualified signer is added to `matrices/signer_registry.json` and `matrices/training_matrix.yml`** (then re-run `python3 tools/qms_distribution.py sync-codeowners`). Until then Pharma-QMS is not operational.
3. **GitHub configuration:** create a Zeuthen-owned GitHub App (slug expected by the workflows: `zeuthen-pharma-qms-bot`), install it on this repository, and add the `QMS_BOT_APP_ID` and `QMS_BOT_APP_PRIVATE_KEY` secrets. Configure branch protection or rulesets on `main` (required PR review, required `qms_approval_gate` status and QMS content gate, no direct pushes, CODEOWNERS review). On GitHub Free private repositories these cannot hard-block merges.
4. **BLOCKER - training and release signatures:** merged-PR signatures use the git-native workflow `2.5` (no hosted signature service). Training-issue (`3.2`) and QMS-release (`2.7`) signatures need `SIGNATURE_UI_BASE_URL` (a signing endpoint) or an approved fallback, which does not exist yet. Until then `2.3` does not dispatch `2.7` automatically (run `2.7` manually by `workflow_dispatch`), `2.7` has no automatic release trigger, and `3.2` exits with a notice instead of requesting a signature. `SIGNATURE_UI_BASE_URL` (or an approved fallback) is listed as required in [`adoption/readiness-config.json`](adoption/readiness-config.json). See [architecture section 11](docs/architecture/README.md#11-known-limitation-training-and-qms-release-signatures).
5. **Validation under `SOP-006`:** validate GitHub, GitHub Actions, and the git-native signature flow for intended use, assess Claude Code as an AI development tool, and record the evidence under [`records/validation/`](records/validation/).
6. **Tailoring review:** SOP bodies still carry clause references to medical-device standards inherited from the source baseline (used as good practice only). Review them and the product-specific GxP gaps in the GAMP 5 overlay.
7. **Training** of all assigned roles on the published document set under `SOP-011`.
8. **Approval** of the adopted QMS by the Management Representative through a signed PR and the first formal `QMS-YYYY-MM-DD-RNNN` release with release notes under `records/releases/`.

## Published Library

Use the grouped links below for navigation. The machine-readable index further down is used by release and training automation. Each document carries a new adoption revision (dated 2026-10-17) that records its adoption and tailoring for Zeuthen. These revisions are **pending approval**: the `Published` status below is the validator's required value for every document on `main`, not an approval. They become approved only when the adoption PR is signed and the first Pharma-QMS `QMS-*` release is published (see Adoption status).

Current library: `1` Quality Manual, `20` SOPs, and `2` WIs.

### Quality Manual

- [QM-001 Quality Manual](qm/QM-001-QualityManual.md) - `R10`

### SOP Library By Topic

#### Governance and Core QMS

- [SOP-001 Document and Record Control](sops/SOP-001-DocControl.md) - `R16`
- [SOP-002 Corrective and Preventive Action (CAPA)](sops/SOP-002-CAPA.md) - `R07`
- [SOP-003 Internal Audit](sops/SOP-003-InternalAudit.md) - `R08`
- [SOP-004 Management Review](sops/SOP-004-ManagementReview.md) - `R10`
- [SOP-005 QMS Governance](sops/SOP-005-QMSGovernance.md) - `R24`
- [SOP-011 Competence, Training, and Awareness](sops/SOP-011-CompetenceTrainingAndAwareness.md) - `R13`
- [SOP-016 Quality Metrics and Data Analysis](sops/SOP-016-QualityMetricsAndDataAnalysis.md) - `R08`
- [SOP-017 Infrastructure and Maintenance Control](sops/SOP-017-InfrastructureAndMaintenanceControl.md) - `R07`

#### Information Security, AI, and Privacy

- [SOP-021 Information Security Management (ISO/IEC 27001)](sops/SOP-021-InformationSecurityManagement.md) - `R03`
- [SOP-022 AI Management System (ISO/IEC 42001)](sops/SOP-022-AIManagementSystem.md) - `R03`
- [SOP-023 Data Protection and Privacy Management (GDPR and Swiss nFADP)](sops/SOP-023-DataProtectionAndPrivacyManagement.md) - `R01`
  - Only the GDPR part applies; Swiss nFADP is not applicable for Zeuthen.

#### Development, Validation, Risk, and Release

- [SOP-006 Software Validation (QMS Tools)](sops/SOP-006-SoftwareValidation.md) - `R06`
- [SOP-008 Design and Development Control](sops/SOP-008-DesignAndDevelopmentControl.md) - `R12`
  - Retained beyond the profile's SOP list because the core ISO 9001 / ISO/IEC 42001 / ISO/IEC 27001 / GAMP 5 mappings rely on it.
- [SOP-009 Change Management](sops/SOP-009-ChangeManagement.md) - `R12`
- [SOP-018 Risk Management (ISO 14971 as good practice)](sops/SOP-018-RiskManagement.md) - `R11`
  - Retained beyond the profile's SOP list because the core ISO 9001 / ISO/IEC 42001 / ISO/IEC 27001 / GAMP 5 mappings rely on it.
- [SOP-019 Usability Engineering (IEC 62366-1 as good practice)](sops/SOP-019-UsabilityEngineering.md) - `R14`
  - Optional for the App with AI profile (good practice).
- [SOP-020 Software Lifecycle, Configuration, and Release Management (IEC 62304 as good practice)](sops/SOP-020-SoftwareLifecycleConfigurationAndReleaseManagement.md) - `R14`

#### Suppliers, Customers, and Nonconformity

- [SOP-010 Supplier and Purchasing Control](sops/SOP-010-SupplierAndPurchasingControl.md) - `R06`
- [SOP-012 Feedback and Complaint Handling](sops/SOP-012-FeedbackAndComplaintHandling.md) - `R09`
  - Retained beyond the profile's SOP list because the core ISO 9001 / ISO/IEC 42001 / ISO/IEC 27001 / GAMP 5 mappings rely on it.
- [SOP-015 Nonconforming Product Control](sops/SOP-015-NonconformingProductControl.md) - `R07`
  - Retained beyond the profile's SOP list because the core ISO 9001 / ISO/IEC 42001 / ISO/IEC 27001 / GAMP 5 mappings rely on it.

#### Not Applicable for This Profile

- SOP-007 Medical Device File Control, SOP-013 Regulatory Incident Reporting, and SOP-014 Post-Market Surveillance are medical-device procedures of the source baseline. They are not applicable for the App with AI profile and are not part of Pharma-QMS (see [`matrices/adoption_profiles.yml`](matrices/adoption_profiles.yml)).

### Work Instructions

- [WI-001 Verification and Validation Execution](wis/WI-001-VerificationAndValidationExecution.md) - `R10`
- [WI-002 Configuration and Release Management Execution](wis/WI-002-ConfigurationAndReleaseManagementExecution.md) - `R11`

<details>
<summary>Machine-readable published controlled document index (used by release and training automation)</summary>

<!-- PUBLISHED-CONTROLLED-DOC-INDEX:START -->
| Document ID | Title | File | Revision Date | Published Revision | Status |
|---|---|---|---|---|---|
| QM-001 | Quality Manual | qm/QM-001-QualityManual.md | 2026-10-17 | R10 | Published |
| SOP-001 | Document and Record Control | sops/SOP-001-DocControl.md | 2026-10-17 | R16 | Published |
| SOP-002 | Corrective and Preventive Action (CAPA) | sops/SOP-002-CAPA.md | 2026-10-17 | R07 | Published |
| SOP-003 | Internal Audit | sops/SOP-003-InternalAudit.md | 2026-10-17 | R08 | Published |
| SOP-004 | Management Review | sops/SOP-004-ManagementReview.md | 2026-10-17 | R10 | Published |
| SOP-005 | QMS Governance | sops/SOP-005-QMSGovernance.md | 2026-10-17 | R24 | Published |
| SOP-006 | Software Validation (QMS Tools) | sops/SOP-006-SoftwareValidation.md | 2026-10-17 | R06 | Published |
| SOP-008 | Design and Development Control | sops/SOP-008-DesignAndDevelopmentControl.md | 2026-10-17 | R12 | Published |
| SOP-009 | Change Management | sops/SOP-009-ChangeManagement.md | 2026-10-17 | R12 | Published |
| SOP-010 | Supplier and Purchasing Control | sops/SOP-010-SupplierAndPurchasingControl.md | 2026-10-17 | R06 | Published |
| SOP-011 | Competence, Training, and Awareness | sops/SOP-011-CompetenceTrainingAndAwareness.md | 2026-10-17 | R13 | Published |
| SOP-012 | Feedback and Complaint Handling | sops/SOP-012-FeedbackAndComplaintHandling.md | 2026-10-17 | R09 | Published |
| SOP-015 | Nonconforming Product Control | sops/SOP-015-NonconformingProductControl.md | 2026-10-17 | R07 | Published |
| SOP-016 | Quality Metrics and Data Analysis | sops/SOP-016-QualityMetricsAndDataAnalysis.md | 2026-10-17 | R08 | Published |
| SOP-017 | Infrastructure and Maintenance Control | sops/SOP-017-InfrastructureAndMaintenanceControl.md | 2026-10-17 | R07 | Published |
| SOP-018 | Risk Management (ISO 14971 as good practice) | sops/SOP-018-RiskManagement.md | 2026-10-17 | R11 | Published |
| SOP-019 | Usability Engineering (IEC 62366-1 as good practice) | sops/SOP-019-UsabilityEngineering.md | 2026-10-17 | R14 | Published |
| SOP-020 | Software Lifecycle, Configuration, and Release Management (IEC 62304 as good practice) | sops/SOP-020-SoftwareLifecycleConfigurationAndReleaseManagement.md | 2026-10-17 | R14 | Published |
| SOP-021 | Information Security Management (ISO/IEC 27001) | sops/SOP-021-InformationSecurityManagement.md | 2026-10-17 | R03 | Published |
| SOP-022 | AI Management System (ISO/IEC 42001) | sops/SOP-022-AIManagementSystem.md | 2026-10-17 | R03 | Published |
| SOP-023 | Data Protection and Privacy Management (GDPR and Swiss nFADP) | sops/SOP-023-DataProtectionAndPrivacyManagement.md | 2026-10-17 | R01 | Published |
| WI-001 | Verification and Validation Execution | wis/WI-001-VerificationAndValidationExecution.md | 2026-10-17 | R10 | Published |
| WI-002 | Configuration and Release Management Execution | wis/WI-002-ConfigurationAndReleaseManagementExecution.md | 2026-10-17 | R11 | Published |
<!-- PUBLISHED-CONTROLLED-DOC-INDEX:END -->

</details>

## Records, Matrices, and Gap Analyses

- [Records index](records/README.md)
- [Company profile](matrices/company_profile.yml), [regulatory market scope](matrices/regulatory_market_scope.yml), [adoption profile](matrices/adoption_profiles.yml)
- [Quality manual traceability matrix](matrices/quality_manual_traceability.yml)
- [QMS tooling inventory](matrices/qms_tooling_inventory.yml), [signer registry](matrices/signer_registry.json), [training matrix](matrices/training_matrix.yml)
- Gap analyses: [ISO 9001](matrices/iso_9001_gap_analysis.yml), [ISO/IEC 27001](matrices/iso_27001_gap_analysis.yml), [ISO/IEC 42001](matrices/iso_iec_42001_gap_analysis.yml), [GDPR](matrices/gdpr_gap_analysis.yml), [privacy gap index](matrices/privacy_data_protection_gap_index.yml), [GAMP 5 / GxP overlay](matrices/gamp5_gxp_gap_analysis.yml); [Swiss nFADP](matrices/swiss_nfadp_gap_analysis.yml) retained for reference only (not applicable)

## Architecture and Automation

- [System architecture](docs/architecture/README.md) and [workflow automation map](docs/architecture/README.md#6-automation-map)
- [GitHub backup and validation](docs/architecture/GITHUB_BACKUP_AND_VALIDATION.md)

## Licensing

Code is Apache-2.0 and narrative content is CC BY-SA 4.0; see [`LICENSE`](LICENSE), [`LICENSES/`](LICENSES/), and [`NOTICE`](NOTICE).
