#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "$SCRIPT_DIR/.." && pwd)"
REPORT_DIR="$REPO_ROOT/devsecops/reports"

IMAGE_NAME="${IMAGE_NAME:-portfolio-site-secure}"
IMAGE_TAG="${IMAGE_TAG:-local}"
IMAGE_REF="${1:-${IMAGE_NAME}:${IMAGE_TAG}}"
FAIL_ON_CRITICAL=false

if [[ "${2:-}" == "--fail-on-critical" ]]; then
  FAIL_ON_CRITICAL=true
fi

mkdir -p "$REPORT_DIR"

echo "Scanning image: $IMAGE_REF"
docker scout cves \
  --format sarif \
  --output "$REPORT_DIR/vulnerability-report.sarif.json" \
  "local://$IMAGE_REF"

docker scout cves \
  --output "$REPORT_DIR/vulnerability-report.txt" \
  "local://$IMAGE_REF"

echo "Collecting base image recommendations"
if ! docker scout recommendations \
  --output "$REPORT_DIR/base-image-recommendations.txt" \
  "local://$IMAGE_REF"; then
  printf '%s\n' \
    "Docker Scout recommendations could not be generated for $IMAGE_REF." \
    > "$REPORT_DIR/base-image-recommendations.txt"
fi

echo "Checking critical vulnerabilities"
set +e
docker scout cves \
  --only-severity critical \
  --exit-code \
  "local://$IMAGE_REF"
critical_status=$?
set -e

printf '%s\n' "$critical_status" > "$REPORT_DIR/critical-exit-code"

if [[ "$critical_status" -eq 0 ]]; then
  echo "No critical vulnerabilities detected."
else
  echo "Critical vulnerability policy failed with exit code $critical_status."
fi

if [[ "$FAIL_ON_CRITICAL" == true ]]; then
  exit "$critical_status"
fi
