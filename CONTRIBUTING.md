# Contributing

Use GitHub issues and pull requests for all controlled changes (`SOP-001`, `SOP-009`).

## Before Opening a PR

- Open or link the relevant issue when the change affects process, workflow behavior, or controlled content.
- Preserve the document structure used by the repository templates and QMS workflows.
- Product execution records belong in the designated product repository (for example `Zeuthens/impd-automation`), not here.

## Validation Expectations

- Run the narrowest relevant checks locally before opening a PR.
- For QMS content changes, run `python3 scripts/validate_qms_content.py --base <base-sha> --head <head-sha>` when practical (requires `ruby` for YAML parsing).
- For adoption or onboarding changes, run `tools/check_adoption_readiness.sh --skip-gh`.
- For workflow helper changes, run `node --test .github/scripts/role-coverage.test.js` and `python3 -m pytest scripts/tests`.

## Pull Request Expectations

- Use the PR template and keep `Summary`, `Why` or `Context`, and `Validation` or `Testing` sections complete.
- Keep changes scoped. Separate infrastructure, workflow, and controlled-content changes unless they must ship together.
- Do not commit local env files, generated caches, or secrets.
