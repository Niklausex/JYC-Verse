# JYC Verse · 潮玩星际赌城 —— 投资人展示官网

## 项目概览
- **名称**：JYC Verse 官网（QuantumPredict 出品，独立于 qpred.io 现有站点）
- **目标**：面向投资人展示 JYC Verse —— 以 JYC 代币为唯一结算货币的 Web3 娱乐宇宙（12 大星域 / 164+ 玩法），让 JYC 成为「全球最大的娱乐化代币」
- **风格**：B+C「潮玩星际赌城」—— 紫黑星空底 + 糖果霓虹色（金色仅留给 JYC）+ 28px 大圆角玻璃卡 + 弹性 3D 金色按钮 + Baloo 2 / Nunito 圆润展示字体 + 3D 潮玩星球与吉祥物
- **语言**：仅中文 UI；不含代币经济具体数字；路线图为 1 年（2026 Q4 → 2027 Q3）

## 当前模式：单页展示（二级页面已保留、暂不对外）
`src/components.tsx` 顶部的 **`SHOW_SUBPAGES = false`** 开关控制全站形态：

| `SHOW_SUBPAGES` | 行为 |
|---|---|
| `false`（当前） | 仅首页 `/` 可访问；顶部导航为页内锚点（十二星域 / JYC 经济 / 路线图 / 起点）；星域卡片、路线图卡片为非链接；页脚展示导航锚点 + 星域名称纯文本；CTA 为 `mailto:invest@qpred.io`；所有非根路径（`/vision`、`/realms/*`、`/contact` …）由 `src/index.tsx` 中间件 **302 重定向到 `/`** |
| `true` | 恢复完整多页面站点（下表全部路径），导航 / 卡片 / 页脚 / CTA 自动切回子页面链接 |

二级页面的代码（`src/pages/*.tsx`、路由、样式）全部保留，未删除；重新开放只需把开关改为 `true` 并 `npm run build`。

首页可用锚点：`#hero` `#pillars` `#home-realms` `#home-economy` `#home-roadmap` `#home-foundation`。

## URL（多页面站点，`SHOW_SUBPAGES = true` 时生效）
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
- 单页模式（`SHOW_SUBPAGES` 开关 + 302 中间件），二级页面代码保留待启用

## 待办 / 建议
- 部署到 Cloudflare Pages（需确认使用自有账号 BYOK 还是 Genspark 托管）
- 时机合适时将 `SHOW_SUBPAGES` 改为 `true` 开放二级页面（可顺带删除 `.nav-cta` / `.logo-coin` 遗留 CSS）
- 清理少量遗留未用 CSS（`.hero-orbit-wrap` `.hero-sun` `.flywheel` `.fw-node`）
- 可选：为星域详情页补充各星域专属配图 / 视频、接入真实联系表单（需第三方邮件 API）

## 部署
- **平台**：Cloudflare Pages
- **状态**：⏳ 未部署（沙盒预览中）
- **最后更新**：2026-09-03
