"""
Removes the six callout boxes baked into the supplied Section 02 diagnostic
image (brand-source/gaps-property-reference.webp) so the callouts can be real
HTML text. The thin connector lines and coverage overlays are kept.
Requires: pip install opencv-python-headless numpy

  python scripts/clean-gaps-labels.py brand-source/gaps-property-reference.webp out.png

Then resize `out.png` to public/images/gaps-property-{768,1200,1536}.webp.
Box coordinates are in source pixels (1536x1024) and mirror the callout
positions in src/content/site.ts (problems.gaps[].at).
"""
import sys
import cv2
import numpy as np

BOXES = [  # x1, y1, x2, y2 — number badge + label box
    (1320, 290, 1517, 377),  # 01 Blind Spots
    (947, 76, 1176, 169),    # 02 Poor Camera Placement
    (364, 215, 608, 304),    # 03 Missed Events
    (298, 582, 514, 668),    # 04 Unmanaged Access
    (664, 712, 879, 798),    # 05 System Downtime
    (1270, 561, 1498, 648),  # 06 Missed Maintenance
]

src, out = sys.argv[1], sys.argv[2]
img = cv2.imread(src)
mask = np.zeros(img.shape[:2], np.uint8)
for x1, y1, x2, y2 in BOXES:
    # pad for the boxes' soft shadow, which falls mostly below them
    cv2.rectangle(mask, (x1 - 8, y1 - 8), (x2 + 8, y2 + 18), 255, -1)
res = cv2.inpaint(img, mask, 13, cv2.INPAINT_TELEA)
cv2.imwrite(out, res, [cv2.IMWRITE_PNG_COMPRESSION, 3])
