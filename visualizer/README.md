# Thirty problems, drawn out

Animated, narrated walk-throughs for 30 Python interview problems (Two Sum to Word Ladder). Each has a step-by-step scene,
the way of thinking, corner cases and a tested Python solution.

```
src/            page source: layout.js (scene engine), probs1-3.js (one tracer per problem), player.js, app.js, css
build.py        python build.py -> dist/index.html (single self-contained page; audio/ sits next to it)
sols.json       the 30 Python solutions (shown on the page)
test_solutions.py   runs every solution against the test cases in problems.json
test.js         node test.js probs1.js probs2.js probs3.js  -> runs every scene, checks layout bounds
captions.json   hash -> spoken text, one entry per animation step (made by `node dump.js`)
gen_audio.py    renders captions.json to audio/<hash>.mp3
```

## Narration audio

The page plays `audio/<hash>.mp3` for each step; `<hash>` is `fnv(speakText(caption))` from `src/layout.js`.
If a clip is missing it falls back to the browser's built-in voice.

```bash
node dump.js                      # refresh captions.json after editing any caption text
# Kokoro-82M (open source, runs locally)
pip install kokoro-onnx soundfile
curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.int8.onnx
curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin
KOKORO_MODEL=kokoro-v1.0.int8.onnx KOKORO_VOICES=voices-v1.0.bin KOKORO_VOICE=af_heart python gen_audio.py kokoro
# or ElevenLabs
ELEVENLABS_API_KEY=... ELEVENLABS_VOICE_ID=... python gen_audio.py elevenlabs
```

Only missing clips are generated, so changing one caption re-renders one clip. Needs `ffmpeg` on the path.
Serve `dist/index.html` with `audio/` beside it (copy or symlink `audio/` into `dist/`).
