/* ===== DOM player ===== */
const stageEl=document.getElementById('stage'),stageIn=document.getElementById('stageIn');
const live=new Map();let sceneH=H,yoff=0;
function applyEl(el,it,fresh){
  const s=el.style;
  if(it.kind==='line'){
    let {x1,y1,x2,y2}=it;y1+=yoff;y2+=yoff;const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy)||1,ux=dx/len,uy=dy/len;
    const ta=it.trimA??it.trim??0,tb=it.trimB??it.trim??0;
    x1+=ux*ta;y1+=uy*ta;x2-=ux*tb;y2-=uy*tb;
    const L=Math.max(0,Math.hypot(x2-x1,y2-y1));
    s.left=x1+'px';s.top=y1+'px';s.width=L+'px';s.transform=`rotate(${Math.atan2(dy,dx)}rad)`;
    s.setProperty('--c',COL[it.c[0]]||COL.d);el.classList.toggle('arrow',!!it.arrow);return}
  s.left=it.x+'px';s.top=(it.y+yoff)+'px';s.width=it.w+'px';s.height=it.h+'px';
  s.setProperty('--c',COL[(it.c||'n')[0]]||COL.n);
  if(it.fs)s.fontSize=it.fs+'px';
  const o=cc(it.c);
  el.classList.toggle('fill',o.fill);el.classList.toggle('dim',o.dim);
  if(it.kind!=='rect'){const h=it.html?it.t:null;if(h!==null){if(el.innerHTML!==h)el.innerHTML=h}else if(el.textContent!==it.t)el.textContent=it.t}
  el.style.justifyContent=it.a==='l'?'flex-start':it.a==='r'?'flex-end':'center';
  el.style.textAlign=it.a==='l'?'left':it.a==='r'?'right':'center';
}
function mkEl(it){const el=document.createElement('div');el.className='it '+(it.kind==='box'?'bx':it.kind)+(it.sh==='c'?' round':'')+(it.mono?' mono':'')+(it.bold?' bold':'')+(it.ital?' ital':'')+(it.dimtxt?' lab':'')+(it.water?' water':'')+(it.bar?' bar':'')+(it.math?' math':'');return el}
function paint(items){
  const seen=new Set();
  for(const it of items){seen.add(it.k);let el=live.get(it.k);
    if(!el){el=mkEl(it);applyEl(el,it,true);stageIn.appendChild(el);live.set(it.k,el);requestAnimationFrame(()=>requestAnimationFrame(()=>el.classList.add('in')))}
    else{applyEl(el,it);el.classList.add('in')}}
  for(const [k,el] of [...live]){if(!seen.has(k)){el.classList.remove('in');live.delete(k);setTimeout(()=>el.remove(),380)}}
}
function fit(){const w=stageEl.clientWidth;const sc=Math.max(w/W,0.62);stageIn.style.transform=`scale(${sc})`;stageEl.style.height=(sceneH*sc)+'px';stageIn.style.width=W+'px';stageIn.style.height=sceneH+'px'}
new ResizeObserver(fit).observe(stageEl);

function sizeScene(frames){let mb=0;frames.forEach(f=>layout(f).forEach(it=>{const b=it.kind==='line'?Math.max(it.y1,it.y2):it.y+it.h;mb=Math.max(mb,b)}));sceneH=Math.max(250,Math.min(H,mb+40));yoff=Math.max(0,Math.round((sceneH-mb)/2)-8);fit()}
