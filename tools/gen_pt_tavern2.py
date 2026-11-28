# «Музики» (pt72–pt76) and «Кухня» (pt77–pt81) portraits for the Tavern, same flat style as the other portraits
import json
def face(skin, eye='#2a1d16', brow='#2a1d16', bw=7):
    return (f'<rect x="117" y="172" width="46" height="44" rx="10" fill="{skin}"/><path d="M118 196 Q140 210 162 196 V206 Q140 218 118 206Z" fill="#000" opacity=".12"/>',
            f'<ellipse cx="86" cy="134" rx="11" ry="16" fill="{skin}"/><ellipse cx="194" cy="134" rx="11" ry="16" fill="{skin}"/><ellipse cx="140" cy="128" rx="54" ry="64" fill="{skin}"/>'
            f'<circle cx="118" cy="126" r="5" fill="{eye}"/><circle cx="162" cy="126" r="5" fill="{eye}"/><circle cx="119.5" cy="124.5" r="1.4" fill="#fff"/><circle cx="163.5" cy="124.5" r="1.4" fill="#fff"/>'
            f'<path d="M102 110 Q118 102 130 109" stroke="{brow}" stroke-width="{bw}" stroke-linecap="round" fill="none"/><path d="M150 109 Q162 102 178 110" stroke="{brow}" stroke-width="{bw}" stroke-linecap="round" fill="none"/>'
            '<path d="M140 128 Q134 148 140 152 Q146 154 150 150" stroke="#000" stroke-opacity=".22" stroke-width="4" stroke-linecap="round" fill="none"/>')
def svg(n,g1,g2,body):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 280"><defs><linearGradient id="y{n}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{g1}"/><stop offset="1" stop-color="{g2}"/></linearGradient></defs><rect width="280" height="280" fill="url(#y{n})"/>{body}</svg>'
smile='<path d="M124 168 Q140 180 156 168" stroke="#7a2a22" stroke-width="5" stroke-linecap="round" fill="none"/>'
open_='<path d="M126 166 Q140 186 154 166Z" fill="#7a2a22"/>'
body=lambda c:f'<path d="M30 280 C38 222 88 202 140 202 C192 202 242 222 250 280Z" fill="{c}"/>'
vysh='<path d="M110 206 L140 226 L170 206" stroke="#c23b3b" stroke-width="6" fill="none"/><path d="M122 214 l6 6 6-6 M146 214 l6 6 6-6" stroke="#1d1410" stroke-width="3" fill="none"/>'
P={}
# — Musicians —
# pt72 piper: straw hat, embroidered shirt, a reed pipe
sk='#eab892'; n,h=face(sk,brow='#6b3f26',bw=6)
P['pt72']=svg(72,'#7fbf8a','#2e6a4c', n+body('#f4efe6')+vysh+h+smile+
 '<ellipse cx="140" cy="92" rx="86" ry="18" fill="#d9b87a"/><path d="M96 90 Q98 46 140 44 Q182 46 184 90Z" fill="#e6c88e"/><rect x="96" y="78" width="88" height="10" fill="#c23b3b"/>'
 '<g transform="translate(176 196) rotate(-38)"><rect x="-6" y="-70" width="12" height="96" rx="5" fill="#a8714b"/><circle cx="0" cy="-50" r="2.5" fill="#3a2214"/><circle cx="0" cy="-36" r="2.5" fill="#3a2214"/><circle cx="0" cy="-22" r="2.5" fill="#3a2214"/></g>')
# pt73 cymbalist: curly hair, waistcoat, two little hammers
sk='#d9a27a'; n,h=face(sk,brow='#1d1410')
P['pt73']=svg(73,'#c08bff','#5a2a8a', n+body('#e9e2d4')+'<path d="M64 280 C70 236 102 214 120 210 L140 250 L160 210 C178 214 210 236 216 280Z" fill="#6a2a3a"/>'+h+smile+
 '<g fill="#2a1a10"><circle cx="96" cy="84" r="16"/><circle cx="118" cy="70" r="17"/><circle cx="142" cy="64" r="17"/><circle cx="166" cy="70" r="17"/><circle cx="186" cy="86" r="16"/><circle cx="90" cy="104" r="12"/><circle cx="192" cy="106" r="12"/></g>'
 '<g stroke="#f4efe6" stroke-width="5" stroke-linecap="round"><path d="M196 250 L230 196"/><path d="M214 256 L246 206"/></g><circle cx="230" cy="196" r="7" fill="#f4efe6"/><circle cx="246" cy="206" r="7" fill="#f4efe6"/>')
# pt74 accordion player: flat cap, moustache, an accordion across the chest
sk='#e5b99a'; n,h=face(sk,brow='#3a2a20')
P['pt74']=svg(74,'#e07a4f','#8a2f1e', n+body('#2a3a5a')+h+
 '<path d="M116 160 Q140 150 164 160 Q154 170 140 166 Q126 170 116 160Z" fill="#3a2a20"/>'+smile+
 '<path d="M82 104 Q86 58 140 54 Q194 58 198 98Z" fill="#5a4a3a"/><path d="M78 102 Q140 88 212 104 L216 114 Q150 102 78 116Z" fill="#4a3a2c"/>'
 '<g transform="translate(140 252)"><rect x="-92" y="-30" width="40" height="56" rx="6" fill="#b0303f"/><rect x="52" y="-30" width="40" height="56" rx="6" fill="#b0303f"/>'
 '<path d="M-52 -26 L-40 24 L-28 -26 L-16 24 L-4 -26 L8 24 L20 -26 L32 24 L44 -26 L52 24" stroke="#f4efe6" stroke-width="4" fill="#2a2226"/>'
 '<g fill="#f4efe6"><circle cx="-80" cy="-14" r="3"/><circle cx="-66" cy="-14" r="3"/><circle cx="-80" cy="0" r="3"/><circle cx="-66" cy="0" r="3"/><circle cx="66" cy="-14" r="3"/><circle cx="80" cy="-14" r="3"/></g></g>')
# pt75 violinist: dark bob, black dress, violin on the shoulder
sk='#f0c6a0'; n,h=face(sk,brow='#1a120c',bw=6)
P['pt75']=svg(75,'#2a2e48','#0e1020', '<path d="M74 120 Q70 196 96 210 L184 210 Q210 196 206 120Z" fill="#1a120c"/>'+n+body('#1a1418')+h+smile+
 '<path d="M84 128 Q80 54 140 50 Q200 54 196 128 Q190 92 162 84 Q140 100 108 84 Q88 96 84 128Z" fill="#1a120c"/>'
 '<g transform="translate(196 214) rotate(-30)"><ellipse cx="0" cy="18" rx="24" ry="30" fill="#a8542f"/><ellipse cx="0" cy="-12" rx="18" ry="20" fill="#a8542f"/><rect x="-4" y="-80" width="8" height="70" fill="#3a2214"/><path d="M-6 6 Q0 0 6 6 M-6 26 Q0 32 6 26" stroke="#3a2214" stroke-width="3" fill="none"/></g>'
 '<path d="M60 250 L240 186" stroke="#e6dccb" stroke-width="3"/>')
# pt76 bandleader: big moustache, red sash, a tambourine
sk='#d9a27a'; n,h=face(sk,brow='#f4f1ea',bw=8)
P['pt76']=svg(76,'#b0303f','#4a0f1a', n+body('#f4efe6')+'<path d="M60 230 L220 270" stroke="#c23b3b" stroke-width="18"/>'+h+
 '<path d="M100 160 Q120 146 140 158 Q160 146 180 160 Q172 176 156 168 Q140 176 124 168 Q108 176 100 160Z" fill="#f4f1ea"/>'+
 '<path d="M86 118 Q80 78 104 66 Q100 96 98 120Z" fill="#f4f1ea"/><path d="M194 118 Q200 78 176 66 Q180 96 182 120Z" fill="#f4f1ea"/>'
 '<path d="M90 82 Q96 36 140 34 Q184 36 190 82Z" fill="#1d1410"/><rect x="86" y="74" width="108" height="14" rx="6" fill="#2a2226"/>'
 '<g transform="translate(214 222)"><circle r="28" fill="#e9d9bf" stroke="#8a5a3a" stroke-width="8"/><g fill="#c9ced6"><circle cx="0" cy="-28" r="5"/><circle cx="24" cy="-14" r="5"/><circle cx="24" cy="14" r="5"/><circle cx="0" cy="28" r="5"/><circle cx="-24" cy="14" r="5"/><circle cx="-24" cy="-14" r="5"/></g></g>')
# — Kitchen —
# pt77 kitchen boy: small chef cap, freckles, a ladle
sk='#f2c9a6'; n,h=face(sk,brow='#b5532f',bw=6)
P['pt77']=svg(77,'#9fc7e8','#4a7aa8', n+body('#f4efe6')+'<path d="M110 206 L140 222 L170 206" stroke="#c9d6e4" stroke-width="6" fill="none"/>'+h+smile+
 '<g fill="#c9845a" opacity=".55"><circle cx="110" cy="146" r="2.5"/><circle cx="118" cy="152" r="2.5"/><circle cx="170" cy="146" r="2.5"/><circle cx="162" cy="152" r="2.5"/></g>'
 '<path d="M96 96 Q92 60 120 64 Q130 44 150 50 Q174 46 182 70 Q192 80 184 96Z" fill="#fff"/><rect x="94" y="88" width="92" height="14" rx="4" fill="#ebe6dc"/>'
 '<g transform="translate(216 230) rotate(20)"><rect x="-4" y="-60" width="8" height="70" rx="3" fill="#c9ced6"/><ellipse cx="0" cy="18" rx="18" ry="12" fill="#c9ced6"/></g>')
# pt78 baker: flour on the cheek, headscarf, a round loaf
sk='#eab892'; n,h=face(sk,brow='#4a2a1a',bw=6)
P['pt78']=svg(78,'#e8c4a0','#b07a4a', n+body('#c86b5a')+'<path d="M96 214 Q140 230 184 214 L188 280 H92Z" fill="#f4efe6"/>'+h+smile+
 '<ellipse cx="112" cy="150" rx="12" ry="7" fill="#fff" opacity=".6"/>'
 '<path d="M82 112 Q78 56 140 50 Q202 56 198 112 Q186 84 140 82 Q94 84 82 112Z" fill="#6fa8a0"/><path d="M190 90 Q214 80 222 96 Q206 104 196 100Z" fill="#6fa8a0"/>'
 '<g transform="translate(218 236)"><ellipse rx="30" ry="22" fill="#b5652f"/><path d="M-16 -10 Q-8 -2 -14 10 M0 -14 Q8 -4 2 12 M16 -10 Q22 0 16 10" stroke="#e8b07a" stroke-width="4" fill="none"/></g>')
# pt79 shashlyk man: bandana, beard, skewer with meat
sk='#c98a62'; n,h=face(sk,brow='#1d1410')
P['pt79']=svg(79,'#5a3a2a','#1e120c', n+body('#3a3e46')+h+
 '<path d="M90 146 Q92 210 140 216 Q188 210 190 146 Q182 178 140 182 Q98 178 90 146Z" fill="#1d1410"/>'+smile+
 '<path d="M84 104 Q84 52 140 50 Q196 52 196 104Z" fill="#b0303f"/><g fill="#f4efe6"><circle cx="108" cy="80" r="4"/><circle cx="130" cy="68" r="4"/><circle cx="154" cy="70" r="4"/><circle cx="176" cy="84" r="4"/></g><path d="M196 96 L222 110 L214 88Z" fill="#b0303f"/>'
 '<g transform="translate(210 230) rotate(-50)"><rect x="-2" y="-70" width="4" height="110" fill="#c9ced6"/><rect x="-11" y="-56" width="22" height="18" rx="5" fill="#8a3a22"/><rect x="-10" y="-34" width="20" height="10" rx="4" fill="#d96a4a"/><rect x="-11" y="-20" width="22" height="18" rx="5" fill="#8a3a22"/></g>')
# pt80 head chef: tall toque, neat moustache, double-breasted jacket
sk='#e5b99a'; n,h=face(sk,brow='#2a1d16')
P['pt80']=svg(80,'#2f7a4f','#123a24', n+body('#f4efe6')+'<g fill="#8a8580"><circle cx="118" cy="232" r="4"/><circle cx="118" cy="256" r="4"/><circle cx="162" cy="232" r="4"/><circle cx="162" cy="256" r="4"/></g><path d="M100 206 L140 220 L180 206" stroke="#c23b3b" stroke-width="7" fill="none"/>'+h+
 '<path d="M118 162 Q130 154 140 160 Q150 154 162 162 Q150 168 140 164 Q130 168 118 162Z" fill="#2a1d16"/>'+smile+
 '<rect x="96" y="44" width="88" height="58" rx="8" fill="#fff"/><circle cx="104" cy="44" r="22" fill="#fff"/><circle cx="140" cy="30" r="26" fill="#fff"/><circle cx="176" cy="44" r="22" fill="#fff"/><rect x="92" y="88" width="96" height="16" rx="4" fill="#ebe6dc"/>')
# pt81 the hostess: braid crown, wreath with ribbons, a pot of borscht
sk='#f0c6a0'; n,h=face(sk,brow='#6b3f26',bw=6)
P['pt81']=svg(81,'#c86b5a','#6a2a22', n+body('#f4efe6')+vysh+h+smile+'<circle cx="108" cy="150" r="8" fill="#e9967a" opacity=".4"/><circle cx="172" cy="150" r="8" fill="#e9967a" opacity=".4"/>'
 '<path d="M84 104 Q84 60 140 58 Q196 60 196 104 Q180 84 140 84 Q100 84 84 104Z" fill="#b5652f"/><path d="M86 90 Q140 62 194 90" stroke="#a8542f" stroke-width="16" fill="none" stroke-linecap="round"/>'
 '<g><circle cx="96" cy="74" r="10" fill="#c23b3b"/><circle cx="118" cy="60" r="10" fill="#e0896f"/><circle cx="140" cy="54" r="11" fill="#c23b3b"/><circle cx="162" cy="60" r="10" fill="#9fc7e8"/><circle cx="184" cy="74" r="10" fill="#c23b3b"/></g>'
 '<path d="M196 96 Q210 150 204 200 M206 96 Q226 150 222 196" stroke="#c23b3b" stroke-width="5" fill="none"/>'
 '<g transform="translate(140 258)"><path d="M-40 -24 H40 L34 22 H-34Z" fill="#3a3e46"/><ellipse cx="0" cy="-24" rx="40" ry="8" fill="#9a2232"/><path d="M-46 -18 H-40 M40 -18 H46" stroke="#3a3e46" stroke-width="6"/></g>')
json.dump(P,open('/home/claude/gen/pt_tv2.json','w'))
html='<html><body style="margin:0;background:#111;display:flex;flex-wrap:wrap;gap:8px;width:1440px">'+''.join(f'<div style="width:280px;height:280px">{v}</div>' for v in P.values())+'</body></html>'
open('/home/claude/gen/pt_tv2.html','w').write(html); print('ok')
