import numpy as np, math
from PIL import Image, ImageDraw, ImageFilter
rng=np.random.default_rng(11)
W,H=3840,760
def layer(col,light,dens,scale,seed,hmin,hmax,lightp):
    r=np.random.default_rng(seed); im=Image.new('RGBA',(W,H),(0,0,0,0)); d=ImageDraw.Draw(im); lights=[]
    x=-40
    while x<W+40:
        kind=r.choice(['house','house','house','dome','minaret','tower'],p=[.3,.2,.15,.17,.1,.08])
        if kind=='house':
            w=int(r.integers(70,180)*scale); h=int(r.integers(hmin,hmax)*scale); y=H-h
            d.rectangle([x,y,x+w,H],fill=col)
            if r.random()<.35: d.rectangle([x+w*.2,y-14*scale,x+w*.8,y],fill=col)
            for wy in range(int(y+18*scale),H-20,int(34*scale)):
                for wx in range(int(x+12*scale),int(x+w-14*scale),int(28*scale)):
                    if r.random()<lightp: lights.append((wx,wy,int(7*scale),int(12*scale)))
            x+=w+int(r.integers(-10,6)*scale)
        elif kind=='dome':
            w=int(r.integers(160,300)*scale); base=int(r.integers(hmin,hmax)*scale); y=H-base
            d.rectangle([x,y,x+w,H],fill=col)
            dw=w*.78; dh=dw*.62; cx=x+w/2
            d.rectangle([cx-dw/2,y-dh*.25,cx+dw/2,y],fill=col)
            d.pieslice([cx-dw/2,y-dh*1.25,cx+dw/2,y+dh*.75-dh*.25],180,360,fill=col)
            d.line([cx,y-dh*1.0,cx,y-dh*1.0-30*scale],fill=col,width=max(2,int(4*scale)))
            cr=10*scale; d.ellipse([cx-cr,y-dh-30*scale-2*cr,cx+cr,y-dh-30*scale],outline=col,width=max(2,int(3*scale)))
            for k in range(3):
                ax=x+w*(.22+.28*k)
                if r.random()<lightp+.2: lights.append((int(ax),int(y+30*scale),int(12*scale),int(22*scale)))
            x+=w+int(r.integers(0,20)*scale)
        elif kind=='minaret':
            w=int(r.integers(26,40)*scale); h=int(r.integers(int(hmax*1.6),int(hmax*2.4))*scale); y=H-h
            d.rectangle([x,y,x+w,H],fill=col)
            d.rectangle([x-8*scale,y+h*.18,x+w+8*scale,y+h*.18+10*scale],fill=col)
            d.polygon([(x-2*scale,y),(x+w+2*scale,y),(x+w/2,y-60*scale)],fill=col)
            d.line([x+w/2,y-60*scale,x+w/2,y-80*scale],fill=col,width=max(2,int(3*scale)))
            if r.random()<.7: lights.append((int(x+w/2-4*scale),int(y+h*.08),int(8*scale),int(14*scale)))
            x+=w+int(r.integers(30,90)*scale)
        else:
            w=int(r.integers(60,100)*scale); h=int(r.integers(int(hmax*1.2),int(hmax*1.7))*scale); y=H-h
            d.rectangle([x,y,x+w,H],fill=col)
            for k in range(0,int(w),int(16*scale)): d.rectangle([x+k,y-12*scale,x+k+8*scale,y],fill=col)
            for wy in range(int(y+30*scale),H-30,int(46*scale)):
                if r.random()<lightp: lights.append((int(x+w/2-5*scale),wy,int(10*scale),int(18*scale)))
            x+=w+int(r.integers(10,40)*scale)
    gl=Image.new('RGBA',(W,H),(0,0,0,0)); g=ImageDraw.Draw(gl); L=ImageDraw.Draw(im)
    for (lx,ly,lw,lh) in lights:
        c=light[r.integers(0,len(light))]
        L.rounded_rectangle([lx,ly,lx+lw,ly+lh],radius=lw//2,fill=c)
        g.ellipse([lx-lw*1.5,ly-lh*.6,lx+lw*2.5,ly+lh*1.6],fill=c[:3]+(70,))
    gl=gl.filter(ImageFilter.GaussianBlur(10*scale))
    return Image.alpha_composite(gl,im) if False else Image.alpha_composite(im,gl)
far=layer((24,30,48,255),[(150,90,80,255),(120,80,90,255)],1,.75,5,120,260,.12)
near=layer((10,13,22,255),[(229,120,80,255),(217,101,74,255),(240,150,110,255)],1,1.0,9,140,300,.28)
haze=Image.new('RGBA',(W,H),(0,0,0,0)); hd=ImageDraw.Draw(haze)
for i in range(120): hd.rectangle([0,H-300+i*2.5,W,H-300+(i+1)*2.5],fill=(40,36,52,int(i*0.9)))
out=Image.alpha_composite(far,haze); out=Image.alpha_composite(out,near)
out.save('city.webp',quality=86); out.resize((1280,253)).save('city_prev.png')
# sky
SW,SH=2560,1440; y=np.linspace(0,1,SH)[:,None]
top=np.array([12,17,32]); mid=np.array([22,28,46]); bot=np.array([46,42,58])
c=np.where(y<.6, top+(mid-top)*(y/.6), mid+(bot-mid)*((y-.6)/.4))
sky=np.repeat(c[:,None,:],SW,axis=1).reshape(SH,SW,3).astype(float)
def pn(h,w,s,seed):
    r=np.random.default_rng(seed); n=r.standard_normal((h,w)); F=np.fft.fft2(n); fy=np.fft.fftfreq(h)[:,None]; fx=np.fft.fftfreq(w)[None,:]
    n=np.real(np.fft.ifft2(F*np.exp(-((fx*s*2.2)**2+(fy*s*.8)**2)))); return (n-n.mean())/n.std()
cl=pn(SH//4,SW//4,30,3); cl=np.array(Image.fromarray(((cl-cl.min())/(cl.max()-cl.min())*255).astype('uint8')).resize((SW,SH),Image.BICUBIC))/255.
cl=np.clip((cl-.55)*3,0,1)*(1-np.abs(y-.42)*1.6).clip(0,1)
sky=sky*(1-cl[...,None]*.35)+cl[...,None]*np.array([70,72,92])*.35
# moon glow
mx,my=int(SW*.78),int(SH*.2); yy,xx=np.mgrid[0:SH,0:SW]; dd=np.sqrt((xx-mx)**2+(yy-my)**2)
glow=np.exp(-dd/260)*.35; sky+=glow[...,None]*np.array([200,200,215])
moon=dd<70; shade=np.clip(1-((xx-mx+25)**2+(yy-my-15)**2)**.5/90,0,1)
mc=np.array([238,233,220])*(1-.12*shade[...,None]); sky[moon]=mc[moon]
sky=np.clip(sky,0,255).astype('uint8'); Image.fromarray(sky).save('sky.webp',quality=82); Image.fromarray(sky).resize((640,360)).save('sky_prev.png')
print('ok')
