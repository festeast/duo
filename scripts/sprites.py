"""Кейіпкер суреттерін қосымшаға дайындау.

Кіріс:  sprites-src/<кейіпкер>/<көңіл-күй>.png   (көңіл-күй: normal, happy, sad)
Шығыс: public/sprites/<кейіпкер>/<көңіл-күй>.webp  — ақ фоны мөлдір, бос шеттері қиылған
        public/sprites/<кейіпкер>/<көңіл-күй>-face.webp — аватарға арналған бет бөлігі

Іске қосу: python3 scripts/sprites.py
"""
import os
import sys
from collections import deque

from PIL import Image

SRC, OUT = 'sprites-src', 'public/sprites'
HEIGHT = 900      # толық сурет биіктігі
FACE = 256        # аватар өлшемі
TOL = 28          # ақ фонды анықтау шегі
# Аватар қиығы: (ортасы x 0..1 немесе None — автомат, жоғарғы шеті y, өлшемі) — биіктікке қатысты үлес
FACE_BOX = {
    'chef': (None, 0.06, 0.24),
    'smart': (None, 0.0, 0.24),
    'sleepy': (None, 0.0, 0.26),
    'muscle': (0.5, 0.0, 0.2),
    'rocker': (None, 0.0, 0.22),
    'samurai': (None, 0.0, 0.2),
}


def remove_white_bg(img):
    """Шеттен басталатын ақ фонды мөлдір етеді (ақ жүнге тимейді — ол контурмен бөлінген)."""
    img = img.convert('RGBA')
    w, h = img.size
    px = img.load()
    seen = bytearray(w * h)
    q = deque()
    for x in range(w):
        q.append((x, 0)); q.append((x, h - 1))
    for y in range(h):
        q.append((0, y)); q.append((w - 1, y))
    white = lambda p: p[0] > 255 - TOL and p[1] > 255 - TOL and p[2] > 255 - TOL
    while q:
        x, y = q.popleft()
        i = y * w + x
        if seen[i]:
            continue
        seen[i] = 1
        p = px[x, y]
        if not white(p):
            continue
        px[x, y] = (255, 255, 255, 0)
        if x > 0: q.append((x - 1, y))
        if x < w - 1: q.append((x + 1, y))
        if y > 0: q.append((x, y - 1))
        if y < h - 1: q.append((x, y + 1))
    # Жиектегі ақшыл пикселдерді жартылай мөлдір етеміз (тегіс шеті)
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a and min(r, g, b) > 230:
                near = any(0 <= x + dx < w and 0 <= y + dy < h and px[x + dx, y + dy][3] == 0 for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)))
                if near:
                    px[x, y] = (r, g, b, 90)
    return img


def process(src, dst_dir, mood):
    img = remove_white_bg(Image.open(src))
    img = img.crop(img.getbbox())
    w, h = img.size
    full = img.resize((round(w * HEIGHT / h), HEIGHT), Image.LANCZOS)
    os.makedirs(dst_dir, exist_ok=True)
    full.save(f'{dst_dir}/{mood}.webp', 'WEBP', quality=88, method=6)
    # Бет бөлігі: басы тұрған жерден шаршы (кейіпкерге қарай баптауға болады)
    cx, top, size = FACE_BOX.get(os.path.basename(dst_dir), (None, 0.0, 0.24))
    if cx is None:
        # Жоғарғы бөліктегі мөлдір емес пикселдердің ортасы
        a = img.getchannel('A').crop((0, 0, w, round(h * 0.18)))
        xs = [x for x in range(w) for y in range(0, a.size[1], 4) if a.getpixel((x, y)) > 128]
        cx = (sum(xs) / len(xs) / w) if xs else 0.5
    side = round(h * size)
    left = min(max(0, round(w * cx - side / 2)), max(0, w - side))
    y0 = round(h * top)
    face = Image.new('RGBA', (side, side), (0, 0, 0, 0))
    face.alpha_composite(img.crop((left, y0, left + side, y0 + side)))
    face = face.resize((FACE, FACE), Image.LANCZOS)
    face.save(f'{dst_dir}/{mood}-face.webp', 'WEBP', quality=88, method=6)
    return full.size


if __name__ == '__main__':
    src_root = sys.argv[1] if len(sys.argv) > 1 else SRC
    done = []
    for char in sorted(os.listdir(src_root)):
        d = os.path.join(src_root, char)
        if not os.path.isdir(d):
            continue
        for f in sorted(os.listdir(d)):
            mood, ext = os.path.splitext(f)
            if ext.lower() not in ('.png', '.jpg', '.jpeg', '.webp') or mood not in ('normal', 'happy', 'sad'):
                continue
            size = process(os.path.join(d, f), os.path.join(OUT, char), mood)
            done.append(f'{char}/{mood} {size}')
    print('\n'.join(done) or 'сурет табылмады')
