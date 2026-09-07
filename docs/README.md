# Project Notes and Evidence

This folder explains the security workflow in plain language and keeps the screenshots that show it working.

## What I built

- A static website served from a small Nginx container.
- A secret scan that runs before the image build.
- A Docker Scout scan for packages and known vulnerabilities.
- A Python report generator that creates an Excel summary.
- A deployment check that stops the process when critical vulnerabilities are present.
- Optional Telegram delivery of the Excel report.
- GitHub Actions checks for pull requests and pushes to `main`.

## Project notes

- [`remediation.md`](remediation.md): what was found, what changed, and how the fix was tested.
- [`architecture/architecture-diagram.png`](architecture/architecture-diagram.png): the pipeline overview.
- [`evidence/README.md`](evidence/README.md): the screenshot index.
- [`evidence/docker-scout-recommendations.md`](evidence/docker-scout-recommendations.md): the base-image recommendation and the selected fix.

## Evidence notes

The screenshots support the commands and generated reports; they are not a replacement for running the checks. The reproducible commands are in the root README. Generated files under `devsecops/reports/` are local outputs and are intentionally ignored by Git.

Never commit `.env` files, bot tokens, chat IDs, Docker Hub tokens, or screenshots that expose secrets. The hosted workflow uses `DOCKER_HUB_USERNAME` and `DOCKER_HUB_TOKEN` as GitHub repository secrets for Docker Scout.
