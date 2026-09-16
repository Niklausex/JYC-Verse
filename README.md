# JYC Verse · 潮玩星际赌城 —— 投资人展示官网

> ## ⚠️ 接手者（开发者 / AI Agent）请先读 [`HANDOFF.md`](./HANDOFF.md)
> 本仓库有 **新版**（`main`，线上 jyc.xnebul.com）与 **老版**（`legacy/old-jyc-verse`）两个版本。
> **动手前必须先问用户：要改新版还是老版？** 版本对应关系见 [`VERSIONS.md`](./VERSIONS.md)。

## 项目概览
- **名称**：JYC Verse 官网（QuantumPredict 出品，独立于 qpred.io 现有站点）
- **目标**：面向投资人展示 JYC Verse —— 以 JYC 代币为唯一结算货币的 Web3 娱乐宇宙（12 大星域 / 164+ 玩法），让 JYC 成为「全球最大的娱乐化代币」
- **风格**：B+C「潮玩星际赌城」—— 紫黑星空底 + 糖果霓虹色（金色仅留给 JYC）+ 28px 大圆角玻璃卡 + 弹性 3D 金色按钮 + Baloo 2 / Nunito 圆润展示字体 + 3D 潮玩星球与吉祥物
- **语言**：仅中文 UI；不含代币经济具体数字；路线图为 1 年（2026 Q4 → 2027 Q3）

## v9 · 视频化 + 素材补齐 + 赌场五连（2026-09-09）
- **13 段 AI 游戏动画视频**（seedance-2.0，守护鼠为主角、逐星域玩法演绎，6s / 960w / H.264 / 无声循环，含海报帧）：`public/static/video/realm-<id>.mp4|jpg` ×12 + `universe-hero.mp4`（元宇宙页背景）
- **视频出现在每一层**：
  - 首页 **Showreel 跑马灯**（24 段滚动、悬停暂停）+ 热门试玩卡**悬停即播**
  - `/universe` 全屏**背景视频**、守护鼠卡片悬停播放、**「鼠族影院」播放器**（12 段自动轮播 9s、点选切换、静音开关）
  - `/play` 大厅顶部 **12 星域视频条**；`/play/:id` 游戏页 **玩法演绎视频 + 三步玩法说明 + 守护鼠台词**
  - `/realms/:id` 详情页 `#realm-play` 首屏视频
  - 全部 `data-lazy-video`：进入视口才加载/播放、离开暂停，**并发限流 3 路**（省流量、省电）；触屏上悬停视频改为「进入视口 60% 自动播」
- **20 张游戏道具素材**（gpt-image-2 + 绿幕抠图 256px WebP）`img/props/`：骰子/筹码/7 号球/金币/樱桃/铃铛/7/星/宝石/火箭/牌背/奖杯/鼠币/虎/龙/红牌/宝箱/水晶/红包/炸弹
- **新增 5 款高动效赌场游戏**（`games3.js`）→ **28 款可试玩**：Slot 老虎机（3 转轮卷带 + 中奖连线）/ Roulette 轮盘（conic 轮盘 + 落球）/ Baccarat 百家乐（发牌翻牌）/ Dragon Tiger 龙虎 / Sic Bo 骰宝（**CSS 3D 骰子**，六面点数 grid 渲染）
- **老游戏升级**：Crash 火箭 + 骑鼠 + 尾焰 + 爆炸闪白；Mines 宝石/炸弹；Coinflip 双面币；刮刮乐图标；快开彩 7 号球；抽卡牌背；Jackpot 宝箱；直播间**红包雨**
- **动效可靠性**：GSAP + ScrollTrigger **自托管**（`static/vendor/`，不再依赖 CDN）；GSAP 接管 `.reveal` 元素并在懒加载导致布局变化时 `refresh()`，另有 1.5s 兜底防「滚过去还是透明」
- **沙盒开发拓扑**（仅本地，生产无关）：`dev-proxy.cjs` 在 :3000 直出 `/static/*`（支持 Range，iOS 视频必需）并反代 wrangler(:3100)——修复 wrangler dev 遇到浏览器中断视频流时崩溃（EPIPE / Network connection lost）

## v8 · 鼠族元宇宙 + 可试玩演示（2026-09-09）
- **IP 世界观**：鼠王 JYC King + 十二守护鼠（每星域一只，gpt-image-2 生成、绿幕抠透明 WebP、风格统一）
- **`/universe`** 鼠族元宇宙概念页：全景主视觉（Ken Burns）、为什么是鼠、鼠王、十二守护鼠卡片、四层结构
- **`/play`** 游戏大厅 + **`/play/:id`** 单游戏页：**23 款可交互模拟玩法**（试玩币 10,000 JYC，localStorage 持久化，Provably Fair 标签）
  - ARCADE：Crash（Canvas 曲线 + 自动兑现）/ Dice / Plinko（Canvas 物理）/ Mines / Coinflip（3D 翻币）/ Wheel
  - LOTTERY：快开彩（摇奖机）/ 刮刮乐（手指刮涂层）/ MEGA JACKPOT（全局滚存）
  - PREDICT：预测市场 / 加密 1 分钟涨跌（实时 K 线）· FORTUNE：塔罗（3D 翻牌）/ 每日运势
  - SPORTS：虚拟赛鼠 / 足球竞猜 · ARENA：猜拳 1v1 / Trivia 答题 · CARDS：命运卡抽卡（SSR 全息）
  - LIVE：主播竞猜房（弹幕）· CITY：玩家做庄 · EARN：Staking 分红 · AI：AI 推荐官 · OPEN：JYC Pay 扫码
- **星域详情页**：守护鼠横幅 + 本星域可试玩列表 + 内嵌首款游戏；玩法列表中可试玩项带「可试玩」徽标
- **首页**：新增「十二守护鼠环绕鼠王」交互舞台 + 「热门试玩」6 卡
- **动效**：GSAP ScrollTrigger 滚动动效（视差 / 交错入场）、3D 倾斜卡片 + 光泽、光标星尘粒子、页面转场、金按钮磁吸光、标题渐变流光
- **移动端**：底部 5 格导航（safe-area）、游戏单列布局 + 紧凑吸顶钱包条、44px 触控目标、触摸按压反馈、0 横向溢出（iPhone 13 实测）
- **API**：`/api/games` 返回全部可试玩游戏

## 站点形态：多页面（每个按钮 / 卡片都进入对应二级页面）
`src/components.tsx` 顶部的 **`SHOW_SUBPAGES = true`** 开关控制全站形态（当前为 `true`，即完整多页面站点）。若改为 `false`，全站退化为仅首页 + 锚点导航，所有二级路径 302 回首页——仅作备用，当前不使用。

所有页面右下角有金色「回到顶部」按钮（滚动超过 600px 出现，点击平滑回顶）。

## URL（多页面站点）
- **生产**：https://jyc.xnebul.com
- **GitHub**：https://github.com/wp222hx-art/JYC-Verse

| 路径 | 内容 |
|---|---|
| `/` | 首页：3D JYC 币主视觉 + 12 颗环绕星球、跑马灯、三支柱、十二星域卡片、飞轮、路线图摘要、基石数据、CTA |
| `/vision` | 愿景：市场规模、七座孤岛、从预测到宇宙、七种人格横幅、24 小时玩家日、可验证信任 |
| `/realms` | 十二星域：可点击星系图 + 全部星域卡片 |
| `/realms/:id` | 星域详情（predict/arcade/lottery/fortune/sports/arena/cards/live/jyc-city/earn/ai/open）：场景图、全部玩法、人群、JYC 流转、上一/下一星域 |
| `/economy` | JYC 经济：飞轮图、8 重效用、收入分配（无数字）、Staking 阶梯 |
| `/platform` | 平台架构：三层架构、9 大系统、MEGA JACKPOT、信任合规、7 语种全球化 |
| `/roadmap` | 路线图：四季度横幅 + 轨道、里程碑、12 星域点亮进度、起点数据 |
| `/universe` | 鼠族元宇宙：全景主视觉、为什么是鼠、鼠王、十二守护鼠、四层结构 |
| `/universe#cinema` | 鼠族影院：12 段守护鼠玩法视频轮播 |
| `/play` | 游戏大厅：12 星域视频条 + 28 款可试玩 + 星域筛选 + 试玩钱包 |
| `/play/:id` | 单游戏页（视频 + 玩法三步 + 可玩 Demo）：crash/dice/plinko/mines/coinflip/wheel/**slot/roulette/baccarat/dragontiger/sicbo**/lotto/scratch/jackpot/predict/updown/tarot/fortune/race/match/rps/trivia/gacha/liveroom/banker/stake/airec/pay |
| `/api/games` | 全部可试玩游戏 JSON |
| `/contact` | 投资人咨询：联系方式 + 一页纸摘要 + 吉祥物 |
| 其他 | 404 页（吉祥物 + 「这颗星球尚未点亮」） |

## 技术栈
- Hono 4 + JSX（`hono/jsx-renderer`）· Vite（`@hono/vite-build/cloudflare-pages`）· Wrangler · Cloudflare Pages
- 前端零框架：原生 CSS（`public/static/style.css` 设计 Token 见文件头；`games.css` 游戏 UI）+ 原生 JS（`app.js` 星空 / reveal / GSAP 动效 / 3D 倾斜 / 粒子 / 转场 / **视频系统**；`games.js` 游戏引擎核心 + 钱包 + 8 款；`games2.js` 15 款星域专属模拟；`games3.js` 5 款赌场游戏，**必须最后加载**——它设置 `window.__JYC_ALL_LOADED` 解锁挂载）
- GSAP 3.12 + ScrollTrigger 自托管于 `static/vendor/`（渐进增强，缺失时回落到 CSS reveal）
- 视频：`<Vid>` 组件（`components.tsx`）→ `<video data-lazy-video poster><source data-src>`，由 `app.js` IntersectionObserver 懒加载
- 无数据库 / 无后端状态；所有内容集中在 `src/data.ts`

## 目录结构
```
src/
  index.tsx        路由 + 404
  renderer.tsx     HTML 外壳、字体、meta
  components.tsx   Nav / Footer / RealmCard / Banner / Mascot / CtaBand / Pic …
  data.ts          12 星域、玩法、人格、路线图、平台系统等全部文案
  pages/           home / vision / realms / economy / platform / roadmap / contact / universe / play
public/static/
  style.css  games.css  app.js  games.js  games2.js  games3.js
  vendor/  gsap.min.js  ScrollTrigger.min.js
  video/   realm-<id>.mp4 + .jpg ×12   universe-hero.mp4 + .jpg   （守护鼠玩法演绎视频 + 海报帧）
  img/
    props/  20 张游戏道具（透明 WebP 256px）
    mouse-<id>.webp  ×12   十二守护鼠(透明底,720px 高)
    universe-key.jpg / universe-key-m.jpg   鼠族元宇宙全景(桌面 16:9 / 移动竖版)
    planet-<id>.webp ×12   透明底 3D 潮玩星球（640px）
    scene-<id>.jpg   ×12   星域场景图（1376×768）
    hero-key.jpg / hero-bg.jpg   首页主视觉 / 星空底
    flywheel.jpg  jackpot.jpg  roadmap.jpg  personas.jpg  globe.jpg
    islands.jpg  evolution.jpg  fair.jpg
    mascot.webp / mascot.png / mascot-head.webp   吉祥物
```

## 接手指南（给其他开发者 / Agent）
**先读 `HANDOFF.md`，先问用户要改新版还是老版。** 以下为新版（`main`）流程：
```bash
git clone https://github.com/wp222hx-art/JYC-Verse.git && cd JYC-Verse
npm install
npm run build                      # Vite → dist/（Cloudflare Pages 产物）
npx wrangler pages dev dist --ip 0.0.0.0 --port 3000   # 本地预览；沙盒内用 pm2 start ecosystem.config.cjs
```
- **改文案 / 数据**：只改 `src/data.ts`（12 星域、玩法数、人格、路线图、系统、基石数据、**守护鼠设定 `guardian`、可试玩 `games`、世界观 `universeLore`** 全部在此，页面自动读取）
- **新增可试玩游戏**：① `data.ts` 对应星域 `games[]` 加一条 `{id,name,desc,tag}`；② 在 `games2.js` / `games3.js` 注册 `G.<id> = { title, mount(root, api) }`，`api.bet(n)` 扣款 / `api.win(n, mult)` 派奖 + 动效 / `api.lose()` / `api.toast()` / `api.confetti()` / `api.coinBurst()`；页面 `<div data-game="<id>">` 自动挂载（若新增第 4 个脚本，把 `__JYC_ALL_LOADED = true` 挪到最后一个）
- **换 / 加视频**：替换 `public/static/video/realm-<id>.mp4` + 同名 `.jpg` 海报即可（建议 ≤1.2MB、960w、H.264 baseline、`-movflags +faststart`、无音轨）；页面从 `data.ts` 的 `video/poster` 字段读取
- **改首页结构**：`src/pages/home.tsx`；共用组件（导航、页脚、星域卡、CTA、吉祥物）在 `src/components.tsx`
- **改样式**：`public/static/style.css`（文件头定义设计 Token：`--bg --gold --cyan --violet --pink --mint --r`；移动端断点约 860px）；交互在 `public/static/app.js`
- **改图片**：替换 `public/static/img/` 同名文件即可（命名规则见下文目录结构）
- **缓存**：改动 css/js 后请把 `src/renderer.tsx` 中 `?v=N` 加一
- **站点形态开关**：`src/components.tsx` → `SHOW_SUBPAGES`（当前 `true`，勿改）
- 无数据库、无环境变量、无第三方 API；纯静态 + Hono 边缘渲染

## 本地开发
```bash
npm run build                      # 构建到 dist/
pm2 start ecosystem.config.cjs     # :3000 dev-proxy(静态+Range) → :3100 wrangler pages dev dist
sleep 9 && curl http://localhost:3000
# 仅改前端静态文件时无需重启（proxy 直读 public/）；改 src/ 需 npm run build（wrangler 自动热载 dist）
```

## 已完成
- 多页面信息架构（8 个主页面 + 12 个星域详情 + 404）
- B+C 潮玩星际赌城全站视觉重构
- 35 张 AI 素材处理（星球抠白底→透明 WebP、场景/叙事图压缩）并接入全部页面
- 桌面（1440）与移动（360 / 390 / 430 / 768）视觉 QA：无横向溢出，汉堡菜单深色面板、点击锚点后自动收起
- 顶部左侧改为纯文字 Logo「JYC Verse」（去掉金币图标），右上角「投资人咨询」按钮已移除
- 全部二级页面开放；右下角「回到顶部」按钮

## 待办 / 建议
- v9 静态资源 ~14MB（视频 12.3MB），Cloudflare Pages 单文件上限 25MB，无压力
- 可选：视频加 WebM/AV1 备用源进一步省流量；给 Showreel 加「点击进入对应游戏」
- 可选：把 Plinko / Crash 的 Canvas 换成 WebGL 提升低端机帧率；试玩战绩接 D1 做全球排行榜
- 可顺带删除 `.nav-cta` / `.logo-coin` 遗留 CSS
- 清理少量遗留未用 CSS（`.hero-orbit-wrap` `.hero-sun` `.flywheel` `.fw-node`）
- 可选：为星域详情页补充各星域专属配图 / 视频、接入真实联系表单（需第三方邮件 API）

## 部署
- **生产地址**：https://jyc.xnebul.com（备用 https://jyc-verse.pages.dev）
- **平台**：Cloudflare Pages（用户自有账号），项目名 `jyc-verse`，生产分支 `main`
- **DNS**：`xnebul.com` zone 内 CNAME `jyc` → `jyc-verse.pages.dev`（proxied）
- **重新部署**：`npm run build && npx wrangler pages deploy dist --project-name jyc-verse --branch main`（需 `CLOUDFLARE_API_TOKEN`）
- **状态**：✅ 新版（v9）已上线，已替代老版
- **版本区分**：新版 `main` / 标签 `v2-new-jyc-verse`；老版 `legacy/old-jyc-verse` / 标签 `v1-old-jyc-verse`（详见 `VERSIONS.md`、`HANDOFF.md`）
- **最后更新**：2026-09-16（新版 v9 部署到 Cloudflare Pages `jyc-verse` 替代老版；仓库内区分新/老版并加入交接文档）
