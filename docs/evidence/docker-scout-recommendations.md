# Docker Scout Recommendation Evidence

## Command

```bash
docker scout recommendations local://portfolio-site-secure:local
```

## Baseline recommendation

The baseline image used the older Alpine Nginx base and Docker Scout identified the slim Nginx variant as a safer update candidate. The recommendation report showed:

- Current base image family: `nginx:1-alpine`
- Recommended candidate: `1-alpine-slim`
- Candidate runtime observed: `1.31.5`
- Candidate vulnerability result: `0C 0H 0M 0L`
- Candidate size observed: approximately `8.2 MB`

The formatted recommendation is visible in [`04-excel-recommendations-sheet.png`](04-excel-recommendations-sheet.png).

## Selected remediation

The project selected the explicit fixed image below instead of using the floating `1-alpine-slim` tag:

```dockerfile
FROM nginx:1.31.5-alpine-slim@sha256:3b171d7224b669faa3cc2137fea0a65301791df1ec1f271ebd2a2b7461f7fade
```

The remediated scan then reported `0C 0H 0M 0L`, indexed 26 packages, and produced an 8.3 MB image. The raw generated recommendation report remains under `devsecops/reports/` locally and is intentionally ignored because it is reproducible output.
