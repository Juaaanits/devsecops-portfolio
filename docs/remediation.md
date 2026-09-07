# Vulnerability Remediation Record

## Status

Remediation is validated for the image `portfolio-site-secure:remediated`. The project still uses a fail-closed critical-vulnerability policy for future builds.

## Baseline finding

The original image used `nginx:1.27.5-alpine`. Docker Scout reported:

- 83 packages
- 124 total vulnerabilities
- 6 critical vulnerabilities
- Deployment blocked by the policy

The critical findings included packages such as `curl`, `libxml2`, `openssl`, and `expat`. Some findings had fixed versions available, while others had no fixed version in the scan result.

The baseline Excel evidence is available in:

- [`01-excel-vulnerabilities-sheet.png`](evidence/01-excel-vulnerabilities-sheet.png)
- [`03-excel-summary-sheet.png`](evidence/03-excel-summary-sheet.png)
- [`05-telegram-report-attachment.png`](evidence/05-telegram-report-attachment.png)

## Remediation decision

Docker Scout recommended the slim Nginx variant. The Dockerfile now uses the fixed version and digest:

```dockerfile
FROM nginx:1.31.5-alpine-slim@sha256:3b171d7224b669faa3cc2137fea0a65301791df1ec1f271ebd2a2b7461f7fade
```

Why this change was selected:

- It was identified by Docker Scout as a candidate base image.
- The image includes `wget`, so the existing HTTP healthcheck remains valid.
- `nginx -t` passes in the candidate image.
- The digest makes the build reproducible instead of relying only on a mutable tag.

## Validation procedure

Run from the repository root after starting Docker Desktop:

```powershell
docker build -f devsecops-portfolio\Dockerfile -t portfolio-site-secure:remediated .
docker run --rm -d --name portfolio-site-secure-remediated -p 8080:80 portfolio-site-secure:remediated
Invoke-WebRequest http://localhost:8080
docker inspect --format "{{.State.Health.Status}}" portfolio-site-secure-remediated
docker stop portfolio-site-secure-remediated
```

Run the security gate from Git Bash or WSL:

```bash
bash devsecops/security-scan.sh portfolio-site-secure:remediated --fail-on-critical
```

Then generate the workbook:

```powershell
.\.venv\Scripts\python.exe devsecops\generate-report.py `
  --input devsecops\reports\vulnerability-report.sarif.json `
  --output devsecops\reports\vulnerability-report.xlsx `
  --recommendations devsecops\reports\base-image-recommendations.txt `
  --image portfolio-site-secure:remediated
```

## Acceptance criteria

- The Docker image builds successfully.
- The website returns HTTP 200 on port 8080.
- The container healthcheck becomes healthy.
- The critical scan exits with code 0.
- The generated Excel workbook opens without repair warnings.
- The report and optional Telegram notification describe the remediated image.

## Validation result

The remediated image was rebuilt and tested on 2026-09-07:

- Docker build completed successfully from the pinned digest.
- Docker Scout critical policy: `0C 0H 0M 0L`.
- Docker Scout indexed 26 packages in an 8.3 MB image.
- Container-internal HTTP smoke test: `200`.
- Published host-port smoke test: `200`.
- Docker healthcheck: `healthy`.
- Generated workbook: 0 vulnerabilities, 4 worksheets, no embedded Excel table XML.

The successful-run evidence is stored in:

- [`06-remediated-pipeline-success.png`](evidence/06-remediated-pipeline-success.png)
- [`07-remediated-excel-scan-info-sheet.png`](evidence/07-remediated-excel-scan-info-sheet.png)
- [`08-website-smoke-test.png`](evidence/08-website-smoke-test.png)
- [`09-container-health.png`](evidence/09-container-health.png)

The next local run should use `bash devsecops/CICD.sh` from Git Bash to verify the complete `portfolio-site-secure:local` flow and send the optional Telegram notification.

## Residual risk and next improvement

Vulnerability data and base-image contents change over time. The pinned digest improves reproducibility but does not replace recurring scans. The next production-grade improvement would be a scheduled GitHub Actions scan that opens an issue or pull request when the pinned image becomes stale or a new critical vulnerability is detected.
