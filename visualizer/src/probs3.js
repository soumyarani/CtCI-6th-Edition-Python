/* 21 Kth largest */
P.push({id:21,
think:['Sorting is O(n log n). You only need the <i>k-th</i> largest, so you can afford to remember just the k biggest values.','Keep a <b>min-heap of size k</b>. Push each number; if the heap grows past k, pop the smallest. Whatever is left holds the k largest, and the root (the smallest of those) is the k-th largest.','Why a min-heap for "largest"? The root is the item you want to evict next.'],
edges:[['k = 1','The heap holds one element: the running maximum.'],['k = len(nums)','Nothing is ever evicted; the root is the minimum.'],['Duplicates, e.g. [3,3,3], k = 2','Duplicates count separately (the problem says sorted order), so the answer is 3.'],['Negative values','Heap compares normally; nothing special.'],['Python’s heapq is a min-heap','For a max-heap you would push negatives; here we want the min-heap.']],
time:'O(n log k)',space:'O(k)',brute:'Sort: O(n log n)',
demos:[{label:'nums = [3,2,1,5,6,4], k = 2',a:[[3,2,1,5,6,4],2]},{label:'Edge: duplicates',a:[[3,3,3,1],2]},{label:'Edge: k = 1',a:[[4,9,2,7],1]}],
trace:([nums,k])=>{const F=[],n=nums.length;let heap=[];const c=ar(n,'n');
 const B=(i,txt,hc)=>[{t:'cells',id:'a',label:'nums',v:nums,c:c.slice(),p:i===null?[]:[{n:'x',i,c:'y'}]},{t:'cells',id:'h',label:`min-heap (size ≤ ${k})`,v:heap.length?heap.slice():['empty'],c:heap.length?heap.map((x,j)=>hc&&hc[j]||(j===0?'o':'b')):['d'],idx:false,cw:56,sub:heap.map((x,j)=>j===0?'root':'')},{t:'text',s:txt||'&nbsp;',fs:21}];
 F.push(fr(B(null),`Goal: the ${K('y',k+'-th')} largest. We keep a ${K('b','min-heap of the k biggest')} values seen so far; its root is the smallest of those.`));
 for(let i=0;i<n;i++){c[i]='y*';heap.push(nums[i]);heap.sort((a,b)=>a-b);
  F.push(fr(B(i,`push ${nums[i]}   (size ${heap.length})`),`Push ${K('y',nums[i])} into the heap.`));
  c[i]='b';
  if(heap.length>k){const ev=heap.shift();F.push(fr(B(i,`size ${heap.length+1} > k = ${k} → pop smallest (${ev})`,heap.map(()=>'b')),`Heap holds ${k+1} items, too many. Pop the smallest, ${K('r',ev)}. It can't be among the top ${k}.`));c[i]=nums[i]>=heap[0]?'b':'d'}}
 for(let i=0;i<n;i++)c[i]='n';
 F.push(fr(B(null,`root = ${heap[0]}  → the ${k}-th largest`,heap.map((x,j)=>j===0?'g*':'b')),`The heap contains the ${k} largest. Its root, ${K('g',heap[0])}, is the answer.`));return F}});
/* 22 Number of islands */
P.push({id:22,
think:['Each island is a <b>connected component</b> of land cells. Scan the grid; when you find an unvisited land cell, you have found a new island.','Then <b>flood fill</b> from it (DFS or BFS), marking every connected land cell as visited so it is never counted again.','Count = number of times you start a flood fill.'],
edges:[['All water','No starting cell is found: 0.'],['All land','One flood fill covers it: 1.'],['Diagonal neighbours','Not connected; only up/down/left/right count. Two diagonal 1s form two islands.'],['Single cell','Grid 1×1 with "1": 1. Check bounds before indexing.'],['Mutating the input','Marking visited by writing "0" is simple; copy first if the caller needs the grid back.'],['Deep recursion','A 300×300 land grid can recurse 90 000 deep. Use an explicit stack (as in the code) or BFS.']],
time:'O(R·C)',space:'O(R·C) worst case stack',brute:'Union-Find is equivalent: ~O(R·C · α)',
demos:[{label:'3 islands',a:[[["1","1","0","0"],["1","0","0","1"],["0","0","1","1"],["1","0","0","0"]]]},{label:'Edge: diagonal is not connected',a:[[["1","0"],["0","1"]]]},{label:'Edge: all water',a:[[["0","0"],["0","0"]]]}],
trace:([g0])=>{const g=g0.map(r=>r.slice()),R=g.length,C=g[0].length;const F=[];const pal=['b','y','o','p','t','r'];let cnt=0;const col=g.map(r=>r.map(x=>x==='1'?'n':'d'));
 const B=(txt)=>[{t:'grid',id:'g',v:g0.map(r=>r.map(x=>x==='1'?'1':'0')),c:col.map(r=>r.slice()),s:60,hmax:230},{t:'text',s:txt||`islands = ${cnt}`,fs:22}];
 F.push(fr(B(),`Land is ${K('b','1')}, water is 0. Scan cell by cell; every time we meet fresh land we have found a new island.`));
 for(let r=0;r<R;r++)for(let c=0;c<C;c++){
  if(g[r][c]==='1'){cnt++;const colr=pal[(cnt-1)%pal.length];col[r][c]=colr+'*';
   F.push(fr(B(`found unvisited land at (${r},${c}) → islands = ${cnt}`),`Unvisited land at (${r}, ${c}): ${K(colr==='b'?'b':colr,'island #'+cnt)}. Flood-fill it so nothing in it is counted again.`));
   const st=[[r,c]];g[r][c]='0';while(st.length){const [y,x]=st.pop();for(const [dy,dx] of [[1,0],[-1,0],[0,1],[0,-1]]){const ny=y+dy,nx=x+dx;if(ny>=0&&ny<R&&nx>=0&&nx<C&&g[ny][nx]==='1'){g[ny][nx]='0';col[ny][nx]=colr+'*';st.push([ny,nx])}}}
   for(let y=0;y<R;y++)for(let x=0;x<C;x++)if(col[y][x]===colr+'*')col[y][x]=colr;
   F.push(fr(B(),`Everything connected is now coloured and marked visited (set to "0"). Keep scanning.`))}}
 F.push(fr(B(`islands = ${cnt}`),`Scan complete: ${K('g',cnt)} island${cnt===1?'':'s'}.`));return F}});
/* 23 Course schedule */
P.push({id:23,
think:['Courses are nodes, <code>[a, b]</code> is an edge <code>b → a</code>. You can finish all courses iff the graph has <b>no cycle</b>.','Topological sort (Kahn): count each course’s incoming edges (<code>indegree</code>). Courses with indegree 0 can be taken now. Take one, remove its outgoing edges, and any course dropping to 0 joins the queue.','If you take all <code>numCourses</code>, answer True. Leftover courses are stuck in a cycle.'],
edges:[['No prerequisites','Everything starts at indegree 0: True.'],['Self-loop [[0,0]]','Course 0 needs itself: indegree 1, never reaches 0: False.'],['Two-cycle [[1,0],[0,1]]','Neither can start: False.'],['Disconnected graph','Multiple components are fine; queue starts with several sources.'],['Cycle plus free courses','Free courses finish but the cycle’s courses never do; compare the processed count to numCourses.'],['Duplicate edges','Constraints say pairs are distinct; otherwise indegree would still balance.']],
time:'O(V + E)',space:'O(V + E)',brute:'DFS cycle detection with colors is also O(V + E)',
demos:[{label:'4 courses: 0→1, 0→2, 1→3, 2→3',a:[4,[[1,0],[2,0],[3,1],[3,2]]]},{label:'Edge: a cycle 0→1→2→0',a:[3,[[1,0],[2,1],[0,2]]]},{label:'Edge: cycle plus free course',a:[4,[[1,0],[0,1]]]}],
trace:([n,pre])=>{const F=[];const adj=Array.from({length:n},()=>[]);const indeg=ar(n,0);for(const [a,b] of pre){adj[b].push(a);indeg[a]++}
 const pos0={0:[500,60],1:[300,160],2:[700,160],3:[500,260]};
 const layouts={4:[[200,70],[420,70],[640,70],[860,70]],3:[[500,50],[300,190],[700,190]]};
 const pos=(layouts[n]||Array.from({length:n},(_,i)=>[100+i*(800/Math.max(1,n-1)),120]));
 if(n===4&&pre.length===4&&pre.some(e=>e[0]===3)){pos[0]=[500,50];pos[1]=[300,150];pos[2]=[700,150];pos[3]=[500,250]}
 const col=ar(n,'n');const ec={};let q=[],done=0;const taken=[];
 const edges=()=>pre.map(([a,b])=>({a:b,b:a,d:true,c:ec[b+'_'+a]||'d'}));
 const B=(txt)=>[{t:'graph',id:'g',h:290,nodes:pos.map((p,i)=>({id:i,x:p[0],y:p[1],t:String(i),c:col[i],sub:'in:'+indeg[i],sc:indeg[i]===0?'g':'y'})),edges:edges()},{t:'cells',id:'q',label:'ready',v:q.length?q.slice():['none'],c:q.length?q.map(()=>'g'):['d'],idx:false,cw:46},{t:'text',s:txt||`taken: ${taken.length}/${n}`,fs:21}];
 F.push(fr(B(),`An arrow ${K('b','b → a')} means b must come first. The label under each course is its ${K('y','indegree')}: prerequisites still outstanding.`));
 q=[];for(let i=0;i<n;i++)if(indeg[i]===0){q.push(i);col[i]='g'}
 F.push(fr(B(),q.length?`Courses with indegree 0 are ready right now: ${K('g',q.join(', '))}.`:`${K('r','No course has indegree 0.')} Nobody can start, which already hints at a cycle.`));
 while(q.length){const u=q.shift();taken.push(u);done++;col[u]='b*';
  F.push(fr(B(`take course ${u}`),`Take course ${K('b',u)}. Its outgoing arrows disappear.`));
  for(const v of adj[u]){indeg[v]--;ec[u+'_'+v]='b';if(indeg[v]===0){q.push(v);col[v]='g'}}
  col[u]='b';
  F.push(fr(B(`taken: ${taken.join(', ')}`),adj[u].length?`Decrement the indegree of ${adj[u].join(', ')}. ${adj[u].some(v=>indeg[v]===0)?K('g','Any that reach 0 are now ready.'):''}`:`No courses depend on ${u}.`))}
 for(let i=0;i<n;i++)if(!taken.includes(i))col[i]='r*';
 F.push(fr(B(done===n?`${done} = ${n} → True`:`${done} < ${n} → False`),done===n?`All ${n} courses taken: ${K('g','True')}.`:`Only ${done} of ${n} courses could be taken. The red ones wait on each other forever, a ${K('r','cycle')}: ${K('r','False')}.`));return F}});
/* 24 Rotting oranges */
P.push({id:24,
think:['Rot spreads simultaneously from every rotten orange. That is a <b>multi-source BFS</b>: start the queue with all rotten oranges at time 0.','Each BFS layer is one minute. Process the queue one layer at a time; fresh neighbours become rotten and join the next layer.','Count the fresh oranges at the start and decrement when one rots. If any remain at the end, return −1.'],
edges:[['No oranges at all','Return 0, nothing to rot.'],['No fresh oranges','Already done: 0 minutes (stop when <code>fresh == 0</code>, not when the queue empties).'],['Fresh orange isolated by empty cells','It can never rot: −1.'],['Fresh but no rotten','−1; the queue starts empty.'],['Minutes off by one','Count a minute only when at least one orange rotted. The code’s loop condition <code>while q and fresh</code> avoids a trailing empty minute.'],['Multiple rotten sources','They all spread in the same minute, which is why BFS starts with all of them.']],
time:'O(R·C)',space:'O(R·C)',brute:'Simulate minute by minute rescanning the grid: O((R·C)²)',
demos:[{label:'grid = [[2,1,1],[1,1,0],[0,1,1]]',a:[[[2,1,1],[1,1,0],[0,1,1]]]},{label:'Edge: unreachable fresh orange',a:[[[2,1,0],[0,1,1],[1,0,1]]]},{label:'Edge: two rotten sources',a:[[[2,1,1,1,2]]]}],
trace:([g0])=>{const g=g0.map(r=>r.slice()),R=g.length,C=g[0].length,F=[];let q=[],fresh=0,min=0;
 for(let r=0;r<R;r++)for(let c=0;c<C;c++){if(g[r][c]===2)q.push([r,c]);else if(g[r][c]===1)fresh++}
 const sym={0:'',1:'🍊',2:'☠'};
 const B=(txt,hl)=>[{t:'grid',id:'g',v:g.map(r=>r.map(x=>x===0?'':x===1?'1':'2')),c:g.map((r,i)=>r.map((x,j)=>hl&&hl.some(h=>h[0]===i&&h[1]===j)?'y*':x===0?'d':x===1?'g':'r*')),s:62,hmax:240},{t:'text',s:txt||`minute ${min}    fresh left = ${fresh}`,fs:22}];
 F.push(fr(B(),`${K('g','1 = fresh')}, ${K('r','2 = rotten')}, empty cells are dark. All rotten oranges spread ${K('y','at the same time')}.`));
 while(q.length&&fresh){const sz=q.length;const next=[];const newly=[];
  for(let k=0;k<sz;k++){const [r,c]=q.shift();for(const [dr,dc] of [[1,0],[-1,0],[0,1],[0,-1]]){const nr=r+dr,nc=c+dc;if(nr>=0&&nr<R&&nc>=0&&nc<C&&g[nr][nc]===1){g[nr][nc]=2;fresh--;q.push([nr,nc]);newly.push([nr,nc])}}}
  min++;F.push(fr(B(undefined,newly),`${K('y','Minute '+min)}: ${newly.length} fresh orange${newly.length===1?'':'s'} next to rotten ones turn rotten. ${fresh} still fresh.`))}
 F.push(fr(B(fresh===0?`all rotten after ${min} minute${min===1?'':'s'}`:`${fresh} fresh orange(s) can never be reached → -1`),fresh===0?`No fresh oranges left. Answer: ${K('g',min)} minutes.`:`The queue is empty, yet ${K('r',fresh)} fresh orange${fresh>1?'s are':' is'} still cut off from the rot. Answer ${K('r','−1')}.`));return F}});
/* 25 Binary tree max path sum */
P.push({id:25,
think:['A path may bend at one node: <code>left gain + node + right gain</code>. Evaluate that at <b>every</b> node and keep the global best.','What a node returns to its parent is different: a path going <i>upward</i> can only continue down <b>one</b> side, so return <code>node + max(left, right)</code>.','Negative branches only hurt, so clamp each gain at 0 (<code>max(gain, 0)</code>), meaning "don’t take that branch".'],
edges:[['All negative values, e.g. [-3]','The path must contain at least one node, so the answer is the largest single node (−3). Initialise <code>best = −∞</code>, not 0.'],['A negative root with positive children','A path joining the two children must pass through the negative root, but the best path may avoid it entirely: in [-10,9,20,null,null,15,7] the answer is 15 + 20 + 7 = 42, and the root is left out.'],['Path does not touch the root','Handled because best is updated at every node, not only at the root.'],['Skewed tree','Recursion depth up to 30 000; raise the recursion limit or iterate.'],['Returning the wrong thing','Returning <code>node + left + right</code> would let a path fork, which is not a path.']],
time:'O(n)',space:'O(h)',brute:'Try every pair of nodes: O(n²)',
demos:[{label:'tree = [-10, 9, 20, null, null, 15, 7]',a:[[-10,9,20,null,null,15,7]]},{label:'Edge: all negative',a:[[-3,-2,-5]]},{label:'Edge: best path skips the root',a:[[1,-5,3,null,null,4,5]]}],
trace:([v])=>{const F=[],{kids}=treeKids(v);const col=v.map(()=>'n'),ann={},ac={};let best=-Infinity;
 const B=(txt)=>[{t:'tree',id:'t',v,c:col.slice(),ann:Object.assign({},ann),ac:Object.assign({},ac),h:200},{t:'text',s:txt||`best = ${best===-Infinity?'−∞':best}`,fs:22}];
 F.push(fr(B(),`Post-order: solve both children first. Each node reports its ${K('b','upward gain')}: the best path that starts at it and goes down one side.`));
 const gain=i=>{if(i===null)return 0;col[i]='y*';const l=Math.max(gain(kids[i][0]),0),r=Math.max(gain(kids[i][1]),0);col[i]='y*';
  const through=v[i]+l+r,up=v[i]+Math.max(l,r);const nb=Math.max(best,through);
  F.push(fr(B(`${v[i]} + ${l} + ${r} = ${through}   ${through>best?'new best':''}`),`At ${K('y',v[i])}: left gain ${K('b',l)}, right gain ${K('b',r)} (negatives are clamped to 0). A path bending here is worth ${K('g',through)}.`));
  best=nb;col[i]='g';ann[i]='↑'+up;ac[i]='b';
  F.push(fr(B(`returns ${v[i]} + max(${l}, ${r}) = ${up}`),`Report ${K('b',up)} upward: a path can only continue down ${K('o','one')} side.`));return up};
 gain(0);F.push(fr(B(`answer = ${best}`),`The best bent path anywhere is ${K('g',best)}.`));return F}});
/* 26 Merge intervals */
P.push({id:26,
think:['If two intervals overlap, their order in the input is arbitrary; that makes comparing everything to everything messy. <b>Sort by start</b>.','After sorting, an interval can only overlap with the <i>last</i> merged one: if <code>start ≤ last.end</code> they overlap, so extend <code>last.end = max(last.end, end)</code>. Otherwise start a new interval.','The <code>max</code> matters: a later interval can be fully inside the previous one.'],
edges:[['Touching [1,4],[4,5]','"Touching counts as overlapping", so use <code>≤</code>: they merge to [1,5].'],['Contained interval [1,10],[2,3]','End stays 10. Using <code>last.end = end</code> instead of <code>max</code> would wrongly shrink it.'],['Unsorted input','Sorting is the first step; skipping it breaks the single-pass logic.'],['Single interval','Returned as is.'],['Identical intervals','They merge into one.'],['Mutating inputs','Copy the first interval before editing so the caller’s data is not altered.']],
time:'O(n log n)',space:'O(n)',brute:'Compare every pair repeatedly: O(n²)',
demos:[{label:'[[1,3],[8,10],[2,6],[15,18]]',a:[[[1,3],[8,10],[2,6],[15,18]]]},{label:'Edge: touching + contained',a:[[[1,4],[4,5],[2,3],[7,9]]]}],
trace:([iv])=>{const F=[];let items=iv.map((p,i)=>({id:'i'+i,s:p[0],e:p[1],c:'b',row:i}));const hi=Math.max(...iv.map(p=>p[1]))+1;const lo=0;
 const B=(its,txt,t2)=>[{t:'axis',id:'ax',lo,hi,items:its,step:Math.max(1,Math.round(hi/12))},{t:'text',s:txt||'&nbsp;',fs:21}];
 F.push(fr(B(items,`input order: ${JSON.stringify(iv)}`),`Intervals as bars on a number line, in the messy input order.`));
 const s=iv.map((p,i)=>({id:'i'+i,s:p[0],e:p[1],c:'b'})).sort((a,b)=>a.s-b.s);s.forEach((x,i)=>x.row=i);
 F.push(fr(B(s,`sorted by start`),`${K('b','Sort by start.')} Now an interval can only overlap the most recent merged one.`));
 let out=[{...s[0]}];const own=[s[0]];const view=()=>s.map(x=>({...x}));
 s.forEach(x=>x.c='d');s[0].c='g*';
 F.push(fr(B(view(),`merged = [${out.map(o=>`[${o.s},${o.e}]`).join(', ')}]`),`The first interval starts the answer.`));
 for(let i=1;i<s.length;i++){const x=s[i],last=out[out.length-1];x.c='y*';
  F.push(fr(B(view(),`start ${x.s} ${x.s<=last.e?'≤':'>'} last end ${last.e}`),x.s<=last.e?`[${x.s},${x.e}] starts at ${K('y',x.s)} ≤ ${K('g',last.e)}, the end of the last merged interval. ${K('g','Overlap!')}`:`[${x.s},${x.e}] starts at ${K('y',x.s)} > ${K('g',last.e)}. ${K('o','Gap')}: open a new interval.`));
  if(x.s<=last.e){last.e=Math.max(last.e,x.e);own[own.length-1].e=last.e;x.c='d';
   F.push(fr(B(view(),`merged end = max(...) = ${last.e}`),`Extend the end with ${K('g','max(last.end, end)')} = ${last.e} (so a contained interval can't shrink it).`))}
  else{out.push({...x});own.push(x);x.c='g*';F.push(fr(B(view(),`merged = [${out.map(o=>`[${o.s},${o.e}]`).join(', ')}]`),`Start a new merged interval.`))}}
 const res=out.map((o,j)=>({id:'r'+j,s:o.s,e:o.e,c:'g',row:j}));
 F.push(fr(B(res,`result = ${JSON.stringify(out.map(o=>[o.s,o.e]))}`),`Result: ${K('g',JSON.stringify(out.map(o=>[o.s,o.e])).replace(/,/g,', '))}.`));return F}});
/* 27 Subsets */
P.push({id:27,
think:['Each element has two choices: <b>in</b> or <b>out</b>. n elements give 2ⁿ subsets, exactly the leaves of a binary decision tree.','Backtracking: at index i, first recurse <i>without</i> nums[i], then <i>append</i> it, recurse, and <b>pop</b> to undo. When i reaches n, copy the path into the answer.','Append a copy (<code>path[:]</code>), not the list itself, or later changes would corrupt saved results.'],
edges:[['One element [0]','Two subsets: [] and [0].'],['Empty subset','Always part of the answer; it falls out as the "skip everything" leaf.'],['Appending <code>path</code> without copying','Every stored subset is the same list object and ends up empty.'],['Forgetting to pop','Elements leak into sibling branches.'],['Size','n ≤ 10 means at most 1024 subsets, so exponential time is fine.']],
time:'O(n · 2ⁿ)',space:'O(n) recursion',brute:'Iterative bitmask over 0..2ⁿ−1 is equivalent',
demos:[{label:'nums = [1, 2, 3]',a:[[1,2,3]]},{label:'Edge: one element',a:[[7]]}],
trace:([nums])=>{const F=[],n=nums.length,res=[];const path=[];
 const B=(i,txt,hl)=>[{t:'cells',id:'a',label:'nums',v:nums,c:nums.map((x,j)=>j<i?(path.includes(x)?'g':'d'):j===i?'y*':'n'),p:i<n?[{n:'i',i,c:'y'}]:[],cw:60},{t:'cells',id:'path',label:'path',v:path.length?path.slice():['∅'],c:path.length?path.map(()=>'g'):['d'],idx:false,cw:50},{t:'text',s:txt||'&nbsp;',fs:21},{t:'dict',id:'res',label:'subsets',e:res.map((r,j)=>['['+r.join(',')+']','',hl===j?'g*':'b']),arrow:'',empty:'none yet'}];
 const go=(i)=>{
  if(i===n){res.push(path.slice());F.push(fr(B(i,`leaf: save copy of [${path.join(',')}]`,res.length-1),`Reached the end of the list: save a ${K('g','copy')} of the path, ${K('g','['+path.join(', ')+']')}.`));return}
  F.push(fr(B(i,`decide nums[${i}] = ${nums[i]}`),`Decide about ${K('y',nums[i])}: first ${K('r','skip')} it...`));
  go(i+1);
  path.push(nums[i]);F.push(fr(B(i,`take ${nums[i]}`),`...then ${K('g','take')} ${K('y',nums[i])}.`));
  go(i+1);
  path.pop();F.push(fr(B(i,`undo (pop ${nums[i]})`),`${K('o','Backtrack')}: pop ${nums[i]} so the sibling branch starts clean.`))};
 F.push(fr(B(0),`Every element is either skipped or taken: ${K('y','2^'+n+' = '+(1<<n))} subsets.`));
 go(0);F.push(fr(B(n,`${res.length} subsets`),`All ${K('g',res.length)} subsets generated.`));return F}});
/* 28 Coin change */
P.push({id:28,
think:['Greedy (take the biggest coin) is wrong: coins [1,3,4], amount 6: greedy gives 4+1+1 (3 coins) but 3+3 uses 2.','Define <code>dp[a]</code> = fewest coins to make amount a. The last coin used was some c, so <code>dp[a] = 1 + dp[a − c]</code>; take the minimum over all coins.','Start with dp[0] = 0 and "infinity" elsewhere. If dp[amount] is still infinity, answer −1.'],
edges:[['amount = 0','Zero coins: dp[0] = 0.'],['Impossible, e.g. coins [2], amount 3','dp[3] stays infinity → return −1.'],['Greedy trap [1,3,4], 6','DP finds 2 (3+3), greedy finds 3.'],['Coin larger than amount','Skip it: guard <code>c ≤ a</code>.'],['Unlimited coins','That is why dp[a−c] is reused, not removed.'],['Sentinel','Use amount + 1 as infinity; it can never be a real answer.']],
time:'O(amount · coins)',space:'O(amount)',brute:'Plain recursion without memo: exponential',
demos:[{label:'coins = [1, 3, 4], amount = 6',a:[[1,3,4],6]},{label:'Edge: impossible',a:[[2],5]},{label:'Edge: amount 0',a:[[5],0]}],
trace:([coins,amt])=>{const F=[],INF=amt+1;const dp=[0,...ar(amt,INF)];const c=ar(amt+1,'d');c[0]='g';
 const B=(a,txt,pick)=>[{t:'text',s:`coins = [${coins.join(', ')}]`,c:'y',fs:22},{t:'cells',id:'dp',label:'dp[a]',v:dp.map(x=>x===INF?'∞':x),c:c.slice(),p:a===null?[]:[{n:'a',i:a,c:'y'}],cw:Math.min(58,Math.floor(900/(amt+1)))},{t:'text',s:txt||'&nbsp;',fs:21}];
 F.push(fr(B(null),`${K('g','dp[a]')} = fewest coins that sum to a. dp[0] = 0, everything else starts at ${K('r','∞')}.`));
 for(let a=1;a<=amt;a++){c[a]='y*';let best=INF,from=null;const opts=[];
  for(const co of coins)if(co<=a){opts.push(`${co}: dp[${a-co}]+1 = ${dp[a-co]===INF?'∞':dp[a-co]+1}`);if(dp[a-co]+1<best){best=dp[a-co]+1;from=co}}
  F.push(fr(B(a,opts.length?opts.join('   |   '):'no coin fits'),`To make ${K('y',a)}: try every coin as the ${K('b','last coin')}, then add 1 to the best way to make what remains.`));
  dp[a]=Math.min(INF,best);c[a]=dp[a]>=INF?'r':'g';
  F.push(fr(B(a,dp[a]>=INF?`dp[${a}] = ∞  (unreachable)`:`dp[${a}] = ${dp[a]}   (last coin ${from})`),dp[a]>=INF?`No coin works: ${a} is ${K('r','unreachable')}.`:`Best is ${K('g',dp[a])} coin${dp[a]>1?'s':''} (using the ${from}).`))}
 F.push(fr(B(null,dp[amt]>=INF?`dp[${amt}] = ∞  → return -1`:`answer = dp[${amt}] = ${dp[amt]}`),dp[amt]>=INF?`dp[${amt}] is still ∞. Return ${K('r','−1')}.`:`Answer: ${K('g',dp[amt])}.`));return F}});
/* 29 LIS */
P.push({id:29,
think:['The O(n²) DP asks, for each element, which earlier smaller element gives the longest chain. We can do better with a greedy idea.','Keep <code>tails[i]</code> = the <b>smallest possible tail</b> of an increasing subsequence of length i+1. A smaller tail is always better for future extension.','For each number, binary search the first tail ≥ x. Replace it (a better tail), or append if x is bigger than all tails. The length of <code>tails</code> is the answer. <code>tails</code> itself is <i>not</i> the actual subsequence.'],
edges:[['Equal values [2,2,2]','Strictly increasing is required, so use <code>bisect_left</code> (replace the equal tail); answer 1. <code>bisect_right</code> would give 3.'],['Strictly decreasing','Every number replaces tails[0]; answer 1.'],['Single element','Answer 1.'],['Already sorted','Every element appends; answer n.'],['tails is not the LIS','For [4,5,1], tails ends as [1,5], but 1 comes after 5 in the input, so [1,5] is not a real subsequence. Only its length (2) is meaningful.'],['Negative numbers','No special handling.']],
time:'O(n log n)',space:'O(n)',brute:'O(n²) DP',
demos:[{label:'nums = [10,9,2,5,3,7,101,18]',a:[[10,9,2,5,3,7,101,18]]},{label:'Edge: duplicates',a:[[2,2,2,3]]}],
trace:([nums])=>{const F=[],n=nums.length,tails=[];const c=ar(n,'n');
 const B=(i,txt,hl)=>[{t:'cells',id:'a',label:'nums',v:nums,c:c.slice(),p:i===null?[]:[{n:'x',i,c:'y'}]},{t:'cells',id:'t',label:'tails',v:tails.length?tails.slice():['empty'],c:tails.length?tails.map((x,j)=>hl===j?'y*':'b'):['d'],idx:false,cw:54,sub:tails.map((x,j)=>'len '+(j+1))},{t:'text',s:txt||'&nbsp;',fs:21}];
 F.push(fr(B(null),`${K('b','tails[i]')} = smallest possible last value of an increasing subsequence with length i+1.`));
 for(let i=0;i<n;i++){const x=nums[i];let lo=0,hi=tails.length;while(lo<hi){const m=(lo+hi)>>1;if(tails[m]<x)lo=m+1;else hi=m}
  c[i]='y*';F.push(fr(B(i,lo===tails.length?`${x} is bigger than every tail`:`first tail ≥ ${x} is tails[${lo}] = ${tails[lo]}`,lo<tails.length?lo:undefined),lo===tails.length?`${K('y',x)} is larger than all tails, so it ${K('g','extends')} the longest subsequence.`:`${K('y',x)}: binary search finds the first tail ≥ x at position ${lo}.`));
  if(lo===tails.length)tails.push(x);else tails[lo]=x;c[i]='g';
  F.push(fr(B(i,`tails now has length ${tails.length}`,lo),`Tails: ${K('b','['+tails.join(', ')+']')}. A smaller tail keeps more options open. Length ${K('g',tails.length)}.`))}
 F.push(fr(B(null,`answer = len(tails) = ${tails.length}`),`The longest increasing subsequence has length ${K('g',tails.length)}.`));return F}});
/* 30 Word ladder */
P.push({id:30,
think:['Words are nodes; two words are connected if they differ by exactly one letter. We want the <b>shortest path</b>, so use BFS.','Neighbour generation: for each position, try all 26 letters and keep results found in the word set (O(L · 26) per word, better than comparing against every word).','Mark words visited when enqueued, and track the distance in the queue. Return the distance when you pop <code>endWord</code>.'],
edges:[['endWord not in wordList','Return 0 immediately.'],['beginWord already adjacent to endWord','Answer 2 (counts words, not edges).'],['beginWord is in wordList','Fine; it is already in <code>seen</code>.'],['No path','BFS exhausts the queue: 0.'],['Length counts words','"hit→hot→dot→dog→cog" has 5 words, answer 5.'],['Large word lists','Use a set for O(1) membership; a list would be O(N) per lookup.']],
time:'O(N · L · 26)',space:'O(N · L)',brute:'Compare every pair of words: O(N² · L)',
demos:[{label:'hit → cog',a:['hit','cog',['hot','dot','dog','lot','log','cog']]},{label:'Edge: endWord missing',a:['hit','cog',['hot','dot','dog']]},{label:'Edge: adjacent immediately',a:['cat','cot',['cot','cog']]}],
trace:([bw,ew,list])=>{const F=[];const words=[bw,...list.filter(w=>w!==bw)];
 const set=new Set(list);
 if(!set.has(ew))return [fr([{t:'text',s:`endWord "${ew}" is not in wordList`,c:'r',fs:24},{t:'text',s:'return 0',c:'n',fs:26}],`${K('r',JSON.stringify(ew))} isn't in the word list, so no valid ladder exists. Return ${K('r','0')} right away, no BFS needed.`)];
 const m=words.length;const cols=Math.min(m,4);const pos=words.map((w,i)=>({id:i,x:140+(i%cols)*240,y:50+Math.floor(i/cols)*100}));
 if(bw==='hit'){const L={hit:[100,60],hot:[300,60],dot:[500,0],lot:[500,120],dog:[700,0],log:[700,120],cog:[900,60]};words.forEach((w,i)=>{pos[i].x=L[w][0];pos[i].y=L[w][1]+80})}
 const idx={};words.forEach((w,i)=>idx[w]=i);
 const edges=[];for(let i=0;i<m;i++)for(let j=i+1;j<m;j++){let d=0;for(let k=0;k<words[i].length;k++)if(words[i][k]!==words[j][k])d++;if(d===1)edges.push({a:i,b:j,c:'d'})}
 const col=words.map(()=>'n'),sub={};const distv={};let q=[[bw,1]];const seen=new Set([bw]);
 const B=(txt)=>[{t:'graph',id:'g',h:bw==='hit'?250:Math.ceil(m/cols)*100+30,nodes:words.map((w,i)=>({id:i,x:pos[i].x,y:pos[i].y,t:w,w:72,c:col[i],sub:sub[i]})),edges:edges.map(e=>({...e}))},{t:'cells',id:'q',label:'queue',v:q.length?q.map(e=>e[0]+':'+e[1]):['empty'],c:q.length?q.map(()=>'y'):['d'],idx:false,cw:78,ch:36},{t:'text',s:txt||'&nbsp;',fs:21}];
 col[0]='y*';sub[0]='d=1';
 F.push(fr(B(),`Words are nodes; an edge joins words that differ by ${K('y','one letter')}. BFS from ${K('y',bw)} finds the fewest steps to ${K('g',ew)}.`));
 const mark=(a,b,c)=>{const e=edges.find(e=>(e.a===a&&e.b===b)||(e.a===b&&e.b===a));if(e)e.c=c};
 while(q.length){const [w,d]=q.shift();col[idx[w]]=w===ew?'g*':'y*';
  F.push(fr(B(`pop "${w}"  distance ${d}`),`Pop ${K('y',w)} at distance ${K('y',d)}.`));
  if(w===ew){F.push(fr(B(`answer = ${d}`),`Reached ${K('g',ew)}. The ladder has ${K('g',d)} words.`));return F}
  const found=[];
  for(let i=0;i<w.length;i++)for(const ch of 'abcdefghijklmnopqrstuvwxyz'){const nw=w.slice(0,i)+ch+w.slice(i+1);if(set.has(nw)&&!seen.has(nw)){seen.add(nw);q.push([nw,d+1]);found.push(nw);col[idx[nw]]='b';sub[idx[nw]]='d='+(d+1);mark(idx[w],idx[nw],'b')}}
  col[idx[w]]='d';
  F.push(fr(B(found.length?`new neighbours: ${found.join(', ')}`:`no unseen neighbours`),found.length?`Try changing each letter. New unseen words: ${K('b',found.join(', '))}. Enqueue at distance ${d+1}.`:`Nothing new from ${w}.`))}
 F.push(fr(B(`queue empty → 0`),`Queue empty without reaching ${ew}: return ${K('r','0')}.`));return F}});
