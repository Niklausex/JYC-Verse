# JYC Verse · 60s Sizzle Reel 剪辑工程

素材：`/home/user/gen/vid/realm-<id>.mp4`（seedance-2.0 原片 1280×720 24fps，12 星域）+ `universe-hero.mp4`；音乐 `music.mp3`（ElevenLabs Music，60s，F minor 124BPM 电子预告片风）。

```bash
python3 overlays.py   # 生成 HUD / 下三分之一字幕卡 / 片头片尾 PNG（Noto Sans CJK SC Black，index=2）
python3 build2.py     # 两遍渲染：每段 720p 中间片 → xfade 拼接 + 环境音 + 音乐混音
ffmpeg -i out.mp4 -c:v copy -af loudnorm=I=-14:TP=-1.5:LRA=9 final.mp4   # 响度标准化
```
结构：片头 4s → 12 × 4.6s（0.4s 交叉转场）→ 片尾 6s = 60.00s。字幕内容来自 `realms.jsonl`（由 `src/data.ts` 导出）。

## 配音版（v2）
- BGM v2：ElevenLabs Music「hybrid cinematic EDM trailer」128BPM F minor，`vo/bgm2.mp3`
- 旁白：ElevenLabs v3 TTS —— EN `Gaming Announcer`(style .7, speed 1.2)，ZH `Sam`(speed 1.2)，14 句（片头 1 + 星域 12 + 片尾 1）
- `mix_vo.py`：whisper 词级时间戳切 14 句 → 对齐到各段起点（星域句 +0.5s，片尾句 -0.6s）→ 超时才 atempo(≤1.25) → 高通/压缩 → BGM sidechain ducking → 混入原片环境音 → loudnorm -14 LUFS → `-c:v copy` 复用画面
