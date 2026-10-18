/* ===== app ===== */
const $=s=>document.querySelector(s);
const md=s=>s.replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\*\*([^*]+)\*\*/g,'<b>$1</b>');
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
function hl(code){
  const KW=new Set('def return if elif else for while in not and or is import from as class lambda None True False break continue pass nonlocal'.split(' '));
  const BI=new Set('range len max min sum sorted enumerate set dict list tuple float int zip reversed any all print'.split(' '));
  return esc(code).replace(/(#[^\n]*)|("[^"\n]*"|'[^'\n]*')|\b(\d+)\b|\b([A-Za-z_]\w*)\b/g,(m,c,s,n,w)=>{
    if(c)return `<span class="tk-com">${c}</span>`;if(s)return `<span class="tk-str">${s}</span>`;if(n)return `<span class="tk-num">${n}</span>`;
    if(KW.has(w))return `<span class="tk-kw">${w}</span>`;if(BI.has(w))return `<span class="tk-bi">${w}</span>`;return m});
}
let pid=1,sceneI=0,fi=0,frames=[],playing=false,timer=null,speed=1,voiceOn=false,vtoken=0;
const byId=id=>P.find(p=>p.id===id);
function buildIndex(){
  $('#index').innerHTML=META.map(m=>`<button data-id="${m.id}" class="d-${m.diff}"><span class="n">${String(m.id).padStart(2,'0')}</span><span>${m.title}</span><span class="dot" title="${m.diff}"></span></button>`).join('');
  $('#picker').innerHTML=META.map(m=>`<option value="${m.id}">${m.id}. ${m.title} (${m.diff})</option>`).join('');
}
function setFrame(i,instant,fromTick){
  fi=Math.max(0,Math.min(frames.length-1,i));
  const f=frames[fi];paint(layout(f));
  const cap=$('#cap');cap.classList.add('swap');setTimeout(()=>{cap.innerHTML=f.cap;cap.classList.remove('swap')},instant?0:140);
  $('#scrub').value=fi;$('#ctr').textContent=`${fi+1} / ${frames.length}`;
  $('#play').textContent=playing?'❚❚ Pause':(fi===frames.length-1?'↻ Replay':'▶ Play');
  if(voiceOn&&!playing&&!instant)sayNow(speakText(f.cap));
}
function stop(){playing=false;clearTimeout(timer);hush();$('#play').textContent=(fi===frames.length-1?'↻ Replay':'▶ Play')}
function tick(){clearTimeout(timer);if(!playing)return;
  if(voiceOn){const adv=()=>{timer=setTimeout(()=>{if(!playing)return;if(fi>=frames.length-1){stop();return}setFrame(fi+1,false,true);tick()},420/speed)};sayNow(speakText(frames[fi].cap),()=>{if(playing)adv()});return}
  timer=setTimeout(()=>{if(fi>=frames.length-1){stop();return}setFrame(fi+1);tick()},Math.max(900,(1500+f_len(frames[fi].cap)*28)/speed))}
const f_len=s=>s.replace(/<[^>]+>/g,'').length;
function play(){if(fi>=frames.length-1)setFrame(0);playing=true;$('#play').textContent='❚❚ Pause';tick()}
function loadScene(si){
  stop();sceneI=si;const p=byId(pid);const d=p.demos[si];
  frames=p.trace(JSON.parse(JSON.stringify(d.a)));
  document.querySelectorAll('.scenes button').forEach((b,i)=>b.setAttribute('aria-pressed',i===si));
  for(const [k,el] of [...live]){el.remove();live.delete(k)}
  sizeScene(frames);$('#scrub').max=frames.length-1;fi=0;setFrame(0,true);
}
function showProblem(id,auto=true){
  pid=id;const p=byId(id),m=META.find(x=>x.id===id);stop();
  document.querySelectorAll('#index button').forEach(b=>b.setAttribute('aria-current',+b.dataset.id===id));
  $('#picker').value=id;
  $('#ptitle').innerHTML=`<h2>${m.id}. ${m.title}</h2><span class="chip d-${m.diff}">${m.diff}</span><span class="chip plain">${m.pattern}</span>`;
  $('#desc').innerHTML=m.desc.split('\n\n').map(s=>`<p>${md(esc(s))}</p>`).join('');
  $('#scenes').innerHTML=p.demos.map((d,i)=>`<button data-s="${i}">${esc(d.label)}</button>`).join('');
  $('#think').innerHTML=`<ol>${p.think.map(t=>`<li>${t}</li>`).join('')}</ol><div class="cx"><span>time <b>${p.time}</b></span><span>space <b>${p.space}</b></span><span>brute force <b>${p.brute}</b></span></div>`;
  $('#edges').innerHTML=p.edges.map(e=>`<div class="edge"><div class="in">${esc(e[0])}</div><div class="why">${e[1]}</div></div>`).join('');
  $('#code').innerHTML=hl(PY[id]);
  loadScene(0);
  try{history.replaceState(null,'','#p'+id)}catch(e){}
  if(auto){setTimeout(play,500)}
}
document.addEventListener('click',e=>{
  if(e.target.id==='voice'){voiceOn=!voiceOn;setVoiceLabel();if(!voiceOn){hush();return}if(playing){clearTimeout(timer);tick()}else sayNow(speakText(frames[fi].cap));return}
  const ib=e.target.closest('#index button');if(ib)return showProblem(+ib.dataset.id);
  const sb=e.target.closest('#scenes button');if(sb){loadScene(+sb.dataset.s);setTimeout(play,300);return}
  if(e.target.id==='play'){playing?stop():play();return}
  if(e.target.id==='next'){stop();setFrame(fi+1);return}
  if(e.target.id==='prev'){stop();setFrame(fi-1);return}
  if(e.target.id==='first'){stop();setFrame(0);return}
  if(e.target.id==='copy'){const t=PY[pid];const done=()=>{e.target.textContent='Copied'};const fb=()=>{const r=document.createRange();r.selectNodeContents($('#code'));const s=getSelection();s.removeAllRanges();s.addRange(r);e.target.textContent='Selected, press copy'};
    try{navigator.clipboard.writeText(t).then(done,fb)}catch(_){fb()}setTimeout(()=>e.target.textContent='Copy',1800)}
});
$('#scrub').addEventListener('input',e=>{stop();setFrame(+e.target.value)});
$('#speed').addEventListener('change',e=>{speed=+e.target.value;if(playing&&!voiceOn)tick()});

$('#picker').addEventListener('change',e=>showProblem(+e.target.value));
document.addEventListener('keydown',e=>{if(/INPUT|SELECT|TEXTAREA/.test(e.target.tagName))return;
  if(e.key==='ArrowRight'){stop();setFrame(fi+1)}else if(e.key==='ArrowLeft'){stop();setFrame(fi-1)}else if(e.key===' '){e.preventDefault();playing?stop():play()}});

/* ===== voice: pre-rendered clips (audio/<fnv hash of spoken text>.mp3), made by gen_audio.py ===== */
let clip=null;
function sayNow(text,done){
  const t=++vtoken;hushAudio();
  let fired=false;const fin=()=>{if(fired)return;fired=true;if(t===vtoken&&done)done()};
  const a=new Audio('audio/'+fnv(text)+'.mp3');clip=a;a.playbackRate=Math.min(1.6,Math.max(.8,speed>1?1+(speed-1)*.35:speed>.6?1:.9));
  a.onended=fin;
  a.onerror=()=>{ // clip missing: fall back to the browser's own voice so narration never goes silent
    if(window.speechSynthesis&&t===vtoken){const u=new SpeechSynthesisUtterance(text);u.rate=Math.min(1.5,speed);u.onend=fin;u.onerror=fin;speechSynthesis.cancel();speechSynthesis.speak(u)}else fin()};
  const p=a.play();if(p&&p.catch)p.catch(()=>{});
}
function hushAudio(){if(clip){clip.onended=null;clip.onerror=null;try{clip.pause()}catch(e){}clip=null}try{window.speechSynthesis&&speechSynthesis.cancel()}catch(e){}}
function hush(){vtoken++;hushAudio()}
function setVoiceLabel(){$('#voice').textContent=voiceOn?'Voice: on':'Voice: off';$('#voice').setAttribute('aria-pressed',voiceOn)}

buildIndex();
const h=(location.hash.match(/^#p(\d+)$/)||[])[1];
showProblem(h&&byId(+h)?+h:1,true);
