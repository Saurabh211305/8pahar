#!/usr/bin/env bash
# Fetches the selected photographs (Unsplash Licence) and generates
# responsive WebP variants in public/images. Requires curl + ImageMagick.
# Replace with commissioned 8PAHAR project photography when available.
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=public/images
TMP=$(mktemp -d)
mkdir -p "$OUT"

# name|unsplash-photo-id|widths
PHOTOS=(
  "hero-residence|1600585154340-be6161a56a0c|640 960 1280 1800"
  "cctv-pole|1589935447067-5531094415d1|480 800 1200"
  "monitoring-room|1580795479225-c50ab8c3348d|640 960 1400"
  "residential|1600047509807-ba8f99d2cdde|480 800 1200"
  "commercial|1631193816258-28b44b21e78b|480 800 1200"
  "industrial|1586528116311-ad8dd3c8310d|480 800 1200"
  "construction|1541888946425-d81bb19240f5|480 800 1200"
  "assessment|1581092160562-40aa08e78837|480 800 1200|south:100%x64%"
  "technician|1621905251189-08b45d6a269e|480 800 1200"
)

for entry in "${PHOTOS[@]}"; do
  IFS='|' read -r name id widths crop <<<"$entry"
  src="$TMP/$name.jpg"
  curl -sSf -o "$src" "https://images.unsplash.com/photo-$id?w=2000&q=90&fm=jpg"
  if [[ -n "${crop:-}" ]]; then
    # Optional crop "gravity:geometry", e.g. keep the lower 64% of the frame.
    convert "$src" -gravity "${crop%%:*}" -crop "${crop#*:}+0+0" +repage "$src"
  fi
  for w in $widths; do
    convert "$src" -strip -resize "${w}x>" -quality 72 -define webp:method=6 "$OUT/$name-$w.webp"
  done
  echo "built $name"
done
rm -rf "$TMP"
