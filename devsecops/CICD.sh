#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

if [[ -f "$REPO_ROOT/devsecops/.env" ]]; then
  set -a
  # Load optional local notification and image settings without committing them.
  source "$REPO_ROOT/devsecops/.env"
  set +a
fi

IMAGE_NAME="${IMAGE_NAME:-portfolio-site-secure}"
IMAGE_TAG="${IMAGE_TAG:-local}"
IMAGE_REF="${IMAGE_NAME}:${IMAGE_TAG}"
CONTAINER_NAME="${CONTAINER_NAME:-portfolio-site-secure-local}"
HOST_PORT="${HOST_PORT:-8080}"

if [[ -z "${PYTHON_COMMAND:-}" ]]; then
  if [[ -x "$REPO_ROOT/.venv/bin/python" ]]; then
    PYTHON_COMMAND="$REPO_ROOT/.venv/bin/python"
  elif [[ -x "$REPO_ROOT/.venv/Scripts/python.exe" ]]; then
    PYTHON_COMMAND="$REPO_ROOT/.venv/Scripts/python.exe"
  else
    PYTHON_COMMAND="python"
  fi
fi

echo "Building Docker image: $IMAGE_REF"
docker build \
  --file devsecops-portfolio/Dockerfile \
  --tag "$IMAGE_REF" \
  .

echo "Scanning image for vulnerabilities..."
critical_status=0
if bash devsecops/security-scan.sh "$IMAGE_REF" --fail-on-critical; then
  critical_status=0
else
  critical_status=$?
fi

echo "Generating vulnerability report..."
"$PYTHON_COMMAND" devsecops/generate-report.py \
  --input devsecops/reports/vulnerability-report.sarif.json \
  --output devsecops/reports/vulnerability-report.xlsx \
  --recommendations devsecops/reports/base-image-recommendations.txt \
  --image "$IMAGE_REF"

if [[ "$critical_status" -ne 0 ]]; then
  echo "Critical vulnerability policy failed; deployment is blocked."

  if [[ -n "${TELEGRAM_BOT_TOKEN:-}" && -n "${TELEGRAM_CHAT_ID:-}" ]]; then
    "$PYTHON_COMMAND" devsecops/notify-telegram.py
  fi

  exit "$critical_status"
fi

echo "Starting container: $CONTAINER_NAME"
docker rm -f "$CONTAINER_NAME" 2>/dev/null || true
docker run -d \
  --name "$CONTAINER_NAME" \
  --publish "${HOST_PORT}:80" \
  "$IMAGE_REF"

echo "Deployment successful: http://localhost:${HOST_PORT}"
