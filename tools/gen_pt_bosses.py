# arena bosses redrawn in the same flat style as the «East» and «Café» portraits (one style for every boss): pt48–pt54
import json
exec(open('/home/claude/nardy/tools/gen_pt_cafe.py').read().split("P={}")[0])
P={}
# blocks — the builder: hard hat, hi-vis vest, stern brows
sk='#d9a27a'; neck,head=face(sk,brow='#2a1d16',bw=8)
P['pt48']=svg(48,'#6b7a86','#2f3a44', neck+'<path d="M30 280 C38 222 88 202 140 202 C192 202 242 222 250 280Z" fill="#3c4a56"/><path d="M70 280 L96 214 L116 210 L120 280Z M210 280 L184 214 L164 210 L160 280Z" fill="#e8743a"/><path d="M84 250 H118 M162 250 H196" stroke="#e8e8e8" stroke-width="7"/>'
 +head+'<path d="M124 170 H156" stroke="#7a2a22" stroke-width="5" stroke-linecap="round"/><path d="M78 100 Q80 44 140 42 Q200 44 202 100Z" fill="#e8743a"/><rect x="70" y="94" width="140" height="14" rx="7" fill="#c9602d"/><rect x="134" y="44" width="12" height="52" rx="5" fill="#f08a52"/>')
# sharp — the card sharp: dark hat, thin moustache, a card in hand
sk='#e5b99a'; neck,head=face(sk,brow='#1a1310')
P['pt49']=svg(49,'#3a2a4a','#160f1e', neck+'<path d="M30 280 C38 222 88 202 140 202 C192 202 242 222 250 280Z" fill="#1a1a22"/><path d="M118 204 L140 240 L162 204" fill="#f4efe6"/><path d="M134 214 L140 222 L146 214 L143 232 H137Z" fill="#a8283f"/>'
 +head+'<path d="M118 160 Q130 154 140 160 Q150 154 162 160" stroke="#1a1310" stroke-width="4" fill="none" stroke-linecap="round"/>'+smirk.replace('Q142 178','Q142 174')+'<path d="M60 98 Q140 86 220 98 L212 108 Q140 96 68 108Z" fill="#14141a"/><path d="M92 98 Q94 44 140 40 Q186 44 188 98 Q140 90 92 98Z" fill="#1d1d26"/><path d="M92 86 Q140 78 188 86" stroke="#a8283f" stroke-width="7"/>'
 '<g transform="translate(212 220) rotate(14)"><rect x="-18" y="-26" width="36" height="50" rx="5" fill="#fbf7ee"/><text x="0" y="8" text-anchor="middle" font-size="24" font-family="Georgia" fill="#a8283f">A</text></g>')
# mirror — glasses with a mirror sheen, neat parting
sk='#efc8a6'; neck,head=face(sk,brow='#5a3a24')
P['pt50']=svg(50,'#9fd4c0','#3f7f72', neck+'<path d="M30 280 C38 222 88 202 140 202 C192 202 242 222 250 280Z" fill="#e9eef0"/><path d="M110 206 Q140 222 170 206" stroke="#c9d1d4" stroke-width="6" fill="none"/>'
 +head+'<rect x="100" y="114" width="34" height="24" rx="10" fill="#cfe9f0" stroke="#5a6a70" stroke-width="3"/><rect x="146" y="114" width="34" height="24" rx="10" fill="#cfe9f0" stroke="#5a6a70" stroke-width="3"/><path d="M134 124 H146" stroke="#5a6a70" stroke-width="3"/><path d="M106 132 L120 118 M152 132 L166 118" stroke="#fff" stroke-width="3" opacity=".8"/>'+smile+
 '<path d="M84 110 Q80 50 140 46 Q200 50 196 110 Q190 80 160 74 Q120 70 96 86 Q88 96 84 110Z" fill="#5a3a24"/><path d="M150 50 Q146 66 160 74" stroke="#7a5034" stroke-width="4" fill="none"/>')
# storm — wild hair, a lightning-bolt scarf, stormy sky
sk='#d9a27a'; neck,head=face(sk,brow='#2a2030',bw=8)
P['pt51']=svg(51,'#3a4a6a','#141a2a', '<path d="M200 30 L176 86 H196 L170 140 L222 72 H200 L218 30Z" fill="#cfe3f5" opacity=".7"/>'+neck+'<path d="M30 280 C38 222 88 202 140 202 C192 202 242 222 250 280Z" fill="#2a3a5a"/><path d="M100 206 Q140 230 180 206 L176 224 Q140 244 104 224Z" fill="#7fb3d5"/>'
 +head+'<path d="M124 168 Q140 162 156 168" stroke="#7a2a22" stroke-width="5" stroke-linecap="round" fill="none"/>'
 '<path d="M78 120 L66 90 L86 96 L78 62 L104 80 L110 46 L130 70 L146 36 L156 66 L178 44 L182 76 L206 62 L198 94 L216 92 L202 122 Q190 84 140 80 Q92 84 78 120Z" fill="#2a2030"/>')
# sultan — turban with a jewel, trimmed beard, rich robe
sk='#c98e66'; neck,head=face(sk,brow='#1a1310')
P['pt52']=svg(52,'#7a1a2c','#2e0811', neck+'<path d="M30 280 C38 222 88 202 140 202 C192 202 242 222 250 280Z" fill="#8e1f36"/><path d="M116 204 L140 280 L164 204" fill="#f3e6d2"/><path d="M60 250 Q140 230 220 250" stroke="#c9ced6" stroke-width="5" fill="none"/>'
 +head+'<path d="M96 156 Q100 206 140 214 Q180 206 184 156 Q170 182 140 184 Q110 182 96 156Z" fill="#1a1310"/>'+smile+
 '<path d="M76 104 Q72 40 140 36 Q208 40 204 104 Q190 92 140 92 Q90 92 76 104Z" fill="#f3e6d2"/><path d="M80 96 Q140 70 200 96 M84 80 Q140 54 196 80 M92 62 Q140 40 188 62" stroke="#d8c8ad" stroke-width="5" fill="none"/><circle cx="140" cy="74" r="10" fill="#4fb393" stroke="#c9ced6" stroke-width="3"/><path d="M140 64 Q150 40 166 34" stroke="#f4efe6" stroke-width="5" fill="none"/>')
# twin — the same face twice: a small shadow-twin behind, mint sweater
sk='#f0c6a0'; neck,head=face(sk,brow='#3a2418')
twin='<g opacity=".35" transform="translate(-34 -8)">'+face(sk)[1]+'</g>'
P['pt53']=svg(53,'#d9a3b8','#6a3a54', twin+neck+'<path d="M30 280 C38 222 88 202 140 202 C192 202 242 222 250 280Z" fill="#9fd4c0"/><path d="M60 250 H220 M56 266 H224" stroke="#7fbfa8" stroke-width="5"/>'
 +head+smirk+'<path d="M84 112 Q82 46 140 42 Q198 46 196 112 Q170 84 120 82 Q96 84 84 112Z" fill="#3a2418"/>')
# khan — fur hat, long moustache, a heavy coat with a silver clasp
sk='#c98e66'; neck,head=face(sk,brow='#120c08',bw=8)
P['pt54']=svg(54,'#1f3a33','#0b1714', neck+'<path d="M30 280 C38 222 88 202 140 202 C192 202 242 222 250 280Z" fill="#3a2418"/><path d="M60 280 C66 236 100 214 140 210 C180 214 214 236 220 280" stroke="#e9e2d4" stroke-width="16" fill="none"/><circle cx="140" cy="236" r="10" fill="#c9ced6"/>'
 +head+'<path d="M112 160 Q140 150 168 160 Q176 186 186 196 Q170 176 140 168 Q110 176 94 196 Q104 186 112 160Z" fill="#120c08"/><path d="M128 176 Q140 182 152 176" stroke="#5a2a1e" stroke-width="4" fill="none" stroke-linecap="round"/>'
 '<path d="M70 104 Q66 36 140 30 Q214 36 210 104Z" fill="#e9e2d4"/><path d="M70 104 Q140 90 210 104 L210 116 Q140 100 70 116Z" fill="#cfc6b4"/><path d="M110 40 Q140 20 170 40 L160 60 Q140 52 120 60Z" fill="#8e1f36"/>')
json.dump(P,open('/home/claude/gen/pt_boss.json','w'))
html='<html><body style="margin:0;background:#111;display:flex;gap:6px">'+''.join('<div style="width:200px;height:200px">'+v+'</div>' for v in P.values())+'</body></html>'
open('/home/claude/gen/pt_boss.html','w').write(html); print('ok')
