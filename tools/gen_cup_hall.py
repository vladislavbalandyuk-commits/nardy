# the weekend-tournament hall: dark room, crimson velvet curtains at the sides, a soft spotlight from above, haze over the floor, rows of seats in the dark
import numpy as np
from PIL import Image, ImageFilter
W,H=2560,1440; y,x=np.mgrid[0:H,0:W].astype(float); X=x/W; Y=y/H
img=np.zeros((H,W,3))+np.array([10,10,13])
# curtains: folds = sine shading, a deep crimson, darker towards the centre
for side in (0,1):
    d=X if side==0 else 1-X; m=np.clip((0.22-d)/0.22,0,1)**0.6
    fold=0.55+0.45*np.sin(d*W/38+np.sin(Y*3+side)*1.2)**2
    sway=1-0.25*Y
    c=np.array([92,14,26])*fold[...,None]*sway[...,None]
    img=img*(1-m[...,None])+c*m[...,None]
# top valance
val=np.clip((0.07-Y)/0.07,0,1); fold=0.6+0.4*np.sin(X*W/26)**2; img=img*(1-val[...,None])+(np.array([70,10,20])*fold[...,None])*val[...,None]
# seats: dark arcs in the lower half
for k in range(7):
    yc=0.62+k*0.055; arc=yc+0.06*((X-0.5)*2)**2; band=np.exp(-((Y-arc)/0.016)**2)*(Y>0.5)
    bumps=0.8+0.2*np.cos(X*W/(60+k*6))**2
    img+=band[...,None]*bumps[...,None]*np.array([16,13,17])*(1-k*0.08)
# spotlight cone from the top centre
cone=np.clip(1-np.abs(X-0.5)/(0.10+0.32*Y),0,1)**1.6*np.clip(1.15-Y,0,1)
img+=cone[...,None]*np.array([150,148,160])*0.55
# light pool on the floor
pool=np.exp(-(((X-0.5)/0.24)**2+((Y-0.86)/0.07)**2)); img+=pool[...,None]*np.array([120,112,108])*0.5
# haze grain
r=np.random.default_rng(3); n=r.standard_normal((H//4,W//4)); n=np.array(Image.fromarray(((n-n.min())/(n.max()-n.min())*255).astype('uint8')).resize((W,H),Image.BICUBIC).filter(ImageFilter.GaussianBlur(18)))/255.
img+=(n[...,None]-.5)*18*cone[...,None]
# vignette
v=np.clip(1-((X-0.5)**2*1.1+(Y-0.45)**2*1.4)*1.4,0.25,1); img*=v[...,None]
img=np.clip(img,0,255).astype('uint8')
Image.fromarray(img).filter(ImageFilter.GaussianBlur(1.2)).save('/home/claude/nardy/tb/cup.webp',quality=80)
Image.fromarray(img).resize((960,540)).save('/home/claude/gen/cup_prev.png')
print('ok')
