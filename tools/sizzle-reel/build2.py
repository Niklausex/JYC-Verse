"""Two-pass assembly (2-core friendly): 1) render each segment to a 720p intermediate, 2) xfade-concat + music."""
import json, subprocess, shlex, os, sys
R = '/home/user/gen/reel'; V = '/home/user/gen/vid'; T = f'{R}/tmp'; os.makedirs(T, exist_ok=True)
realms = [json.loads(l) for l in open('/home/user/gen/realms.jsonl')]
XF = 0.4; INTRO, REALM, OUTRO = 4.0, 4.6, 6.0; FPS = 24
TRANS = ['fade', 'slideleft', 'circleopen', 'smoothright', 'fadewhite', 'smoothleft', 'diagtl', 'radial', 'slideup', 'circleopen', 'hlslice', 'smoothup', 'fade']
ENC = f'-c:v libx264 -preset veryfast -crf 16 -pix_fmt yuv420p -r {FPS} -c:a aac -b:a 192k -ar 48000 -ac 2'
def run(cmd):
    r = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if r.returncode: print(r.stderr[-1500:]); sys.exit(1)

segs = []
# intro
out = f'{T}/s00.mp4'
if not os.path.exists(out):
    fc = (f"[0:v]trim=0:{INTRO},setpts=PTS-STARTPTS,scale=1280:720,setsar=1,fps={FPS}[v];"
          f"[1:v]format=rgba,fade=in:st=0.5:d=0.7:alpha=1,fade=out:st={INTRO-0.6}:d=0.5:alpha=1[o];"
          f"[v][o]overlay=0:'(1-min(1,max(0,(t-0.5)/0.7)))*30':shortest=1[vo];"
          f"[0:a]atrim=0:{INTRO},asetpts=PTS-STARTPTS,afade=in:d=0.3,afade=out:st={INTRO-0.4}:d=0.4[ao]")
    run(f"ffmpeg -y -hide_banner -loglevel error -i {V}/universe-hero.mp4 -loop 1 -t {INTRO} -i {R}/intro.png -filter_complex \"{fc}\" -map '[vo]' -map '[ao]' -t {INTRO} {ENC} {out}")
segs.append((out, INTRO)); print('intro ok', flush=True)
# realms
for i, rm in enumerate(realms):
    out = f'{T}/s{i+1:02d}.mp4'
    if not os.path.exists(out):
        s0 = 0.7
        fc = (f"[0:v]trim={s0}:{s0+REALM},setpts=PTS-STARTPTS,scale=1280:720,setsar=1,fps={FPS},eq=saturation=1.08:contrast=1.04[v];"
              f"[1:v]format=rgba,fade=in:st=0:d=0.3:alpha=1[h];"
              f"[2:v]format=rgba,fade=in:st=0.35:d=0.45:alpha=1,fade=out:st={REALM-0.5}:d=0.4:alpha=1[l];"
              f"[v][h]overlay=0:0:shortest=1[a];"
              f"[a][l]overlay=0:'36*pow(1-min(1,max(0,(t-0.35)/0.45)),2)':shortest=1[vo];"
              f"[0:a]atrim={s0}:{s0+REALM},asetpts=PTS-STARTPTS,afade=in:d=0.3,afade=out:st={REALM-0.4}:d=0.4[ao]")
        run(f"ffmpeg -y -hide_banner -loglevel error -i {V}/realm-{rm['id']}.mp4 -loop 1 -t {REALM} -i {R}/hud_{i:02d}.png -loop 1 -t {REALM} -i {R}/lower_{i:02d}.png -filter_complex \"{fc}\" -map '[vo]' -map '[ao]' -t {REALM} {ENC} {out}")
    segs.append((out, REALM)); print('realm', rm['id'], 'ok', flush=True)
# outro
out = f'{T}/s13.mp4'
if not os.path.exists(out):
    fc = (f"[0:v]trim=2:{2+OUTRO},setpts=PTS-STARTPTS,scale=1280:720,setsar=1,fps={FPS},eq=brightness=-0.06[v];"
          f"[1:v]format=rgba,fade=in:st=0.4:d=0.6:alpha=1[o];"
          f"[v][o]overlay=0:'(1-min(1,max(0,(t-0.4)/0.6)))*30':shortest=1,fade=out:st={OUTRO-0.9}:d=0.9[vo];"
          f"[0:a]atrim=2:{2+OUTRO},asetpts=PTS-STARTPTS,afade=in:d=0.3,afade=out:st={OUTRO-1.0}:d=1.0[ao]")
    run(f"ffmpeg -y -hide_banner -loglevel error -i {V}/universe-hero.mp4 -loop 1 -t {OUTRO} -i {R}/outro.png -filter_complex \"{fc}\" -map '[vo]' -map '[ao]' -t {OUTRO} {ENC} {out}")
segs.append((out, OUTRO)); print('outro ok', flush=True)

# ---- pass 2: xfade concat + audio mix ----
inputs = ' '.join(f'-i {p}' for p, _ in segs) + f' -i {R}/music.mp3'
mi = len(segs)
f = []; prev = '0:v'; offset = 0.0; starts = [0.0]
for k in range(1, len(segs)):
    offset += segs[k-1][1] - XF; starts.append(offset)
    out = f'x{k}' if k < len(segs)-1 else 'vout'
    f.append(f'[{prev}][{k}:v]xfade=transition={TRANS[(k-1)%len(TRANS)]}:duration={XF}:offset={offset:.3f}[{out}]'); prev = out
total = offset + segs[-1][1]
al = []
for k, st in enumerate(starts):
    f.append(f'[{k}:a]adelay={int(st*1000)}|{int(st*1000)},volume=0.7[ad{k}]'); al.append(f'[ad{k}]')
f.append(f'[{mi}:a]atrim=0:{total:.3f},asetpts=PTS-STARTPTS,afade=in:d=0.4,afade=out:st={total-1.6:.3f}:d=1.6,volume=0.82[mus]')
f.append(''.join(al) + f'[mus]amix=inputs={len(al)+1}:duration=first:normalize=0,alimiter=limit=0.95[aout]')
open(f'{R}/filter2.txt', 'w').write(';\n'.join(f))
print(f'concat total {total:.2f}s', flush=True)
run(f"ffmpeg -y -hide_banner -loglevel error {inputs} -filter_complex_script {R}/filter2.txt -map '[vout]' -map '[aout]' -t {total:.3f} -c:v libx264 -preset fast -crf 19 -profile:v high -pix_fmt yuv420p -r {FPS} -c:a aac -b:a 192k -movflags +faststart {R}/JYC_Verse_Sizzle_Reel_60s_720p.mp4")
print('DONE', flush=True)
