from PIL import Image, ImageOps
import base64, io, os, re, json

SRC = "/root/.claude/uploads/14d8f5d8-80fd-56d2-8b4e-bc98acc6c7d5"
FILES = {
 "5699":"791a7c17-IMG_5699.jpeg","5700":"930006ba-IMG_5700.jpeg","5701":"fa6fb950-IMG_5701.jpeg",
 "5703":"961661e0-IMG_5703.jpeg","5704":"0828d598-IMG_5704.jpeg","5705":"12e184f8-IMG_5705.jpeg",
 "5706":"6d218256-IMG_5706.jpeg","5707":"9e694093-IMG_5707.jpeg","5708":"0efcf959-IMG_5708.jpeg",
 "5709":"43517701-IMG_5709.jpeg","5710":"3fb890c2-IMG_5710.jpeg","5711":"55ea9319-IMG_5711.jpeg",
 "5712":"c57d8987-IMG_5712.jpeg",
}
os.makedirs("design-reference/photos", exist_ok=True)
B64 = {}
for k, fn in FILES.items():
    im = ImageOps.exif_transpose(Image.open(os.path.join(SRC, fn))).convert("RGB")
    full = im.copy(); full.thumbnail((1200,1200), Image.LANCZOS)
    full.save(f"design-reference/photos/IMG_{k}.jpg", "JPEG", quality=80, optimize=True)
    enc = im.copy(); enc.thumbnail((760,760), Image.LANCZOS)
    buf = io.BytesIO(); enc.save(buf, "JPEG", quality=70, optimize=True)
    B64[k] = "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode()

# ---- the 12-plant collection (best-effort IDs; provisional where uncertain) ----
# group class + label; av = mom/you
P = [
 # key,  name,            latin,                              gclass,     glabel,   size,    pills,                                  av,  who,        prov, babies
 ("5706","Medusa (dark)", "Tillandsia caput-medusae",        "t-bulbous","Bulbous","28cm·L","<span class='pill'>💧 mist 3d</span><span class='pill'>📏 28cm·L</span>","you","You · 5d", False, False),
 ("5707","Dark octopus",  "Tillandsia caput-medusae",        "t-bulbous","Bulbous","24cm·L","<span class='pill'>💧 mist 3d</span><span class='pill'>📏 24cm·L</span>","you","You · 5d", True,  False),
 ("5700","Green octopus", "Tillandsia bulbosa",              "t-bulbous","Bulbous","20cm·M","<span class='pill'>💧 mist 3d</span><span class='pill'>📏 20cm·M</span>","mom","Mom · 3d", False, False),
 ("5705","Green bulb",    "Tillandsia bulbosa",              "t-bulbous","Bulbous","18cm·M","<span class='pill'>💧 mist 3d</span><span class='pill'>📏 18cm·M</span>","mom","Mom · 3d", True,  False),
 ("5711","Fuzzy frost",   "Tillandsia pruinosa",             "t-xeric",  "Xeric",  "12cm·S","<span class='pill warn'>💧 mist due</span><span class='pill'>📏 12cm·S</span>","you","You · today", False, False),
 ("5701","Blushing rosette","Tillandsia ionantha",           "t-rosette","Rosette","8cm·S", "<span class='pill'>💧 soak 7d</span><span class='pill'>🌸 blush</span>","mom","Mom · 2d", False, False),
 ("5709","Red-tip rosette","Tillandsia ionantha",            "t-rosette","Rosette","8cm·S", "<span class='pill'>💧 soak 7d</span><span class='pill'>📏 8cm·S</span>","mom","Mom · 2d", True,  False),
 ("5699","Curly green",   "Tillandsia ionantha / stricta",   "t-rosette","Rosette","12cm·M","<span class='pill'>💧 soak 7d</span><span class='pill'>📏 12cm·M</span>","you","You · 1d", True,  False),
 ("5704","Curly fuzzy",   "Tillandsia stricta",              "t-rosette","Rosette","11cm·M","<span class='pill'>💧 soak 7d</span><span class='pill'>📏 11cm·M</span>","you","You · 1d", True,  False),
 ("5703","Grassy tuft",   "Tillandsia tenuifolia",           "t-wispy",  "Wispy",  "14cm·M","<span class='pill'>💧 dunk 5d</span><span class='pill'>📏 14cm·M</span>","mom","Mom · 4d", True,  False),
 ("5712","Wispy grass",   "Tillandsia tenuifolia / juncea",  "t-wispy",  "Wispy",  "16cm·M","<span class='pill'>💧 dunk 5d</span><span class='pill'>📏 16cm·M</span>","mom","Mom · 4d", True,  False),
 ("5708","Mama + babies", "Tillandsia ionantha (clump)",     "t-rosette","Rosette","—",     "<span class='pill warn'>👶 pups</span><span class='pill'>💧 soak 7d</span>","you","You · today", False, True),
]

def card(p, onclick="openDetail()"):
    key,name,latin,gc,gl,size,pills,av,who,prov,babies = p
    prov_html = "<span class='prov'>? provisional</span>" if prov else ""
    baby_html = "<span class='prov' style='left:auto;right:50px;color:#2c5c3b;background:#e2f0df'>👶 has pups</span>" if babies else ""
    return (f"<button class=\"card\" onclick=\"{onclick}\">{prov_html}{baby_html}"
            f"<span class=\"heart\">🤍</span>"
            f"<div class=\"photo\" style=\"background-image:url('{B64[key]}')\"><div class=\"cap\">{name}</div></div>"
            f"<div class=\"meta\"><span class=\"gtag {gc}\">{gl}</span>"
            f"<div class=\"pills\">{pills}</div>"
            f"<div class=\"by\"><span class=\"av av-{av}\">{'👩' if av=='mom' else '🙋'}</span>{who}</div></div></button>")

plants_grid = "\n      ".join(card(p) for p in P)
# album: a curated 6 (blooms + favourites)
album_keys = ["5701","5706","5708","5705","5711","5712"]
album_grid = "\n      ".join(card(next(x for x in P if x[0]==k)) for k in album_keys)

with open("design-reference/prototype.html", encoding="utf-8") as f:
    html = f.read()

# 1) CSS: real-image backgrounds + wispy tag
html = html.replace(
 ".t-bulbous{background:var(--bulbous)}.t-rosette{background:var(--rosette)}.t-xeric{background:var(--xeric)}",
 ".t-bulbous{background:var(--bulbous)}.t-rosette{background:var(--rosette)}.t-xeric{background:var(--xeric)}.t-wispy{background:var(--wispy)}\n"
 "  .photo,.hero,.pdot,.ph,.ri,.uphoto{background-size:cover;background-position:center;background-repeat:no-repeat}")

# 2) Replace PLANTS grid (lines between the plants <div class="grid"> ... </div>)
def replace_block(html, start_marker, new_inner):
    i = html.index(start_marker)
    j = html.index('<div class="grid">', i) + len('<div class="grid">')
    depth = 1; k = j
    while depth:
        nxt_open = html.find('<div', k); nxt_close = html.find('</div>', k)
        if nxt_close == -1: break
        if nxt_open != -1 and nxt_open < nxt_close:
            depth += 1; k = nxt_open + 4
        else:
            depth -= 1; k = nxt_close + 6
    return html[:j] + "\n      " + new_inner + "\n    " + html[k-6:]

html = replace_block(html, 'id="plants"', plants_grid)
html = replace_block(html, 'id="album"', album_grid)

# 3) Header counts
html = html.replace('Friday · 6 plants · 2 need water','Friday · 12 plants · 2 need water')
html = html.replace('<div class="sub">6 in your collection</div>','<div class="sub">12 in your collection</div>')
html = html.replace('<div class="sub">Mom + me · 24 photos</div>','<div class="sub">Mom + me · 13 photos</div>')

# 4) Home task pdots -> real thumbnails
html = html.replace('<div class="pdot g3">🧅</div>', f'<div class="pdot" style="background-image:url(\'{B64["5711"]}\')"></div>')
html = html.replace('<div class="pdot g4">🌿</div>', f'<div class="pdot" style="background-image:url(\'{B64["5701"]}\')"></div>')
html = html.replace('<div class="pdot g1">🐙</div>', f'<div class="pdot" style="background-image:url(\'{B64["5700"]}\')"></div>')
# task labels -> real names
html = html.replace('Mist — Fuzzy purple','Mist — Fuzzy frost').replace('Soak 20 min — Soft rosettes','Soak 20 min — Blushing rosette').replace('Mist — Blushing octopus','Mist — Green octopus')

# 5) Home activity strip
acts = [("5701","👩 Mom · 2d"),("5708","🙋 You · today"),("5711","🙋 You · today"),("5706","🙋 You · 5d")]
act_html = "".join(f'<div class="act"><div class="ph" style="background-image:url(\'{B64[k]}\')"></div><div class="who">{w}</div></div>' for k,w in acts)
html = re.sub(r'<div class="activity">.*?</div>\s*</section>', f'<div class="activity">\n      {act_html}\n    </div>\n  </section>', html, count=1, flags=re.S)

# 6) Detail hero + add uphoto -> real photo (pruinosa "Fuzzy frost" = 5711)
html = html.replace('<div class="hero g3"><div class="em">🧅</div><div><h2>Fuzzy purple</h2><div class="latin">Tillandsia pruinosa · Sw.</div></div></div>',
 f'<div class="hero" style="background-image:url(\'{B64["5711"]}\')"><div><h2>Fuzzy frost</h2><div class="latin">Tillandsia pruinosa · Sw.</div></div></div>')
html = html.replace('<div class="uphoto g3"><div class="em">🧅</div></div>',
 f'<div class="uphoto" style="background-image:url(\'{B64["5711"]}\')"></div>')
# care-sheet rows in MORE: give them real thumbnails
html = html.replace('<div class="ri g1">🧅</div>', f'<div class="ri" style="background-image:url(\'{B64["5700"]}\')"></div>')
html = html.replace('<div class="ri g6">🐍</div>', f'<div class="ri" style="background-image:url(\'{B64["5706"]}\')"></div>')
html = html.replace('<div class="ri g3">🧊</div>', f'<div class="ri" style="background-image:url(\'{B64["5711"]}\')"></div>')
html = html.replace('<div class="ri g4">🌿</div>', f'<div class="ri" style="background-image:url(\'{B64["5701"]}\')"></div>')

with open("design-reference/prototype.html","w",encoding="utf-8") as f:
    f.write(html)

print("prototype.html bytes:", len(html))
print("photos saved:", len(os.listdir("design-reference/photos")))
print("grid cards (should be 12):", html.count('class="card"', html.index('id="plants"'), html.index('id="album"')))
