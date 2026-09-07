import os
from pathlib import Path

import requests
from dotenv import load_dotenv


load_dotenv(Path(__file__).resolve().with_name(".env"))

bot_token = os.getenv("TELEGRAM_BOT_TOKEN")
chat_id = os.getenv("TELEGRAM_CHAT_ID")

if not bot_token or not chat_id:
    raise SystemExit(
        "TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID must be configured."
    )

image_ref = os.getenv("IMAGE_REF", "portfolio-site-secure:local")
pipeline_status = os.getenv("PIPELINE_STATUS", "failed")
report_file = Path(
    os.getenv(
        "REPORT_FILE",
        Path(__file__).resolve().parent / "reports" / "vulnerability-report.xlsx",
    )
)
message = f"""DEVSECOPS PIPELINE FAILED

Image:
{image_ref}

Reason:
Critical vulnerabilities detected or the pipeline failed

Action:
Deployment blocked

Report generated:
{report_file.as_posix()}
"""

if report_file.exists():
    with report_file.open("rb") as document:
        response = requests.post(
            f"https://api.telegram.org/bot{bot_token}/sendDocument",
            data={
                "chat_id": chat_id,
                "caption": message,
            },
            files={
                "document": (
                    report_file.name,
                    document,
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                )
            },
            timeout=30,
        )
else:
    response = requests.post(
        f"https://api.telegram.org/bot{bot_token}/sendMessage",
        json={
            "chat_id": chat_id,
            "text": message,
            "disable_web_page_preview": True,
        },
        timeout=15,
    )

response.raise_for_status()
payload = response.json()
if not payload.get("ok"):
    raise RuntimeError(payload.get("description", "Telegram API request failed."))

delivery_type = "Excel report" if report_file.exists() else "text notification"
print(
    f"Telegram {delivery_type} sent for pipeline status: {pipeline_status}"
)
