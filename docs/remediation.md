# Vulnerability Remediation

## Current status

The remediation has been validated for `portfolio-site-secure:remediated`. Future builds still use the same rule: critical vulnerabilities stop the deployment process.

## What happened initially

The first image used `nginx:1.27.5-alpine`. Docker Scout found:

- 83 packages
- 124 total vulnerabilities
- 6 critical vulnerabilities

The pipeline correctly blocked deployment. The main critical findings involved packages such as `curl`, `libxml2`, `openssl`, and `expat`. Some had fixed versions available; others did not have a fix in that scan.

The baseline evidence is available in:

- [`01-excel-vulnerabilities-sheet.png`](evidence/01-excel-vulnerabilities-sheet.png)
- [`03-excel-summary-sheet.png`](evidence/03-excel-summary-sheet.png)
- [`05-telegram-report-attachment.png`](evidence/05-telegram-report-attachment.png)

## What changed

Docker Scout recommended moving to the slim Nginx image. The Dockerfile now uses a fixed version and digest:

```dockerfile
FROM nginx:1.31.5-alpine-slim@sha256:3b171d7224b669faa3cc2137fea0a65301791df1ec1f271ebd2a2b7461f7fade
```

I chose this image because:

- Docker Scout identified it as a safer base-image option.
- It includes `wget`, so the existing HTTP healthcheck still works.
- `nginx -t` passes in the image.
- Pinning the digest makes the build reproducible.

## Reproduce the test

Run from the repository root after starting Docker Desktop:

```powershell
docker build -f devsecops-portfolio\Dockerfile -t portfolio-site-secure:remediated .
docker run --rm -d --name portfolio-site-secure-remediated -p 8080:80 portfolio-site-secure:remediated
Invoke-WebRequest http://localhost:8080
docker inspect --format "{{.State.Health.Status}}" portfolio-site-secure-remediated
docker stop portfolio-site-secure-remediated
```

Run the security check from Git Bash:

```bash
bash devsecops/security-scan.sh portfolio-site-secure:remediated --fail-on-critical
```

Then create the Excel report:

```powershell
.\.venv\Scripts\python.exe devsecops\generate-report.py `
  --input devsecops\reports\vulnerability-report.sarif.json `
  --output devsecops\reports\vulnerability-report.xlsx `
  --recommendations devsecops\reports\base-image-recommendations.txt `
  --image portfolio-site-secure:remediated
```

## What a successful run looks like

- The image builds successfully.
- The website returns HTTP 200 on port 8080.
- The container becomes healthy.
- The critical scan exits with code 0.
- The Excel workbook opens without a repair warning.
- The report describes the remediated image.

## Result

The remediated image was rebuilt and tested on 2026-09-07:

- Docker build completed successfully from the pinned digest.
- Docker Scout reported `0C 0H 0M 0L`.
- Docker Scout indexed 26 packages in an 8.3 MB image.
- The container returned HTTP 200 internally.
- The published host port returned HTTP 200.
- The Docker healthcheck reached `healthy`.
- The Excel workbook contained 0 vulnerabilities across 4 worksheets and opened without embedded Excel table XML.

The final evidence is available in:

- [`06-remediated-pipeline-success.png`](evidence/06-remediated-pipeline-success.png)
- [`07-remediated-excel-scan-info-sheet.png`](evidence/07-remediated-excel-scan-info-sheet.png)
- [`08-website-smoke-test.png`](evidence/08-website-smoke-test.png)
- [`09-container-health.png`](evidence/09-container-health.png)
- [`10-github-actions-success-summary.png`](evidence/10-github-actions-success-summary.png)
- [`11-github-actions-success-logs.png`](evidence/11-github-actions-success-logs.png)
- [`12-github-actions-checks-passed.png`](evidence/12-github-actions-checks-passed.png)

## Next improvement

Vulnerability data and base images change over time. The pinned digest makes this build reproducible, but it does not replace regular scans. A useful next step would be a scheduled GitHub Actions scan that opens an issue or pull request when the base image becomes outdated or a new critical vulnerability appears.
