# Evidence Index

These files show the project before and after remediation. The first group captures the original blocked run; the second group captures the successful local and GitHub Actions runs.

## Baseline run

- [`01-excel-vulnerabilities-sheet.png`](01-excel-vulnerabilities-sheet.png): the detailed vulnerability list.
- [`02-excel-scan-info-sheet.png`](02-excel-scan-info-sheet.png): image and scan details.
- [`03-excel-summary-sheet.png`](03-excel-summary-sheet.png): vulnerability counts by severity.
- [`04-excel-recommendations-sheet.png`](04-excel-recommendations-sheet.png): Docker Scout base-image recommendations.
- [`docker-scout-recommendations.md`](docker-scout-recommendations.md): the recommendation command and remediation decision.
- [`05-telegram-report-attachment.png`](05-telegram-report-attachment.png): the Excel report delivered through Telegram after the blocked run.

## Successful local run

- [`06-remediated-pipeline-success.png`](06-remediated-pipeline-success.png): the local pipeline completed and started the website.
- [`07-remediated-excel-scan-info-sheet.png`](07-remediated-excel-scan-info-sheet.png): the remediated image shows zero vulnerabilities.
- [`08-website-smoke-test.png`](08-website-smoke-test.png): the website responded successfully on port 8080.
- [`09-container-health.png`](09-container-health.png): the Docker healthcheck returned `healthy`.

## Successful GitHub Actions run

- [`10-github-actions-success-summary.png`](10-github-actions-success-summary.png): the GitHub Actions security job passed.
- [`11-github-actions-success-logs.png`](11-github-actions-success-logs.png): detailed logs from the successful job.
- [`12-github-actions-checks-passed.png`](12-github-actions-checks-passed.png): the repository check status after the run.

The Node.js 20 message in the GitHub Actions logs is a platform warning, not a project failure. Keep it as context, but do not present it as a security issue.

Do not include `.env` contents, bot tokens, chat IDs, GitHub secrets, Docker Hub tokens, or Telegram API URLs containing tokens in project screenshots.
