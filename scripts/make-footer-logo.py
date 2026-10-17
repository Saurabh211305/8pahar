"""
Builds the footer logo (light-on-dark) from the official logo file.

  public/images/Final Logo.png  ->  public/brand/logo-footer-{360,720}.webp

The official logo sits on an ivory background with dark lettering. The footer
is dark green, so this script:
  * removes the ivory background (the owl keeps its original colours; areas
    enclosed by the owl's outline stay opaque),
  * turns the dark lettering ("8PAHAR", "INTELLIGENT SECURITY SYSTEMS",
    "WATCHFUL. ALWAYS.") into warm-white using the original glyph pixels as
    the alpha mask, and keeps the terracotta Hindi line and rules in colour.
Nothing is redrawn and the proportions are unchanged; the output is cropped
to the artwork with a small margin.

Run: python3 scripts/make-footer-logo.py   (needs opencv-python + numpy)
"""
import cv2
import numpy as np
from scipy import ndimage

SRC = 'public/images/Final Logo.png'
OUT = 'public/brand/logo-footer-{w}.webp'
IVORY = np.array([234, 241, 245], dtype=np.float32)  # #F5F1EA in BGR

img = cv2.imread(SRC).astype(np.float32)
h, w = img.shape[:2]

# 1. Background model: the ivory has a soft gradient, so estimate it per pixel
#    by inpainting over everything that differs from the corner colour.
corner = img[5, 5]
rough = (np.abs(img - corner).sum(2) > 18).astype(np.uint8)
rough = cv2.dilate(rough, np.ones((15, 15), np.uint8))
small = cv2.resize(img, (w // 4, h // 4))
small_mask = cv2.resize(rough, (w // 4, h // 4), interpolation=cv2.INTER_NEAREST)
bg = cv2.inpaint(small.astype(np.uint8), small_mask, 12, cv2.INPAINT_TELEA)
bg = cv2.GaussianBlur(cv2.resize(bg, (w, h), interpolation=cv2.INTER_CUBIC).astype(np.float32), (0, 0), 6)

diff = np.abs(img - bg).sum(2)

# 2. Split the artwork: lettering block (right, lower) vs owl (everything else).
yy, xx = np.mgrid[0:h, 0:w]
text_zone = (xx >= 585) & (yy >= 460)

# 3. Owl: everything that differs from the background, with enclosed areas
#    (ivory face and ribbon) filled. The original has soft cast shadows under
#    the owl; shadow-toned pixels (mid-light, a little darker than the
#    background) below the body that connect to the outer edge of the mask
#    are removed, so interior shading is kept. Soft 1px edge; original colours.
owl_fg = (diff > 22) & ~text_zone
owl_fg = ndimage.binary_closing(owl_fg, structure=np.ones((5, 5)), iterations=2)
owl_fg = ndimage.binary_fill_holes(owl_fg)
lum = img.mean(2)
bg_lum = bg.mean(2)
# Cast shadows only occur beneath the owl (below y=820 in the source).
shadowish = owl_fg & (lum > bg_lum - 48) & (lum < bg_lum - 3) & (yy > 820)
outside_edge = ndimage.binary_dilation(~owl_fg, structure=np.ones((3, 3))) & owl_fg
s_labels, sn = ndimage.label(shadowish)
touching = np.unique(s_labels[outside_edge & shadowish])
owl_fg &= ~np.isin(s_labels, touching[touching > 0])
owl_fg = ndimage.binary_opening(owl_fg, structure=np.ones((3, 3)))
labels, n = ndimage.label(owl_fg)
sizes = ndimage.sum(owl_fg, labels, range(1, n + 1))
owl_fg = np.isin(labels, 1 + np.where(sizes > 2000)[0])  # drop specks
owl_alpha = cv2.GaussianBlur(owl_fg.astype(np.float32), (0, 0), 0.8)

# 4. Lettering: alpha from how far each pixel is from the background.
#    Neutral (grey/black) ink -> warm white; saturated ink (terracotta) keeps its colour.
ink = np.clip((diff - 12) / 260.0, 0, 1) * text_zone
sat = img.max(2) - img.min(2)
terracotta = (sat > 45) & text_zone
# Un-premultiply to recover the ink colour where it is coloured.
safe = np.maximum(ink, 1e-3)[..., None]
ink_colour = np.clip((img - bg * (1 - safe)) / safe, 0, 255)
TERRACOTTA_LIFT = 0.3  # blend toward ivory so the Hindi line reads on dark green
text_rgb = np.where(terracotta[..., None], ink_colour * (1 - TERRACOTTA_LIFT) + IVORY * TERRACOTTA_LIFT, IVORY)
text_alpha = np.where(terracotta, np.clip((diff - 12) / 160.0, 0, 1), ink) * text_zone

# 5. Compose.
alpha = np.maximum(owl_alpha, text_alpha)
rgb = np.where((owl_alpha >= text_alpha)[..., None], img, text_rgb)
out = np.dstack([rgb, alpha * 255]).astype(np.uint8)

ys, xs = np.where(alpha > 0.02)
pad = 6
out = out[max(ys.min() - pad, 0):ys.max() + pad, max(xs.min() - pad, 0):xs.max() + pad]
print('cropped size', out.shape[1], 'x', out.shape[0])

for width in (360, 720):
    height = round(out.shape[0] * width / out.shape[1])
    resized = cv2.resize(out, (width, height), interpolation=cv2.INTER_AREA)
    cv2.imwrite(OUT.format(w=width), resized, [cv2.IMWRITE_WEBP_QUALITY, 92])
    print('wrote', OUT.format(w=width), width, 'x', height)
