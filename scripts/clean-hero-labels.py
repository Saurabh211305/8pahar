"""
Removes the two labels baked into the supplied hero photograph
(brand-source/hero-architecture-reference.webp) so the labels can be real
HTML text. Requires: pip install opencv-python-headless numpy

  python scripts/clean-hero-labels.py brand-source/hero-architecture-reference.webp out.png

Then resize `out.png` to public/images/hero-architecture-{960,1280,1672}.webp.
The cleaned master is kept at brand-source/hero-architecture-clean.webp.
"""
import cv2, numpy as np, sys
src, out = sys.argv[1], sys.argv[2]
img = cv2.imread(src)
m = np.zeros(img.shape[:2], np.uint8)
cv2.rectangle(m, (922, 191), (1143, 268), 255, -1)      # "Live Coverage" label
cv2.rectangle(m, (1138, 222), (1210, 233), 255, -1)     # its connector + dot
cv2.rectangle(m, (1452, 479), (1634, 563), 255, -1)     # "Potential Blind Spot" label
cv2.rectangle(m, (1396, 516), (1460, 527), 255, -1)     # its connector
res = cv2.inpaint(img, m, 11, cv2.INPAINT_TELEA)
cv2.imwrite(out, res, [cv2.IMWRITE_PNG_COMPRESSION, 3])
# Replace the stone-wall smear with real wall texture from directly above it.
patch = res[566:650, 1452:1634].copy()
mask = np.full(patch.shape[:2], 255, np.uint8)
res = cv2.seamlessClone(patch, res, mask, ((1452 + 1634) // 2, (479 + 563) // 2), cv2.NORMAL_CLONE)
cv2.imwrite(out, res, [cv2.IMWRITE_PNG_COMPRESSION, 3])
