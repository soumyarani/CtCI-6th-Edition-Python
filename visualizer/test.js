const fs=require('fs');const dir=__dirname+'/src/';
let code=fs.readFileSync(dir+'layout.js','utf8');
const files=process.argv.slice(2);
for(const f of files)code+='\n'+fs.readFileSync(dir+f,'utf8');
code+=`
let bad=0;
for(const p of P){for(const d of p.demos){let F;try{F=p.trace(JSON.parse(JSON.stringify(d.a)))}catch(e){console.log('THROW',p.id,d.label,e.stack.split('\\n').slice(0,3).join(' | '));bad++;continue}
 if(!F.length){console.log('EMPTY',p.id);bad++}
 F.forEach((f,fi)=>{let items;try{items=layout(f)}catch(e){console.log('LAYTHROW',p.id,fi,e.message);bad++;return}
  for(const it of items){if(it.kind==='line')continue;if(it.x<-1||it.x+it.w>W+1||it.y<-1||it.y+it.h>H+1){console.log('OOB',p.id,d.label,'f'+fi,it.k,Math.round(it.x),Math.round(it.y),Math.round(it.w),Math.round(it.h));bad++;break}}
  const keys=new Set();for(const it of items){if(keys.has(it.k)){console.log('DUPKEY',p.id,fi,it.k);bad++;break}keys.add(it.k)}});
 const last=F[F.length-1].cap.replace(/<[^>]+>/g,'');console.log(p.id,d.label,'frames',F.length,'|',last)}}
console.log('problems',P.length,'bad',bad);`;
fs.writeFileSync('/tmp/_t.js',code);
require('child_process').execSync('node /tmp/_t.js',{stdio:'inherit'});
