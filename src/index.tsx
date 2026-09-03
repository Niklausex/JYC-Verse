import { Hono } from 'hono'
import { renderer } from './renderer'
import { realms, totalPlays } from './data'
import { Page, Mascot } from './components'
import { HomePage } from './pages/home'
import { VisionPage } from './pages/vision'
import { RealmsPage, RealmDetailPage } from './pages/realms'
import { EconomyPage } from './pages/economy'
import { PlatformPage } from './pages/platform'
import { RoadmapPage } from './pages/roadmap'
import { ContactPage } from './pages/contact'

const app = new Hono()
app.use(renderer)

/* ---------- 页面路由 ---------- */
app.get('/', (c) => c.render(<HomePage />))

app.get('/vision', (c) => c.render(<VisionPage />, {
  title: '愿景', desc: '从一个预测市场,到覆盖全部博彩人格的 Web3 娱乐宇宙。JYC Verse 的起点、问题与答案。',
}))

app.get('/realms', (c) => c.render(<RealmsPage />, {
  title: '十二星域', desc: `JYC Verse 十二星域 · ${totalPlays}+ 种玩法。从极速游戏城到元宇宙赌城,每一种玩法都以 JYC 结算。`,
}))

app.get('/realms/:id', (c) => {
  const r = realms.find(x => x.id === c.req.param('id'))
  if (!r) return c.notFound()
  return c.render(<RealmDetailPage r={r} />, {
    title: `${r.name} · ${r.code}`, desc: `${r.tagline}。${r.desc}`,
  })
})

app.get('/economy', (c) => c.render(<EconomyPage />, {
  title: 'JYC 经济', desc: `JYC 是 JYC Verse 唯一的结算货币,${totalPlays}+ 个消耗场景。每一笔投注都在为持币者分红、为 JYC 销毁。`,
}))

app.get('/platform', (c) => c.render(<PlatformPage />, {
  title: '平台架构', desc: '统一账户、九大横向系统、MEGA JACKPOT、可验证公平——把 12 个星域织成一张网。',
}))

app.get('/roadmap', (c) => c.render(<RoadmapPage />, {
  title: '路线图', desc: '2026 Q4 奠基 → 2027 Q1 扩张 → 2027 Q2 社交 → 2027 Q3 宇宙。一年点亮十二星域。',
}))

app.get('/contact', (c) => c.render(<ContactPage />, {
  title: '投资人咨询', desc: '欢迎投资机构与战略合作伙伴联系 JYC Verse。',
}))

/* ---------- API ---------- */
app.get('/api/realms', (c) => c.json({ total: totalPlays, realms }))
app.get('/api/realms/:id', (c) => {
  const r = realms.find(x => x.id === c.req.param('id'))
  return r ? c.json(r) : c.json({ error: 'not found' }, 404)
})

/* ---------- 404 ---------- */
app.notFound((c) => { c.status(404); return c.render(
  <Page path="/404">
    <section class="notfound">
      <canvas class="stars" data-stars></canvas>
      <div class="notfound-inner">
        <Mascot cls="notfound-mascot" />
        <div class="kicker">404</div>
        <h1 class="page-title">这颗星球<span class="grad-gold">尚未点亮</span></h1>
        <p class="page-sub">你要找的页面不在 JYC Verse 的任何一个星域里。</p>
        <div class="hero-cta">
          <a class="btn btn-gold" href="/">回到首页</a>
          <a class="btn btn-ghost" href="/realms">探索十二星域</a>
        </div>
      </div>
    </section>
  </Page>,
  { title: '页面未找到' },
) })

export default app
