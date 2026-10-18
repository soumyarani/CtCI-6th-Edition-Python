"""Assemble dist/index.html (one self-contained page) from src/. Run pack_audio.py first so the sprite manifest is embedded; dist/audio/ must sit next to index.html."""
import json, os
H = os.path.dirname(os.path.abspath(__file__)); S = H + '/src/'
r = lambda f: open(S + f, encoding='utf-8').read()
sols = json.load(open(H + '/sols.json')); P = json.load(open(H + '/problems.json'))
meta = [{'id': p['id'], 'title': p['title'], 'diff': p['diff'], 'pattern': p['pattern'], 'desc': p['desc']} for p in P]
js = r('layout.js') + '\n' + '\n'.join(r(f) for f in ['probs1.js', 'probs2.js', 'probs3.js']) + '\n'
js += 'const META=' + json.dumps(meta, ensure_ascii=False) + ';\nconst PY=' + json.dumps({int(k): v for k, v in sols.items()}, ensure_ascii=False) + ';\n'
aud = json.load(open(H + '/dist/audio/manifest.json')) if os.path.exists(H + '/dist/audio/manifest.json') else {}
js += 'const AUDIO=' + json.dumps(aud) + ';\n'
js += r('player.js') + '\n' + r('app.js')
js = js.replace('</script', '<\\/script')
html = r('shell.html').replace('/*CSS*/', r('chrome.css') + '\n' + r('page.css')).replace('/*JS*/', js)
os.makedirs(H + '/dist', exist_ok=True)
open(H + '/dist/index.html', 'w', encoding='utf-8').write(html)
print('dist/index.html', len(html), 'bytes')
