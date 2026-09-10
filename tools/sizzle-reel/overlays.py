"""Render RGBA overlay PNGs (1280x720) for the JYC Verse sizzle reel.
- hud_XX.png      : static HUD (logo top-left, progress dots bottom-center, url bottom-right)
- lower_XX.png    : animated lower-third card (slides up + fades in)
- intro.png / outro.png : centered title cards
"""
import json, math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H = 1280, 720
GOLD = (255, 197, 49); CYAN = (61, 232, 255); PINK = (255, 79, 184); VIOLET = (168, 85, 255); WHITE = (255, 255, 255)
BLACK = '/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc'
BOLD = '/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'
MED = '/usr/share/fonts/opentype/noto/NotoSansCJK-Medium.ttc'
def F(path, size): return ImageFont.truetype(path, size, index=2)  # index 2 = SC

realms = [json.loads(l) for l in open('/home/user/gen/realms.jsonl')]
COLORS = { 'predict': CYAN, 'arcade': PINK, 'lottery': GOLD, 'fortune': VIOLET, 'sports': (94, 234, 212), 'arena': (255, 122, 69),
           'cards': (255, 143, 219), 'live': (255, 79, 184), 'city': GOLD, 'earn': (120, 255, 180), 'ai': CYAN, 'open': VIOLET }

def glow_text(img, xy, text, font, fill, glow=(255, 197, 49), radius=14, alpha=170, anchor='la'):
    layer = Image.new('RGBA', img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.text(xy, text, font=font, fill=glow + (alpha,), anchor=anchor)
    layer = layer.filter(ImageFilter.GaussianBlur(radius))
    img.alpha_composite(layer)
    ImageDraw.Draw(img).text(xy, text, font=font, fill=fill + (255,), anchor=anchor)

def shadow_text(img, xy, text, font, fill, anchor='la'):
    d = ImageDraw.Draw(img)
    d.text((xy[0] + 2, xy[1] + 3), text, font=font, fill=(0, 0, 0, 160), anchor=anchor)
    d.text(xy, text, font=font, fill=fill + (255,), anchor=anchor)

def glass(img, box, r=26, fill=(14, 7, 32, 150), stroke=(255, 255, 255, 60)):
    layer = Image.new('RGBA', img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.rounded_rectangle(box, r, fill=fill, outline=stroke, width=2)
    img.alpha_composite(layer)

def hud(idx, total=12):
    img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    # logo
    glow_text(img, (44, 34), 'JYC', F(BLACK, 40), GOLD)
    shadow_text(img, (44 + 96, 34), 'Verse', F(BLACK, 40), WHITE)
    shadow_text(img, (44, 84), '鼠族元宇宙 · MOUSE METAVERSE', F(MED, 16), (220, 214, 240))
    # url
    shadow_text(img, (W - 44, H - 40), 'jyc.xnebul.com', F(BOLD, 20), (230, 224, 250), anchor='rs')
    # progress dots
    n = total; gap = 22; r = 5; x0 = W / 2 - (n - 1) * gap / 2; y = H - 44
    d = ImageDraw.Draw(img)
    for i in range(n):
        cx = x0 + i * gap
        if i == idx:
            d.ellipse((cx - r - 3, y - r - 3, cx + r + 3, y + r + 3), fill=GOLD + (90,))
            d.ellipse((cx - r, y - r, cx + r, y + r), fill=GOLD + (255,))
        elif i < idx: d.ellipse((cx - r, y - r, cx + r, y + r), fill=GOLD + (140,))
        else: d.ellipse((cx - r, y - r, cx + r, y + r), fill=(255, 255, 255, 70))
    # top-right counter
    shadow_text(img, (W - 44, 44), f'{idx + 1:02d} / {total}', F(BOLD, 22), (230, 224, 250), anchor='ra')
    return img

def lower(rm):
    img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    c = COLORS.get(rm['id'], GOLD)
    x, y = 44, H - 236
    glass(img, (x, y, x + 660, y + 160))
    # accent bar
    ImageDraw.Draw(img).rounded_rectangle((x, y + 24, x + 6, y + 136), 3, fill=c + (255,))
    glow_text(img, (x + 28, y + 14), rm['no'], F(BLACK, 64), c, glow=c, radius=16, alpha=150)
    shadow_text(img, (x + 122, y + 30), rm['code'], F(BOLD, 18), c)
    shadow_text(img, (x + 122, y + 54), rm['name'], F(BLACK, 44), WHITE)
    shadow_text(img, (x + 122, y + 112), f"守护者 · {rm['g']}", F(BOLD, 20), GOLD)
    # quote bubble to the right
    q = f"“{rm['quote'].replace(',', '，').replace('!', '！')}”"
    qf = F(BOLD, 24)
    tw = ImageDraw.Draw(img).textlength(q, font=qf)
    bx = x + 690; by = y + 46
    glass(img, (bx, by, bx + tw + 48, by + 62), r=31, fill=(14, 7, 32, 190), stroke=(255, 197, 49, 170))
    shadow_text(img, (bx + 24, by + 14), q, qf, (255, 240, 200))
    return img

def intro():
    img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    glow_text(img, (W / 2, 250), 'JYC Verse', F(BLACK, 120), GOLD, radius=28, alpha=200, anchor='mm')
    shadow_text(img, (W / 2, 345), '鼠 族 元 宇 宙', F(BLACK, 48), WHITE, anchor='mm')
    shadow_text(img, (W / 2, 400), 'MOUSE METAVERSE  ·  12 REALMS  ·  ONE TOKEN', F(BOLD, 20), (200, 190, 230), anchor='mm')
    glass(img, (W / 2 - 250, 460, W / 2 + 250, 512), r=26, fill=(255, 197, 49, 30), stroke=(255, 197, 49, 140))
    shadow_text(img, (W / 2, 486), '十二守护鼠 · 十二星域 · 164+ 玩法', F(BOLD, 22), (255, 240, 200), anchor='mm')
    return img

def outro():
    img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    glow_text(img, (W / 2, 200), '一枚 JYC', F(BLACK, 96), GOLD, radius=26, alpha=200, anchor='mm')
    shadow_text(img, (W / 2, 290), '走遍整个娱乐宇宙', F(BLACK, 56), WHITE, anchor='mm')
    stats = [('12', '星域'), ('164+', '玩法'), ('28', '可试玩 Demo'), ('7', '语种')]
    bw = 200; x0 = W / 2 - (len(stats) * bw + (len(stats) - 1) * 18) / 2
    for i, (n, l) in enumerate(stats):
        bx = x0 + i * (bw + 18); by = 360
        glass(img, (bx, by, bx + bw, by + 110))
        glow_text(img, (bx + bw / 2, by + 44), n, F(BLACK, 48), GOLD, radius=12, alpha=120, anchor='mm')
        shadow_text(img, (bx + bw / 2, by + 86), l, F(BOLD, 20), (220, 214, 240), anchor='mm')
    glow_text(img, (W / 2, 556), 'jyc.xnebul.com', F(BLACK, 52), WHITE, glow=CYAN, radius=18, alpha=160, anchor='mm')
    shadow_text(img, (W / 2, 612), 'QuantumPredict 出品 · Web3 娱乐宇宙 · 可验证公平', F(MED, 18), (200, 190, 230), anchor='mm')
    return img

for i, rm in enumerate(realms):
    hud(i).save(f'/home/user/gen/reel/hud_{i:02d}.png')
    lower(rm).save(f'/home/user/gen/reel/lower_{i:02d}.png')
intro().save('/home/user/gen/reel/intro.png')
outro().save('/home/user/gen/reel/outro.png')
print('overlays ok', len(realms))
