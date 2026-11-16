# four covers for the weekend tournament, one per week in turn (tb/tc1..tc4.webp)
import numpy as np, math
from PIL import Image, ImageFilter, ImageDraw
W,H=1600,560; y,x=np.mgrid[0:H,0:W].astype(float); X=x/W; Y=y/H; R=np.random.default_rng(7)
def save(img,n):
    Image.fromarray(np.clip(img,0,255).astype('uint8')).save(f'/home/claude/nardy/tb/tc{n}.webp',quality=80)
def blur(a,r): return np.array(Image.fromarray(np.clip(a,0,255).astype('uint8')).filter(ImageFilter.GaussianBlur(r))).astype(float)
# 1 — night city: bokeh lights over deep navy, a skyline
img=np.zeros((H,W,3))+np.array([10,14,30]); img+= (1-Y)[...,None]*np.array([20,26,60])
L=np.zeros((H,W,3))
for i in range(160):
    cx,cy,r=R.uniform(0,W),R.uniform(H*.15,H*.8),R.uniform(6,30); c=[np.array([255,170,120]),np.array([120,200,255]),np.array([255,120,160]),np.array([180,230,210])][R.integers(0,4)]
    m=np.clip(1-np.hypot(x-cx,y-cy)/r,0,1)**.8; L+=m[...,None]*c*R.uniform(.15,.5)
img+=blur(L,3)
sk=Image.new('L',(W,H),0); d=ImageDraw.Draw(sk); xx=0
while xx<W:
    w=R.integers(40,120); h=R.integers(80,260); d.rectangle([xx,H-h,xx+w,H],255); 
    if R.random()<.3: d.rectangle([xx+w//2-4,H-h-R.integers(20,70),xx+w//2+4,H-h],255)
    xx+=w+R.integers(0,10)
m=np.array(sk)/255.; img=img*(1-m[...,None])+m[...,None]*np.array([6,8,16])
win=(R.random((H,W))<.004)*m; img+=blur(win[...,None]*np.array([255,200,140])*3,0.6)
save(img,1)
# 2 — the hookah lounge: teal smoke curls on near black
img=np.zeros((H,W,3))+np.array([8,12,14])
S=np.zeros((H,W))
for i in range(9):
    t=np.linspace(0,1,400); x0=R.uniform(.1,.9)*W; ph=R.uniform(0,6); amp=R.uniform(40,140)
    px=x0+np.sin(t*R.uniform(4,9)+ph)*amp*t+t*R.uniform(-200,200); py=H*(1.05-t*R.uniform(.9,1.3))
    for a,b,tt in zip(px,py,t):
        ix,iy=int(a),int(b)
        if 0<=ix<W and 0<=iy<H: S[max(0,iy-2):iy+2,max(0,ix-2):ix+2]+=1-tt*.6
S=blur(np.stack([S*90]*3,-1),14)[...,0]/255.
img+=S[...,None]*np.array([90,210,190])*1.4
img+=np.exp(-(((X-.5)/.5)**2+((Y-1.1)/.4)**2))[...,None]*np.array([30,70,66])
save(img,2)
# 3 — the yard at sunset: a coral sky, roofs and a vine
sky=np.array([60,30,70])*(1-Y)[...,None]+np.array([235,120,90])*Y[...,None]
img=sky*(0.7+0.3*np.exp(-((X-.7)/.3)**2))[...,None]
sun=np.exp(-(((X-.7)/.07)**2+((Y-.62)/.2)**2)); img+=sun[...,None]*np.array([255,160,130])*.7
rf=Image.new('L',(W,H),0); d=ImageDraw.Draw(rf); xx=-20
while xx<W:
    w=R.integers(120,260); h=R.integers(120,230); d.polygon([(xx,H),(xx,H-h),(xx+w//2,H-h-R.integers(30,80)),(xx+w,H-h),(xx+w,H)],255)
    if R.random()<.5: d.rectangle([xx+w*0.7,H-h-60,xx+w*0.7+14,H-h],255)
    xx+=w+R.integers(-30,10)
d.line([(0,40),(W,90)],255,3)
for k in range(60): cx=R.uniform(0,W); cy=40+cx/W*50+R.uniform(-6,30); d.ellipse([cx-10,cy-6,cx+10,cy+6],255)
m=np.array(rf)/255.; img=img*(1-m[...,None])+m[...,None]*np.array([28,16,24])
save(img,3)
# 4 — the hall: the tournament hall from the weekend set
c=Image.open('/home/claude/nardy/tb/cup.webp').convert('RGB'); c=c.crop((0,int(c.height*.08),c.width,int(c.height*.08)+int(c.width*H/W))).resize((W,H))
c.save('/home/claude/nardy/tb/tc4.webp',quality=80)
o=Image.new('RGB',(W,H*4))
for n in range(1,5): o.paste(Image.open(f'/home/claude/nardy/tb/tc{n}.webp'),(0,(n-1)*H))
o.resize((800,1120)).save('/home/claude/gen/tc_prev.png'); print('ok')
