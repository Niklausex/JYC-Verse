# JYC Verse · 潮玩星际赌城 —— 投资人展示官网

## 项目概览
- **名称**：JYC Verse 官网（QuantumPredict 出品，独立于 qpred.io 现有站点）
- **目标**：面向投资人展示 JYC Verse —— 以 JYC 代币为唯一结算货币的 Web3 娱乐宇宙（12 大星域 / 164+ 玩法），让 JYC 成为「全球最大的娱乐化代币」
- **风格**：B+C「潮玩星际赌城」—— 紫黑星空底 + 糖果霓虹色（金色仅留给 JYC）+ 28px 大圆角玻璃卡 + 弹性 3D 金色按钮 + Baloo 2 / Nunito 圆润展示字体 + 3D 潮玩星球与吉祥物
- **语言**：仅中文 UI；不含代币经济具体数字；路线图为 1 年（2026 Q4 → 2027 Q3）

## 站点形态：多页面（每个按钮 / 卡片都进入对应二级页面）
`src/components.tsx` 顶部的 **`SHOW_SUBPAGES = true`** 开关控制全站形态（当前为 `true`，即完整多页面站点）。若改为 `false`，全站退化为仅首页 + 锚点导航，所有二级路径 302 回首页——仅作备用，当前不使用。

所有页面右下角有金色「回到顶部」按钮（滚动超过 600px 出现，点击平滑回顶）。

## URL（多页面站点）
- **生产**：https://jyc.xnebul.com
- **GitHub**：https://github.com/Niklausex/JYC-Verse

| 路径 | 内容 |
|---|---|
| `/` | 首页：3D JYC 币主视觉 + 12 颗环绕星球、跑马灯、三支柱、十二星域卡片、飞轮、路线图摘要、基石数据、CTA |
| `/vision` | 愿景：市场规模、七座孤岛、从预测到宇宙、七种人格横幅、24 小时玩家日、可验证信任 |
| `/realms` | 十二星域：可点击星系图 + 全部星域卡片 |
| `/realms/:id` | 星域详情（predict/arcade/lottery/fortune/sports/arena/cards/live/jyc-city/earn/ai/open）：场景图、全部玩法、人群、JYC 流转、上一/下一星域 |
| `/economy` | JYC 经济：飞轮图、8 重效用、收入分配（无数字）、Staking 阶梯 |
| `/platform` | 平台架构：三层架构、9 大系统、MEGA JACKPOT、信任合规、7 语种全球化 |
| `/roadmap` | 路线图：四季度横幅 + 轨道、里程碑、12 星域点亮进度、起点数据 |
| `/contact` | 投资人咨询：联系方式 + 一页纸摘要 + 吉祥物 |
| 其他 | 404 页（吉祥物 + 「这颗星球尚未点亮」） |

## 技术栈
- Hono 4 + JSX（`hono/jsx-renderer`）· Vite（`@hono/vite-build/cloudflare-pages`）· Wrangler · Cloudflare Pages
- 前端零框架：原生 CSS（`public/static/style.css`，设计 Token 见文件头）+ 原生 JS（`public/static/app.js`：星空 canvas、滚动 reveal、主视觉视差、星系旋转、路线图进度、数字滚动、键盘翻页）
- 无数据库 / 无后端状态；所有内容集中在 `src/data.ts`

## 目录结构
```
src/
  index.tsx        路由 + 404
  renderer.tsx     HTML 外壳、字体、meta
  components.tsx   Nav / Footer / RealmCard / Banner / Mascot / CtaBand / Pic …
  data.ts          12 星域、玩法、人格、路线图、平台系统等全部文案
  pages/           home / vision / realms / economy / platform / roadmap / contact
public/static/
  style.css  app.js
  img/
    planet-<id>.webp ×12   透明底 3D 潮玩星球（640px）
    scene-<id>.jpg   ×12   星域场景图（1376×768）
    hero-key.jpg / hero-bg.jpg   首页主视觉 / 星空底
    flywheel.jpg  jackpot.jpg  roadmap.jpg  personas.jpg  globe.jpg
    islands.jpg  evolution.jpg  fair.jpg
    mascot.webp / mascot.png / mascot-head.webp   吉祥物
```

## 接手指南（给其他开发者 / Agent）
```bash
git clone https://github.com/Niklausex/JYC-Verse.git && cd JYC-Verse
npm install
npm run build                      # Vite → dist/（Cloudflare Pages 产物）
npx wrangler pages dev dist --ip 0.0.0.0 --port 3000   # 本地预览；沙盒内用 pm2 start ecosystem.config.cjs
```
- **改文案 / 数据**：只改 `src/data.ts`（12 星域、玩法数、人格、路线图、系统、基石数据等全部在此，页面自动读取）
- **改首页结构**：`src/pages/home.tsx`；共用组件（导航、页脚、星域卡、CTA、吉祥物）在 `src/components.tsx`
- **改样式**：`public/static/style.css`（文件头定义设计 Token：`--bg --gold --cyan --violet --pink --mint --r`；移动端断点约 860px）；交互在 `public/static/app.js`
- **改图片**：替换 `public/static/img/` 同名文件即可（命名规则见下文目录结构）
- **缓存**：改动 css/js 后请把 `src/renderer.tsx` 中 `?v=N` 加一
- **站点形态开关**：`src/components.tsx` → `SHOW_SUBPAGES`（当前 `true`，勿改）
- 无数据库、无环境变量、无第三方 API；纯静态 + Hono 边缘渲染

## 本地开发
```bash
npm run build                      # 构建到 dist/
pm2 start ecosystem.config.cjs     # wrangler pages dev dist --port 3000
curl http://localhost:3000
```

## 已完成
- 多页面信息架构（8 个主页面 + 12 个星域详情 + 404）
- B+C 潮玩星际赌城全站视觉重构
- 35 张 AI 素材处理（星球抠白底→透明 WebP、场景/叙事图压缩）并接入全部页面
- 桌面（1440）与移动（360 / 390 / 430 / 768）视觉 QA：无横向溢出，汉堡菜单深色面板、点击锚点后自动收起
- 顶部左侧改为纯文字 Logo「JYC Verse」（去掉金币图标），右上角「投资人咨询」按钮已移除
- 全部二级页面开放；右下角「回到顶部」按钮

## 待办 / 建议
- 可顺带删除 `.nav-cta` / `.logo-coin` 遗留 CSS
- 清理少量遗留未用 CSS（`.hero-orbit-wrap` `.hero-sun` `.flywheel` `.fw-node`）
- 可选：为星域详情页补充各星域专属配图 / 视频、接入真实联系表单（需第三方邮件 API）

## 部署
- **生产地址**：https://jyc.xnebul.com（备用 https://jyc-verse.pages.dev）
- **平台**：Cloudflare Pages（用户自有账号），项目名 `jyc-verse`，生产分支 `main`
- **DNS**：`xnebul.com` zone 内 CNAME `jyc` → `jyc-verse.pages.dev`（proxied）
- **重新部署**：`npm run build && npx wrangler pages deploy dist --project-name jyc-verse --branch main`（需 `CLOUDFLARE_API_TOKEN`）
- **状态**：✅ 已上线
- **最后更新**：2026-09-03
