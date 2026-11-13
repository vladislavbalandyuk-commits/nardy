#!/usr/bin/env python3
# 0.72: a zip of the built site for a game portal (CrazyGames by default) — python3 tools/portal_zip.py [crazygames]
import os, sys, zipfile
portal = sys.argv[1] if len(sys.argv) > 1 else 'crazygames'
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.makedirs(os.path.join(root, 'dist'), exist_ok=True)
out = os.path.join(root, 'dist', f'nardy-{portal}.zip')
files = ['index.html', 'av.js', 'pt.js', 'en.js', 'ru.js', 'news.js', 'skins.css', 'qr.js', 'favicon.svg', 'icon-192.png', 'icon-512.png', 'og.png']
dirs = ['fx', 'sfx', 'snd']
with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
    for f in files:
        p = os.path.join(root, f)
        if not os.path.exists(p): continue
        if f == 'index.html':
            s = open(p, encoding='utf-8').read().replace('<head>', f"<head><script>window.__PORTAL='{portal}'</script>", 1)
            z.writestr(f, s)
        else:
            z.write(p, f)
    for d in dirs:
        for dp, _, fs in os.walk(os.path.join(root, d)):
            for f in fs:
                full = os.path.join(dp, f); z.write(full, os.path.relpath(full, root))
print(out, round(os.path.getsize(out) / 1e6, 1), 'MB')
