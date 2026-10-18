const fs=require('fs');const dir=__dirname+'/src/';
let code=['layout.js','probs1.js','probs2.js','probs3.js'].map(f=>fs.readFileSync(dir+f,'utf8')).join('\n');
code+=`
const out={},by={};for(const p of P){by[p.id]=[];for(const d of p.demos){for(const f of p.trace(JSON.parse(JSON.stringify(d.a)))){const t=speakText(f.cap);if(t){out[fnv(t)]=t;if(!by[p.id].includes(fnv(t)))by[p.id].push(fnv(t))}}}}require('fs').writeFileSync('${__dirname}/clips_by_problem.json',JSON.stringify(by));
require('fs').writeFileSync('${__dirname}/captions.json',JSON.stringify(out,null,0));console.log(Object.keys(out).length,Object.values(out).reduce((a,b)=>a+b.length,0))`;
fs.writeFileSync('/tmp/_d.js',code);require('child_process').execSync('node /tmp/_d.js',{stdio:'inherit'});
