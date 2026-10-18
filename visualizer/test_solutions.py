
import json,sys,copy,os
sols=json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'sols.json'))); P=json.load(open('problems.json'))
class ListNode:
    def __init__(s,val=0,next=None): s.val=val; s.next=next
class TreeNode:
    def __init__(s,val=0,left=None,right=None): s.val=val;s.left=left;s.right=right
def mk(a):
    d=ListNode();t=d
    for v in a: t.next=ListNode(v);t=t.next
    return d.next
def tl(n):
    o=[]
    while n:o.append(n.val);n=n.next
    return o
def mt(a):
    if not a or a[0] is None:return None
    r=TreeNode(a[0]);q=[r];i=1
    for n in q:
        if i<len(a) and a[i] is not None:n.left=TreeNode(a[i]);q.append(n.left)
        i+=1
        if i<len(a) and a[i] is not None:n.right=TreeNode(a[i]);q.append(n.right)
        i+=1
    return r
bad=0
for p in P:
    ns={'ListNode':ListNode,'TreeNode':TreeNode}
    exec(sols[str(p['id'])],ns)
    fn=ns[p['fn']] if p['fn'] in ns else ns['merge'] if p['id']==26 else ns[p['fn']]
    for c in p['cases']:
        a=copy.deepcopy(c['args'])
        i=p['id']
        if i in (16,17): a[0]=mk(a[0])
        if i==20: a[0]=[mk(x) for x in a[0]]
        if i in (18,19,25): a[0]=mt(a[0])
        r=fn(*a)
        if i in (16,17,20): r=tl(r)
        e=c['expected']
        cmp=p['cmp']
        if cmp=='sorted' and isinstance(r,list): ok=sorted(r)==sorted(e)
        elif cmp=='deepsorted': ok=sorted(sorted(x) for x in r)==sorted(sorted(x) for x in e)
        elif cmp=='window': ok=len(r)==len(e)
        else: ok=r==e
        if not ok: bad+=1;print('FAIL',i,p['title'],str(c['args'])[:60],r,e)
print('bad',bad)
