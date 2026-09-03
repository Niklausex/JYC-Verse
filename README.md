# JYC Verse — 投资人展示官网

> One Token. Every Thrill. — 以 JYC 为唯一代币的全球 Web3 娱乐宇宙

## 项目概览
- **名称**:JYC Verse 战略展示站(独立于现有 qpred.io 官网,不修改原站)
- **目标**:向投资人直观呈现 JYC 从"预测市场"进化为"全球最大娱乐化代币"的完整生态蓝图,激发兴趣与长期期许
- **语言**:全站中文
- **风格**:深空 + 霓虹赌场 + 金色点缀,玻璃拟态,长滚动叙事页(24 屏)

## URL
- **沙盒预览**:https://3000-i2h87mladygw4hr64m708-2b54fc91.sandbox.novita.ai
- **API**:`GET /api/realms` — 返回 12 大星域及玩法总数 JSON
- **生产环境**:尚未部署(Cloudflare Pages)

## 已完成功能
1. **Hero**:Canvas 星空 + 12 星球三轨道环绕 JYC 太阳,鼠标视差,点击星球跳转对应星域
2. **数据跑马灯**:生态关键指标滚动
3. **问题 → 进化**:孤岛困境 / 从预测市场到娱乐宇宙的进化叙事
4. **星系总览图**:12 星域可交互星图(自动旋转、悬停暂停、点击弹窗)
5. **12 大星域详情屏**(交替左右布局):预测 / 街机 / 彩票 / 幸运 / 体育 / 竞技 / 棋牌 / 真人 / 城市 / 收益 / AI / 开放平台,共 **164 种玩法**
6. **玩家画像**(7 类)+ **玩家旅程**(7 步)
7. **底层系统**(9 大基建)
8. **经济飞轮**:6 节点循环图 + 8 项 JYC 效用
9. **路线图**:2026 Q4 奠基 → 2027 Q1 扩张 → 2027 Q2 社交 → 2027 Q3 宇宙,滚动进度线动画
10. **公平与信任**、**现有基础数据**(数字滚动)、**投资人联系 CTA** + 免责声明
11. **星域弹窗**:上一个/下一个/Esc/方向键
12. 全响应式(1100 / 860 / 520 断点),支持 `prefers-reduced-motion`

## 项目结构
```
webapp/
├── src/
│   ├── index.tsx        # 页面全部组件 + 路由(/ 与 /api/realms)
│   ├── renderer.tsx     # HTML 外壳(字体、FontAwesome、样式脚本引用)
│   └── data.ts          # 全站内容数据(星域、画像、系统、路线图等)
├── public/static/
│   ├── style.css        # 设计系统
│   ├── app.js           # 交互脚本
│   ├── favicon.svg
│   └── img/             # 概念图目录(待放入)
├── ecosystem.config.cjs # PM2 配置
├── wrangler.jsonc
└── vite.config.ts
```

## 概念图文件名对照(放入 `public/static/img/` 即自动生效)
图片缺失时页面自动显示图标占位,不影响布局。

| 用途 | 文件名 |
|---|---|
| 12 星域星球(透明底 PNG) | `planet-predict.png` `planet-arcade.png` `planet-lottery.png` `planet-fortune.png` `planet-sports.png` `planet-arena.png` `planet-cards.png` `planet-live.png` `planet-city.png` `planet-earn.png` `planet-ai.png` `planet-open.png` |
| 12 星域场景图(JPG, 16:10) | `scene-predict.jpg` `scene-arcade.jpg` `scene-lottery.jpg` `scene-fortune.jpg` `scene-sports.jpg` `scene-arena.jpg` `scene-cards.jpg` `scene-live.jpg` `scene-city.jpg` `scene-earn.jpg` `scene-ai.jpg` `scene-open.jpg` |
| 孤岛困境 | `islands.jpg` |
| 进化叙事 | `evolution.jpg` |
| 公平与信任 | `fair.jpg` |

需求清单中 A1/A2(Hero 背景)、D1–D4/D6(画像横幅、飞轮、头奖、路线图、地球)尚未接入页面,收到图片后可追加。

## 数据架构
- **数据模型**:`Realm`(id/编号/名称/标语/描述/配色/图标/玩法列表/亮点/轨道位置)及静态内容常量,全部在 `src/data.ts`
- **存储**:纯静态展示站,无数据库
- **数据流**:`data.ts` → 服务端 JSX 渲染 → 同时以 `<script type="application/json">` 嵌入供前端弹窗使用

## 本地开发
```bash
npm run build
pm2 start ecosystem.config.cjs     # http://localhost:3000
pm2 logs webapp --nostream
```

## 部署
- **平台**:Cloudflare Pages
- **状态**:❌ 未部署(沙盒预览中)
- **技术栈**:Hono 4 + JSX + Vite 8 + Wrangler 4 + 原生 CSS/JS
- **最后更新**:2026-09-03

## 后续建议
1. 接入用户交付的 34 张概念图,并补充 A1/A2/D 系列位置
2. 移动端逐屏视觉复核
3. 部署到 Cloudflare Pages 并绑定自定义域名(如 verse.qpred.io)
4. 可选:增加英文版切换、投资人资料下载入口
