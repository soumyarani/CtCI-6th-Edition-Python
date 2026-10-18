/* 11 Valid Parentheses */
P.push({id:11,
think:['The most recent unmatched opener must be closed first. That is <b>last in, first out</b>, so a stack.','Push every opener. On a closer, pop and check the pair matches. If the stack is empty at a closer, or the pair is wrong, fail.','At the very end the stack must be empty, otherwise some opener never found its closer.'],
edges:[['"]" (closer first)','Stack is empty when the closer arrives. Popping an empty list would raise, so check <code>not stack</code> first.'],['"((" (never closed)','All characters are valid but the stack is non-empty at the end. Forgetting the final check returns True wrongly.'],['"([)]"','Counts balance but the order is wrong. The pop gives "[" when ")" needs "(".'],['Odd length','Can never be valid. Optional early exit.'],['"" (empty)','Constraints say length ≥ 1; an empty string would be valid.']],
time:'O(n)',space:'O(n)',brute:'Repeatedly delete "()", "[]", "{}": O(n²)',
demos:[{label:'s = "{[()]}"',a:["{[()]}"]},{label:'Edge: wrong order "([)]"',a:["([)]"]},{label:'Edge: unclosed "(("',a:["(("]},{label:'Edge: closer first "]"',a:["]"]}],
trace:([s])=>{const F=[],n=s.length,st=[],c=ar(n,'n');const pair={')':'(',']':'[','}':'{'};
 const B=(i,txt,sc)=>[{t:'cells',id:'s',label:'s',v:[...s],c:c.slice(),p:i===null?[]:[{n:'i',i,c:'y'}],idx:false},{t:'text',s:txt||'&nbsp;',fs:22},{t:'cells',id:'st',label:'stack',v:st.length?st.slice():['empty'],c:st.length?st.map((x,j)=>sc&&j===st.length-1?sc:'b'):['d'],idx:false,sub:st.length?st.map((x,j)=>j===st.length-1?'top':''):[],cw:56}];
 F.push(fr(B(null),`Openers wait on a ${K('b','stack')}; a closer must match the newest opener on top.`));
 for(let i=0;i<n;i++){const ch=s[i];c[i]='y*';
  if(!pair[ch]){st.push(ch);F.push(fr(B(i,`push "${ch}"`,'y*'),`${K('y',ch)} is an opener: ${K('b','push')} it.`));c[i]='b'}
  else{
   if(!st.length){c[i]='r*';F.push(fr(B(i,`"${ch}" arrives but the stack is empty`),`${K('r',ch)} is a closer but nothing is waiting. ${K('r','Invalid.')}`));return F}
   F.push(fr(B(i,`"${ch}" needs "${pair[ch]}",  top is "${st[st.length-1]}"`,'o*'),`${K('y',ch)} is a closer. It needs ${K('b',pair[ch])} on top; the top is ${K('o',st[st.length-1])}.`));
   const top=st.pop();
   if(top!==pair[ch]){c[i]='r*';F.push(fr(B(i,`mismatch`),`${K('r','Mismatch.')} Wrong kind of bracket, so the string is invalid.`));return F}
   c[i]='g';
   for(let j=i-1;j>=0;j--)if(c[j]==='b'&&s[j]===top){c[j]='g';break}
   F.push(fr(B(i,`matched, pop`),`${K('g','Match!')} Pop the opener.`))}}
 if(st.length)F.push(fr(B(null,`stack not empty → False`),`The loop ended but ${K('r',st.length)} opener${st.length>1?'s':''} never closed. ${K('r','Invalid.')}`));
 else F.push(fr(B(null,`stack empty → True`),`The stack is empty: every opener found its closer. ${K('g','Valid.')}`));return F}});
/* 12 Daily temperatures */
P.push({id:12,
think:['For each day you want the <b>next greater element</b>. Scanning forward for each day is O(n²).','Keep a stack of days still <i>waiting</i> for a warmer day. Their temperatures are decreasing from bottom to top (a monotonic stack).','When today is warmer than the day on top, that day has found its answer: <code>i − j</code>. Pop and repeat, then push today.'],
edges:[['Strictly decreasing, e.g. [90,80,70]','Nobody finds a warmer day. All zeros, and the stack ends full.'],['Equal temperatures [70,70]','The condition is strictly <code>&lt;</code>, so equal is not warmer. Answer [0,0].'],['Single day','Answer [0].'],['Strictly increasing','Every day is popped by the very next day: all 1s except the last, which is 0.'],['Why indices, not values','You need the day number to compute <code>i − j</code>.']],
time:'O(n)',space:'O(n)',brute:'O(n²)',
demos:[{label:'temps = [73,74,75,71,69,72,76,73]',a:[[73,74,75,71,69,72,76,73]]},{label:'Edge: equal temperatures',a:[[70,70,80,70]]},{label:'Edge: always cooling',a:[[90,80,70,60]]}],
trace:([t])=>{const F=[],n=t.length,st=[],ans=ar(n,0),c=ar(n,'n'),done=ar(n,false);
 const B=(i,txt)=>[{t:'cells',id:'t',label:'temps',v:t,c:c.slice(),p:i===null?[]:[{n:'i',i,c:'y'}]},{t:'cells',id:'ans',label:'answer',v:ans.map((a,j)=>done[j]||a?a:'?'),c:ans.map((a,j)=>done[j]?'g':'d'),idx:false},{t:'text',s:txt||'&nbsp;',fs:21},{t:'cells',id:'st',label:'waiting (idx)',v:st.length?st.map(j=>j):['empty'],c:st.length?st.map(()=>'b'):['d'],sub:st.map(j=>t[j]+'°'),cw:56,idx:false}];
 F.push(fr(B(null),`The ${K('b','stack')} holds days still waiting for a warmer day. Their temperatures only go down as you look from bottom to top.`));
 for(let i=0;i<n;i++){c[i]='y*';
  F.push(fr(B(i,`today ${t[i]}°`),`Day ${i} is ${K('y',t[i]+'°')}. Is it warmer than the day on top of the stack?`));
  while(st.length&&t[st[st.length-1]]<t[i]){const j=st.pop();ans[j]=i-j;done[j]=true;c[j]='g';
   F.push(fr(B(i,`${t[i]} > ${t[j]}  →  answer[${j}] = ${i} − ${j} = ${i-j}`),`${K('g',t[i]+'°')} beats ${t[j]}°. Day ${j} waited ${K('g',i-j)} day${i-j>1?'s':''}. Pop it.`))}
  if(st.length)F.push(fr(B(i,`top ${t[st[st.length-1]]}° ≥ ${t[i]}°: stop popping`),`The top (${t[st[st.length-1]]}°) isn't colder than ${t[i]}°, so it keeps waiting.`));
  st.push(i);c[i]='b';F.push(fr(B(i,`push day ${i}`),`Push day ${i}: it now waits for something warmer.`))}
 F.push(fr(B(null,`left on stack never saw a warmer day → 0`),`Days still on the stack never saw a warmer day, so their answer stays ${K('g','0')}. Result: [${ans.join(', ')}].`));return F}});
/* 13 Search in rotated sorted array */
P.push({id:13,
think:['Cutting a sorted array at a pivot leaves <b>two sorted pieces</b>. At any <code>mid</code>, at least one half <code>[lo..mid]</code> or <code>[mid..hi]</code> is fully sorted.','Find the sorted half: if <code>nums[lo] ≤ nums[mid]</code> the left half is sorted. Then ask: does the target lie inside that sorted half’s range? If so search there, otherwise search the other half.','Every step discards half of the array, so it is binary search: O(log n).'],
edges:[['Target absent','The window empties (<code>lo &gt; hi</code>) and we return −1.'],['One element','mid = lo = hi; either found or lo&gt;hi.'],['Two elements [3,1], target 1','Here <code>lo == mid</code>. The test must be <code>nums[lo] &lt;= nums[mid]</code> (with ≤), otherwise the left "half" of one element is mistaken as unsorted.'],['Not rotated at all','The left half is always sorted; works like ordinary binary search.'],['Target equals nums[lo] or nums[hi]','The sorted-range test uses ≤ on the boundary that is NOT mid, and &lt; on mid (we already checked mid).']],
time:'O(log n)',space:'O(1)',brute:'O(n) linear scan',
demos:[{label:'nums = [4,5,6,7,0,1,2], target = 0',a:[[4,5,6,7,0,1,2],0]},{label:'Edge: target missing',a:[[4,5,6,7,0,1,2],3]},{label:'Edge: two elements',a:[[3,1],1]}],
trace:([a,tg])=>{const F=[],n=a.length;let lo=0,hi=n-1;const c=ar(n,'n');
 const B=(mid,txt,win)=>[{t:'text',s:`target = ${tg}`,c:'y',fs:24},{t:'cells',id:'a',label:'nums',v:a,c:c.slice(),p:mid===null?[{n:'lo',i:Math.min(lo,n-1),c:'y'},{n:'hi',i:Math.max(hi,0),c:'o'}]:[{n:'lo',i:lo,c:'y'},{n:'mid',i:mid,c:'p'},{n:'hi',i:hi,c:'o'}],win:lo<=hi?{l:lo,r:hi,c:'b'}:null},{t:'text',s:txt||'&nbsp;',fs:21}];
 const shade=(lo,hi,mid,left)=>{for(let k=0;k<n;k++)c[k]=(k<lo||k>hi)?'d':'n';if(mid!==null)c[mid]='p*'};
 shade(lo,hi,null);F.push(fr(B(null),`The array is two sorted runs glued together. Binary search still works if we always find the ${K('g','sorted half')}.`));
 while(lo<=hi){const mid=(lo+hi)>>1;shade(lo,hi,mid);
  F.push(fr(B(mid),`mid = ${mid}, nums[mid] = ${a[mid]}${a[mid]===tg?'':''}`+(a[mid]===tg?`. ${K('g','Found it!')}`:`. Not the target.`)));
  if(a[mid]===tg){c[mid]='g*';F.push(fr(B(mid,`found at index ${mid}`),`Answer: index ${K('g',mid)}.`));return F}
  const leftSorted=a[lo]<=a[mid];
  for(let k=lo;k<=hi;k++)if(k!==mid)c[k]=leftSorted?(k<mid?'g':'n'):(k>mid?'g':'n');
  F.push(fr(B(mid,leftSorted?`nums[lo]=${a[lo]} ≤ nums[mid]=${a[mid]}  → left half sorted`:`nums[lo]=${a[lo]} > nums[mid]=${a[mid]}  → right half sorted`),leftSorted?`${a[lo]} ≤ ${a[mid]}, so the ${K('g','left half')} is sorted.`:`${a[lo]} > ${a[mid]}, so the pivot is on the left. The ${K('g','right half')} is sorted.`));
  const L0=lo,H0=hi;
  if(leftSorted){if(a[L0]<=tg&&tg<a[mid]){hi=mid-1;shade(lo,hi,null);F.push(fr(B(null,`${a[L0]} ≤ ${tg} < ${a[mid]}  → search left`),`${K('y',tg)} lies inside the sorted left range. Discard the right half.`))}else{lo=mid+1;shade(lo,hi,null);F.push(fr(B(null,`${tg} is outside [${a[L0]}, ${a[mid]})  → search right`),`${K('y',tg)} can't be in the sorted left range. Discard it and search right.`))}}
  else{if(a[mid]<tg&&tg<=a[H0]){lo=mid+1;shade(lo,hi,null);F.push(fr(B(null,`${a[mid]} < ${tg} ≤ ${a[H0]}  → search right`),`${K('y',tg)} lies inside the sorted right range. Discard the left half.`))}else{hi=mid-1;shade(lo,hi,null);F.push(fr(B(null,`${tg} is outside (${a[mid]}, ${a[H0]}]  → search left`),`${K('y',tg)} can't be in the sorted right range. Discard it and search left.`))}}}
 F.push(fr(B(null,'lo > hi → not found'),`The window is empty: return ${K('r','−1')}.`));return F}});
/* 14 Koko eating bananas */
P.push({id:14,
think:['Don’t search for the answer directly. Notice that if speed <code>k</code> works then every faster speed works too. That monotonic yes/no pattern is the cue for <b>binary search on the answer</b>.','Candidate speeds run from 1 to <code>max(piles)</code>. For a speed k, hours needed = <code>sum(ceil(p / k))</code>.','If hours ≤ h, k is feasible: search lower (<code>hi = mid</code>). Else go higher (<code>lo = mid + 1</code>). Stop when lo meets hi.'],
edges:[['h == len(piles)','Each pile gets exactly one hour, so k must be max(piles).'],['One pile [10], h = 3','Need ceil(10/k) ≤ 3 → k = 4.'],['Huge piles (up to 10⁹)','Linear search over speeds is impossible; binary search needs only ~30 checks.'],['Ceiling division','Use <code>(p + k - 1) // k</code> or <code>-(-p // k)</code>. Plain <code>//</code> would round down.'],['Keep <code>hi = mid</code>','mid itself might be the answer, so don’t discard it. Using <code>hi = mid − 1</code> would skip a correct speed.']],
time:'O(n log max)',space:'O(1)',brute:'O(n · max) trying every speed',
demos:[{label:'piles = [3,6,7,11], h = 8',a:[[3,6,7,11],8]},{label:'Edge: h equals number of piles',a:[[5,9,4],3]},{label:'Edge: one pile',a:[[10],3]}],
trace:([piles,h])=>{const F=[],mx=Math.max(...piles);let lo=1,hi=mx;const ks=Array.from({length:mx},(_,i)=>i+1);
 const col=(mid)=>ks.map(k=>k<lo||k>hi?'d':(k===mid?'y*':'n'));
 const B=(mid,sub,txt)=>[{t:'text',s:`h = ${h} hours`,c:'y',fs:22},{t:'cells',id:'ks',label:'speed k',v:ks,c:col(mid),from:1,idx:false,p:[{n:'lo',i:lo-1,c:'y'},{n:'hi',i:hi-1,c:'o'},...(mid?[{n:'mid',i:mid-1,c:'p'}]:[])],cw:34,ch:34},{t:'cells',id:'pl',label:'piles',v:piles,c:ar(piles.length,mid?'b':'d'),sub,idx:false,cw:60},{t:'text',s:txt||'&nbsp;',fs:21}];
 F.push(fr(B(null,[],''),`Any speed from ${K('y','1')} to ${K('o',mx)} is a candidate. If speed k finishes in time, any faster speed does too.`));
 while(lo<hi){const mid=(lo+hi)>>1;const hrs=piles.map(p=>Math.ceil(p/mid));const tot=hrs.reduce((a,b)=>a+b,0);
  F.push(fr(B(mid,hrs.map((x,i)=>`${x}h`),`k = ${mid}: hours = ${hrs.join(' + ')} = ${tot}`),`Try ${K('p','k = '+mid)}. Each pile takes ${K('b','ceil(pile / k)')} hours: total ${K(tot<=h?'g':'r',tot)} vs allowed ${h}.`));
  if(tot<=h){hi=mid;F.push(fr(B(null,hrs.map(x=>`${x}h`),`${tot} ≤ ${h}  ✓ feasible → try slower: hi = ${mid}`),`${K('g','Fast enough.')} Maybe a slower speed also works. Keep ${mid} (it could be the answer) and set hi = mid.`))}
  else{lo=mid+1;F.push(fr(B(null,hrs.map(x=>`${x}h`),`${tot} > ${h}  ✗ too slow → lo = ${mid+1}`),`${K('r','Too slow.')} Everything ≤ ${mid} is too slow, so lo = ${mid+1}.`))}}
 const kc=ks.map(k=>k===lo?'g*':'d');F.push(fr([{t:'text',s:`h = ${h} hours`,c:'y',fs:22},{t:'cells',id:'ks',label:'speed k',v:ks,c:kc,from:1,idx:false,p:[{n:'k',i:lo-1,c:'g'}],cw:34,ch:34}],`lo and hi met: slowest speed that works is ${K('g',lo)}.`));return F}});
/* 15 Largest rectangle */
P.push({id:15,
think:['For each bar, the best rectangle that uses it as the <i>shortest</i> bar extends left and right until a shorter bar appears. Finding both limits per bar is O(n²).','Keep a stack of bars in <b>increasing</b> height. When a shorter bar arrives, bars taller than it can’t extend further right: pop them and compute their area, with width = distance back to where they started.','The popped bar’s start index is inherited by the new bar, because the new, shorter bar can reach back through everything just popped. A final sentinel bar of height 0 flushes the stack.'],
edges:[['Strictly increasing [1,2,3]','Nothing pops until the sentinel flushes the stack; widths come from each bar’s start index.'],['Equal heights [5,5,5]','Use <code>≥</code> when popping so equal bars merge into one wide rectangle.'],['A zero-height bar','Everything before it is popped; the answer can’t cross a zero.'],['Single bar','Area equals its height times 1.'],['Why the sentinel','Without it, bars still on the stack at the end would never be evaluated.']],
time:'O(n)',space:'O(n)',brute:'O(n²)',
demos:[{label:'heights = [2,1,5,6,2,3]',a:[[2,1,5,6,2,3]]},{label:'Edge: equal bars',a:[[3,3,3]]},{label:'Edge: increasing',a:[[1,2,3,4]]}],
trace:([hs])=>{const F=[],n=hs.length,st=[];let best=0;const cc2=ar(n,'n');let rects=[];
 const B=(i,txt)=>[{t:'bars',id:'h',v:hs,c:cc2.slice(),rects:rects.slice(),h:150,p:(i!==null&&i<n)?[{n:'i',i,c:'y'}]:[]},{t:'text',s:txt||`best area = ${best}`,fs:21},{t:'cells',id:'st',label:'stack (start:h)',v:st.length?st.map(e=>`${e[0]}:${e[1]}`):['empty'],c:st.length?st.map(()=>'b'):['d'],idx:false,cw:70}];
 F.push(fr(B(null),`The stack stores ${K('b','(start, height)')} with heights increasing. A shorter bar forces the taller ones to finalise.`));
 const arr=hs.concat([0]);
 for(let i=0;i<arr.length;i++){const h=arr[i];let start=i;
  if(i<n){cc2[i]='y*';F.push(fr(B(i,`next bar: ${h}`),`Bar ${i} has height ${K('y',h)}.`))}
  else F.push(fr(B(i,`sentinel 0`),`${K('o','Sentinel')} of height 0: it is shorter than everything, so the whole stack flushes.`));
  while(st.length&&st[st.length-1][1]>=h){const [idx,ht]=st.pop();const area=ht*(i-idx);best=Math.max(best,area);start=idx;
   rects=[{l:idx,r:i-1,h:ht,c:'o'}];for(let q=idx;q<=i-1&&q<n;q++);
   F.push(fr(B(i,`pop ${ht}: width ${i} − ${idx} = ${i-idx},  area = ${ht} × ${i-idx} = ${area}`),`${K('o',ht)} ≥ ${h}, so it can't stretch further right. Its rectangle: ${K('o',ht+' × '+(i-idx)+' = '+area)}. Best so far ${K('g',best)}.`));rects=[]}
  st.push([start,h]);if(i<n)cc2[i]='b';
  F.push(fr(B(i,i<n?`push (${start}, ${h})`:`stack: (${start}, 0)`),i<n?`Push ${K('b','('+start+', '+h+')')}. The new bar can reach back to index ${start}.`:`Done. The largest rectangle has area ${K('g',best)}.`))}
 return F}});
/* 16 Reverse linked list */
P.push({id:16,
think:['Walk the list once and <b>flip each arrow</b> to point backwards. You need three names: <code>prev</code> (already reversed part), <code>cur</code> (node being flipped), <code>nxt</code> (the rest).','Order matters: save <code>cur.next</code> in <code>nxt</code> <i>before</i> overwriting it, or you lose the rest of the list.','Move <code>prev</code> and <code>cur</code> forward one step. When <code>cur</code> is None, <code>prev</code> is the new head.'],
edges:[['Empty list (head = None)','The loop never runs and <code>prev</code> is still None. Correct output: None.'],['One node','One flip: its next becomes None. The list is unchanged.'],['Two nodes','Smallest case where order matters.'],['Forgetting to save next','After <code>cur.next = prev</code> you can no longer reach the remainder.'],['Recursive version','Equally valid; uses O(n) call stack. State the iterative one first.']],
time:'O(n)',space:'O(1)',brute:'Copy into an array and rebuild: O(n) time, O(n) space',
demos:[{label:'1 → 2 → 3 → 4',a:[[1,2,3,4]]},{label:'Edge: single node',a:[[1]]},{label:'Edge: empty list',a:[[]]}],
trace:([vals])=>{const F=[],m=vals.length;
 if(!m){return [fr([{t:'cells',id:'l',label:'head',v:['None'],c:['d'],idx:false},{t:'text',s:'prev = None,  cur = None',fs:22}],`Empty list: the loop never starts and ${K('g','prev = None')} is returned. Nothing to reverse.`)]}
 const v=['None',...vals,'None'];const slots=v.length-1;let rev=Array.from({length:slots},(_,j)=>j===0?null:false);const col=v.map((x,i)=>x==='None'?'d':'n');let prev=0,cur=1,nxt=null;
 const B=(txt)=>[{t:'cells',id:'l',v:v.slice(),c:col.slice(),idx:false,arrows:true,rev:rev.slice(),p:[{n:'prev',i:prev,c:'g'},{n:'cur',i:cur,c:'y'},...(nxt!==null?[{n:'nxt',i:nxt,c:'p'}]:[])],cw:60},{t:'text',s:txt||'&nbsp;',fs:21}];
 F.push(fr(B(),`${K('g','prev')} starts as None, ${K('y','cur')} at the head. We'll flip one arrow per step.`));
 while(cur<=m){nxt=cur+1;col[cur]='y*';
  F.push(fr(B(`nxt = cur.next`),`Save ${K('p','nxt = cur.next')} first, otherwise flipping the arrow would lose the rest of the list.`));
  rev[cur]=null;rev[cur-1]=true;col[cur]='g';
  F.push(fr(B(`cur.next = prev`),`Flip: ${K('y','cur.next = prev')}. The arrow now points backwards.`));
  prev=cur;cur=nxt;nxt=null;
  F.push(fr(B(`prev, cur = cur, nxt`),`Advance: ${K('g','prev')} takes cur, ${K('y','cur')} takes nxt.`))}
 F.push(fr(B(`cur is None → return prev`),`${K('y','cur')} fell off the end. ${K('g','prev')} is the new head: ${K('g',[...vals].reverse().join(' → '))}.`));return F}});
/* 17 Remove Nth from end */
P.push({id:17,
think:['The length is unknown, and counting first costs an extra pass. Use <b>two pointers with a fixed gap</b>.','Move <code>fast</code> ahead by n+1 steps; then move both until <code>fast</code> hits None. <code>slow</code> now stands right <i>before</i> the node to delete.','Add a <b>dummy node</b> in front of the head. Then removing the head itself needs no special case.'],
edges:[['n equals the length (delete the head)','slow stays on the dummy and the head is skipped. This is exactly why the dummy exists.'],['Single node, n = 1','The list becomes empty: returns <code>dummy.next</code> = None.'],['n = 1 (delete the tail)','slow ends on the second-to-last node.'],['n larger than length','Guaranteed not to happen. Otherwise fast would hit None early.'],['Gap is n + 1, not n','The gap of n+1 leaves slow one node <i>before</i> the target so we can re-link.']],
time:'O(n)',space:'O(1)',brute:'Two passes: count length, then walk to L − n: O(n)',
demos:[{label:'1→2→3→4→5, n = 2',a:[[1,2,3,4,5],2]},{label:'Edge: remove the head',a:[[1,2,3],3]},{label:'Edge: single node',a:[[1],1]}],
trace:([vals,n])=>{const F=[],m=vals.length;let v=['D',...vals,'None'];const col=v.map((x,i)=>i===0?'p':x==='None'?'d':'n');let fast=0,slow=0;
 const B=(txt,ptrs)=>[{t:'cells',id:'l',v:v.slice(),c:col.slice(),idx:false,arrows:true,rev:v.slice(0,-1).map(()=>false),p:ptrs||[{n:'slow',i:slow,c:'g'},{n:'fast',i:fast,c:'o'}],cw:60},{t:'text',s:txt||'&nbsp;',fs:21}];
 F.push(fr(B(`remove the ${n}${n===2?'nd':n===1?'st':n===3?'rd':'th'} node from the end`),`${K('p','D')} is a dummy node before the head, so deleting the head isn't a special case. Both pointers start there.`));
 for(let k=0;k<=n;k++){fast++;F.push(fr(B(`fast moves ${k+1} of ${n+1}`),`Open a gap: ${K('o','fast')} advances ${k+1} of ${n+1} steps while ${K('g','slow')} waits.`))}
 while(fast<m+1){fast++;slow++;F.push(fr(B(`both move`),`Move both one step. The gap stays ${n+1}.`))}
 col[slow+1]='r*';F.push(fr(B(`fast is None → slow is just before the target`),`${K('o','fast')} reached None. ${K('g','slow')} stands just before the node to delete: ${K('r',v[slow+1])}.`));
 v=v.filter((x,i)=>i!==slow+1);const c2=col.filter((x,i)=>i!==slow+1);for(let i=0;i<c2.length;i++)col[i]=c2[i];col.length=c2.length;
 const keep=vals.filter((x,i)=>i!==m-n);
 F.push(fr(B(`slow.next = slow.next.next`,[{n:'slow',i:slow,c:'g'}]),`Re-link: ${K('g','slow.next = slow.next.next')}. Result: ${keep.length?K('g',keep.join(' → ')):K('g','empty list')}.`));return F}});
/* 18 Level order */
P.push({id:18,
think:['Breadth-first means "everything at distance d before distance d+1". A <b>queue</b> gives that order.','To split by level, freeze <code>len(queue)</code> at the start of each round. Exactly that many nodes belong to the current level; their children go to the back for the next round.','Return the per-level lists in order.'],
edges:[['Empty tree (root = None)','Return [] immediately; <code>deque([None])</code> would crash.'],['Single node','[[val]].'],['Skewed tree 1→2→3','Each level has one node, giving [[1],[2],[3]]. Queue never holds more than one.'],['Why freeze the length','If you loop <code>while q</code> inside a level, the next level’s children mix in.'],['Missing children','Only push non-null children.']],
time:'O(n)',space:'O(w) for widest level',brute:'DFS with a depth parameter is also O(n)',
demos:[{label:'tree = [3, 9, 20, null, null, 15, 7]',a:[[3,9,20,null,null,15,7]]},{label:'Edge: left-skewed chain',a:[[1,2,null,3]]},{label:'Edge: empty tree',a:[[]]}],
trace:([v])=>{const F=[];if(!v.length||v[0]===null)return [fr([{t:'text',s:'root = None',fs:26,c:'d'},{t:'text',s:'result = [ ]',fs:24,c:'g'}],`Empty tree: return ${K('g','[]')} immediately. Never put None in the queue.`)];
 const {kids}=treeKids(v);const col=v.map(x=>x===null?'n':'n');const ann={};let q=[0];const res=[];
 const B=(txt,hi)=>[{t:'tree',id:'t',v,c:col.slice(),ann:Object.assign({},ann),h:200},{t:'cells',id:'q',label:'queue',v:q.length?q.map(i=>v[i]):['empty'],c:q.length?q.map(i=>hi&&hi.includes(i)?'y*':'b'):['d'],idx:false,cw:54},{t:'text',s:txt||'result = '+JSON.stringify(res).replace(/,/g,', '),fs:21,c:'g'}];
 F.push(fr(B(),`A ${K('b','queue')} holds nodes waiting to be visited. Start with the root.`));
 while(q.length){const sz=q.length;const lvl=q.slice();lvl.forEach(i=>col[i]='y*');
  F.push(fr(B(`level size = ${sz}`,lvl),`Freeze ${K('y','len(queue) = '+sz)}. Exactly ${sz} node${sz>1?'s':''} belong to this level.`));
  const out=[];for(const i of lvl){out.push(v[i]);col[i]='g';}
  const nq=[];for(const i of lvl)for(const k of kids[i])if(k!==null)nq.push(k);
  q=nq;res.push(out);
  F.push(fr(B(),`Pop them in order, collect ${K('g',JSON.stringify(out).replace(/,/g,', '))}, and queue their children for the next round.`))}
 F.push(fr(B(),`Queue empty. Result: ${K('g',JSON.stringify(res).replace(/,/g,', '))}.`));return F}});
/* 19 Validate BST */
P.push({id:19,
think:['Checking each node against only its parent is the <b>classic mistake</b>. A node deep in the right subtree must still be larger than the root.','Pass down a range <code>(lo, hi)</code>. Going left, the parent’s value becomes the new <code>hi</code>; going right, it becomes the new <code>lo</code>.','Each node must satisfy <code>lo &lt; val &lt; hi</code> strictly. Start with (−∞, +∞).'],
edges:[['[5,4,6,null,null,3,7]','Every parent-child pair looks fine on its own (3 &lt; 6 and 7 &gt; 6). But 3 sits in the right subtree of 5, so it must exceed 5. The range (5, 6) catches it.'],['Duplicates [2,2,2]','Strict inequality: equal values are invalid in a BST.'],['Single node','Always valid.'],['Values at int limits (−2³¹, 2³¹−1)','Use ±infinity (<code>float("inf")</code>), not INT_MIN/MAX, or the extreme values fail.'],['In-order alternative','An in-order traversal must be strictly increasing; keep a <code>prev</code> value.']],
time:'O(n)',space:'O(h)',brute:'Check every node against its entire subtree: O(n²)',
demos:[{label:'tree = [8, 3, 10, 1, 6, null, 14]',a:[[8,3,10,1,6,null,14]]},{label:'Edge: the grandchild trap',a:[[5,4,6,null,null,3,7]]},{label:'Edge: duplicates',a:[[2,2,2]]}],
trace:([v])=>{const F=[],{kids}=treeKids(v);const col=v.map(()=>'n'),ann={},ac={};const f=x=>x===-Infinity?'−∞':x===Infinity?'+∞':x;
 const B=(txt)=>[{t:'tree',id:'t',v,c:col.slice(),ann:Object.assign({},ann),ac:Object.assign({},ac),h:200},{t:'text',s:txt||'&nbsp;',fs:22}];
 F.push(fr(B(),`Each node carries the ${K('y','allowed range (lo, hi)')} inherited from all ancestors, not just its parent.`));
 let failed=false;
 const go=(i,lo,hi)=>{if(i===null||failed)return;ann[i]=`(${f(lo)}, ${f(hi)})`;ac[i]='y';col[i]='y*';const ok=lo<v[i]&&v[i]<hi;
  F.push(fr(B(`${f(lo)} < ${v[i]} < ${f(hi)} ?  ${ok?'✓':'✗'}`),ok?`Node ${K('y',v[i])} must lie in ${K('y','('+f(lo)+', '+f(hi)+')')}. It does.`:`Node ${K('r',v[i])} must lie in (${f(lo)}, ${f(hi)}) but ${K('r','does not')}. Invalid!`));
  if(!ok){col[i]='r*';ac[i]='r';failed=true;F.push(fr(B(`✗ not a BST`),`${K('r','Not a valid BST')}: ${v[i]} violates a bound set by an ancestor.`));return}
  col[i]='g';go(kids[i][0],lo,v[i]);go(kids[i][1],v[i],hi)};
 go(0,-Infinity,Infinity);
 if(!failed)F.push(fr(B(`every node inside its range → True`),`All nodes passed their ranges: ${K('g','valid BST')}.`));return F}});
/* 20 Merge k sorted lists */
P.push({id:20,
think:['Merging two sorted lists is a two-pointer job. For k lists, you need the <b>smallest head among k</b> at each step.','A min-heap holds exactly one candidate (the current head) from each list. Pop the smallest, append it to the output, then push that list’s next node.','The heap never exceeds k items, so each of N total nodes costs O(log k).'],
edges:[['k = 0 or all lists empty','Heap starts empty; return None.'],['Some lists empty','Skip them when seeding the heap (<code>if node</code>).'],['Equal values across lists','Tuples <code>(val, i, node)</code> compare by <code>i</code> next. Without <code>i</code>, Python would try to compare ListNodes and raise TypeError.'],['One list only','Output equals that list.'],['Divide and conquer alternative','Pairwise merge in rounds also gives O(N log k).']],
time:'O(N log k)',space:'O(k)',brute:'Concatenate and sort: O(N log N)',
demos:[{label:'lists = [1,4,5], [1,3,4], [2,6]',a:[[[1,4,5],[1,3,4],[2,6]]]},{label:'Edge: empty lists mixed in',a:[[[],[5],[2,3]]]},{label:'Edge: equal values across lists',a:[[[1,1],[1]]]}],
trace:([lists])=>{const F=[],k=lists.length;const pos=ar(k,0);const out=[];let heap=[];
 const lc=(j)=>lists[j].length?lists[j].map((x,q)=>q<pos[j]?'d':(heap.some(h=>h[1]===j&&h[2]===q)?'y*':'n')):['d'];
 const B=(txt,hl)=>[...lists.map((l,j)=>({t:'cells',id:'L'+j,label:'list '+j,v:l.length?l:['∅'],c:l.length?l.map((x,q)=>q<pos[j]?'d':(heap.some(h=>h[1]===j&&h[2]===q)?(hl&&hl[1]===j&&hl[2]===q?'o*':'y*'):'n')):['d'],idx:false,gap:6,cw:44,ch:36})),
  {t:'cells',id:'hp',label:'heap',v:heap.length?heap.map(h=>h[0]):['empty'],c:heap.length?heap.map((h,i)=>i===0?'o*':'y'):['d'],sub:heap.map(h=>'L'+h[1]),idx:false,cw:44,ch:36,gap:6},
  {t:'cells',id:'out',label:'merged',v:out.length?out:['·'],c:out.length?out.map(()=>'g'):['d'],idx:false,cw:44,ch:36,gap:2},
  {t:'text',s:txt||'&nbsp;',fs:20}];
 const sortH=()=>heap.sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
 for(let j=0;j<k;j++)if(lists[j].length)heap.push([lists[j][0],j,0]);sortH();
 F.push(fr(B(`heap = one head from every non-empty list`),`Seed the ${K('y','min-heap')} with the first node of each non-empty list.`));
 while(heap.length){const top=heap[0];
  F.push(fr(B(`smallest head: ${top[0]} from list ${top[1]}`,top),`The heap's smallest value is ${K('o',top[0])} (list ${top[1]}).`));
  heap.shift();out.push(top[0]);pos[top[1]]++;
  const nxt=lists[top[1]][top[2]+1];
  if(nxt!==undefined){heap.push([nxt,top[1],top[2]+1]);sortH()}
  F.push(fr(B(nxt!==undefined?`pop ${top[0]}, push next of list ${top[1]}: ${nxt}`:`pop ${top[0]}; list ${top[1]} is exhausted`),`Append ${K('g',top[0])} to the output. ${nxt!==undefined?`Push list ${top[1]}'s next node, ${K('y',nxt)}.`:`List ${top[1]} has no more nodes.`}`))}
 F.push(fr(B(`merged = [${out.join(', ')}]`),`Heap empty. Merged list: ${K('g','['+out.join(', ')+']')}.`));return F}});
