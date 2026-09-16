# JYC VERSE · 版本区分说明

本仓库同时保留 **老版** 与 **新版** JYC VERSE，通过 git 分支 + 标签区分。

| 版本 | 分支 | 标签 | 来源仓库 | 最新提交 | 说明 |
|---|---|---|---|---|---|
| **老版 (v1)** | `legacy/old-jyc-verse` | `v1-old-jyc-verse` | `Niklausex/JYC-Verse` | `53749cb` | 12 星域投资人落地页 + 移动端适配 + Cloudflare Pages 部署（jyc.xnebul.com） |
| **新版 (v2，当前主线)** | `main` | `v2-new-jyc-verse` | `wp222hx-art/JYC-Verse` | `f170b71` | 在老版基础上新增 Mouse Metaverse（v8）与视频化（v9）：`/universe` 世界观页、`/play` 大厅 + 28 款可试玩游戏、12 守护鼠、13 段 AI 视频、20 张道具素材、GSAP 自托管动效、sizzle-reel 工具链 |

> 新版 `main` 的历史完整包含老版 `53749cb`，即 **老版 = 新版的祖先**。`f170b71` 之后的所有开发默认在 `main`（新版）上进行。

## Git 远端
- `origin` → https://github.com/wp222hx-art/JYC-Verse.git （新版，`main` 跟踪此远端）
- `old-origin` → https://github.com/Niklausex/JYC-Verse.git （老版来源，仅作参考）

## 常用操作
```bash
# 查看两版差异（文件级）
git diff --stat v1-old-jyc-verse v2-new-jyc-verse

# 切到老版看一眼（只读用途；改完记得切回 main）
git checkout legacy/old-jyc-verse
git checkout main

# 在老版的基础上另起修改
git checkout -b hotfix/old-xxx legacy/old-jyc-verse
```

## 新版相对老版的主要变更（86 files, +3189 / -27）
- 新增页面：`src/pages/universe.tsx`、`src/pages/play.tsx`
- 新增素材：`public/static/video/*`（12 星域视频 + 元宇宙首页视频）、`public/static/img/props/*`、`public/static/img/mice/*`
- 新增前端脚本：`games*.js`（可试玩游戏）、`motion.js`（GSAP 动效）等，GSAP/ScrollTrigger 改为 `public/static/vendor/` 自托管
- 新增工具：`tools/sizzle-reel/`（宣传片合成流水线，仅本地使用，不参与部署）
- 新增文档：`PRODUCT_CATALOG.md`
- 开发拓扑：`dev-proxy.cjs`（沙盒内 :3000 直出静态 + 反代 wrangler :3100，解决视频 Range 请求导致 wrangler dev 崩溃）
