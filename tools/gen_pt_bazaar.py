# «Базар» portrait pack (pt67–pt71) for the Tavern traders, same flat style as the other portraits
import json
def face(skin, eye='#2a1d16', brow='#2a1d16', bw=7):
    return (f'<rect x="117" y="172" width="46" height="44" rx="10" fill="{skin}"/><path d="M118 196 Q140 210 162 196 V206 Q140 218 118 206Z" fill="#000" opacity=".12"/>',
            f'<ellipse cx="86" cy="134" rx="11" ry="16" fill="{skin}"/><ellipse cx="194" cy="134" rx="11" ry="16" fill="{skin}"/><ellipse cx="140" cy="128" rx="54" ry="64" fill="{skin}"/>'
            f'<circle cx="118" cy="126" r="5" fill="{eye}"/><circle cx="162" cy="126" r="5" fill="{eye}"/><circle cx="119.5" cy="124.5" r="1.4" fill="#fff"/><circle cx="163.5" cy="124.5" r="1.4" fill="#fff"/>'
            f'<path d="M102 110 Q118 102 130 109" stroke="{brow}" stroke-width="{bw}" stroke-linecap="round" fill="none"/><path d="M150 109 Q162 102 178 110" stroke="{brow}" stroke-width="{bw}" stroke-linecap="round" fill="none"/>'
            '<path d="M140 128 Q134 148 140 152 Q146 154 150 150" stroke="#000" stroke-opacity=".22" stroke-width="4" stroke-linecap="round" fill="none"/>')
def svg(n,g1,g2,body):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 280"><defs><linearGradient id="z{n}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{g1}"/><stop offset="1" stop-color="{g2}"/></linearGradient></defs><rect width="280" height="280" fill="url(#z{n})"/>{body}</svg>'
smile='<path d="M124 168 Q140 180 156 168" stroke="#7a2a22" stroke-width="5" stroke-linecap="round" fill="none"/>'
smirk='<path d="M126 170 Q142 176 158 164" stroke="#7a2a22" stroke-width="5" stroke-linecap="round" fill="none"/>'
P={}
# pt67 — the reseller: a red flowered headscarf tied under the chin, a paper cone of sunflower seeds
sk='#eab892'; neck,head=face(sk,brow='#4a2a1a',bw=6)
P['pt67']=svg(67,'#3f8f8a','#1d4f55', neck+
 '<path d="M30 280 C38 222 88 202 140 202 C192 202 242 222 250 280Z" fill="#3b4a7a"/><path d="M84 236 Q140 214 196 236" stroke="#2c3860" stroke-width="6" fill="none"/>'
 +head+smile+'<circle cx="108" cy="150" r="8" fill="#e9967a" opacity=".4"/><circle cx="172" cy="150" r="8" fill="#e9967a" opacity=".4"/>'
 '<path d="M72 150 Q60 60 140 44 Q220 60 208 150 Q206 120 196 104 Q170 80 140 80 Q110 80 84 104 Q74 120 72 150Z" fill="#c23b3b"/>'
 '<path d="M72 150 Q78 196 118 206 L140 230 L162 206 Q202 196 208 150 Q204 182 162 196 L140 212 L118 196 Q76 182 72 150Z" fill="#a52f30"/>'
 '<g fill="#f4efe6"><circle cx="104" cy="70" r="6"/><circle cx="140" cy="56" r="6"/><circle cx="176" cy="70" r="6"/><circle cx="84" cy="110" r="5"/><circle cx="196" cy="110" r="5"/></g>'
 '<g fill="#2f7a4f"><circle cx="112" cy="62" r="3"/><circle cx="148" cy="50" r="3"/><circle cx="168" cy="62" r="3"/></g>'
 '<g transform="translate(212 228) rotate(14)"><path d="M-20 -24 L20 -24 L0 26Z" fill="#efe6d6"/><path d="M-20 -24 L20 -24" stroke="#c9b89c" stroke-width="4"/><g fill="#2a1d16"><ellipse cx="-8" cy="-28" rx="3" ry="5"/><ellipse cx="2" cy="-30" rx="3" ry="5"/><ellipse cx="12" cy="-27" rx="3" ry="5"/></g></g>')
# pt68 — the money changer: flat cap, thin moustache, leather jacket, a fan of green banknotes
sk='#d9a27a'; neck,head=face(sk,brow='#1d1410')
P['pt68']=svg(68,'#2e5a3e','#132a1e', neck+
 '<path d="M30 280 C38 222 88 202 140 202 C192 202 242 222 250 280Z" fill="#3a2a22"/><path d="M118 206 L140 246 L162 206" fill="#e9e2d4"/><path d="M96 212 L126 262 M184 212 L154 262" stroke="#4e3a30" stroke-width="8" stroke-linecap="round"/>'
 +head+'<path d="M118 162 Q130 156 140 160 Q150 156 162 162" stroke="#1d1410" stroke-width="5" stroke-linecap="round" fill="none"/>'+smirk+
 '<path d="M80 106 Q84 58 140 54 Q196 58 200 100 Z" fill="#4a4f58"/><path d="M76 104 Q140 88 214 108 L222 118 Q150 104 76 118Z" fill="#3a3e46"/><circle cx="140" cy="58" r="5" fill="#3a3e46"/>'
 '<g transform="translate(212 230)"><g transform="rotate(-24)"><rect x="-14" y="-30" width="28" height="44" rx="3" fill="#6fae7a"/></g><g transform="rotate(-8)"><rect x="-14" y="-32" width="28" height="44" rx="3" fill="#7fbf8a"/></g><g transform="rotate(10)"><rect x="-14" y="-32" width="28" height="44" rx="3" fill="#8fd09a"/><circle cx="0" cy="-10" r="7" fill="none" stroke="#2e6a3c" stroke-width="3"/></g></g>')
# pt69 — the peddler: beanie with a pompom, backpack straps, a tray of little trinkets
sk='#f2c9a6'; neck,head=face(sk,brow='#6b3f26',bw=6)
P['pt69']=svg(69,'#e07a4f','#9c3a26', neck+
 '<path d="M30 280 C38 222 88 202 140 202 C192 202 242 222 250 280Z" fill="#5a7a9a"/><path d="M92 210 V280 M188 210 V280" stroke="#2c2a30" stroke-width="12"/>'
 +head+smile+'<g fill="#c9845a" opacity=".55"><circle cx="110" cy="146" r="2.5"/><circle cx="118" cy="152" r="2.5"/><circle cx="104" cy="154" r="2.5"/><circle cx="170" cy="146" r="2.5"/><circle cx="162" cy="152" r="2.5"/><circle cx="176" cy="154" r="2.5"/></g>'
 '<path d="M86 104 Q86 44 140 42 Q194 44 194 104Z" fill="#2f7a6a"/><rect x="82" y="94" width="116" height="18" rx="8" fill="#256458"/><circle cx="140" cy="36" r="14" fill="#f4efe6"/><path d="M104 94 V58 M122 94 V48 M140 94 V44 M158 94 V48 M176 94 V58" stroke="#256458" stroke-width="4" opacity=".5"/>'
 '<g transform="translate(140 258)"><rect x="-70" y="-14" width="140" height="22" rx="4" fill="#8a5a3a"/><circle cx="-46" cy="-20" r="9" fill="#e0896f"/><rect x="-24" y="-30" width="16" height="18" rx="3" fill="#9fc7e8"/><circle cx="10" cy="-20" r="8" fill="none" stroke="#c9ced6" stroke-width="4"/><path d="M34 -12 L44 -32 L54 -12Z" fill="#c9b6ff"/></g>')
# pt70 — the jeweler: grey hair, a loupe in one eye, waistcoat, a cut gem
sk='#e5b99a'; neck,head=face(sk,brow='#9a948a',bw=7)
P['pt70']=svg(70,'#6a4a8a','#2e1e44', neck+
 '<path d="M30 280 C38 222 88 202 140 202 C192 202 242 222 250 280Z" fill="#efe9dc"/><path d="M62 280 C68 236 102 214 120 210 L140 248 L160 210 C178 214 212 236 218 280Z" fill="#3a2e4a"/><circle cx="140" cy="258" r="3" fill="#c9ced6"/><circle cx="140" cy="272" r="3" fill="#c9ced6"/>'
 +head+'<path d="M120 166 Q140 160 160 166" stroke="#9a948a" stroke-width="7" stroke-linecap="round" fill="none"/>'
 '<circle cx="162" cy="126" r="17" fill="#cfe4f4" opacity=".55" stroke="#2a2a30" stroke-width="6"/><circle cx="162" cy="126" r="7" fill="#2a1d16"/><path d="M178 136 Q196 160 188 200" stroke="#c9ced6" stroke-width="2" fill="none"/>'
 '<path d="M86 116 Q80 70 112 60 Q106 92 100 120Z" fill="#c9c3bb"/><path d="M194 116 Q200 70 168 60 Q174 92 180 120Z" fill="#c9c3bb"/><path d="M108 66 Q140 54 172 66" stroke="#c9c3bb" stroke-width="6" stroke-linecap="round" fill="none"/>'
 '<g transform="translate(214 230)"><path d="M-18 -8 L-10 -20 H10 L18 -8 L0 18Z" fill="#9fe0d6"/><path d="M-18 -8 H18 M-10 -20 L-4 -8 L0 18 M10 -20 L4 -8" stroke="#4fa89a" stroke-width="2" fill="none"/></g>')
# pt71 — the bazaar baroness: tall fur hat, sunglasses, fur collar, red lips, rings
sk='#f0c6a0'; neck,head=face(sk,brow='#2a1a14',bw=6)
P['pt71']=svg(71,'#9a2a3a','#4a0f1a', neck+
 '<path d="M30 280 C38 222 88 202 140 202 C192 202 242 222 250 280Z" fill="#2a1a1e"/>'
 '<g fill="#d9ccbb"><circle cx="70" cy="226" r="22"/><circle cx="98" cy="210" r="22"/><circle cx="126" cy="204" r="20"/><circle cx="154" cy="204" r="20"/><circle cx="182" cy="210" r="22"/><circle cx="210" cy="226" r="22"/></g>'
 +head+'<path d="M126 168 Q140 176 154 168 Q140 162 126 168Z" fill="#c2273a"/>'
 '<rect x="98" y="114" width="36" height="22" rx="9" fill="#1a1014"/><rect x="146" y="114" width="36" height="22" rx="9" fill="#1a1014"/><path d="M134 122 H146" stroke="#1a1014" stroke-width="4"/><path d="M104 118 L114 118" stroke="#fff" stroke-width="3" opacity=".5"/>'
 '<path d="M80 96 Q78 30 140 24 Q202 30 200 96 Q140 80 80 96Z" fill="#6b4a3a"/><path d="M82 92 Q140 76 198 92" stroke="#5a3c2e" stroke-width="6" fill="none"/><path d="M96 60 Q100 40 112 34 M120 50 Q124 32 136 28 M150 30 Q162 34 166 50 M174 40 Q186 46 188 64" stroke="#8a6a58" stroke-width="4" fill="none" stroke-linecap="round"/>'
 '<circle cx="86" cy="156" r="9" fill="none" stroke="#c9ced6" stroke-width="4"/><circle cx="194" cy="156" r="9" fill="none" stroke="#c9ced6" stroke-width="4"/>')
json.dump(P,open('/home/claude/gen/pt_bazaar.json','w'))
html='<html><body style="margin:0;background:#111;display:flex;gap:8px">'+''.join(f'<div style="width:280px;height:280px">{v}</div>' for v in P.values())+'</body></html>'
open('/home/claude/gen/pt_bazaar.html','w').write(html); print('ok')
