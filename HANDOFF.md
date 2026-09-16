# HANDOFF · 接手须知（所有开发者 / AI Agent 必读）

> ## ⚠️ 第一步：先问用户「要改 **新版** 还是 **老版** JYC VERSE？」
> 本仓库同时保留两个版本。**在做任何修改、部署之前，必须先向用户确认目标版本**，
> 不要默认、不要猜测。确认后再切换到对应分支操作。

## 两个版本一览

| | 新版 (v2) | 老版 (v1) |
|---|---|---|
| 分支 | `main` | `legacy/old-jyc-verse` |
| 标签 | `v2-new-jyc-verse` | `v1-old-jyc-verse` |
| 基线提交 | `f170b71`（之后持续演进） | `53749cb`（冻结） |
| 内容 | 12 星域 + **鼠族元宇宙 `/universe`** + **游戏大厅 `/play`（28 款可试玩）** + 13 段 AI 视频 + GSAP 动效 + sizzle-reel 工具链 | 12 星域投资人落地页 + 移动端适配（无 /universe、/play、视频） |
| 线上部署 | **Cloudflare Pages 项目 `jyc-verse`** → https://jyc-verse.pages.dev / **https://jyc.xnebul.com** | 已被新版**替代下线**；代码仅保留在分支/标签中 |
| GitHub | https://github.com/wp222hx-art/JYC-Verse （`main`） | 同仓库 `legacy/old-jyc-verse` 分支；原始来源 Niklausex/JYC-Verse |

关系：老版 `53749cb` 是新版 `main` 的祖先提交，两版历史线性相连。详见 `VERSIONS.md`。

## 用户说「新版」时
```bash
git checkout main && git pull origin main
npm run build
# 沙盒预览（仓库自带 dev-proxy 拓扑，:3000 → :3100）
pm2 start ecosystem.config.cjs
# 部署（BYOK，用户自己的 Cloudflare 账号，先 setup_cloudflare_api_key）
npx wrangler pages deploy dist --project-name jyc-verse
```

## 用户说「老版」时
```bash
git checkout legacy/old-jyc-verse
# 若要修改，请另起分支，不要直接在 legacy 分支上 force 改历史
git checkout -b legacy/fix-xxx
```
- 老版**没有** `dev-proxy.cjs`，其 `ecosystem.config.cjs` 直接跑 wrangler 于 :3000
- 老版**没有**线上站点。若用户要求把老版重新上线，**不要覆盖 `jyc-verse` 项目**（那是新版），
  应新建 Pages 项目（如 `jyc-verse-legacy`）后再问是否需要绑域名

## 禁止事项
- ❌ 未确认版本就开始改代码 / 部署
- ❌ 把老版部署到 `jyc-verse` 项目（会把线上新版顶掉）
- ❌ 删除 `legacy/old-jyc-verse` 分支或 `v1-old-jyc-verse` / `v2-new-jyc-verse` 标签
- ❌ 在 `legacy/old-jyc-verse` 上 rebase / force push

## 关键路径速查（新版）
- 入口 `src/index.tsx`；页面 `src/pages/*.tsx`；数据 `src/data.ts`；公共组件 `src/components.tsx`（顶部 `SHOW_SUBPAGES` 开关）
- 前端脚本 `public/static/app.js`、`games.js` / `games2.js` / `games3.js`；动效库自托管 `public/static/vendor/`
- 视频/图片 `public/static/video/`、`public/static/img/`
- 产品目录 `PRODUCT_CATALOG.md`；宣传片工具 `tools/sizzle-reel/`（仅本地，不参与部署）
- Cloudflare：账号 `Zfc9274@gmail.com's Account`，Pages 项目 `jyc-verse`，自定义域 `jyc.xnebul.com`
