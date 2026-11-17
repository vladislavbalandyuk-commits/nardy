# «Zodiac» case (0.94): 12 plain portraits (zc1–zc12) and 12 epic ones (ze1–ze12) in the same flat style as the other portraits.
# Epic ones sit on a night sky with their real constellation drawn in silver, a silver ring, rim light and a richer outfit.
import json,math
def face(skin, eye='#2a1d16', brow='#2a1d16', bw=7, blush=False):
    neck=(f'<rect x="117" y="172" width="46" height="44" rx="10" fill="{skin}"/><path d="M118 196 Q140 210 162 196 V206 Q140 218 118 206Z" fill="#000" opacity=".12"/>')
    head=(f'<ellipse cx="86" cy="134" rx="11" ry="16" fill="{skin}"/><ellipse cx="194" cy="134" rx="11" ry="16" fill="{skin}"/><ellipse cx="140" cy="128" rx="54" ry="64" fill="{skin}"/>'
          f'<circle cx="118" cy="126" r="5" fill="{eye}"/><circle cx="162" cy="126" r="5" fill="{eye}"/><circle cx="119.5" cy="124.5" r="1.4" fill="#fff"/><circle cx="163.5" cy="124.5" r="1.4" fill="#fff"/>'
          f'<path d="M102 110 Q118 102 130 109" stroke="{brow}" stroke-width="{bw}" stroke-linecap="round" fill="none"/><path d="M150 109 Q162 102 178 110" stroke="{brow}" stroke-width="{bw}" stroke-linecap="round" fill="none"/>'
          '<path d="M140 128 Q134 148 140 152 Q146 154 150 150" stroke="#000" stroke-opacity=".22" stroke-width="4" stroke-linecap="round" fill="none"/>')
    if blush: head+='<circle cx="110" cy="150" r="7" fill="#e9967a" opacity=".35"/><circle cx="170" cy="150" r="7" fill="#e9967a" opacity=".35"/>'
    return neck,head
SMILE='<path d="M124 168 Q140 180 156 168" stroke="#7a2a22" stroke-width="5" stroke-linecap="round" fill="none"/>'
SMIRK='<path d="M126 170 Q142 178 158 166" stroke="#7a2a22" stroke-width="5" stroke-linecap="round" fill="none"/>'
CALM='<path d="M128 170 Q140 174 152 170" stroke="#7a2a22" stroke-width="5" stroke-linecap="round" fill="none"/>'
def body(c, extra=''): return f'<path d="M30 280 C38 222 88 202 140 202 C192 202 242 222 250 280Z" fill="{c}"/>'+extra
# constellations: stars (x,y) in a 280 box and the lines between them
CON={
 1:([(40,70),(70,52),(104,46),(122,58)],[(0,1),(1,2),(2,3)]),
 2:([(30,40),(58,70),(78,86),(96,74),(120,40),(70,100)],[(0,1),(1,2),(2,3),(3,4),(2,5)]),
 3:([(36,30),(44,70),(52,110),(80,24),(88,64),(96,104),(44,70),(88,64)],[(0,1),(1,2),(3,4),(4,5),(6,7)]),
 4:([(70,30),(70,62),(46,96),(96,98),(70,62)],[(0,1),(1,2),(1,3)]),
 5:([(40,40),(56,28),(76,34),(80,56),(66,72),(110,82),(140,70),(116,54)],[(0,1),(1,2),(2,3),(3,4),(4,5),(5,6),(6,7),(7,3)]),
 6:([(30,30),(56,48),(80,40),(96,64),(122,58),(104,90),(70,84)],[(0,1),(1,2),(2,3),(3,4),(3,5),(5,6)]),
 7:([(60,30),(40,70),(92,66),(66,104),(120,96)],[(0,1),(0,2),(1,3),(2,3),(2,4)]),
 8:([(30,30),(44,44),(58,62),(66,86),(84,104),(108,110),(126,98),(132,78),(122,66)],[(0,1),(1,2),(2,3),(3,4),(4,5),(5,6),(6,7),(7,8)]),
 9:([(40,60),(62,44),(88,48),(100,70),(76,86),(50,84),(118,40),(124,92)],[(0,1),(1,2),(2,3),(3,4),(4,5),(5,0),(2,6),(3,7)]),
 10:([(30,40),(60,56),(98,74),(124,52),(118,30),(76,34)],[(0,1),(1,2),(2,3),(3,4),(4,5),(5,0)]),
 11:([(26,50),(48,36),(66,56),(86,40),(104,60),(126,44),(66,88),(96,96)],[(0,1),(1,2),(2,3),(3,4),(4,5),(2,6),(6,7)]),
 12:([(24,96),(48,80),(74,66),(100,60),(126,40),(74,66),(80,40),(70,20),(90,14)],[(0,1),(1,2),(2,3),(3,4),(5,6),(6,7),(7,8)]),
}
def stars(n, ox=0, oy=0, sc=1.0, col='#e8eef7'):
    P,L=CON[n]; P=[(ox+x*sc,oy+y*sc) for x,y in P]
    s=''.join(f'<path d="M{P[a][0]:.1f} {P[a][1]:.1f} L{P[b][0]:.1f} {P[b][1]:.1f}" stroke="{col}" stroke-opacity=".55" stroke-width="1.6"/>' for a,b in L)
    s+=''.join(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{3.4 if i%3==0 else 2.4}" fill="{col}"/><circle cx="{x:.1f}" cy="{y:.1f}" r="7" fill="{col}" opacity=".16"/>' for i,(x,y) in enumerate(P))
    return s
DUST=''.join(f'<circle cx="{(37*i*7)%280}" cy="{(53*i*11)%170}" r="{0.8+(i%3)*0.5}" fill="#fff" opacity="{0.25+(i%4)*0.12}"/>' for i in range(1,34))
def svg(key, g1, g2, inner, epic=False, n=1):
    bg=f'<rect width="280" height="280" fill="url(#g{key})"/>'
    defs=f'<linearGradient id="g{key}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{g1}"/><stop offset="1" stop-color="{g2}"/></linearGradient>'
    if epic:
        defs+=f'<radialGradient id="h{key}" cx=".5" cy=".42" r=".6"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>'
        bg+=DUST+stars(n, 150, 18, .95)+f'<circle cx="140" cy="128" r="118" fill="url(#h{key})"/>'
        inner+='<rect x="7" y="7" width="266" height="266" rx="18" fill="none" stroke="#dfe6ef" stroke-opacity=".7" stroke-width="2.5"/><rect x="13" y="13" width="254" height="254" rx="14" fill="none" stroke="#dfe6ef" stroke-opacity=".25" stroke-width="1"/>'
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 280"><defs>{defs}</defs>{bg}{inner}</svg>'
RIM='<path d="M192 92 Q206 128 192 170" stroke="#fff" stroke-opacity=".35" stroke-width="5" stroke-linecap="round" fill="none"/>'
def sign(n, epic):
    E=epic
    if n==1:  # Aries: curled ram horns, red bomber
        sk='#e9b893'; ne,he=face(sk,brow='#5a2a1a')
        horn=lambda s: f'<g transform="translate({140+s*62} 86) scale({s} 1)"><path d="M0 0 C26 -26 54 -6 44 18 C36 36 12 30 16 12 C20 0 32 6 28 14" stroke="{"#e6dccb" if not E else "#f2eee6"}" stroke-width="13" stroke-linecap="round" fill="none"/>'+('<path d="M6 -6 C26 -22 48 -6 40 14" stroke="#c9bba3" stroke-width="3" fill="none"/>' if E else '')+'</g>'
        hair='<path d="M86 108 Q90 56 140 52 Q190 56 194 108 Q178 80 140 80 Q102 80 86 108Z" fill="#7a2e1a"/>'
        out=body('#b3362a' if not E else '#8e1f2a', '<path d="M110 206 L140 240 L170 206" stroke="#f1e6d6" stroke-width="8" fill="none"/>'+('<path d="M58 250 H222" stroke="#e6dccb" stroke-opacity=".6" stroke-width="4"/>' if E else ''))
        return ('#f3c9a8','#d9775a') if not E else ('#2a0f1a','#0c0a1e'), ne+out+he+hair+horn(1)+horn(-1)+SMIRK+(RIM if E else '')
    if n==2:  # Taurus: short bull horns, nose ring, moss knit
        sk='#c98e66'; ne,he=face(sk,brow='#2a1a10',bw=8)
        horns='<path d="M90 82 Q70 70 66 48 Q84 60 102 70Z" fill="#efe6d6"/><path d="M190 82 Q210 70 214 48 Q196 60 178 70Z" fill="#efe6d6"/>'
        hair='<path d="M88 104 Q92 60 140 58 Q188 60 192 104 Q170 86 140 86 Q110 86 88 104Z" fill="#2a1a10"/>'
        ring='<circle cx="140" cy="158" r="7" fill="none" stroke="#cfd6de" stroke-width="3.5"/>'
        out=body('#5d7a4a' if not E else '#3e5a36','<path d="M60 248 Q140 234 220 248 M56 264 Q140 250 224 264" stroke="#4c6a3c" stroke-width="5" fill="none"/>'+('<circle cx="140" cy="236" r="9" fill="#dfe6ef"/>' if E else ''))
        return ('#d9cfa8','#8a9a6a') if not E else ('#14261e','#0a0f1c'), ne+out+he+hair+horns+ring+CALM+(RIM if E else '')
    if n==3:  # Gemini: half-and-half hair and shirt
        sk='#f0c6a0'; ne,he=face(sk,brow='#3a2418',bw=6,blush=True)
        hair='<path d="M84 112 Q82 50 140 46 L140 80 Q104 80 84 112Z" fill="#2a1d16"/><path d="M196 112 Q198 50 140 46 L140 80 Q176 80 196 112Z" fill="#e9dcc6"/>'
        side='<path d="M84 110 Q74 170 92 214 L104 200 Q92 160 96 120Z" fill="#2a1d16"/><path d="M196 110 Q206 170 188 214 L176 200 Q188 160 184 120Z" fill="#e9dcc6"/>'
        out='<path d="M30 280 C38 222 88 202 140 202 V280Z" fill="#3c5a8a"/><path d="M250 280 C242 222 192 202 140 202 V280Z" fill="#e2d6c2"/>'
        return ('#a9c6e8','#e8d6c6') if not E else ('#101a34','#1a1030'), side+ne+out+he+hair+SMILE+('<path d="M140 46 V280" stroke="#dfe6ef" stroke-opacity=".35" stroke-width="2"/>' if E else '')
    if n==4:  # Cancer: sea-blue, pearl necklace, shell clip
        sk='#f2cdb0'; ne,he=face(sk,brow='#3a2a20',bw=6,blush=True)
        hair='<path d="M78 122 Q70 40 140 38 Q210 40 202 122 Q196 220 176 236 L104 236 Q84 220 78 122Z" fill="#6a4a3a"/>'
        top='<path d="M84 108 Q88 54 140 52 Q192 54 196 108 Q176 74 140 74 Q104 74 84 108Z" fill="#6a4a3a"/>'
        shell='<g transform="translate(184 76)"><path d="M-14 8 Q0 -16 14 8Z" fill="#f4d6cf"/><path d="M-8 6 L-2 -6 M0 6 V-8 M8 6 L2 -6" stroke="#d6a69c" stroke-width="2"/></g>'
        pearls=''.join(f'<circle cx="{140+60*math.sin(a)}" cy="{214+18*math.cos(a)}" r="5" fill="#f4f1ea"/>' for a in [i*0.32-1.28 for i in range(9)])
        out=body('#2f6f8a' if not E else '#1d4a66')
        return ('#bfe3e6','#6fb0c2') if not E else ('#0b2236','#0a0e20'), hair+ne+out+pearls+he+top+shell+SMILE+(RIM if E else '')
    if n==5:  # Leo: big mane, a small crown
        sk='#d9a37a'; ne,he=face(sk,brow='#5a3216',bw=8)
        mane='<g fill="#b8642a">'+''.join(f'<circle cx="{140+78*math.cos(a)}" cy="{124+80*math.sin(a)}" r="26"/>' for a in [i*math.pi/7-math.pi for i in range(15)])+'</g><ellipse cx="140" cy="132" rx="74" ry="86" fill="#b8642a"/>'
        crown='<path d="M108 66 L114 40 L128 56 L140 32 L152 56 L166 40 L172 66Z" fill="'+('#dfe6ef' if E else '#cfd3d8')+'"/>'+('<circle cx="140" cy="46" r="4" fill="#c8325a"/>' if E else '')
        out=body('#6b3a20' if not E else '#4a1f2e','<path d="M104 210 Q140 232 176 210" stroke="#e6d6c0" stroke-width="7" fill="none"/>')
        return ('#f0c79a','#c2703a') if not E else ('#2a1414','#0e0a1c'), mane+ne+out+he+'<path d="M90 100 Q100 70 140 66 Q180 70 190 100 Q160 84 140 86 Q120 84 90 100Z" fill="#b8642a"/>'+crown+SMIRK+(RIM if E else '')
    if n==6:  # Virgo: long braid, wheat in the hair, linen dress
        sk='#f4d2b8'; ne,he=face(sk,brow='#6a4a2a',bw=6,blush=True)
        hair='<path d="M80 120 Q72 44 140 40 Q208 44 200 120 L196 150 Q190 90 140 84 Q90 90 84 150Z" fill="#a7743e"/>'
        braid='<g fill="#a7743e">'+''.join(f'<ellipse cx="{198-i*2}" cy="{160+i*20}" rx="12" ry="12"/>' for i in range(5))+'</g>'
        wheat='<g transform="translate(102 70) rotate(-30)" fill="#e9dcc0">'+''.join(f'<ellipse cx="{-4 if i%2 else 4}" cy="{-i*7}" rx="4" ry="7"/>' for i in range(6))+'<path d="M0 6 V30" stroke="#cdbb93" stroke-width="2"/></g>'
        out=body('#efe6d6' if not E else '#d9d2e4','<path d="M108 206 Q140 222 172 206" stroke="#c9bba3" stroke-width="5" fill="none"/>')
        return ('#d6e2c8','#9ab08a') if not E else ('#1a2230','#0c0a1a'), ne+out+he+hair+braid+wheat+CALM+(RIM if E else '')
    if n==7:  # Libra: sleek bun, scale earrings, pastel blazer
        sk='#e8bfa0'; ne,he=face(sk,brow='#2a1d16',bw=6)
        hair='<path d="M86 112 Q84 54 140 50 Q196 54 194 112 Q176 76 140 76 Q104 76 86 112Z" fill="#2a1d16"/><circle cx="140" cy="44" r="20" fill="#2a1d16"/>'
        ear=lambda x: f'<g transform="translate({x} 152)"><path d="M0 0 V10 M-9 10 H9" stroke="#cfd6de" stroke-width="2.5"/><path d="M-9 10 L-13 20 H-5Z M9 10 L5 20 H13Z" fill="#cfd6de"/></g>'
        out=body('#c9a6c6' if not E else '#7c5e9a','<path d="M120 204 L140 250 L160 204" fill="#f1ece4"/><path d="M120 204 L106 260 M160 204 L174 260" stroke="#b08cae" stroke-width="5"/>')
        return ('#f1dde8','#c6b2d6') if not E else ('#1e1630','#0b0c1c'), ne+out+he+hair+ear(86)+ear(194)+SMILE+(RIM if E else '')
    if n==8:  # Scorpio: dark hood, a stinger curl of hair, burgundy
        sk='#d6a585'; ne,he=face(sk,eye='#1a0f12',brow='#1a0f12',bw=8)
        hood='<path d="M70 150 Q60 40 140 30 Q220 40 210 150 L200 230 Q140 190 80 230Z" fill="#3a1220"/>'
        curl='<path d="M140 52 Q170 30 186 44 Q196 58 180 64 Q170 66 172 56" stroke="#1a0f12" stroke-width="9" stroke-linecap="round" fill="none"/><path d="M172 56 L164 48 L176 46Z" fill="#1a0f12"/>'
        hair='<path d="M92 104 Q96 62 140 60 Q184 62 188 104 Q164 84 140 86 Q116 84 92 104Z" fill="#1a0f12"/>'
        out=body('#5a1426' if not E else '#3a0c1a')
        return ('#b05068','#4a1424') if not E else ('#22060f','#0a0816'), hood+ne+out+he+hair+curl+SMIRK+(RIM if E else '')
    if n==9:  # Sagittarius: feather headband, quiver strap, an arrow
        sk='#b98060'; ne,he=face(sk,brow='#20140c',bw=7)
        hair='<path d="M84 116 Q80 50 140 46 Q200 50 196 116 Q180 82 140 82 Q100 82 84 116Z" fill="#20140c"/><path d="M84 116 Q78 170 96 206 L108 196 Q94 160 96 124Z" fill="#20140c"/>'
        band='<path d="M86 98 Q140 84 194 98" stroke="#2f6a5a" stroke-width="8" fill="none"/><path d="M186 94 Q206 60 200 34 Q190 60 180 92Z" fill="#e9e1d4"/><path d="M190 90 L198 44" stroke="#bfb6a6" stroke-width="2"/>'
        out=body('#8a5a2e' if not E else '#3e4a6a','<path d="M60 230 L210 266" stroke="#4a2e16" stroke-width="9"/>')
        arrow='<g transform="translate(214 214) rotate(-35)"><path d="M0 0 H52" stroke="#e9e1d4" stroke-width="4"/><path d="M52 0 L42 -6 V6Z" fill="#cfd6de"/><path d="M0 0 L-8 -6 M0 0 L-8 6 M6 0 L-2 -6 M6 0 L-2 6" stroke="#2f6a5a" stroke-width="3"/></g>'
        return ('#e8c7a0','#a86a40') if not E else ('#14202e','#0c0a1c'), ne+out+he+hair+band+arrow+SMILE+(RIM if E else '')
    if n==10:  # Capricorn: small goat horns, a trimmed goatee, charcoal coat
        sk='#e2b593'; ne,he=face(sk,brow='#4a4a4a',bw=7)
        horns='<path d="M104 76 Q84 40 98 24 Q102 48 116 70Z" fill="#cfc4b2"/><path d="M176 76 Q196 40 182 24 Q178 48 164 70Z" fill="#cfc4b2"/>'
        hair='<path d="M88 106 Q92 64 140 62 Q188 64 192 106 Q166 86 140 88 Q114 86 88 106Z" fill="#6a6a6a"/>'
        goatee='<path d="M128 176 Q140 210 152 176 Q140 184 128 176Z" fill="#6a6a6a"/>'
        out=body('#3a3c42' if not E else '#2a2c3a','<path d="M110 206 L140 236 L170 206" fill="#e9e2d4"/><path d="M134 222 L140 250 L146 222Z" fill="#2c4a6a"/>')
        return ('#c6ccd6','#7a8494') if not E else ('#151a26','#0a0a16'), ne+out+he+hair+horns+goatee+CALM+(RIM if E else '')
    if n==11:  # Aquarius: wavy blue-tinted hair, a water jug on the shoulder
        sk='#f0c8a8'; ne,he=face(sk,brow='#2a3a5a',bw=6,blush=True)
        hair='<path d="M80 120 Q70 44 140 40 Q210 44 200 120 Q206 160 196 200 Q186 170 190 130 Q170 86 140 84 Q110 86 90 130 Q94 170 84 200 Q74 160 80 120Z" fill="#3a6a9a"/>'
        waves='<path d="M92 84 Q104 74 116 84 T140 84 T164 84 T188 84" stroke="#9cc6e8" stroke-width="4" fill="none"/>'
        jug='<g transform="translate(212 214)"><path d="M-16 -18 Q-22 0 -14 18 H14 Q22 0 16 -18Z" fill="#cfd6de"/><rect x="-10" y="-26" width="20" height="9" rx="3" fill="#b6bec8"/><path d="M-6 -26 Q-24 -40 -40 -20" stroke="#7ab6e2" stroke-width="5" fill="none" stroke-linecap="round"/></g>'
        out=body('#2a4a7a' if not E else '#1c2f5a','<path d="M60 250 Q100 238 140 250 T220 250" stroke="#7ab6e2" stroke-width="4" fill="none"/>')
        return ('#cfe6f4','#7aa8d6') if not E else ('#0b1a34','#0a0a1c'), ne+out+he+hair+waves+jug+SMILE+(RIM if E else '')
    if n==12:  # Pisces: scale collar, two little fish in the hair, sea-green
        sk='#eac3a6'; ne,he=face(sk,brow='#3a2a3a',bw=6,blush=True)
        hair='<path d="M82 118 Q76 46 140 42 Q204 46 198 118 Q182 82 140 80 Q98 82 82 118Z" fill="#4a3a6a"/><path d="M82 116 Q72 180 92 230 L104 222 Q90 170 94 124Z" fill="#4a3a6a"/><path d="M198 116 Q208 180 188 230 L176 222 Q190 170 186 124Z" fill="#4a3a6a"/>'
        fish=lambda x,y,s: f'<g transform="translate({x} {y}) scale({s} 1)"><path d="M-12 0 Q0 -10 12 0 Q0 10 -12 0Z" fill="#9ad6c6"/><path d="M12 0 L20 -7 V7Z" fill="#9ad6c6"/><circle cx="-5" cy="-1" r="1.6" fill="#1a2a3a"/></g>'
        scales='<g fill="none" stroke="#7ac0b0" stroke-width="3">'+''.join(f'<path d="M{x-10} {y} Q{x} {y+12} {x+10} {y}"/>' for y in (220,236,252) for x in range(70,220,20))+'</g>'
        out=body('#2f6a6a' if not E else '#1e4a56')
        return ('#cfeee6','#8ac6c0') if not E else ('#0c2228','#0c0a1e'), ne+out+scales+he+hair+fish(108,74,1)+fish(172,70,-1)+SMILE+(RIM if E else '')
P={}
for n in range(1,13):
    (g1,g2),inner=sign(n,False); P[f'zc{n}']=svg(f'zc{n}',g1,g2,inner)
    (g1,g2),inner=sign(n,True); P[f'ze{n}']=svg(f'ze{n}',g1,g2,inner,epic=True,n=n)
json.dump(P,open('/home/claude/gen/zodiac.json','w'))
html='<html><body style="margin:0;background:#111;display:grid;grid-template-columns:repeat(6,200px);gap:6px">'+''.join(f'<div style="width:200px;height:200px">{P[k]}</div>' for k in [f'zc{i}' for i in range(1,13)]+[f'ze{i}' for i in range(1,13)])+'</body></html>'
open('/home/claude/gen/zodiac.html','w').write(html); print(len(P))
