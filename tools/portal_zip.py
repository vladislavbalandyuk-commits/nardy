#!/usr/bin/env python3
# A zip of the built site for a game portal.
#   python3 tools/portal_zip.py crazygames|playgama|gd|itch [GD_GAME_ID]
# Everything the game loads is inside (pictures, fonts, sounds); only the radio streams from the CDN.
# playgama: the Playgama Bridge SDK (LGPL-3.0, unmodified) and its config sit next to index.html.
# gd: the GameDistribution SDK with the game id from the GameDistribution dashboard.
import os, sys, zipfile
portal = sys.argv[1] if len(sys.argv) > 1 else 'crazygames'
gd_id = sys.argv[2] if len(sys.argv) > 2 else 'GD_GAME_ID'
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.makedirs(os.path.join(root, 'dist'), exist_ok=True)
out = os.path.join(root, 'dist', f'nardy-{portal}.zip')
files = ['index.html', 'av.js', 'pt.js', 'en.js', 'ru.js', 'news.js', 'skins.css', 'pages.css', 'qr.js',
         'favicon.svg', 'icon-192.png', 'icon-512.png', 'og.png']
dirs = ['fx', 'sfx', 'snd', 'img', 'tb', 'arena', 'fonts', 'lib']
skip = [os.path.join('snd', 'radio')]  # the radio streams from the CDN (and is off inside portals)
head = f"<script>window.__PORTAL='{portal}'</script>"
extra = {}
if portal == 'playgama':
    head += "<script src=\"playgama-bridge.js\"></script>"
    sdk = os.path.join(root, 'tools', 'vendor', 'playgama-bridge.js')
    extra['playgama-bridge.js'] = open(sdk, 'rb').read()
    extra['playgama-bridge-config.json'] = b'{}\n'
    extra['PLAYGAMA-BRIDGE-LICENSE.txt'] = open(os.path.join(root, 'tools', 'vendor', 'playgama-bridge-LICENSE'), 'rb').read()
elif portal == 'gd':
    head += ("<script>window.GD_OPTIONS={gameId:'" + gd_id + "',onEvent:function(e){try{window.p114Gd&&window.p114Gd(e)}catch(x){}}};</script>"
             "<script async src=\"https://html5.api.gamedistribution.com/main.min.js\"></script>")
n = 0
with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
    for f in files:
        p = os.path.join(root, f)
        if not os.path.exists(p): continue
        if f == 'index.html':
            s = open(p, encoding='utf-8').read().replace('<head>', '<head>' + head, 1)
            z.writestr(f, s)
        else:
            z.write(p, f)
        n += 1
    for d in dirs:
        for dp, _, fs in os.walk(os.path.join(root, d)):
            rel = os.path.relpath(dp, root)
            if any(rel == k or rel.startswith(k + os.sep) for k in skip): continue
            for f in fs:
                full = os.path.join(dp, f); z.write(full, os.path.relpath(full, root)); n += 1
    for k, v in extra.items():
        z.writestr(k, v); n += 1
print(out, n, 'files', round(os.path.getsize(out) / 1e6, 1), 'MB')
