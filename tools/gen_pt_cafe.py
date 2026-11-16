# «Кав'ярня» portrait pack (pt42–pt46), drawn in the same flat style as the other portraits
import json
def face(skin, eye='#2a1d16', brow='#2a1d16', bw=7):
    return (f'<rect x="117" y="172" width="46" height="44" rx="10" fill="{skin}"/><path d="M118 196 Q140 210 162 196 V206 Q140 218 118 206Z" fill="#000" opacity=".12"/>',
            f'<ellipse cx="86" cy="134" rx="11" ry="16" fill="{skin}"/><ellipse cx="194" cy="134" rx="11" ry="16" fill="{skin}"/><ellipse cx="140" cy="128" rx="54" ry="64" fill="{skin}"/>'
            f'<circle cx="118" cy="126" r="5" fill="{eye}"/><circle cx="162" cy="126" r="5" fill="{eye}"/><circle cx="119.5" cy="124.5" r="1.4" fill="#fff"/><circle cx="163.5" cy="124.5" r="1.4" fill="#fff"/>'
            f'<path d="M102 110 Q118 102 130 109" stroke="{brow}" stroke-width="{bw}" stroke-linecap="round" fill="none"/><path d="M150 109 Q162 102 178 110" stroke="{brow}" stroke-width="{bw}" stroke-linecap="round" fill="none"/>'
            '<path d="M140 128 Q134 148 140 152 Q146 154 150 150" stroke="#000" stroke-opacity=".22" stroke-width="4" stroke-linecap="round" fill="none"/>')
def svg(n,g1,g2,body):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 280"><defs><linearGradient id="e{n}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{g1}"/><stop offset="1" stop-color="{g2}"/></linearGradient></defs><rect width="280" height="280" fill="url(#e{n})"/>{body}</svg>'
smile='<path d="M124 168 Q140 180 156 168" stroke="#7a2a22" stroke-width="5" stroke-linecap="round" fill="none"/>'
smirk='<path d="M126 170 Q142 178 158 166" stroke="#7a2a22" stroke-width="5" stroke-linecap="round" fill="none"/>'
P={}
# pt42 — the barista: rust beanie, short beard, chocolate shirt with a cream apron
sk='#e0b08a'; neck,head=face(sk)
P['pt42']=svg(42,'#f1ebe1','#d6cbbb', neck+
 '<path d="M30 280 C38 222 88 202 140 202 C192 202 242 222 250 280Z" fill="#4a2c22"/><path d="M102 214 Q140 226 178 214 L184 280 H96Z" fill="#eadfcc"/><path d="M108 214 L100 280 M172 214 L180 280" stroke="#c9b89c" stroke-width="5"/>'
 +head+'<path d="M90 146 Q92 204 140 212 Q188 204 190 146 Q182 176 140 182 Q98 176 90 146Z" fill="#6b3f26"/>'+smile+
 '<path d="M84 98 Q84 36 140 34 Q196 36 196 98 Z" fill="#b5532f"/><rect x="80" y="88" width="120" height="20" rx="9" fill="#9c4526"/><path d="M96 88 V60 M112 88 V48 M128 88 V40 M144 88 V40 M160 88 V46 M176 88 V58" stroke="#9c4526" stroke-width="4" opacity=".55"/>'
 '<g transform="translate(212 222)"><path d="M-18 -18 H18 L14 22 H-14Z" fill="#f4efe6"/><path d="M18 -8 Q30 -6 28 6 Q26 14 16 12" stroke="#f4efe6" stroke-width="5" fill="none"/><path d="M-10 -16 Q0 -10 10 -16" stroke="#8a5a3c" stroke-width="4" fill="none"/></g>')
# pt43 — matcha and headphones: long dark hair with a claw clip, cream knit, a green cup
sk='#f0c6a0'; neck,head=face(sk,brow='#3a2418',bw=6)
P['pt43']=svg(43,'#4f9a8f','#1f5f5a',
 '<path d="M74 120 Q66 220 92 262 L188 262 Q214 220 206 120 Z" fill="#3a2418"/>'+neck+
 '<path d="M30 280 C38 222 88 202 140 202 C192 202 242 222 250 280Z" fill="#efe6d6"/><path d="M60 250 Q140 236 220 250 M56 266 Q140 252 224 266" stroke="#d9cdb8" stroke-width="5" fill="none"/>'
 +head+smile+'<circle cx="110" cy="150" r="7" fill="#e9967a" opacity=".35"/><circle cx="170" cy="150" r="7" fill="#e9967a" opacity=".35"/>'
 '<path d="M84 112 Q82 46 140 42 Q198 46 196 112 Q176 76 140 74 Q104 76 84 112Z" fill="#3a2418"/>'
 '<path d="M80 130 Q78 52 140 48 Q202 52 200 130" stroke="#f4efe6" stroke-width="9" fill="none"/><rect x="64" y="118" width="24" height="40" rx="11" fill="#f4efe6"/><rect x="192" y="118" width="24" height="40" rx="11" fill="#f4efe6"/>'
 '<g transform="translate(140 40)"><rect x="-16" y="-8" width="32" height="14" rx="5" fill="#c86b5a"/><path d="M-12 -6 V-14 M-4 -6 V-16 M4 -6 V-16 M12 -6 V-14" stroke="#c86b5a" stroke-width="4" stroke-linecap="round"/></g>'
 '<g transform="translate(214 226)"><path d="M-16 -20 H16 L12 22 H-12Z" fill="#fff" opacity=".9"/><path d="M-14 -10 H14 L11 20 H-11Z" fill="#8fbf6a"/><rect x="-17" y="-24" width="34" height="6" rx="3" fill="#e6e1d6"/></g>')
# pt44 — bucket hat: sage hat, small round glasses, moustache, mocha hoodie
sk='#b97a55'; neck,head=face(sk,brow='#1d1410')
P['pt44']=svg(44,'#8a4a6a','#4a2238', neck+
 '<path d="M30 280 C38 222 88 202 140 202 C192 202 242 222 250 280Z" fill="#7a5a48"/><path d="M110 206 Q140 236 170 206" stroke="#5f4436" stroke-width="10" fill="none"/><path d="M126 226 V262 M154 226 V262" stroke="#f1e6d0" stroke-width="4" stroke-linecap="round"/>'
 +head+'<circle cx="118" cy="126" r="15" fill="none" stroke="#1d1410" stroke-width="4"/><circle cx="162" cy="126" r="15" fill="none" stroke="#1d1410" stroke-width="4"/><path d="M133 126 H147" stroke="#1d1410" stroke-width="4"/>'
 '<path d="M114 160 Q140 150 166 160 Q156 168 140 164 Q124 168 114 160Z" fill="#1d1410"/><path d="M128 176 Q140 182 152 176" stroke="#5a2a1e" stroke-width="4" stroke-linecap="round" fill="none"/>'
 '<path d="M66 102 Q140 84 214 102 L206 114 Q140 98 74 114Z" fill="#8fae8b"/><path d="M92 102 Q94 50 140 46 Q186 50 188 102 Q140 92 92 102Z" fill="#a7c3a2"/><path d="M92 92 Q140 82 188 92" stroke="#7d9a79" stroke-width="4" fill="none"/>')
# pt45 — the grandpa: white hair at the sides, round glasses, olive knit vest over a shirt, a newspaper
sk='#e5b99a'; neck,head=face(sk,brow='#f4f1ea',bw=8)
P['pt45']=svg(45,'#9a4630','#4a1a10', neck+
 '<path d="M30 280 C38 222 88 202 140 202 C192 202 242 222 250 280Z" fill="#e9e2d4"/><path d="M60 280 C66 236 100 214 120 210 L140 250 L160 210 C180 214 214 236 220 280Z" fill="#6b7a4a"/><path d="M80 246 H200 M74 262 H206" stroke="#5a6840" stroke-width="4"/>'
 +head+'<circle cx="118" cy="126" r="14" fill="none" stroke="#8a7a6a" stroke-width="3"/><circle cx="162" cy="126" r="14" fill="none" stroke="#8a7a6a" stroke-width="3"/><path d="M132 126 H148" stroke="#8a7a6a" stroke-width="3"/>'
 '<path d="M118 164 Q140 156 162 164" stroke="#f4f1ea" stroke-width="9" stroke-linecap="round" fill="none"/>'+smile+
 '<path d="M84 120 Q78 82 98 70 Q92 98 96 122Z" fill="#f4f1ea"/><path d="M196 120 Q202 82 182 70 Q188 98 184 122Z" fill="#f4f1ea"/><path d="M104 74 Q140 62 176 74" stroke="#f4f1ea" stroke-width="5" stroke-linecap="round" fill="none" opacity=".7"/>'
 '<g transform="translate(206 228) rotate(-8)"><rect x="-26" y="-22" width="52" height="40" rx="3" fill="#f2ede2"/><path d="M-20 -14 H8 M-20 -6 H20 M-20 2 H20 M-20 10 H14" stroke="#9a948a" stroke-width="3"/></g>')
# pt46 — curls: two puffs, silver hoops, a cream turtleneck
sk='#8a5a3c'; neck,head=face(sk,brow='#1a120c')
P['pt46']=svg(46,'#d99a8e','#a85a52',
 '<circle cx="86" cy="56" r="34" fill="#1a120c"/><circle cx="194" cy="56" r="34" fill="#1a120c"/>'+neck+
 '<path d="M30 280 C38 222 88 202 140 202 C192 202 242 222 250 280Z" fill="#efe6d6"/><path d="M108 196 Q140 214 172 196 L176 226 Q140 242 104 226Z" fill="#e3d8c4"/>'
 +head+smile+'<circle cx="86" cy="156" r="10" fill="none" stroke="#c9ced6" stroke-width="3.5"/><circle cx="194" cy="156" r="10" fill="none" stroke="#c9ced6" stroke-width="3.5"/>'
 '<path d="M84 108 Q86 58 140 54 Q194 58 196 108 Q184 82 140 80 Q96 82 84 108Z" fill="#1a120c"/>'
 '<g fill="#1a120c"><circle cx="100" cy="76" r="9"/><circle cx="118" cy="66" r="9"/><circle cx="140" cy="62" r="9"/><circle cx="162" cy="66" r="9"/><circle cx="180" cy="76" r="9"/></g>')
json.dump(P,open('/home/claude/gen/pt_cafe.json','w'))
html='<html><body style="margin:0;background:#111;display:flex;gap:8px">'+''.join(f'<div style="width:280px;height:280px">{v}</div>' for v in P.values())+'</body></html>'
open('/home/claude/gen/pt_cafe.html','w').write(html); print('ok')
