"""Cut VO into 14 lines by word timestamps, place them on segment starts, duck BGM under VO, mux with the video."""
import json, subprocess, sys, os
D = '/home/user/gen/reel/vo'; VIDEO = '/home/user/gen/reel/JYC_Verse_Sizzle_Reel_60s.mp4'
XF = 0.4; INTRO, REALM, OUTRO = 4.0, 4.6, 6.0
starts = [0.0]; off = 0.0
for k in range(1, 14): off += (INTRO if k == 1 else REALM) - XF; starts.append(off)     # 0, 3.6, 7.8, ... 49.8, 54.0
TOTAL = starts[-1] + OUTRO
# line boundaries: (first-word index, last-word index) found by keyword of each line's first word
LINE_FIRST = {
 'en': ['JYC', 'Predict', 'Arcade', 'Lottery', 'Fortune', 'Sports', 'Arena', 'Cards', 'Live', 'JYC', 'Earn', 'AI', 'Open', 'JYC'],
 'zh': [('J','Y'), ('预','测'), ('极','速'), ('彩','票'), ('玄','学'), ('体','育'), ('竞','技'), ('卡','牌'), ('直','播'), ('元','宇'), ('理','财'), ('智','脑'), ('开','放'), ('J','Y')],
}
def cut_points(lang):
    w = json.load(open(f'{D}/{lang}_words.json'))['words']
    idx = []; i = 0
    for key in LINE_FIRST[lang]:
        def hit(j):
            if isinstance(key, tuple): return all(j+n < len(w) and w[j+n]['text'] == k for n, k in enumerate(key))
            return w[j]['text'] == key
        while i < len(w) and not hit(i): i += 1
        if i >= len(w): sys.exit(f'{lang}: keyword {key} not found'); 
        idx.append(i); i += 1
    lines = []
    for n, s in enumerate(idx):
        e = idx[n + 1] - 1 if n + 1 < len(idx) else len(w) - 1
        st = max(0, w[s]['start'] - 0.12); en = w[e]['end'] + 0.15
        lines.append((st, en))
    return lines

def build(lang, vo_gain_db=0.0, tag=''):
    lines = cut_points(lang)
    slots = [INTRO] + [REALM] * 12 + [OUTRO]
    f = []; labels = []
    for n, (st, en) in enumerate(lines):
        dur = en - st; slot = (slots[n] + 0.6 - 0.3) if n == 13 else (slots[n] - 0.25 - (0.5 if n else 0.2))      # leave room before the next cut
        tempo = max(1.0, min(1.25, dur / slot))                            # speed up only if the line overflows
        place = (starts[n] - 0.6) if n == 13 else (starts[n] + (0.5 if n else 0.2))
        chain = f'[1:a]atrim={st:.3f}:{en:.3f},asetpts=PTS-STARTPTS'
        if tempo > 1.01: chain += f',atempo={tempo:.3f}'
        chain += f',afade=in:d=0.03,afade=out:st={max(0, dur/tempo-0.08):.3f}:d=0.08,adelay={int(place*1000)}|{int(place*1000)}[vo{n}]'
        f.append(chain); labels.append(f'[vo{n}]')
        print(f'{lang} line {n:02d}: src {st:6.2f}-{en:6.2f} ({dur:4.2f}s) -> t={place:5.2f}s slot={slot:4.2f}s tempo={tempo:.2f}', flush=True)
    f.append(''.join(labels) + f'amix=inputs={len(labels)}:duration=longest:normalize=0,apad=whole_dur={TOTAL},atrim=0:{TOTAL},highpass=f=90,acompressor=threshold=-18dB:ratio=3:attack=5:release=80:makeup=4,volume={vo_gain_db}dB[vo]')
    # BGM: trim to 60s, end hit aligned; sidechain duck under VO
    f.append(f'[2:a]atrim=0:{TOTAL},asetpts=PTS-STARTPTS,afade=in:d=0.3,afade=out:st={TOTAL-1.2:.2f}:d=1.2,volume=0.9[bgm]')
    f.append('[vo]asplit[voA][voB]')
    f.append('[bgm][voB]sidechaincompress=threshold=0.05:ratio=6:attack=15:release=350:makeup=1[bgmd]')
    # original clip ambience from the muxed video, lowered
    f.append(f'[0:a]volume=0.35[amb]')
    f.append('[bgmd][amb][voA]amix=inputs=3:duration=first:normalize=0,alimiter=limit=0.97[mix]')
    f.append('[mix]loudnorm=I=-14:TP=-1.5:LRA=9[aout]')
    fs = f'{D}/filter_{lang}.txt'; open(fs, 'w').write(';\n'.join(f))
    out = f'/home/user/gen/reel/JYC_Verse_Sizzle_Reel_60s_VO_{lang.upper()}{tag}.mp4'
    cmd = f"ffmpeg -y -hide_banner -loglevel error -i {VIDEO} -i {D}/vo_{lang}.mp3 -i {D}/bgm2.mp3 -filter_complex_script {fs} -map 0:v -map '[aout]' -c:v copy -c:a aac -b:a 192k -movflags +faststart -t {TOTAL} {out}"
    r = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if r.returncode: print(r.stderr[-2000:]); sys.exit(1)
    print('OK', out, flush=True); return out

if __name__ == '__main__':
    for lang in sys.argv[1:] or ['en', 'zh']: build(lang)
