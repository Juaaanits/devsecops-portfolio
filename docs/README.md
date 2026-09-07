# DevSecOps Project Evidence

This folder contains the recruiter-facing explanation and evidence for the DevSecOps portfolio project.

## What this demonstrates

- A Python virtual environment is created before installing project tooling.
- `detect-secrets` checks the repository before the image build.
- Docker Scout scans the built image and produces SARIF and text output.
- A Python report generator creates a readable Excel workbook.
- A critical-vulnerability policy blocks deployment instead of silently shipping a risky image.
- Telegram can receive the generated Excel report as a document.
- A base-image recommendation is evaluated and documented as remediation.
- GitHub Actions automatically repeats the checks on pull requests and pushes to `main`.

## Documents

- [`remediation.md`](remediation.md): baseline findings, remediation decision, validation steps, and residual risks.
- [`architecture/architecture-diagram.png`](architecture/architecture-diagram.png): visual pipeline overview.
- [`evidence/README.md`](evidence/README.md): screenshot index and evidence guidance.
- [`evidence/docker-scout-recommendations.md`](evidence/docker-scout-recommendations.md): Docker Scout recommendation output and selected fix.

## Evidence policy

The screenshots in this folder are supporting evidence, not the source of truth. The reproducible commands in the root README and the generated reports under `devsecops/reports/` are authoritative for a new run. Do not commit Telegram bot tokens, chat IDs, `.env` files, or screenshots that expose them.
