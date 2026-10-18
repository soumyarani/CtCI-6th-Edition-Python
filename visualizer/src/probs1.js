const P=[];const fr=(b,cap)=>({b,cap});
const ar=(n,c)=>Array(n).fill(c);
/* 1 Two Sum */
P.push({id:1,
think:['<b>Brute force</b> tries every pair: n² checks. Ask what you are really searching for: for each <code>x</code> you need one specific partner, <code>target − x</code>.','So instead of searching the array again, <b>remember</b> every value you have passed, along with its index. A dictionary answers "have I seen it?" in O(1).','Order matters: <b>check first, store second</b>. That way an element can never pair with itself.'],
edges:[['[3, 2, 4], target 6','The partner of 3 is 3 itself. Because 3 is stored only after the lookup, the lookup misses, so the single 3 never pairs with itself.'],['[3, 3], target 6','Two equal values at different indices are a valid answer. The second 3 finds the first one in the map.'],['Negatives and zero, e.g. [-3, 4, 90, 3], 0','Nothing here assumes positive numbers. Equality in the dictionary is all that matters.'],['Exactly one answer is promised','Say that assumption out loud. A final <code>return []</code> is a harmless safety net.']],
time:'O(n)',space:'O(n)',brute:'O(n²)',
demos:[{label:'nums = [2, 11, 7, 15], target = 9',a:[[2,11,7,15],9]},{label:'Edge: element must not pair with itself',a:[[3,2,4],6]},{label:'Edge: negatives',a:[[-3,4,90,3],0]}],
trace:([nums,t])=>{const F=[],n=nums.length,seen=[];
 const B=(i,c,eq)=>[{t:'text',s:`target = ${t}`,c:'y',fs:24},{t:'cells',id:'nums',label:'nums',v:nums,c,p:i===null?[]:[{n:'i',i,c:'y'}]},{t:'text',s:eq||'&nbsp;',c:'n',fs:22},{t:'dict',id:'seen',label:'seen',e:seen.map(e=>e.slice()),empty:'{ }  value → index'}];
 F.push(fr(B(null,ar(n,'n')),`We need two positions whose values add up to ${K('y',t)}. Instead of testing every pair, we keep a dictionary of everything we have already walked past.`));
 for(let i=0;i<n;i++){const x=nums[i],need=t-x,c=ar(n,'n');for(const e of seen)c[e[1]]='d';c[i]='y*';
  const hit=seen.find(e=>e[0]===need);
  F.push(fr(B(i,c,`need = ${t} − (${x}) = ${need}`),`At index ${i} the value is ${K('y',x)}. Its partner must be ${K('b',need)}. Have we seen ${need}?`));
  if(hit){const c2=ar(n,'d');c2[i]='g*';c2[hit[1]]='g*';const s2=seen.map(e=>e===hit?[e[0],e[1],'g*']:e.slice());seen.length=0;s2.forEach(e=>seen.push(e));
   F.push(fr(B(i,c2,`${need} + ${x} = ${t}   ✓`),`${K('g','Yes!')} ${need} sits at index ${hit[1]}. Answer: ${K('g',`[${hit[1]}, ${i}]`)}. One pass, no pair-by-pair search.`));break}
  seen.push([x,i,'b']);
  F.push(fr(B(i,c,`need = ${t} − (${x}) = ${need}`),`${K('r','No.')} Remember ${K('b',x)} at index ${i} and move on. (Stored <i>after</i> checking, so ${x} can't pair with itself.)`));}
 return F}});
/* 2 Group Anagrams */
P.push({id:2,
think:['Two words are anagrams exactly when they share a <b>canonical form</b>. Find a signature that is identical for every rearrangement.','Sorting the letters works: <code>"eat"</code>, <code>"tea"</code>, <code>"ate"</code> all become <code>"aet"</code>. Use the signature as a dictionary key and append the word.','A list cannot be a key (not hashable), but a <code>tuple</code> or a string can.'],
edges:[['[""]','The empty string sorts to the empty tuple <code>()</code>, a perfectly good key. The answer is [[""]].'],['["", ""]','Both empty strings share a key and land in one group: [["", ""]].'],['["a"]','Single word, single group.'],['Duplicates like ["ab", "ab"]','Duplicates are kept. Both go in the same group.'],['Different lengths','Words of different lengths never share a signature, so they are separated for free.']],
time:'O(n · k log k)',space:'O(n · k)',brute:'O(n² · k) comparing all pairs',
demos:[{label:'["eat","tea","tan","ate","nat","bat"]',a:[["eat","tea","tan","ate","nat","bat"]]},{label:'Edge: empty strings and duplicates',a:[["","b","","b","ab","ba"]]}],
trace:([strs])=>{const F=[],n=strs.length,g=new Map();const pal=['b','y','g','o','p','t','r'];
 const B=(i,c,eq)=>[{t:'cells',id:'w',label:'strs',v:strs.map(s=>s===''?'""':s),c,cw:72,p:i===null?[]:[{n:'w',i,c:'y'}]},{t:'text',s:eq||'&nbsp;',fs:22},{t:'dict',id:'g',label:'groups',e:[...g].map(([k,v],j)=>[k,'['+v.map(s=>s===''?'""':s).join(', ')+']',pal[j%pal.length]]),empty:'{ }  signature → words',arrow:'→'}];
 F.push(fr(B(null,ar(n,'n')),`Goal: put anagrams in the same bucket. Idea: give every word a ${K('y','signature')} that rearranging can't change.`));
 const col=ar(n,'n');
 for(let i=0;i<n;i++){const k=[...strs[i]].sort().join('');const c=col.slice();c[i]='y*';
  F.push(fr(B(i,c,`sorted(${JSON.stringify(strs[i])}) = ${JSON.stringify(k)}`),`Sort the letters of ${K('y',JSON.stringify(strs[i]))} to get the key ${K('b',JSON.stringify(k))}.`));
  const isNew=!g.has(k);if(isNew)g.set(k,[]);g.get(k).push(strs[i]);
  const keys=[...g.keys()];col[i]=pal[keys.indexOf(k)%pal.length];
  F.push(fr(B(i,col.map((x,j)=>j===i?x+'*':x),`bucket[${JSON.stringify(k)}] ← ${JSON.stringify(strs[i])}`),isNew?`New key, so we open a new group.`:`${K('g','Key already exists')}: join that group.`))}
 F.push(fr(B(null,col),`Read off the dictionary values: ${K('g',[...g.values()].length+' groups')}. Same colour means same bucket.`));return F}});
/* 3 Top K */
P.push({id:3,
think:['First <b>count</b> every value. Then the question becomes "which k counts are largest?"','Sorting counts costs O(n log n). A heap gives O(n log k). To reach O(n), notice a count can never exceed <code>len(nums)</code>.','So use <b>buckets indexed by frequency</b>: bucket[c] holds all values appearing c times. Walk from the highest bucket down until you have k values.'],
edges:[['[1], k = 1','Only one element, so bucket 1 holds it. Buckets need length n+1 so index n exists.'],['All values equal, e.g. [7,7,7], k = 1','The frequency is n, the very last bucket. This is why we allocate n+1.'],['k equals the number of distinct values','Every distinct value is returned; the loop ends when the buckets run out.'],['Ties at the boundary','The problem guarantees a unique answer, so a tie at position k never happens.']],
time:'O(n)',space:'O(n)',brute:'O(n log n) by sorting counts',
demos:[{label:'nums = [1,1,1,2,2,3], k = 2',a:[[1,1,1,2,2,3],2]},{label:'Edge: single element',a:[[7],1]},{label:'Edge: all equal',a:[[4,4,4,4],1]}],
trace:([nums,k])=>{const F=[],n=nums.length,cnt=new Map();
 const B=(i,c,extra=[])=>[{t:'cells',id:'nums',label:'nums',v:nums,c,p:i===null?[]:[{n:'i',i,c:'y'}]},{t:'dict',id:'cnt',label:'count',e:[...cnt].map(([a,b])=>[a,b,'b']),empty:'{ }  value → count'},...extra];
 F.push(fr(B(null,ar(n,'n')),`Step 1: count how often each value appears.`));
 const c0=ar(n,'n');for(let i=0;i<n;i++){cnt.set(nums[i],(cnt.get(nums[i])||0)+1);c0[i]='b';const c=c0.slice();c[i]='y*';F.push(fr(B(i,c),`Value ${K('y',nums[i])} → count is now ${K('b',cnt.get(nums[i]))}.`))}
 const buckets=Array.from({length:n+1},()=>[]);for(const [v,c] of cnt)buckets[c].push(v);
 const bc=ar(n+1,'d');
 const BK=(c,p)=>[{t:'text',s:'bucket[c] = values that appear c times',c:'y',fs:20},{t:'cells',id:'bk',label:'buckets',v:buckets.map(b=>b.length?b.join(','):'·'),c,cw:60,from:0,p}];
 F.push(fr([...B(null,ar(n,'d')),...BK(buckets.map((b,i)=>b.length?'b':'d'),[])],`Step 2: file each value under its count. Bucket index = frequency, so a bucket can't be past ${K('y','n = '+n)}.`));
 const out=[];let done=false;
 for(let c=n;c>=1&&!done;c--){const cl=buckets.map((b,i)=>b.length?'b':'d');cl[c]='y*';
  const take=buckets[c];
  F.push(fr([...B(null,ar(n,'d')),...BK(cl,[{n:'c',i:c,c:'y'}]),{t:'text',s:`picked: [${out.join(', ')}]`,fs:22,c:'g'}],take.length?`Scan from the right. Bucket ${K('y',c)} holds ${K('g',take.join(', '))}.`:`Bucket ${c} is empty. Keep going left.`));
  for(const v of take){out.push(v);if(out.length===k){done=true;break}}
  if(take.length){const cl2=cl.slice();F.push(fr([...B(null,ar(n,'d')),...BK(cl2.map((x,i)=>i===c?'g*':x),[{n:'c',i:c,c:'y'}]),{t:'text',s:`picked: [${out.join(', ')}]`,fs:22,c:'g'}],done?`We have ${K('g','k = '+k)} values: ${K('g','['+out.join(', ')+']')}.`:`Collected ${take.join(', ')}. Still need ${k-out.length} more.`))}}
 return F}});
/* 4 Product except self */
P.push({id:4,
think:['Division is banned, and zeros would break it anyway. Look at what <code>answer[i]</code> really is: <b>(everything to the left) × (everything to the right)</b>.','Pass 1, left to right: write the running product of the left side into the output, <i>then</i> multiply the running value by <code>nums[i]</code>.','Pass 2, right to left: multiply each output cell by the running product of the right side. No second array is needed.'],
edges:[['One zero, e.g. [-1,1,0,-3,3]','Only the position of the zero gets a non-zero answer; every other cell contains the zero in its product.'],['Two or more zeros','Every product contains at least one zero, so the whole answer is zeros. The prefix/suffix method handles this with no special case.'],['Length 2: [2, 3]','The answer is simply swapped: [3, 2]. Left of index 0 is empty (product 1).'],['Negative values','Signs are handled by ordinary multiplication; nothing special.'],['Why start at 1','An empty product is 1, the multiplicative identity.']],
time:'O(n)',space:'O(1) extra',brute:'O(n²)',
demos:[{label:'nums = [1, 2, 3, 4]',a:[[1,2,3,4]]},{label:'Edge: contains a zero',a:[[2,0,3,4]]}],
trace:([nums])=>{const F=[],n=nums.length,res=ar(n,1),shown=ar(n,'');
 const B=(i,rc,run,txt,pn)=>[{t:'cells',id:'nums',label:'nums',v:nums,c:ar(n,'n').map((x,j)=>j===i?'y*':x),p:i===null?[]:[{n:'i',i,c:'y'}]},{t:'cells',id:'res',label:'answer',v:res.map((v,j)=>shown[j]===''?'?':v),c:rc,idx:false},{t:'text',s:txt||'&nbsp;',c:'n',fs:22}];
 F.push(fr(B(null,ar(n,'d')),`answer[i] = (product of everything ${K('b','left')} of i) × (product of everything ${K('o','right')} of i). We build both halves in the same array.`));
 let left=1;const rc=ar(n,'d');
 for(let i=0;i<n;i++){res[i]=left;shown[i]=1;rc[i]='b*';F.push(fr(B(i,rc.slice(),left,`left = ${left}  →  answer[${i}] = ${left}`),`Pass 1: write the product of everything to the left (${K('b',left)}) into answer[${i}].`));rc[i]='b';left*=nums[i];
  F.push(fr(B(i,rc.slice(),left,`left = left × ${nums[i]} = ${left}`),`Then fold ${K('y',nums[i])} into the running left product.`))}
 let right=1;
 for(let i=n-1;i>=0;i--){const before=res[i];res[i]=before*right;rc[i]='o*';
  F.push(fr(B(i,rc.slice(),right,`answer[${i}] = ${before} × right(${right}) = ${res[i]}`),`Pass 2: multiply by the product of everything to the right (${K('o',right)}).`));rc[i]='g';right*=nums[i];
  F.push(fr(B(i,rc.slice(),right,`right = right × ${nums[i]} = ${right}`),`Fold ${K('y',nums[i])} into the running right product.`))}
 F.push(fr(B(null,ar(n,'g')),`Done: ${K('g','['+res.join(', ')+']')}, no division and no extra array.`));return F}});
/* 5 Trapping rain water */
P.push({id:5,
think:['Water above bar i is <code>min(tallest to the left, tallest to the right) − height[i]</code>. Precomputing both maxima costs O(n) space.','Two pointers remove that array. If <code>height[l] &lt; height[r]</code>, the left side is the limiting wall: whatever the right max is, it is at least <code>height[r]</code> which is already taller. So the water at <code>l</code> is <b>already decided</b> by <code>left_max</code>.','Move the pointer on the smaller side inward, update its running max, add the water, repeat.'],
edges:[['[1] or [1, 2, 3] (monotonic)','No bar has a taller wall on both sides, so the answer is 0.'],['Fewer than 3 bars','Water needs two walls and a valley. The pointer loop ends with 0.'],['Plateaus: equal heights','On <code>height[l] == height[r]</code> we take the else branch; either choice is correct.'],['Leading and trailing zeros, e.g. [0,2,0]','The left_max starts at 0, so nothing is added there. Edge bars never hold water.'],['Large values (up to 10⁵ × 2·10⁴)','Python ints don’t overflow; in other languages use 64-bit.']],
time:'O(n)',space:'O(1)',brute:'O(n²), or O(n) time with O(n) arrays',
demos:[{label:'height = [0,1,0,2,1,0,1,3,2,1,2,1]',a:[[0,1,0,2,1,0,1,3,2,1,2,1]]},{label:'Edge: strictly increasing',a:[[1,2,3,4,5]]},{label:'Edge: valley between walls',a:[[4,2,0,3,2,5]]}],
trace:([h])=>{const F=[],n=h.length;let l=0,r=n-1,lm=0,rm=0,w=0;const wt=ar(n,0),c=ar(n,'n');
 const B=(txt)=>[{t:'bars',id:'bars',v:h,c:c.slice(),water:wt.slice(),p:[{n:'l',i:l,c:'y'},{n:'r',i:r,c:'o'}],h:170},{t:'text',s:txt||`left_max = ${lm}    right_max = ${rm}    water = ${w}`,fs:21,c:'n'}];
 F.push(fr(B(),`Bars are walls. Water fills any valley that has a taller wall on both sides. We use ${K('y','l')} and ${K('o','r')} walking inward.`));
 while(l<r){
  if(h[l]<h[r]){F.push(fr(B(),`${K('y','height[l]')} = ${h[l]} is shorter than ${K('o','height[r]')} = ${h[r]}. The left side limits the water, so we can finish bar ${l} now.`));
   lm=Math.max(lm,h[l]);const add=lm-h[l];w+=add;wt[l]=add;c[l]=add?'b':'g';
   F.push(fr(B(),add?`left_max = ${lm}. Bar ${l} holds ${K('b',lm+' − '+h[l]+' = '+add)} units.`:`left_max = ${lm}. Bar ${l} is itself the wall, so it holds 0.`));l++}
  else{F.push(fr(B(),`${K('o','height[r]')} = ${h[r]} ≤ ${K('y','height[l]')} = ${h[l]}. The right side limits the water, so finish bar ${r}.`));
   rm=Math.max(rm,h[r]);const add=rm-h[r];w+=add;wt[r]=add;c[r]=add?'b':'g';
   F.push(fr(B(),add?`right_max = ${rm}. Bar ${r} holds ${K('b',rm+' − '+h[r]+' = '+add)} units.`:`right_max = ${rm}. Bar ${r} is a wall, so it holds 0.`));r--}}
 F.push(fr(B(`total water = ${w}`),`Pointers met. Total trapped: ${K('b',w)} units.`));return F}});
/* 6 Valid Palindrome */
P.push({id:6,
think:['Cleaning the string first (<code>filter</code> + <code>lower</code> + reverse) works but costs O(n) extra space.','With two pointers you clean <b>on the fly</b>: move <code>l</code> right past junk, move <code>r</code> left past junk, then compare the survivors case-insensitively.','Always guard the inner skips with <code>l &lt; r</code> so they cannot run past each other.'],
edges:[['" " or ""','After removing non-alphanumerics nothing remains. An empty string is a palindrome: True.'],['"0P"','Digits count as alphanumeric. "0" ≠ "p", so False. A mistake is lower-casing "0" into something else; it stays "0".'],['"ab_a"','The underscore is not a letter or digit, so it is skipped. What remains is "aba": True.'],['All punctuation: ".,"','Same as empty: True. The inner while-loops need the <code>l &lt; r</code> guard or they walk off the string.'],['Mixed case: "Aa"','Compare lowered characters: True.']],
time:'O(n)',space:'O(1)',brute:'O(n) time but O(n) space for a cleaned copy',
demos:[{label:"s = \"No 'x' in Nixon\"",a:["No 'x' in Nixon"]},{label:'Edge: "0P" mixes digit and letter',a:["0P"]},{label:'Edge: only punctuation',a:["., !"]}],
trace:([s])=>{const F=[],n=s.length;let l=0,r=n-1;const c=ar(n,'n');const disp=[...s].map(ch=>ch===' '?'␣':ch);
 const B=(txt)=>[{t:'cells',id:'s',label:'s',v:disp,c:c.slice(),p:[{n:'l',i:Math.min(l,n-1),c:'y'},{n:'r',i:Math.max(r,0),c:'o'}],idx:false},{t:'text',s:txt||'&nbsp;',fs:22}];
 const al=ch=>/[A-Za-z0-9]/.test(ch);
 F.push(fr(B(),`Two pointers, ${K('y','l')} from the left and ${K('o','r')} from the right. Punctuation and spaces will be skipped, letters and digits compared.`));
 while(l<r){
  while(l<r&&!al(s[l])){c[l]='d';F.push(fr(B(),`${K('y',JSON.stringify(s[l]))} isn't a letter or digit. Skip it.`));l++}
  while(l<r&&!al(s[r])){c[r]='d';F.push(fr(B(),`${K('o',JSON.stringify(s[r]))} isn't a letter or digit. Skip it.`));r--}
  if(l>=r)break;
  const ok=s[l].toLowerCase()===s[r].toLowerCase();c[l]=ok?'g*':'r*';c[r]=ok?'g*':'r*';
  F.push(fr(B(`${s[l].toLowerCase()}  ${ok?'=':'≠'}  ${s[r].toLowerCase()}`),ok?`Lower-cased they match. Move both inward.`:`${K('r','Mismatch.')} Not a palindrome.`));
  if(!ok)return F;c[l]='g';c[r]='g';l++;r--}
 F.push(fr(B('pointers met → True'),`Pointers met without a mismatch: ${K('g','True')}.`));return F}});
/* 7 3Sum */
P.push({id:7,
think:['Reduce to a known problem: fix one number <code>a</code>, then you need two others summing to <code>−a</code>. That is Two Sum.','<b>Sort first.</b> On a sorted array, Two Sum becomes two pointers: too small → move <code>l</code> right, too big → move <code>r</code> left.','Duplicates are the real difficulty. Skip repeated <i>anchors</i>, and after recording a triplet skip repeated <i>left</i> values. Sorting puts duplicates side by side.'],
edges:[['[0, 0, 0, 0]','Exactly one triplet [0,0,0]. After recording it the duplicate skip prevents repeats.'],['[0, 1, 1]','Positive anchor with no negatives: no triplet. Early exit: if the anchor is > 0 we can stop.'],['Fewer than 3 numbers','The loop range is empty, so [] is returned.'],['[-1,-1,-1,2]','Without skipping the duplicate anchor you would record [-1,-1,2] three times.'],['Do not skip using i-1 vs i+1','Compare with the <i>previous</i> element, otherwise [-1,-1,2] itself would be skipped.']],
time:'O(n²)',space:'O(1) beyond output',brute:'O(n³)',
demos:[{label:'nums = [-1, 0, 1, 2, -1, -4]',a:[[-1,0,1,2,-1,-4]]},{label:'Edge: all zeros',a:[[0,0,0,0,0]]}],
trace:([a0])=>{const nums=[...a0].sort((a,b)=>a-b),n=nums.length,F=[],res=[];let i=0,l=0,r=0;const c=ar(n,'n');
 const B=(txt,pi=true)=>[{t:'cells',id:'a',label:'sorted',v:nums,c:c.slice(),p:pi?[{n:'i',i,c:'p'},{n:'l',i:l,c:'y'},{n:'r',i:r,c:'o'}]:[]},{t:'text',s:txt||'&nbsp;',fs:22},{t:'dict',id:'res',label:'found',e:res.map((t,j)=>['['+t.join(',')+']','','g']),arrow:'',empty:'none yet'}];
 const cell=(...x)=>{};
 F.push(fr(B('',false),`Step 0: ${K('b','sort')}. Equal numbers become neighbours, which makes de-duplication easy.`));
 for(i=0;i<n-2;i++){
  if(nums[i]>0){F.push(fr(B('anchor > 0 → no more zero sums',false),`The anchor ${K('p',nums[i])} is positive and everything after it is bigger. No zero sum possible. ${K('g','Stop.')}`));break}
  if(i>0&&nums[i]===nums[i-1]){c[i]='d';F.push(fr(B('',false),`Anchor ${K('p',nums[i])} equals the previous anchor. Skip, or we would repeat triplets.`));continue}
  l=i+1;r=n-1;for(let k=0;k<n;k++)if(c[k]!=='d')c[k]='n';c[i]='p*';
  F.push(fr(B(`anchor a = ${nums[i]}, hunt for pair summing to ${-nums[i]}`),`New anchor ${K('p',nums[i])}. Two pointers search the rest for a pair summing to ${K('b',-nums[i])}.`));
  while(l<r){const s=nums[i]+nums[l]+nums[r];c[l]='y*';c[r]='o*';
   const m=s<0?`${nums[i]} + ${nums[l]} + ${nums[r]} = ${s}  (too small)`:s>0?`${nums[i]} + ${nums[l]} + ${nums[r]} = ${s}  (too big)`:`${nums[i]} + ${nums[l]} + ${nums[r]} = 0  ✓`;
   F.push(fr(B(m),s<0?`Sum ${K('r',s)} is too small. Move ${K('y','l')} right to a bigger number.`:s>0?`Sum ${K('r',s)} is too big. Move ${K('o','r')} left to a smaller number.`:`${K('g','Zero!')} Record [${nums[i]}, ${nums[l]}, ${nums[r]}].`));
   c[l]='n';c[r]='n';
   if(s<0)l++;else if(s>0)r--;else{res.push([nums[i],nums[l],nums[r]]);l++;r--;
    while(l<r&&nums[l]===nums[l-1]){c[l]='d';F.push(fr(B('skip duplicate on the left'),`${nums[l]} repeats the previous left value. Skip it so the same triplet isn't recorded twice.`));l++}}}
  for(let k=i+1;k<n;k++)if(c[k]!=='d')c[k]='n';}
 l=Math.min(l,n-1);r=Math.min(r,n-1);i=Math.min(i,n-1);
 F.push(fr(B(`result: ${JSON.stringify(res)}`,false),`Finished with ${K('g',res.length)} unique triplet${res.length===1?'':'s'}.`));return F}});
/* 8 Longest substring without repeating */
P.push({id:8,
think:['A substring is a window <code>[left, right]</code>. Grow <code>right</code> one step at a time; the window must never contain a duplicate.','When <code>s[right]</code> already appears <i>inside</i> the window, jump <code>left</code> to just past its previous position. You never move <code>left</code> backwards.','Store each character’s <b>last index</b> in a dictionary. The window length is <code>right − left + 1</code>; the answer is the largest one seen.'],
edges:[['""','Empty string: loop never runs, answer 0.'],['"bbbbb"','Every step jumps <code>left</code> to right; answer 1.'],['"abba" (the classic trap)','At the final "a", its last index is 0, but <code>left</code> is already 2. Without the check <code>last[ch] >= left</code>, left would jump <i>back</i> to 1 and produce length 3. Correct answer: 2.'],['" " (a single space)','Spaces are ordinary characters: answer 1.'],['"dvdf"','Greedy "reset the window" fails; the jump-to-last+1 method finds "vdf" = 3.']],
time:'O(n)',space:'O(min(n, alphabet))',brute:'O(n²) or O(n³)',
demos:[{label:'s = "abcabcbb"',a:["abcabcbb"]},{label:'Edge: "abba", left must never move back',a:["abba"]},{label:'Edge: "dvdf"',a:["dvdf"]}],
trace:([s])=>{const F=[],n=s.length,last=new Map();let left=0,best=0;const c=ar(n,'n');
 const B=(right,txt)=>[{t:'cells',id:'s',label:'s',v:[...s],c:c.slice(),win:right===null?null:{l:left,r:right,c:'y'},p:right===null?[]:[{n:'right',i:right,c:'o'},{n:'left',i:left,c:'y'}]},{t:'text',s:txt||`best = ${best}`,fs:22},{t:'dict',id:'last',label:'last seen',e:[...last].map(([k,v])=>[k,v,'b']),empty:'{ }  char → index'}];
 F.push(fr(B(null,'best = 0'),`Slide a window over the string. Dictionary remembers the ${K('b','last index')} of every character.`));
 for(let i=0;i<n;i++){const ch=s[i];const prev=last.has(ch)?last.get(ch):-1;
  for(let k=0;k<n;k++)c[k]=k>=left&&k<i?'b':'n';c[i]='y*';
  if(prev>=left){F.push(fr(B(i,`"${ch}" last seen at ${prev} ≥ left=${left}: duplicate inside window`),`${K('y',JSON.stringify(ch))} is already in the window (index ${prev}). ${K('r','Duplicate!')}`));left=prev+1;
   for(let k=0;k<n;k++)c[k]=k>=left&&k<i?'b':'n';c[i]='y*';
   F.push(fr(B(i,`left jumps to ${prev} + 1 = ${left}`),`Jump ${K('y','left')} just past the old copy: left = ${left}.`))}
  else if(prev>=0){F.push(fr(B(i,`"${ch}" last seen at ${prev} < left=${left}: it's outside the window`),`${K('y',JSON.stringify(ch))} was seen at ${prev}, but that is ${K('g','left of the window')}. Not a duplicate, so left stays put.`))}
  last.set(ch,i);best=Math.max(best,i-left+1);
  F.push(fr(B(i,`window length = ${i} − ${left} + 1 = ${i-left+1};  best = ${best}`),`Window ${K('y',JSON.stringify(s.slice(left,i+1)))}. Length ${i-left+1}, best so far ${K('g',best)}.`))}
 F.push(fr(B(null,`answer = ${best}`),`Answer: ${K('g',best)}.`));return F}});
/* 9 Longest repeating char replacement */
P.push({id:9,
think:['A window can be turned into one repeated letter if <code>window length − count(most common letter) ≤ k</code>. Those leftover letters are the ones you repaint.','Slide a window. Add <code>s[right]</code>; if the window is no longer fixable, remove one letter from the left. The window <i>never shrinks</i>, it only slides, once it reaches its best size.','You can keep <code>best_freq</code> from ever decreasing. A stale max can only mislead the window to stay the same size, never to grow wrongly.'],
edges:[['k = 0','You may not change anything. The answer is the longest run of one letter.'],['k ≥ len(s)','The whole string can be repainted: the answer is len(s).'],['Single character','Window of 1, answer 1.'],['Why a stale max is fine','The window only grows when a <i>new</i> higher frequency is reached, which is exactly when a bigger answer is possible.']],
time:'O(n)',space:'O(26)',brute:'O(n²) or O(26n²)',
demos:[{label:'s = "AABABBA", k = 1',a:["AABABBA",1]},{label:'Edge: k = 0',a:["AABBBA",0]}],
trace:([s,k])=>{const F=[],n=s.length,cnt={};let left=0,bf=0,best=0;const c=ar(n,'n');
 const B=(right,txt)=>[{t:'cells',id:'s',label:'s',v:[...s],c:c.slice(),win:right===null?null:{l:left,r:right,c:'y'},p:right===null?[]:[{n:'right',i:right,c:'o'},{n:'left',i:left,c:'y'}]},{t:'text',s:txt||`k = ${k}    best = ${best}`,fs:22},{t:'dict',id:'cnt',label:'window counts',e:Object.entries(cnt).filter(e=>e[1]>0).map(e=>[e[0],e[1],'b'])}];
 F.push(fr(B(null),`We may repaint ${K('y','k = '+k)} letters. A window is good if ${K('b','length − most-common count')} ≤ k.`));
 for(let r=0;r<n;r++){cnt[s[r]]=(cnt[s[r]]||0)+1;bf=Math.max(bf,cnt[s[r]]);
  for(let q=0;q<n;q++)c[q]=q>=left&&q<=r?'b':'n';c[r]='y*';
  const need=r-left+1-bf;
  F.push(fr(B(r,`length ${r-left+1} − max count ${bf} = ${need} ${need>k?'> '+k+'  ✗':'≤ '+k+'  ✓'}`),need>k?`Need to repaint ${K('r',need)} letters but only ${k} allowed. Shrink from the left.`:`Repaint ${K('g',need)} ≤ ${k}: the window is fine and ${K('g','grows')}.`));
  if(need>k){cnt[s[left]]--;left++;for(let q=0;q<n;q++)c[q]=q>=left&&q<=r?'b':'n';c[r]='y*';
   F.push(fr(B(r,`window slides: length stays ${r-left+1}`),`Drop ${K('y',s[left-1])} from the left. The window keeps its size and ${K('o','slides')} right.`))}
  best=Math.max(best,r-left+1)}
 for(let q=0;q<n;q++)c[q]=q>=left?'g':'n';
 F.push(fr(B(null,`answer = ${best}`),`The largest window we ever held: ${K('g',best)}.`));return F}});
/* 10 Minimum window substring */
P.push({id:10,
think:['Expand <code>right</code> until the window holds every letter of <code>t</code> (with multiplicity). Then <b>shrink</b> <code>left</code> as far as possible while it stays valid. Record the best, then drop the left letter and continue.','Checking "does the window contain t?" by comparing two counters is O(52) each time. Instead track <code>missing</code>, the number of required letters still owed. Valid means <code>missing == 0</code>, an O(1) check.','<code>need[ch]</code> goes negative for surplus letters. That is exactly how you know a left letter is safe to drop.'],
edges:[['t longer than s','Impossible; the answer is "". Falls out naturally because <code>missing</code> never hits 0.'],['Duplicates in t, e.g. s="aa", t="aa"','Counts matter: "a" is needed twice. Use counts, not a set.'],['t has a letter absent from s','<code>missing</code> never reaches 0, so we return "".'],['s equals t','The whole string is the answer.'],['Several shortest windows','Any is accepted. Use strict "<" when updating the best so the first wins.'],['Case sensitive','"a" and "A" are different letters.']],
time:'O(|s| + |t|)',space:'O(alphabet)',brute:'O(|s|² · |t|)',
demos:[{label:'s = "ADOBECODEBANC", t = "ABC"',a:["ADOBECODEBANC","ABC"]},{label:'Edge: duplicate letters needed',a:["aab","aab"]},{label:'Edge: impossible',a:["ab","aa"]}],
trace:([s,t])=>{const F=[],n=s.length;const need={};for(const ch of t)need[ch]=(need[ch]||0)+1;let missing=t.length,left=0,best=[0,Infinity];const c=ar(n,'n');
 const nd=()=>Object.entries(need).filter(e=>t.includes(e[0])).map(e=>[e[0],e[1],e[1]<=0?'g':'b']);
 const B=(r,txt)=>[{t:'cells',id:'s',label:'s',v:[...s],c:c.slice(),cw:56,win:r===null?null:{l:left,r,c:'y'},p:r===null?[]:[{n:'right',i:r,c:'o'},{n:'left',i:Math.min(left,n-1),c:'y'}]},{t:'text',s:txt||`missing = ${missing}    best = ${best[1]===Infinity?'none':JSON.stringify(s.slice(best[0],best[1]+1))}`,fs:22},{t:'dict',id:'need',label:'still need',e:nd(),empty:'{ }'}];
 F.push(fr(B(null),`We need all of ${K('b',JSON.stringify(t))}. ${K('y','need[ch]')} counts how many of each letter are still owed (negative = surplus).`));
 for(let r=0;r<n;r++){const ch=s[r];
  if(need[ch]>0)missing--;need[ch]=(need[ch]||0)-1;
  for(let q=0;q<n;q++)c[q]=q>=left&&q<=r?'b':'n';c[r]='y*';
  F.push(fr(B(r),need[ch]>=0&&t.includes(ch)?`Add ${K('y',s[r])}: it was needed. ${K('b','missing = '+missing)}.`:`Add ${K('y',s[r])}: not needed (or surplus), missing stays ${missing}.`));
  if(missing===0){
   while(need[s[left]]<0){need[s[left]]++;c[left]='d';left++;
    F.push(fr(B(r,`window valid, drop surplus ${s[left-1]}`),`Window is valid. ${K('y',s[left-1])} at the left is surplus, so ${K('o','drop')} it and keep the window valid.`))}
   for(let q=0;q<n;q++)c[q]=q>=left&&q<=r?'g':(q<left?'d':'n');
   if(r-left<best[1]-best[0])best=[left,r];
   F.push(fr(B(r,`shortest valid so far: ${JSON.stringify(s.slice(best[0],best[1]+1))} (length ${best[1]-best[0]+1})`),`${K('g','Tightest valid window')}: ${K('g',JSON.stringify(s.slice(left,r+1)))}. Record it.`));
   need[s[left]]++;missing++;left++;
   F.push(fr(B(r,`drop ${s[left-1]} → missing = ${missing}`),`Drop ${K('y',s[left-1])}: now one letter is missing again. Resume expanding ${K('o','right')}.`))}}
 for(let q=0;q<n;q++)c[q]=best[1]!==Infinity&&q>=best[0]&&q<=best[1]?'g*':'d';
 F.push(fr(B(null,best[1]===Infinity?'no valid window → ""':`answer = ${JSON.stringify(s.slice(best[0],best[1]+1))}`),best[1]===Infinity?`No window ever covered ${K('r','all of t')}. Return the empty string.`:`Answer: ${K('g',JSON.stringify(s.slice(best[0],best[1]+1)))}.`));return F}});
