# campaign characters redrawn in the flat portrait style used by the arena and the «East»/«Café» packs: pt55–pt61
import json
exec(open('/home/claude/nardy/tools/gen_pt_cafe.py').read().split("P={}")[0])
P={}
# 1 — Uncle Tolik: flat cap, grey moustache, cardigan, a watermelon slice
sk='#e2b08c'; neck,head=face(sk,brow='#9a948a',bw=7)
P['pt55']=svg(55,'#7fa36a','#3f5a34', neck+'<path d="M30 280 C38 222 88 202 140 202 C192 202 242 222 250 280Z" fill="#8a6a4a"/><path d="M118 206 L140 250 L162 206" fill="#d8cfc0"/><circle cx="132" cy="236" r="3" fill="#5a4030"/><circle cx="132" cy="256" r="3" fill="#5a4030"/>'
 +head+'<path d="M116 160 Q140 150 164 160 Q156 170 140 166 Q124 170 116 160Z" fill="#c9c3b8"/>'+smile+'<path d="M84 122 Q80 100 94 92" stroke="#c9c3b8" stroke-width="7" fill="none"/><path d="M196 122 Q200 100 186 92" stroke="#c9c3b8" stroke-width="7" fill="none"/>'
 '<path d="M76 100 Q80 54 140 52 Q196 54 204 100 Q140 84 76 100Z" fill="#5a5048"/><path d="M76 100 Q60 108 64 116 Q140 96 206 104 L204 100Z" fill="#48403a"/>'
 '<g transform="translate(212 226)"><path d="M-26 0 A26 26 0 0 0 26 0Z" fill="#7fa36a"/><path d="M-21 0 A21 21 0 0 0 21 0Z" fill="#e0564a"/><g fill="#2a1a14"><circle cx="-8" cy="7" r="2"/><circle cx="0" cy="12" r="2"/><circle cx="8" cy="7" r="2"/></g></g>')
# 2 — Oksana Ihorivna: a neat bun, glasses on a chain, a chessboard scarf
sk='#efc8a6'; neck,head=face(sk,brow='#5a4030')
P['pt56']=svg(56,'#c7ccd6','#6a7080', '<circle cx="140" cy="44" r="22" fill="#6a5040"/>'+neck+'<path d="M30 280 C38 222 88 202 140 202 C192 202 242 222 250 280Z" fill="#3a3a48"/>'
 '<g transform="translate(96 206)"><rect width="88" height="22" fill="#f4efe6"/><g fill="#24242c"><rect width="11" height="11"/><rect x="22" width="11" height="11"/><rect x="44" width="11" height="11"/><rect x="66" width="11" height="11"/><rect x="11" y="11" width="11" height="11"/><rect x="33" y="11" width="11" height="11"/><rect x="55" y="11" width="11" height="11"/><rect x="77" y="11" width="11" height="11"/></g></g>'
 +head+'<circle cx="118" cy="126" r="13" fill="none" stroke="#8a7a6a" stroke-width="3"/><circle cx="162" cy="126" r="13" fill="none" stroke="#8a7a6a" stroke-width="3"/><path d="M131 126 H149" stroke="#8a7a6a" stroke-width="3"/><path d="M105 130 Q96 170 104 200" stroke="#c9ced6" stroke-width="2" fill="none" stroke-dasharray="3 3"/>'
 '<path d="M126 170 Q140 176 154 170" stroke="#9a3a3a" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M84 116 Q84 60 140 58 Q196 60 196 116 Q186 84 140 80 Q94 84 84 116Z" fill="#6a5040"/>')
# 3 — Marko the barista: a top knot, short beard, black tee, a tamper
sk='#c98e66'; neck,head=face(sk,brow='#1a120c')
P['pt57']=svg(57,'#a8705a','#4a2a1c', '<circle cx="140" cy="48" r="16" fill="#1a120c"/>'+neck+'<path d="M30 280 C38 222 88 202 140 202 C192 202 242 222 250 280Z" fill="#1c1c22"/><path d="M80 280 L96 218 M200 280 L184 218" stroke="#7a5034" stroke-width="7"/>'
 +head+'<path d="M92 150 Q96 200 140 206 Q184 200 188 150 Q176 176 140 178 Q104 176 92 150Z" fill="#1a120c"/>'+smirk+
 '<path d="M86 112 Q86 64 140 62 Q194 64 194 112 Q180 86 140 84 Q100 86 86 112Z" fill="#1a120c"/>'
 '<g transform="translate(214 226)"><rect x="-6" y="-30" width="12" height="26" rx="5" fill="#2a2a30"/><rect x="-18" y="-6" width="36" height="12" rx="4" fill="#c9ced6"/></g>')
# 4 — Rustam, the hookah lounge host: an embroidered cap, full beard, a waistcoat
sk='#c98e66'; neck,head=face(sk,brow='#120c08',bw=8)
P['pt58']=svg(58,'#2f6f66','#123430', neck+'<path d="M30 280 C38 222 88 202 140 202 C192 202 242 222 250 280Z" fill="#f1e6d0"/><path d="M60 280 C66 236 100 214 122 210 L130 280Z M220 280 C214 236 180 214 158 210 L150 280Z" fill="#6a1e2e"/>'
 +head+'<path d="M90 140 Q92 214 140 220 Q188 214 190 140 Q180 180 140 184 Q100 180 90 140Z" fill="#120c08"/><path d="M124 172 Q140 180 156 172" stroke="#e6b8a0" stroke-width="4" fill="none" stroke-linecap="round"/>'
 '<path d="M90 92 Q92 58 140 56 Q188 58 190 92 Z" fill="#1f5f56"/><path d="M90 92 H190" stroke="#c9ced6" stroke-width="4"/><path d="M104 74 L114 84 L124 74 L134 84 L144 74 L154 84 L164 74 L174 84" stroke="#e7b7b0" stroke-width="3" fill="none"/>'
 '<path d="M206 250 Q210 196 224 176" stroke="#f4efe6" stroke-width="5" fill="none" opacity=".6"/>')
# 5 — Halyna Petrivna, the train conductor: uniform cap, scarf, a ticket punch
sk='#efc8a6'; neck,head=face(sk,brow='#5a3a24')
P['pt59']=svg(59,'#5a7a9a','#24384e', neck+'<path d="M30 280 C38 222 88 202 140 202 C192 202 242 222 250 280Z" fill="#2a3a5a"/><path d="M104 206 Q140 230 176 206 L170 226 Q140 240 110 226Z" fill="#c0453a"/><circle cx="104" cy="252" r="4" fill="#c9ced6"/><circle cx="176" cy="252" r="4" fill="#c9ced6"/>'
 +head+smile+'<circle cx="110" cy="150" r="7" fill="#e9967a" opacity=".35"/><circle cx="170" cy="150" r="7" fill="#e9967a" opacity=".35"/>'
 '<path d="M84 118 Q80 84 98 76 Q92 100 96 120Z M196 118 Q200 84 182 76 Q188 100 184 120Z" fill="#a0522d"/>'
 '<path d="M86 86 Q90 52 140 50 Q190 52 194 86Z" fill="#2a3a5a"/><path d="M78 86 H202 Q200 100 140 100 Q80 100 78 86Z" fill="#1c2a44"/><circle cx="140" cy="68" r="7" fill="#c9ced6"/>')
# 6 — Captain Nugzar: a captain's cap, a white beard, a navy coat with silver buttons
sk='#d9a27a'; neck,head=face(sk,brow='#f4f1ea',bw=8)
P['pt60']=svg(60,'#3f8fb0','#123a52', '<path d="M0 230 Q70 214 140 230 T280 230 V280 H0Z" fill="#2a6f8e" opacity=".5"/>'+neck+'<path d="M30 280 C38 222 88 202 140 202 C192 202 242 222 250 280Z" fill="#1c2a44"/><g fill="#c9ced6"><circle cx="122" cy="236" r="4"/><circle cx="158" cy="236" r="4"/><circle cx="122" cy="260" r="4"/><circle cx="158" cy="260" r="4"/></g>'
 +head+'<path d="M90 140 Q92 214 140 220 Q188 214 190 140 Q180 180 140 184 Q100 180 90 140Z" fill="#f4f1ea"/><path d="M124 172 Q140 180 156 172" stroke="#7a2a22" stroke-width="4" fill="none" stroke-linecap="round"/>'
 '<path d="M82 92 Q84 50 140 48 Q196 50 198 92Z" fill="#f4f1ea"/><path d="M76 92 H204 Q200 106 140 106 Q80 106 76 92Z" fill="#1c2a44"/><path d="M126 66 L140 58 L154 66 L140 76Z" fill="#c9ced6"/>')
# 7 — the Shadow: a deep hood, only the eyes catch the light
P['pt61']=svg(61,'#2a2a3a','#0a0a12', '<path d="M30 280 C38 210 84 186 140 186 C196 186 242 210 250 280Z" fill="#14141c"/>'
 '<path d="M64 200 Q60 60 140 44 Q220 60 216 200 Q190 220 140 220 Q90 220 64 200Z" fill="#1c1c28"/><path d="M90 196 Q86 92 140 82 Q194 92 190 196 Q170 206 140 206 Q110 206 90 196Z" fill="#06060a"/>'
 '<ellipse cx="120" cy="140" rx="9" ry="4" fill="#9fd4c0"/><ellipse cx="160" cy="140" rx="9" ry="4" fill="#9fd4c0"/><ellipse cx="120" cy="140" rx="20" ry="10" fill="#9fd4c0" opacity=".12"/><ellipse cx="160" cy="140" rx="20" ry="10" fill="#9fd4c0" opacity=".12"/>')
json.dump(P,open('/home/claude/gen/pt_camp.json','w'))
html='<html><body style="margin:0;background:#111;display:flex;gap:6px">'+''.join('<div style="width:200px;height:200px">'+v+'</div>' for v in P.values())+'</body></html>'
open('/home/claude/gen/pt_camp.html','w').write(html); print('ok')
