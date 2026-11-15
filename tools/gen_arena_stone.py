import numpy as np
from PIL import Image, ImageFilter
rng=np.random.default_rng(7)
N=1024
def pnoise(scale,seed):
    r=np.random.default_rng(seed); w=r.standard_normal((N,N)); F=np.fft.fft2(w)
    fy=np.fft.fftfreq(N)[:,None]; fx=np.fft.fftfreq(N)[None,:]; f=np.sqrt(fx**2+fy**2)
    filt=np.exp(-(f*scale)**2); n=np.real(np.fft.ifft2(F*filt)); n=(n-n.mean())/n.std(); return n
low=pnoise(40,1); mid=pnoise(10,2); fine=pnoise(2.2,3)
img=np.zeros((N,N,3)); blockid=np.zeros((N,N),int); edge=np.full((N,N),99.0)
rowh=64; rows=N//rowh; bid=0; base=np.array([88,80,72])/255.
for r in range(rows):
    y0=r*rowh; ws=[]; 
    while sum(ws)<N: ws.append(int(rng.integers(110,230)))
    over=sum(ws)-N; ws[-1]-=over
    if ws[-1]<60: ws[-2]+=ws[-1]; ws.pop()
    off=int(rng.integers(0,N)); x=0
    for w in ws:
        bid+=1; tone=rng.normal(0,0.045); hue=rng.normal(0,0.007)
        col=base*(1+tone)+np.array([hue,0,-hue])
        for xx in range(w):
            X=(off+x+xx)%N
            img[y0:y0+rowh,X]=col
            blockid[y0:y0+rowh,X]=bid
            d=min(xx,w-1-xx); edge[y0:y0+rowh,X]=np.minimum(edge[y0:y0+rowh,X],d)
        x+=w
    yy=np.arange(rowh); dy=np.minimum(yy,rowh-1-yy)[:,None]
    edge[y0:y0+rowh,:]=np.minimum(edge[y0:y0+rowh,:],dy)
# surface variation
v=1+0.10*low[...,None]+0.07*mid[...,None]+0.05*fine[...,None]
img*=v
# mortar joints and bevel
mortar=np.clip(1-edge/3.0,0,1)[...,None]
img=img*(1-mortar)+mortar*np.array([38,35,33])/255.
bev=np.clip(1-(edge-2)/6.0,0,1)[...,None]*0.18
img*=1-bev
# chips/pits
pits=(fine>2.2)[...,None]*0.15; img*=1-pits
img=np.clip(img,0,1)
im=Image.fromarray((img*255).astype('uint8')); im=im.filter(ImageFilter.GaussianBlur(0.6))
im.save('/home/claude/gen/stone.webp',quality=82); im.resize((256,256)).save('/home/claude/gen/stone_prev.png')
# tiling check
t=Image.new('RGB',(2048,2048)); [t.paste(im,(x,y)) for x in (0,1024) for y in (0,1024)]; t.resize((768,768)).save('/home/claude/gen/stone_tile.png')
print('ok')
