/* ===== scene layout: frame -> list of absolutely-positioned items (pure, testable) ===== */
const W=1000, H=480;
const COL={n:'#E8ECF4',b:'#58C4DD',y:'#FFD866',g:'#83C167',r:'#FC6255',o:'#FF862F',p:'#B189C6',t:'#5CD0B3',d:'#5F6B82'};
const cc=(cls)=>({col:COL[(cls||'n')[0]]||COL.n,fill:(cls||'').includes('*'),dim:(cls||'')[0]==='d'});
const rep=(n,c='n')=>Array(n).fill(c);
const mk=(o)=>o;
const LAY={};
function fsFor(w,s){const L=String(s).length;let f=w>=56?22:w>=40?18:14;if(L*f*0.62>w-6)f=Math.max(11,Math.floor((w-6)/(L*0.62)));return f}
function pointers(b,id,it,xs,ws,yb){
  const cnt={};
  (b.p||[]).forEach(p=>{const k=p.i;const n=cnt[k]||0;cnt[k]=n+1;
    it.push({k:`${id}.p.${p.n}`,kind:'text',x:xs[k]+ws/2-40,y:yb+n*21,w:80,h:20,t:`↑ ${p.n}`,c:p.c||'y',fs:15,bold:1,a:'c'})});
  const m=Math.max(0,...Object.values(cnt));return m*21;
}
LAY.cells=(b,id,y,it)=>{
  const n=b.v.length,arr=b.arrows,lw=b.label?118:0,gap=arr?38:6;
  let cw=b.cw||64;cw=Math.min(cw,(960-lw-(n-1)*gap)/n);cw=Math.floor(cw);
  const ch=b.ch||(cw>=44?46:40),tot=n*cw+(n-1)*gap;
  const x0=Math.max(20+lw,Math.round((W-tot)/2+(lw?lw/2:0)));
  const xs=[];for(let i=0;i<n;i++)xs.push(x0+i*(cw+gap));
  let yy=y;
  if(b.label)it.push({k:`${id}.lab`,kind:'text',x:20,y:yy+(b.idx===false?0:20)+ch/2-12,w:lw-8,h:24,t:b.label,c:'n',fs:16,a:'l',ital:1,dimtxt:1});
  if(b.idx!==false){for(let i=0;i<n;i++)it.push({k:`${id}.i${i}`,kind:'text',x:xs[i],y:yy,w:cw,h:18,t:b.top?b.top[i]??'':(b.from||0)+i,c:'d',fs:12,a:'c',mono:1});yy+=20}
  for(let i=0;i<n;i++){const cl=cc(b.c?.[i]);
    if(b.v[i]===null||b.v[i]===undefined)continue;
    it.push({k:`${id}.c${i}`,kind:'box',x:xs[i],y:yy,w:cw,h:ch,t:String(b.v[i]),c:b.c?.[i]||'n',fs:b.fs||fsFor(cw,b.v[i]),sh:b.round?'c':'r'});
    if(arr&&i<n-1){const rv=b.rev?.[i];if(rv!==null)it.push({k:`${id}.a${i}`,kind:'text',x:xs[i]+cw,y:yy+ch/2-14,w:gap,h:28,t:rv?'←':'→',c:b.ac?.[i]||'n',fs:22,a:'c'})}}
  yy+=ch;
  if(b.win){const w=b.win;const l=xs[w.l],r=xs[w.r]+cw;it.push({k:`${id}.win`,kind:'rect',x:l-5,y:yy-ch-6,w:r-l+10,h:ch+12,c:w.c||'y'})}
  if(b.sub){yy+=4;for(let i=0;i<n;i++)if(b.sub[i]!==undefined&&b.sub[i]!=='')it.push({k:`${id}.s${i}`,kind:'text',x:xs[i]-8,y:yy,w:cw+16,h:18,t:String(b.sub[i]),c:b.sc?.[i]||'d',fs:13,a:'c',mono:1});yy+=22}
  yy+=6;yy+=pointers(b,id,it,xs,cw,yy);
  return yy;
};
LAY.bars=(b,id,y,it)=>{
  const n=b.v.length,mx=Math.max(1,...b.v.map((v,i)=>v+(b.water?.[i]||0)));const hh=b.h||190;const s=hh/mx;
  const bw=Math.min(58,Math.floor(900/n)-5),gap=Math.min(6,Math.floor(bw/6)+2);const tot=n*bw+(n-1)*gap,x0=Math.round((W-tot)/2);
  const base=y+hh+6;const xs=[];for(let i=0;i<n;i++)xs.push(x0+i*(bw+gap));
  for(let i=0;i<n;i++){const v=b.v[i],bh=v*s;
    it.push({k:`${id}.w${i}`,kind:'box',x:xs[i],y:base-bh-(b.water?.[i]||0)*s,w:bw,h:(b.water?.[i]||0)*s,t:'',c:'b',water:1});
    it.push({k:`${id}.b${i}`,kind:'box',x:xs[i],y:base-bh,w:bw,h:Math.max(bh,1),t:'',c:b.c?.[i]||'n',bar:1});
    it.push({k:`${id}.t${i}`,kind:'text',x:xs[i],y:base-bh-(b.water?.[i]||0)*s-20,w:bw,h:18,t:String(v),c:'n',fs:13,a:'c',mono:1})}
  (b.rects||[]).forEach((r,j)=>{const l=xs[r.l],rr=xs[r.r]+bw;it.push({k:`${id}.r${j}`,kind:'rect',x:l-3,y:base-r.h*s-3,w:rr-l+6,h:r.h*s+6,c:r.c||'y'})});
  it.push({k:`${id}.base`,kind:'line',x1:x0-12,y1:base,x2:x0+tot+12,y2:base,c:'d'});
  let yy=base+8;yy+=pointers(b,id,it,xs,bw,yy);return yy;
};
LAY.dict=(b,id,y,it)=>{
  let x=20;if(b.label){it.push({k:`${id}.lab`,kind:'text',x:20,y:y+5,w:118,h:24,t:b.label,c:'n',fs:16,a:'l',ital:1,dimtxt:1});x=146}
  let yy=y,x0=x;
  if(!b.e.length)it.push({k:`${id}.empty`,kind:'text',x:x,y:y+5,w:200,h:24,t:b.empty||'{ }',c:'d',fs:17,a:'l',mono:1});
  b.e.forEach(e=>{const t=`${e[0]} ${b.arrow||'→'} ${e[1]}`;const w=Math.max(70,t.length*10.5+24);if(x+w>W-20){x=x0;yy+=42}
    it.push({k:`${id}.${e[0]}`,kind:'box',x:x,y:yy,w:w,h:34,t,c:e[2]||'n',fs:16,mono:1});x+=w+8});
  return yy+36;
};
LAY.text=(b,id,y,it)=>{const fs=b.fs||22;const lines=(Array.isArray(b.s)?b.s:[b.s]);
  lines.forEach((s,i)=>it.push({k:`${id}.${i}`,kind:'text',x:20,y:y+i*(fs*1.45),w:960,h:fs*1.4,t:s,c:b.c||'n',fs,a:b.a||'c',math:1,html:1}));
  return y+lines.length*fs*1.45;};
LAY.grid=(b,id,y,it)=>{
  const R=b.v.length,Cn=b.v[0].length;const s=Math.min(b.s||52,Math.floor(680/Cn),Math.floor((b.hmax||260)/R));
  const lw=b.label?118:0;const x0=Math.round((W-Cn*(s+4))/2+lw/2);
  if(b.label)it.push({k:`${id}.lab`,kind:'text',x:20,y:y+8,w:lw-8,h:24,t:b.label,c:'n',fs:16,a:'l',ital:1,dimtxt:1});
  for(let r=0;r<R;r++)for(let c=0;c<Cn;c++){const v=b.v[r][c];
    it.push({k:`${id}.g${r}_${c}`,kind:'box',x:x0+c*(s+4),y:y+r*(s+4),w:s,h:s,t:v===''||v===0&&b.hide0?'':String(v),c:b.c?.[r]?.[c]||'n',fs:s>=40?20:15,sh:'r'})}
  return y+R*(s+4)+4;
};
LAY.tree=(b,id,y,it)=>{
  const v=b.v;const nodes=[];const par=[];const kids=v.map(()=>[null,null]);
  let q=[0],qi=0,nxt=1;const depth={0:0};
  if(v.length&&v[0]!==null){const queue=[0];while(queue.length){const i=queue.shift();for(let s=0;s<2;s++){if(nxt<v.length){const j=nxt++;if(v[j]!==null){kids[i][s]=j;depth[j]=depth[i]+1;queue.push(j)}}}}}
  const order=[];const walk=i=>{if(i===null)return;walk(kids[i][0]);order.push(i);walk(kids[i][1])};if(v.length&&v[0]!==null)walk(0);
  const N=order.length,sp=Math.min(76,860/Math.max(1,N-1)),x0=(W-sp*(N-1))/2;const px={};order.forEach((i,k)=>px[i]=x0+k*sp);
  const maxd=Math.max(0,...order.map(i=>depth[i]));const dy=Math.min(72,(b.h||260)/(maxd+1));
  const R=b.r||21;
  order.forEach(i=>{[0,1].forEach(s=>{const j=kids[i][s];if(j!==null){
    const a=[px[i],y+R+depth[i]*dy],c=[px[j],y+R+depth[j]*dy];
    it.push({k:`${id}.e${j}`,kind:'line',x1:a[0],y1:a[1],x2:c[0],y2:c[1],c:b.ec?.[j]||'d',trim:R})}})});
  order.forEach(i=>{it.push({k:`${id}.n${i}`,kind:'box',x:px[i]-R,y:y+depth[i]*dy,w:2*R,h:2*R,t:String(v[i]),c:b.c?.[i]||'n',fs:b.fs||17,sh:'c'});
    if(b.ann?.[i]!==undefined)it.push({k:`${id}.an${i}`,kind:'text',x:px[i]-50,y:y+depth[i]*dy+2*R+1,w:100,h:18,t:String(b.ann[i]),c:b.ac?.[i]||'y',fs:13,a:'c',mono:1})});
  return y+(maxd)*dy+2*R+(b.ann?20:6);
};
LAY.graph=(b,id,y,it)=>{
  const pos={};b.nodes.forEach(n=>pos[n.id]=n);
  (b.edges||[]).forEach((e,j)=>{const A=pos[e.a],B=pos[e.b];
    it.push({k:`${id}.e${e.a}_${e.b}`,kind:'line',x1:A.x,y1:y+A.y,x2:B.x,y2:y+B.y,c:e.c||'d',arrow:e.d,trim:(A.w||44)/2>30?(e.d?24:20):22,trimA:Math.min(A.w||44,44)/2+2,trimB:Math.min(B.w||44,44)/2+(e.d?6:2),wide:A.w>60||B.w>60})});
  b.nodes.forEach(n=>{const w=n.w||44;it.push({k:`${id}.n${n.id}`,kind:'box',x:n.x-w/2,y:y+n.y-22,w,h:44,t:n.t??String(n.id),c:n.c||'n',fs:n.fs||(w>60?15:18),sh:w>60?'r':'c',mono:w>60?1:0});
    if(n.sub!==undefined)it.push({k:`${id}.ns${n.id}`,kind:'text',x:n.x-40,y:y+n.y+24,w:80,h:18,t:String(n.sub),c:n.sc||'y',fs:13,a:'c',mono:1})});
  return y+(b.h||200);
};
LAY.axis=(b,id,y,it)=>{
  const lo=b.lo,hi=b.hi,sx=v=>70+(v-lo)/(hi-lo)*860;const rows=Math.max(...b.items.map(i=>i.row))+1;const rh=34;
  b.items.forEach(i=>{const x1=sx(i.s),x2=sx(i.e);it.push({k:`${id}.${i.id}`,kind:'box',x:x1,y:y+i.row*rh,w:Math.max(x2-x1,6),h:26,t:i.t??`[${i.s},${i.e}]`,c:i.c||'b',fs:13,mono:1,sh:'r'})});
  const ya=y+rows*rh+4;it.push({k:`${id}.ax`,kind:'line',x1:sx(lo),y1:ya,x2:sx(hi),y2:ya,c:'d'});
  const step=b.step||Math.max(1,Math.round((hi-lo)/10));for(let v=lo;v<=hi;v+=step)it.push({k:`${id}.tk${v}`,kind:'text',x:sx(v)-20,y:ya+3,w:40,h:16,t:String(v),c:'d',fs:12,a:'c',mono:1});
  return ya+26;
};
function layout(fr){const it=[];let y=22;fr.b.forEach((b,bi)=>{const id=b.id||('b'+bi);y=LAY[b.t](b,id,y,it)+(b.gap??26)});return it}
const K=(c,s)=>`<i class="k${c}">${s}</i>`;
function treeKids(v){const kids=v.map(()=>[null,null]);const depth={0:0};let nxt=1;
  if(v.length&&v[0]!==null){const q=[0];while(q.length){const i=q.shift();for(let s=0;s<2;s++){if(nxt<v.length){const j=nxt++;if(v[j]!==null){kids[i][s]=j;depth[j]=depth[i]+1;q.push(j)}}}}}
  return {kids,depth}}

function speakText(html){
  let t=String(html).replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
  const R=[[/→/g,' goes to '],[/←/g,' back to '],[/↑/g,''],[/≤/g,' is at most '],[/≥/g,' is at least '],[/≠/g,' is not equal to '],[/</g,' is less than '],[/>/g,' is greater than '],[/−|–/g,' minus '],[/(\d)\s*-\s*(\d)/g,'$1 minus $2'],[/×/g,' times '],[/∞/g,' infinity '],[/∅/g,' empty '],[/\+/g,' plus '],[/=/g,' equals '],[/·/g,' '],[/²/g,' squared'],[/O\(([^)]*)\)/g,'big O of $1'],[/\[\s*\]/g,'an empty list'],[/([A-Za-z_])\.([A-Za-z_])/g,'$1 dot $2'],[/_/g,' '],[/[\[\]{}"`|]/g,' '],[/\bk-th\b/g,'k th'],[/\s+/g,' ']];
  for(const [r,x] of R)t=t.replace(r,x);return t.trim();
}
function fnv(s){let h=0x811c9dc5;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,0x01000193)>>>0}return h.toString(16).padStart(8,'0')}
