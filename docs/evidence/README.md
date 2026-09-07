# Evidence Index

These screenshots document the reporting and notification flow. The first five images were captured from the baseline run that correctly blocked deployment because critical vulnerabilities were present.

## Excel report evidence

1. [`01-excel-vulnerabilities-sheet.png`](01-excel-vulnerabilities-sheet.png): detailed CVE, package, version, fix, score, and advisory columns.
2. [`02-excel-scan-info-sheet.png`](02-excel-scan-info-sheet.png): image name, scan time, and vulnerability totals.
3. [`03-excel-summary-sheet.png`](03-excel-summary-sheet.png): severity counts used for the policy decision.
4. [`04-excel-recommendations-sheet.png`](04-excel-recommendations-sheet.png): Docker Scout base-image recommendations from the baseline image.
5. [`docker-scout-recommendations.md`](docker-scout-recommendations.md): command output summary and remediation decision.

## Notification evidence

6. [`05-telegram-report-attachment.png`](05-telegram-report-attachment.png): Telegram received the Excel report as a document and included the failed-gate context.

## Remediated-run evidence

The successful run should be stored with these names:

- `06-remediated-pipeline-success.png`: terminal output showing zero critical vulnerabilities and deployment success.
- `07-remediated-excel-scan-info-sheet.png`: remediated image scan information showing zero vulnerabilities.
- `08-website-smoke-test.png`: HTTP response or rendered website from `http://localhost:8080`.
- `09-container-health.png`: Docker health status showing `healthy`.

Never include `.env` contents, bot tokens, chat IDs, GitHub secrets, or a Telegram API URL containing a token in project screenshots.
