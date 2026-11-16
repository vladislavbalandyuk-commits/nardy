// Archived 0.88: weekly leagues and clubs, hidden at Vlad's request (the server still counts). To bring them back,
// put these blocks back into src/index.html where the stubs are and set LG_ON / CL_ON to true.

// ================= weekly leagues =================
const LG_COL=['#c98a5a','#c7ccd6','#e0b84d','#7fd3ff'], LG_IC=['🥉','🥈','🥇','💎'];
let LG=null, _lgAt=0;
const LG_ON=false; const CL_ON=false;  // 0.82.6: clubs hidden for now at Vlad's request (the server keeps them)
  // 0.82: leagues hidden again at Vlad's request (the server keeps counting)
async function lgLoad(force){ if(!LG_ON || !frReg()) return null; if(!force && LG && Date.now()-_lgAt<30e3) return LG; _lgAt=Date.now();
  try{ const {data}=await sb.functions.invoke('game',{body:{action:'league'}}); if(data && data.wk!=null){ LG=data; if(data.last && store.get('lgSeen',-1)!==data.last.w){ store.set('lgSeen',data.last.w); setTimeout(()=>lgResult(data.last),600); if(data.last.prize){ try{ const r=await sb.from('profiles').select('ach').eq('id',uid).maybeSingle(); if(r.data && r.data.ach){ profile.ach=r.data.ach; coinsPaint(); } }catch(e){} } } } }catch(e){} return LG; }
const lgName=i=>t('lgT'+i);
// league bots come with a portrait key; use a stock avatar when this build has no such portrait
const lgAv=r=>{ if(!r.bot || (r.av && (AVATARS[r.av] || (typeof PORTRAITS!=='undefined' && PORTRAITS[r.av])))) return r.av; const L=AV_RANDOM(); let h=0; for(const c of String(r.name||'')) h=(h*31+c.charCodeAt(0))>>>0; return L[h%L.length]; };
function lgLeft(ts){ const ms=Math.max(0,ts-Date.now()), d=Math.floor(ms/864e5), h=Math.floor(ms%864e5/3600e3); return d ? t('lgLeftD',{d,h}) : t('lgLeftH',{h:Math.max(1,h)}); }
function lgPaint(body,H){ rpMine(null,-1);
  if(!frReg()){ const e=H('div','rpempty',t('lgNeedReg')); const b=H('button','cta',t('login')); b.onclick=()=>{ closeRankPage(); openProfile(); }; e.append(document.createElement('br'), b); body.appendChild(e); return; }
  if(!LG){ body.appendChild(skel(5)); lgLoad(true).then(()=>{ if(rpMode==='league' && $('rankPg')) rpPaint(); }); return; }
  const L=LG, tr=L.tier||0; const hd=H('div','lghd'); hd.style.setProperty('--lc', LG_COL[tr]);
  hd.append(H('span','lgi',LG_IC[tr]), (()=>{ const d=H('div'); d.append(H('b',null,t('lgLeague',{n:lgName(tr)})), H('small',null,lgLeft(L.ends))); return d; })()); body.appendChild(hd);
  body.appendChild(H('p','rpnote',t('lgRules')));
  if(!L.joined){ const e=H('div','rpempty',t('lgJoin')); const b=H('button','cta',t('findB')); b.onclick=()=>{ closeRankPage(); startSearch(); }; e.append(document.createElement('br'), b); body.appendChild(e); return; }
  const list=H('div','lglist'); L.rows.forEach((r,i)=>{ const zone = i<L.up && tr<3 ? 'up' : i>=L.n-L.down && tr>0 ? 'down' : '';
    if(i===L.up && tr<3) list.appendChild(H('div','lgline up',t('lgUpLine',{n:lgName(tr+1)})));
    if(i===L.n-L.down && tr>0) list.appendChild(H('div','lgline down',t('lgDownLine',{n:lgName(tr-1)})));
    const row=H('div','lgrow'+(r.me?' me':'')+(zone?' '+zone:'')); const a=H('span','av'); avatarInto(a, lgAv(r), r.name||'?');
    row.append(H('span','pos',String(i+1)), a, H('span','nm',(r.name||t('guestName'))+(r.me?' · '+t('lbYou'):'')), H('span','pz', L.prize[i] ? '+'+L.prize[i] : ''), H('b','lpt',String(r.pts)));
    list.appendChild(row); }); body.appendChild(list);
  setTimeout(()=>{ const me=list.querySelector('.lgrow.me'); if(me) me.scrollIntoView({block:'center'}); },60); }
// ================= password recovery: the nickname → a link from the Telegram bot → a new password =================
function pwModal(build){ let ov=$('pwOv'); if(ov) ov.remove(); ov=document.createElement('div'); ov.id='pwOv'; ov.className='overlay'; const m=document.createElement('div'); m.className='modal pwm'; ov.appendChild(m);
  ov.onclick=e=>{ if(e.target===ov) ov.remove(); }; document.body.appendChild(ov); build(m, ()=>ov.remove()); }
const pwEl=(tag,cls,txt)=>{ const e=document.createElement(tag); if(cls) e.className=cls; if(txt!=null) e.textContent=txt; return e; };
function pwForgot(nick0){ pwModal((m,close)=>{ m.append(pwEl('h2',null,t('pwForgotT')), pwEl('p',null,t('pwForgotD')));
  const n=pwEl('input','field'); n.placeholder=t('nick'); n.value=nick0||''; n.maxLength=20; n.autocomplete='username'; const msg=pwEl('p','pwmsg'); const go=pwEl('button','cta',t('pwSend')); go.type='button'; const cl=pwEl('button','ghost',t('close')); cl.type='button'; cl.onclick=close;
  const row=pwEl('div','pwrow'); row.append(cl,go); m.append(n,msg,row);
  go.onclick=async()=>{ const v=n.value.trim(); if(v.length<2){ n.focus(); return; } go.disabled=true; msg.textContent='';
    try{ const {data}=await sb.functions.invoke('game',{body:{action:'pw_forgot', args:{nick:v}}}); if(data && data.ok){ m.innerHTML=''; m.append(pwEl('div','pwbig','✈️'), pwEl('h2',null,t('pwSentT')), pwEl('p',null,t('pwSentD'))); const ok=pwEl('button','cta',t('pwOk')); ok.type='button'; ok.onclick=close; m.append(ok); return; }
      msg.textContent=t({nouser:'pwNoUser', notg:'pwNoTg', wait:'pwWait'}[data&&data.why]||'pwErr'); }catch(e){ msg.textContent=t('pwErr'); } go.disabled=false; };
  n.onkeydown=e=>{ if(e.key==='Enter') go.click(); }; setTimeout(()=>n.focus(),50); }); }
function pwSetNew(tok){ pwModal((m,close)=>{ m.append(pwEl('div','pwbig','🔑'), pwEl('h2',null,t('pwNewT')), pwEl('p',null,t('pwNewD')));
  const a=pwEl('input','field'), b=pwEl('input','field'); a.type=b.type='password'; a.autocomplete=b.autocomplete='new-password'; a.placeholder=t('pwNew1'); b.placeholder=t('pwNew2'); const msg=pwEl('p','pwmsg'); const go=pwEl('button','cta',t('pwSave')); go.type='button'; m.append(a,b,msg,go);
  go.onclick=async()=>{ msg.textContent=''; if(a.value.length<6){ msg.textContent=t('passShort'); a.focus(); return; } if(a.value!==b.value){ msg.textContent=t('pwMismatch'); b.focus(); return; } go.disabled=true;
    try{ const {data}=await sb.functions.invoke('game',{body:{action:'pw_reset', args:{token:tok, pw:a.value}}});
      if(data && data.ok){ try{ await sb.auth.signOut(); }catch(e){} const {data:d2,error}=await sb.auth.signInWithPassword({email:data.email, password:a.value}); close(); if(!error && d2 && d2.user){ toast(t('pwDone')); await onSignedIn(d2.user); } else toast(t('pwDoneLogin')); return; }
      msg.textContent=t(data&&data.why==='expired'?'pwExpired':'pwErr'); }catch(e){ msg.textContent=t('pwErr'); } go.disabled=false; };
  b.onkeydown=e=>{ if(e.key==='Enter') go.click(); }; setTimeout(()=>a.focus(),50); }); }
{ const h=location.hash.replace('#',''); const m=h.match(/^pw-([a-z0-9]{24})$/); if(m){ try{ history.replaceState(null,'',location.pathname+location.search); }catch(e){} const go=()=>{ if(typeof sb!=='undefined' && sb && sb.functions) pwSetNew(m[1]); else setTimeout(go,300); }; setTimeout(go,600); } }
function lgResult(r){ let ov=$('lgOv'); if(ov) ov.remove(); ov=document.createElement('div'); ov.id='lgOv'; ov.className='overlay'; const m=document.createElement('div'); m.className='modal lgres';
  const up=r.nt>r.tier, dn=r.nt<r.tier; m.innerHTML='<div class="lgbig"></div><h2></h2><p></p><button type="button" class="cta"></button>';
  m.querySelector('.lgbig').textContent=LG_IC[r.nt]; m.querySelector('h2').textContent=up?t('lgUpT',{n:lgName(r.nt)}):dn?t('lgDownT',{n:lgName(r.nt)}):t('lgStayT',{n:lgName(r.nt)});
  m.querySelector('p').textContent=t('lgResD',{p:r.place})+(r.prize?' '+t('lgPrize',{n:r.prize}):''); const b=m.querySelector('button'); b.textContent=t('lgGo'); b.onclick=()=>ov.remove();
  ov.appendChild(m); ov.onclick=e=>{ if(e.target===ov) ov.remove(); }; document.body.appendChild(ov); try{ sfx(up?'win':'turn'); }catch(e){} if(r.prize){ try{ coinsCatchUp(); }catch(e){} } }
// home: one line under the rank card — your league and place
function lgHome(home){ if(!home) return; const rk=home.querySelector('.rkcard'); let el=home.querySelector('.lghome'); if(!LG_ON || !frReg() || !LG || !rk){ if(el) el.remove(); return; }
  if(!el){ el=document.createElement('button'); el.type='button'; el.className='lghome'; el.onclick=()=>openRankPage('league'); rk.after(el); }
  const k=LG.joined ? LG.rows.findIndex(r=>r.me) : -1; el.style.setProperty('--lc', LG_COL[LG.tier||0]);
  el.innerHTML=''; const i=document.createElement('span'); i.textContent=LG_IC[LG.tier||0]; const tx=document.createElement('span'); tx.textContent = t('lgLeague',{n:lgName(LG.tier||0)}) + ' · ' + (k>=0 ? t('lgPlace',{n:k+1,m:LG.rows.length}) : t('lgJoinShort')) + ' · ' + lgLeft(LG.ends);
  const ar=document.createElement('em'); ar.textContent='›'; el.append(i,tx,ar); }
setInterval(async()=>{ try{ if(gs || !$('vHome') || $('vHome').classList.contains('hidden') || !frReg()) return; await lgLoad(false); lgHome($('vHome')); }catch(e){} }, 30000);

// ================= 0.78: clubs — your own club of up to 30 friends: a club table, a weekly club tournament, a club chat =================
let CL=null, _clAt=0, clTabIn='m', _clPoll=null;
async function clCall(op,extra){ try{ const {data}=await sb.functions.invoke('game',{body:{action:'club', args:Object.assign({op},extra||{})}}); return data||null; }catch(e){ return null; } }
async function clLoad(force){ if(!frReg()) return null; if(!force && CL && Date.now()-_clAt<15e3) return CL; _clAt=Date.now(); const d=await clCall('mine'); if(d && d.ok){ CL=d; if(d.club && d.club.pz>0 && !store.get('clPzSeen_'+d.club.id+'_'+d.ends,0)){ store.set('clPzSeen_'+d.club.id+'_'+d.ends,1); setTimeout(()=>toast(t('clPzT',{n:d.club.pz})),700); } } return CL; }
function clRe(){ if(rpMode==='club' && $('rankPg')) rpPaint(); }
function clLink(id){ return location.origin+'/?club='+id; }
(function(){ try{ const q=new URLSearchParams(location.search), id=q.get('club'); if(id && /^[a-z0-9]{4,12}$/.test(id)){ store.set('clPend',id); q.delete('club'); history.replaceState(null,'',location.pathname+(q.toString()?'?'+q:'')+location.hash); } }catch(e){} })();
setInterval(async()=>{ try{ const id=store.get('clPend',''); if(!CL_ON || !id || !frReg()) return; store.set('clPend',''); const d=await clCall('peek',{id}); if(!d || !d.ok) return; if(d.mine){ openRankPage('club'); return; }
  let ov=$('clInvOv'); if(ov) ov.remove(); ov=document.createElement('div'); ov.id='clInvOv'; ov.className='overlay'; const m=document.createElement('div'); m.className='modal frinv';
  const r=uxH('div','r'); const no=uxH('button','ghost',t('frLater')); no.type='button'; no.onclick=()=>ov.remove(); const ok=uxH('button','cta',t('clJoin')); ok.type='button'; ok.onclick=async()=>{ ok.disabled=true; const x=await clCall('join',{id}); if(x && x.ok){ ov.remove(); CL=null; openRankPage('club'); toast(t('clJoined',{n:d.name})); } else { ok.disabled=false; toast(t(x&&x.error==='in_club'?'clInClub':x&&x.error==='full'?'clFull':'srvErr')); } };
  r.append(no,ok); m.append(uxH('div','clbadge big',d.tag), uxH('h2',null,t('clInvT',{n:d.name})), uxH('p',null,t('clInvD',{n:d.n,max:d.max})), r); ov.appendChild(m); document.body.appendChild(ov); }catch(e){} }, 3000);
function clPaint(body,H){ rpMine(null,-1); clearInterval(_clPoll);
  if(!frReg()){ const e=H('div','frempty'); e.append(H('div','fe-ic','🛡️'), H('b',null,t('clTab')), H('p',null,t('clNeedReg'))); const b=H('button','cta',t('login')); b.onclick=()=>{ closeRankPage(); openProfile(); }; e.appendChild(b); body.appendChild(e); return; }
  if(!CL){ body.appendChild(skel(5)); clLoad(true).then(clRe); return; }
  if(!CL.club) return clNone(body,H);
  const C=CL.club; const hd=H('section','clhd'); hd.append(H('span','clbadge',C.tag), (()=>{ const d=H('div'); d.append(H('b',null,C.name), H('small',null,t('clMeta',{n:C.n,max:CL.max,a:C.avg,p:C.wp}))); return d; })());
  const sh=H('button','ghost xlink',t('clInvite')); sh.type='button'; sh.onclick=async()=>{ const url=clLink(C.id), text=t('clInvText',{n:C.name}); try{ if(navigator.share){ await navigator.share({title:C.name,text,url}); return; } }catch(e){ if(e&&e.name==='AbortError') return; } try{ await navigator.clipboard.writeText(text+' '+url); toast(t('frLinkCopied')); }catch(e){ prompt(t('clInvite'),url); } };
  hd.appendChild(sh); body.appendChild(hd);
  if(C.pz>0){ const pz=H('div','clpz'); pz.append(H('span',null,'🏆 '+t('clPzT',{n:C.pz}))); const g=H('button','cta',t('ssGet')); g.type='button'; g.onclick=async()=>{ g.disabled=true; const d=await clCall('claim'); if(d && d.ok){ CL=d; try{ confetti(60); if(d.coins!=null){ profile.ach=Object.assign({},profile.ach||{},{coins:d.coins}); coinsPaint(); coinFly(d.got||0); } }catch(e){} clRe(); } else g.disabled=false; }; pz.appendChild(g); body.appendChild(pz); }
  const tb=H('div','cltabs'); [['m','clTabM'],['w','clTabW'],['c','clTabC']].forEach(([k,l])=>{ const b=H('button',clTabIn===k?'on':'',t(l)); b.type='button'; b.onclick=()=>{ clTabIn=k; clRe(); }; tb.appendChild(b); }); body.appendChild(tb);
  if(clTabIn==='m'){ const L=H('div','lglist'); C.m.forEach((r,i)=>{ const row=H('div','lgrow clrow'+(r.me?' me':'')); const a=H('span','av'); avatarInto(a,r.av,r.n);
      const nm=H('span','nm',r.n+(r.own?' 👑':'')); row.append(H('span','pos',String(i+1)), a, nm, H('span','pz',t('tier_'+TIERS[tierIdx(r.r)].k)+' '+r.r), H('b','lpt',String(r.wp)));
      if(C.own && !r.me){ row.style.cursor='pointer'; row.onclick=()=>clKick(r); row.title=t('clKickHint'); } L.appendChild(row); }); body.appendChild(L);
    if(C.own) body.appendChild(H('p','rpnote',t('clKickHint')));
    const lv=H('button','ghost clleave',t('clLeave')); lv.type='button'; lv.onclick=async()=>{ if(!confirm(t('clLeaveQ'))) return; const d=await clCall('leave'); if(d && d.ok){ CL=null; clRe(); } }; body.appendChild(lv); }
  else if(clTabIn==='w'){ body.appendChild(H('p','rpnote',t('clWkRules',{a:CL.prize[0],b:CL.prize[1],c:CL.prize[2]})+' · '+lgLeft(CL.ends)));
    const L=H('div','lglist'); C.m.filter(r=>r.wp>0).forEach((r,i)=>{ const row=H('div','lgrow'+(r.me?' me':'')+(i<3?' up':'')); const a=H('span','av'); avatarInto(a,r.av,r.n); row.append(H('span','pos',String(i+1)), a, H('span','nm',r.n), H('span','pz',i<3?'+'+CL.prize[i]:''), H('b','lpt',String(r.wp))); L.appendChild(row); });
    if(!L.childElementCount) L.appendChild(H('p','note',t('clWkEmpty'))); body.appendChild(L);
    if(C.last && C.last.top.length){ body.appendChild(H('h4','clsub',t('clLastWk'))); const pl=H('div','thpod'); C.last.top.forEach((x,i)=>{ const r=H('div','thp'+(x.me?' me':'')); r.append(H('i',null,['🥇','🥈','🥉'][i]), H('b',null,x.n+' · '+x.p)); pl.appendChild(r); }); body.appendChild(pl); } }
  else { const box=H('div','clchat'); (C.chat||[]).forEach(mm=>{ if(!mm.u){ box.appendChild(H('div','clsys', mm.x.charAt(0)==='+'?t('clSysJoin',{n:mm.x.slice(1)}):t('clSysLeft',{n:mm.x.slice(1)}))); return; } const r=H('div','clmsg'+(mm.u===uid?' me':'')); r.append(H('b',null,mm.n), H('span',null,mm.x), H('small',null,new Date(mm.t).toLocaleTimeString(LOC(),{hour:'2-digit',minute:'2-digit'}))); box.appendChild(r); });
    if(!(C.chat||[]).length) box.appendChild(H('p','note',t('clChatEmpty'))); body.appendChild(box); setTimeout(()=>{ box.scrollTop=box.scrollHeight; },30);
    const f=H('form','clsay'); const inp=H('input'); inp.maxLength=200; inp.placeholder=t('clSayPh'); const go=H('button','cta','➤'); go.type='submit'; f.append(inp,go);
    f.onsubmit=async e=>{ e.preventDefault(); const x=inp.value.trim(); if(!x) return; if(typeof nick70Bad==='function' && nick70Bad(x)){ toast(t('clBadWord')); return; } inp.value=''; go.disabled=true; const d=await clCall('say',{text:x}); go.disabled=false; if(d && d.ok){ CL=d; clRe(); setTimeout(()=>{ const i2=document.querySelector('.clsay input'); if(i2) i2.focus(); },50); } else toast(t(d&&d.error==='too_often'?'frOften':'srvErr')); };
    body.appendChild(f); _clPoll=setInterval(async()=>{ if(rpMode!=='club' || clTabIn!=='c' || !$('rankPg')){ clearInterval(_clPoll); return; } if(document.activeElement && document.activeElement.closest && document.activeElement.closest('.clsay') && document.activeElement.value) return; const n=(CL.club.chat||[]).length, lt=n?CL.club.chat[n-1].t:0; await clLoad(true); const C2=CL&&CL.club; if(C2 && ((C2.chat||[]).length!==n || (n && C2.chat[C2.chat.length-1].t!==lt))) clRe(); }, 8000); } }
async function clKick(r){ if(!confirm(t('clKickQ',{n:r.n}))) return; const d=await clCall('kick',{id:r.id}); if(d && d.ok){ CL=d; clRe(); } else toast(t('srvErr')); }
function clNone(body,H){ const e=H('section','clnew'); e.append(H('div','fe-ic','🛡️'), H('b',null,t('clNoneT')), H('p',null,t('clNoneD',{max:CL.max})));
  const f=H('form','clform'); const nm=H('input'); nm.placeholder=t('clNamePh'); nm.maxLength=24; const tg=H('input','cltag'); tg.placeholder=t('clTagPh'); tg.maxLength=4; const go=H('button','cta',t('clCreate',{n:CL.cost})); go.type='submit'; f.append(nm,tg,go);
  f.onsubmit=async ev=>{ ev.preventDefault(); const name=nm.value.trim(), tag=tg.value.trim(); if(name.length<3 || tag.length<2){ toast(t('clBadName')); return; } if(typeof nick70Bad==='function' && (nick70Bad(name)||nick70Bad(tag))){ toast(t('clBadWord')); return; }
    go.disabled=true; const d=await clCall('create',{name,tag}); if(d && d.ok){ try{ confetti(70); profile.ach=Object.assign({},profile.ach||{},{coins:d.coins}); coinsPaint(); }catch(x){} CL=null; await clLoad(true); clRe(); } else { go.disabled=false; toast(t(d&&d.error==='taken'?'clTaken':d&&d.error==='coins'?'clCoins':d&&d.error==='bad_name'?'clBadName':'srvErr',{n:CL.cost})); } };
  e.appendChild(f); body.appendChild(e);
  body.appendChild(H('h4','clsub',t('clTop'))); const L=H('div','lglist'); (CL.clubs||[]).forEach((c,i)=>{ const row=H('div','lgrow clr'); const b=H('button','ghost',c.n>=CL.max?t('clFullB'):t('clJoin')); b.type='button'; b.disabled=c.n>=CL.max;
      b.onclick=async()=>{ b.disabled=true; const d=await clCall('join',{id:c.id}); if(d && d.ok){ CL=null; toast(t('clJoined',{n:c.name})); await clLoad(true); clRe(); } else { b.disabled=false; toast(t(d&&d.error==='full'?'clFull':d&&d.error==='banned'?'clBanned':'srvErr')); } };
      row.append(H('span','pos',String(i+1)), H('span','clbadge',c.tag), H('span','nm',c.name+' · '+c.n+'/'+CL.max), H('b','lpt',String(c.wp)), b); L.appendChild(row); });
  if(!(CL.clubs||[]).length) L.appendChild(H('p','note',t('clTopEmpty'))); body.appendChild(L); }
