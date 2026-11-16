# two tables for the «Trend 26» collection, generated (no outside images):
#  linen  — a soft off-white linen cloth (2026's «Cloud Dancer» white) in daylight from a window on the left
#  mahog  — a warm mahogany desk under a low lamp, deep reddish-brown grain
import numpy as np
from PIL import Image, ImageFilter
W,H=2560,1440; y,x=np.mgrid[0:H,0:W].astype(float); X=x/W; Y=y/H; R=np.random.default_rng(26)
def blurnoise(sc,bl,seed):
    r=np.random.default_rng(seed); n=r.standard_normal((max(2,H//sc),max(2,W//sc))); n=(n-n.min())/(n.max()-n.min())
    return np.array(Image.fromarray((n*255).astype('uint8')).resize((W,H),Image.BICUBIC).filter(ImageFilter.GaussianBlur(bl)))/255.
# ---- linen
def stretched(hs,ws,bl,seed):
    r=np.random.default_rng(seed); n=r.random((hs,ws)); im=Image.fromarray((n*255).astype('uint8')).resize((W,H),Image.BICUBIC)
    return np.array(im.filter(ImageFilter.GaussianBlur(bl)))/255.
weft=np.sin(x*2*np.pi/9.0)*0.5+0.5; warp=np.sin(y*2*np.pi/9.0)*0.5+0.5
slubx=stretched(H//9,W//90,1,1); sluby=stretched(H//90,W//9,1,2)
thread=(weft*slubx+warp*sluby)/2
wr=blurnoise(16,40,4)
base=np.array([240,229,211]); img=np.zeros((H,W,3))+base
img+=(thread[...,None]-.25)*26
fold=np.sin((X*1.2+Y*0.7+wr*1.4)*7)*0.5+0.5; img*=(0.88+0.12*fold[...,None])
light=np.clip(1.1-0.3*X-0.12*Y,0.65,1.1); img*=light[...,None]
v=np.clip(1-((X-0.5)**2*0.9+(Y-0.5)**2*1.1)*0.9,0.6,1); img*=v[...,None]
img=np.clip(img*0.95,0,255).astype('uint8')
Image.fromarray(img).save('/home/claude/nardy/tb/linen.webp',quality=80)
Image.fromarray(img).resize((960,540)).save('/home/claude/gen/linen_prev.png')
# ---- mahogany
def stretched(hs,ws,bl,seed):
    r=np.random.default_rng(seed); n=r.random((hs,ws)); im=Image.fromarray((n*255).astype('uint8')).resize((W,H),Image.BICUBIC)
    return np.array(im.filter(ImageFilter.GaussianBlur(bl)))/255.
lowx=blurnoise(80,60,7)
u=Y*7+lowx*1.2+0.25*np.sin(X*2.3+1)
rings=(np.sin(u*2*np.pi)*0.5+0.5)**1.6
grain=stretched(H//3,W//160,1.2,11); grain2=stretched(H//10,W//300,2,12)
t=np.clip(0.30+0.38*rings+0.30*(grain-.5)+0.25*(grain2-.5),0,1)[...,None]
dark=np.array([46,16,11]); mid=np.array([118,46,28])
img=dark*(1-t)+mid*t
lamp=np.exp(-(((X-0.5)/0.45)**2+((Y-0.45)/0.4)**2)); img=img*(0.5+0.8*lamp[...,None])+lamp[...,None]*np.array([30,16,6])
sheen=np.exp(-(((X-0.6)/0.3)**2+((Y-0.18)/0.06)**2))*0.18; img+=sheen[...,None]*np.array([255,215,185])
v=np.clip(1-((X-0.5)**2*1.2+(Y-0.45)**2*1.4)*1.3,0.3,1); img*=v[...,None]
img=np.clip(img,0,255).astype('uint8')
Image.fromarray(img).save('/home/claude/nardy/tb/mahog.webp',quality=80)
Image.fromarray(img).resize((960,540)).save('/home/claude/gen/mahog_prev.png')
print('ok')
