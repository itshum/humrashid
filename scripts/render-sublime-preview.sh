#!/bin/sh
# Renders /previews/sublime-home (needs the dev server on :4321) to the
# homepage's Sublime hover image, at 2x for sharp text.
set -e
rm -f "${TMPDIR:-/tmp}/sublime-home-preview.png"
cd "$(dirname "$0")/.."
PNG="${TMPDIR:-/tmp}/sublime-home-preview.png"
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --hide-scrollbars \
  --window-size=1720,1040 --force-device-scale-factor=2 \
  --virtual-time-budget=5000 \
  --screenshot="$PNG" http://localhost:4321/previews/sublime-home 2>/dev/null
[ -s "$PNG" ] || { echo "render failed: is the dev server running on :4321?" >&2; exit 1; }
python3 -c "from PIL import Image; Image.open('$PNG').convert('RGB').save('public/case-studies/sublime-security/home-preview.webp', quality=88, method=6)"
echo "wrote public/case-studies/sublime-security/home-preview.webp"
