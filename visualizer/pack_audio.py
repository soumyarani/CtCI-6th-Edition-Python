"""Pack audio/<hash>.mp3 clips into one sprite per problem: dist/audio/pNN.mp3 + dist/audio/manifest.json
(hash -> [start_seconds, duration]). The page decodes one sprite per problem instead of loading hundreds of files."""
import json, os, subprocess, tempfile
H = os.path.dirname(os.path.abspath(__file__)); SR = 24000; GAP = int(SR * 0.25)
by = json.load(open(H + '/clips_by_problem.json')); out = H + '/dist/audio'; os.makedirs(out, exist_ok=True)
manifest = {}
for pid, hashes in by.items():
    pcm = bytearray(); clips = {}
    for h in hashes:
        raw = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', f'{H}/audio/{h}.mp3', '-f', 's16le', '-ar', str(SR), '-ac', '1', '-'], check=True, capture_output=True).stdout
        clips[h] = [round(len(pcm) / 2 / SR, 3), round(len(raw) / 2 / SR, 3)]
        pcm += raw + bytes(GAP * 2)
    name = f'audio/p{int(pid):02d}.mp3'
    with tempfile.NamedTemporaryFile(suffix='.raw') as f:
        f.write(pcm); f.flush()
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-f', 's16le', '-ar', str(SR), '-ac', '1', '-i', f.name, '-c:a', 'libmp3lame', '-b:a', '40k', f'{H}/dist/{name}'], check=True)
    manifest[pid] = {'file': name, 'clips': clips}
json.dump(manifest, open(out + '/manifest.json', 'w'))
print('packed', len(by), 'sprites')
