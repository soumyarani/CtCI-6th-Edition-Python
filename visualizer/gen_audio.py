"""Generate one narration clip per caption: audio/<hash>.mp3 from captions.json.

  python gen_audio.py kokoro               # open-source Kokoro-82M, runs locally
  ELEVENLABS_API_KEY=... python gen_audio.py elevenlabs

Only missing clips are generated, so re-runs are cheap. Hashes come from speakText()/fnv() in src/layout.js,
so editing a caption changes its hash and only that clip is regenerated (run `node dump.js` first).
"""
import json, os, subprocess, sys, urllib.request, tempfile
HERE = os.path.dirname(os.path.abspath(__file__))
caps = json.load(open(os.path.join(HERE, 'captions.json')))
out = os.path.join(HERE, 'audio'); os.makedirs(out, exist_ok=True)
todo = [(h, t) for h, t in caps.items() if not os.path.exists(f'{out}/{h}.mp3')]
print(len(todo), 'clips to generate of', len(caps), flush=True)
provider = sys.argv[1] if len(sys.argv) > 1 else 'kokoro'

def to_mp3(wav, mp3):
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', wav, '-ac', '1', '-c:a', 'libmp3lame', '-b:a', '40k', mp3], check=True)

if provider == 'kokoro':
    import soundfile as sf
    from kokoro_onnx import Kokoro
    model = os.environ.get('KOKORO_MODEL', 'kokoro.onnx'); voices = os.environ.get('KOKORO_VOICES', 'voices.bin')
    k = Kokoro(model, voices)
    voice = os.environ.get('KOKORO_VOICE', 'af_heart')
    for i, (h, t) in enumerate(todo):
        s, sr = k.create(t, voice=voice, speed=1.0, lang='en-us')
        with tempfile.TemporaryDirectory() as d:
            sf.write(f'{d}/a.wav', s, sr); to_mp3(f'{d}/a.wav', f'{out}/{h}.mp3')
        if i % 20 == 0: print(i, '/', len(todo), flush=True)
elif provider == 'elevenlabs':
    key = os.environ['ELEVENLABS_API_KEY']; voice = os.environ.get('ELEVENLABS_VOICE_ID', '21m00Tcm4TlvDq8ikWAM')
    for i, (h, t) in enumerate(todo):
        req = urllib.request.Request(f'https://api.elevenlabs.io/v1/text-to-speech/{voice}?output_format=mp3_44100_64',
            data=json.dumps({'text': t, 'model_id': 'eleven_multilingual_v2'}).encode(),
            headers={'xi-api-key': key, 'Content-Type': 'application/json'})
        open(f'{out}/{h}.mp3', 'wb').write(urllib.request.urlopen(req).read())
        if i % 20 == 0: print(i, '/', len(todo), flush=True)
else:
    sys.exit('provider must be kokoro or elevenlabs')
print('done')
