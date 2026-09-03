import { Hono } from 'hono'
import { renderer } from './renderer'
import {
  realms, totalPlays, tickerStats, personas, journey, systems,
  utilities, roadmap, trust, foundation, type Realm,
} from './data'

const app = new Hono()
app.use(renderer)

/* ---------- 图片:真图优先,失败自动回落到风格化占位 ---------- */
const Pic = ({ src, alt, icon, color, cls }: { src: string; alt: string; icon: string; color: string; cls?: string }) => (
  <figure class={`pic ${cls ?? ''}`} style={`--pc:${color}`}>
    <div class="pic-ph"><i class={`fa-solid ${icon}`}></i></div>
    <img src={src} alt={alt} loading="lazy" onload="this.parentElement.classList.add('loaded')" onerror="this.remove()" />
  </figure>
)

/* ---------- 导航 ---------- */
const Nav = () => (
  <header class="nav" id="site-nav">
    <a class="nav-logo" href="#hero">
      <span class="logo-coin"><span>J</span></span>
      <span class="logo-text">JYC <em>Verse</em></span>
    </a>
    <nav class="nav-links" aria-label="主导航">
      <a href="#galaxy">生态全景</a>
      <a href="#realms">十二星域</a>
      <a href="#economy">JYC 经济</a>
      <a href="#roadmap">路线图</a>
      <a href="#foundation">已有基石</a>
    </nav>
    <a class="btn btn-gold btn-sm" href="#contact">投资人咨询</a>
    <button class="nav-burger" id="nav-burger" aria-label="菜单"><i class="fa-solid fa-bars"></i></button>
  </header>
)

/* ---------- 屏 1 Hero ---------- */
const Hero = () => (
  <section class="hero" id="hero">
    <canvas id="stars" class="stars"></canvas>
    <div class="hero-orbit-wrap" id="hero-orbit">
      <div class="hero-sun">
        <div class="sun-core"><span>JYC</span></div>
        <div class="sun-glow"></div>
      </div>
      {[1, 2, 3].map(o => <div class={`hero-ring ring-${o}`}></div>)}
      {realms.map(r => (
        <a class={`hero-planet orbit-${r.orbit}`} style={`--a:${r.angle}deg;--c:${r.color}`} href={`#realm-${r.id}`} title={`${r.code} · ${r.name}`}>
          <i class={`fa-solid ${r.icon}`}></i>
        </a>
      ))}
    </div>
    <div class="hero-content">
      <div class="hero-kicker"><span class="dot"></span> JYC VERSE · WEB3 ENTERTAINMENT UNIVERSE</div>
      <h1 class="hero-title">One Token.<br /><span class="grad-gold">Every Thrill.</span></h1>
      <p class="hero-sub">一枚代币,通吃所有心跳</p>
      <p class="hero-desc">
        JYC Verse —— 全球首个覆盖全部博彩人格的一站式 Web3 娱乐宇宙。预测、竞猜、赌场、彩票、玄学、竞技、卡牌、直播、元宇宙……
        <b>12 大星域、{totalPlays}+ 玩法</b>,只用一枚筹码:<b class="grad-gold">JYC</b>。
      </p>
      <div class="hero-cta">
        <a class="btn btn-gold" href="#galaxy">探索宇宙 <i class="fa-solid fa-arrow-down"></i></a>
        <a class="btn btn-ghost" href="#economy">查看 JYC 经济</a>
      </div>
    </div>
    <div class="hero-stats">
      <span><b>12</b> 大星域</span><i></i>
      <span><b>{totalPlays}+</b> 玩法</span><i></i>
      <span><b>7</b> 种语言</span><i></i>
      <span><b>1</b> 枚代币</span>
    </div>
  </section>
)

/* ---------- 屏 2 数字滚动带 ---------- */
const Ticker = () => (
  <div class="ticker" aria-hidden="true">
    <div class="ticker-track">
      {[...tickerStats, ...tickerStats].map(s => (
        <span class="ticker-item"><b>{s.v}</b>{s.l}<i class="fa-solid fa-star-of-life"></i></span>
      ))}
    </div>
  </div>
)

const SectionHead = ({ kicker, title, sub }: { kicker: string; title: any; sub?: string }) => (
  <div class="sec-head reveal">
    <div class="kicker">{kicker}</div>
    <h2 class="sec-title">{title}</h2>
    {sub && <p class="sec-sub">{sub}</p>}
  </div>
)

/* ---------- 屏 3 孤岛 ---------- */
const Problem = () => (
  <section class="sec" id="problem">
    <SectionHead kicker="THE PROBLEM" title={<>万亿级市场,<span class="grad-cyan">却从未被统一</span></>}
      sub="体育博彩、线上赌场、彩票、预测市场、算命占卜、电竞竞猜、卡牌抽赏……每一个都是百亿千亿级生意,但它们彼此割裂。用户在孤岛间迁徙,资金在孤岛间蒸发。" />
    <div class="problem-grid">
      <Pic src="/static/img/islands.jpg" alt="七座孤岛" icon="fa-water" color="#38E8FF" cls="reveal" />
      <div class="problem-cards">
        {[
          ['fa-user-slash', '用户割裂', '一个人想玩全,要注册 7 个平台、记 7 套账户、过 7 次 KYC'],
          ['fa-coins', '筹码割裂', '彩票券换不了赌场筹码,赌场筹码进不了预测市场'],
          ['fa-link-slash', '价值割裂', '没有一枚代币横跨所有场景,每个孤岛的价值都无法沉淀'],
        ].map(([ic, t, d], i) => (
          <article class="glass pcard reveal" style={`--d:${i * 0.1}s`}>
            <i class={`fa-solid ${ic}`}></i>
            <h3>{t}</h3><p>{d}</p>
          </article>
        ))}
        <div class="pcard-answer reveal">
          <span class="grad-gold">JYC Verse 的答案:</span> 一个身份、一枚筹码、一个宇宙。
        </div>
      </div>
    </div>
  </section>
)

/* ---------- 屏 4 从预测市场到娱乐宇宙 ---------- */
const Evolution = () => (
  <section class="sec" id="evolution">
    <SectionHead kicker="FROM PREDICTION TO UNIVERSE" title={<>我们已经<span class="grad-gold">站在起点上</span></>}
      sub="QuantumPredict 已是一个成熟运营的 Web3 预测市场。但预测市场,只是 JYC Verse 的第一颗行星。" />
    <div class="evo reveal">
      <div class="evo-side evo-today glass">
        <div class="evo-label">TODAY</div>
        <div class="evo-name">QuantumPredict</div>
        <div class="evo-planet single"><i class="fa-solid fa-chart-line"></i></div>
        <ul>
          <li><b>$128M</b> TVL</li><li><b>482K</b> 注册用户</li>
          <li><b>1,284</b> 活跃市场</li><li><b>$96M</b> 累计派发</li>
        </ul>
        <p>1 个板块 · 预测市场</p>
      </div>
      <div class="evo-arrow">
        <Pic src="/static/img/evolution.jpg" alt="行星裂变为星系" icon="fa-explosion" color="#9D5CFF" cls="evo-pic" />
        <i class="fa-solid fa-angles-right"></i>
      </div>
      <div class="evo-side evo-tomorrow glass">
        <div class="evo-label gold">TOMORROW</div>
        <div class="evo-name grad-gold">JYC Verse</div>
        <div class="evo-planets">
          {realms.map(r => <span style={`--c:${r.color}`} title={r.code}><i class={`fa-solid ${r.icon}`}></i></span>)}
        </div>
        <ul>
          <li><b>12</b> 大星域</li><li><b>{totalPlays}+</b> 玩法</li>
          <li><b>7</b> 种博彩人格全覆盖</li><li><b>1</b> 枚代币 JYC</li>
        </ul>
        <p>全球最大的 Web3 娱乐宇宙</p>
      </div>
    </div>
  </section>
)

/* ---------- 屏 5 星系图 ---------- */
const Galaxy = () => (
  <section class="sec sec-galaxy" id="galaxy">
    <SectionHead kicker="THE UNIVERSE" title={<>JYC Verse · <span class="grad-cyan">十二星域</span></>} sub="点击任意星球,进入该星域" />
    <div class="galaxy reveal" id="galaxy-map">
      <div class="g-center">
        <div class="g-sun"><span>JYC</span></div>
      </div>
      {[1, 2, 3].map(o => <div class={`g-ring g-ring-${o}`}></div>)}
      {realms.map(r => (
        <button class={`g-planet g-orbit-${r.orbit}`} style={`--a:${r.angle}deg;--c:${r.color};--c2:${r.color2}`} data-realm={r.id} type="button" aria-label={`${r.code} ${r.name}`}>
          <span class="g-planet-body"><i class={`fa-solid ${r.icon}`}></i></span>
          <span class="g-planet-label"><b>{r.code}</b><small>{r.name} · {r.count} 玩法</small></span>
        </button>
      ))}
    </div>
    <div class="galaxy-legend reveal">
      {realms.map(r => (
        <button class="legend-item" data-realm={r.id} type="button" style={`--c:${r.color}`}>
          <i class={`fa-solid ${r.icon}`}></i><span>{r.code}</span><em>{r.count}</em>
        </button>
      ))}
    </div>
  </section>
)

/* ---------- 屏 6–17 十二星域 ---------- */
const RealmSection = ({ r, i }: { r: Realm; i: number }) => (
  <section class={`realm ${i % 2 ? 'realm-flip' : ''}`} id={`realm-${r.id}`} style={`--c:${r.color};--c2:${r.color2}`}>
    <div class="realm-bg"></div>
    <div class="realm-inner">
      <div class="realm-text reveal">
        <div class="realm-no">星域 <b>{r.no}</b> <span class="realm-code">{r.code}</span></div>
        <h2 class="realm-name">{r.name}</h2>
        <p class="realm-tagline">{r.tagline}</p>
        <p class="realm-desc">{r.desc}</p>
        {r.highlight && <div class="realm-hl"><i class="fa-solid fa-bolt"></i>{r.highlight}</div>}
        <div class="realm-tags">
          {r.plays.slice(0, 9).map(p => <span>{p}</span>)}
          {r.plays.length > 9 && <span class="more">+{r.plays.length - 9}</span>}
        </div>
        <button class="btn btn-outline" data-realm={r.id} type="button">查看全部 {r.count} 种玩法 <i class="fa-solid fa-arrow-right"></i></button>
      </div>
      <div class="realm-visual reveal">
        <Pic src={r.sceneImg} alt={`${r.name} 概念图`} icon={r.icon} color={r.color} cls="realm-scene" />
        <Pic src={r.planetImg} alt={`${r.code} 星球`} icon={r.icon} color={r.color} cls="realm-planet" />
        <div class="realm-count"><b>{r.count}</b><span>玩法</span></div>
      </div>
    </div>
  </section>
)

/* ---------- 屏 18 人格 ---------- */
const Personas = () => (
  <section class="sec" id="personas">
    <SectionHead kicker="RETENTION" title={<>总有一款,<span class="grad-gold">让你停留</span></>}
      sub="玩家不是同一种人。JYC Verse 为每一种“想赢”的心理,准备了对应的星域。" />
    <div class="persona-row">
      {personas.map((p, i) => (
        <article class="persona glass reveal" style={`--c:${p.color};--d:${i * 0.07}s`}>
          <i class={`fa-solid ${p.icon}`}></i>
          <h3>{p.name}</h3><p>{p.desc}</p>
          <div class="persona-realms">{p.realms.map(x => <span>{x}</span>)}</div>
        </article>
      ))}
    </div>
    <div class="journey reveal">
      <div class="journey-title"><i class="fa-solid fa-route"></i> 一位玩家的 24 小时</div>
      <div class="journey-line">
        {journey.map(j => (
          <div class="j-step">
            <span class="j-time">{j.t}</span>
            <span class="j-dot"><i class={`fa-solid ${j.icon}`}></i></span>
            <span class="j-text">{j.text}</span>
            <span class="j-realm">{j.realm}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
)

/* ---------- 屏 19 横向系统 ---------- */
const Systems = () => (
  <section class="sec" id="systems">
    <SectionHead kicker="ONE IDENTITY · ONE UNIVERSE" title={<>一个身份,<span class="grad-cyan">一个宇宙</span></>}
      sub="九大横向系统,把 12 个星域织成一张网——而不是 12 个孤立的 App。" />
    <div class="sys-grid">
      {systems.map((s, i) => (
        <article class="sys glass reveal" style={`--d:${(i % 3) * 0.08}s`}>
          <i class={`fa-solid ${s.icon}`}></i>
          <h3>{s.name}</h3><p>{s.desc}</p>
        </article>
      ))}
    </div>
  </section>
)

/* ---------- 屏 20 经济飞轮 ---------- */
const Economy = () => (
  <section class="sec" id="economy">
    <SectionHead kicker="JYC TOKENOMICS" title={<>玩法越多,<span class="grad-gold">JYC 越值钱</span></>}
      sub="每一个星域都是 JYC 的消耗场景,每一笔投注都在为持币者创造价值。" />
    <div class="economy">
      <div class="flywheel reveal" id="flywheel">
        <div class="fw-ring"></div>
        <div class="fw-center"><span>JYC</span><small>飞轮</small></div>
        {[
          ['fa-gamepad', `${totalPlays}+ 玩法`, '消耗 JYC'],
          ['fa-sack-dollar', '生态收入池', '手续费 · 抽水 · 庄优'],
          ['fa-hand-holding-dollar', '质押分红', '持币者获利'],
          ['fa-fire', '回购销毁', 'JYC 更稀缺'],
          ['fa-gem', 'MEGA JACKPOT', '拉新弹药'],
          ['fa-users', '用户量 ↑', '持币动机 ↑'],
        ].map(([ic, t, d], i) => (
          <div class="fw-node" style={`--i:${i}`}>
            <i class={`fa-solid ${ic}`}></i><b>{t}</b><small>{d}</small>
          </div>
        ))}
      </div>
      <div class="eco-side">
        <div class="eco-quotes reveal">
          <p><i class="fa-solid fa-quote-left"></i> 每一笔投注,都在为持币者分红</p>
          <p><i class="fa-solid fa-quote-left"></i> 每一次抽水,都在为 JYC 销毁</p>
          <p><i class="fa-solid fa-quote-left"></i> 每一个新玩法,都是 JYC 的新消耗</p>
        </div>
        <div class="util-grid reveal">
          {utilities.map(u => (
            <div class="util"><i class={`fa-solid ${u.icon}`}></i><b>{u.name}</b><span>{u.desc}</span></div>
          ))}
        </div>
      </div>
    </div>
  </section>
)

/* ---------- 屏 21 路线图 ---------- */
const Roadmap = () => (
  <section class="sec" id="roadmap">
    <SectionHead kicker="ROADMAP · 12 MONTHS" title={<>一年,<span class="grad-cyan">点亮十二星域</span></>}
      sub="四个季度,从 3 个星域到 12 个星域全部点亮。" />
    <div class="rm-track reveal">
      <div class="rm-line"><span id="rm-progress"></span></div>
      {roadmap.map((m, i) => (
        <article class="rm-stage" style={`--c:${m.color};--d:${i * 0.15}s`}>
          <div class="rm-node"><span>{i + 1}</span></div>
          <div class="rm-q">{m.q}</div>
          <h3>{m.title}</h3>
          <div class="rm-realms">
            {m.realms.map(id => { const r = realms.find(x => x.id === id)!; return <span style={`--c:${r.color}`} title={r.code}><i class={`fa-solid ${r.icon}`}></i>{r.code}</span> })}
          </div>
          <ul>{m.items.map(it => <li>{it}</li>)}</ul>
        </article>
      ))}
    </div>
  </section>
)

/* ---------- 屏 22 信任 ---------- */
const Trust = () => (
  <section class="sec" id="trust">
    <SectionHead kicker="TRUST & FAIRNESS" title={<>一切<span class="grad-gold">可验证</span></>}
      sub="Web3 娱乐平台的信任底线:不是相信我们,而是自己验证。" />
    <div class="trust-wrap">
      <Pic src="/static/img/fair.jpg" alt="Provably Fair" icon="fa-shield-halved" color="#38E8FF" cls="reveal trust-pic" />
      <div class="trust-grid">
        {trust.map((t, i) => (
          <article class="glass tcard reveal" style={`--d:${i * 0.08}s`}>
            <i class={`fa-solid ${t.icon}`}></i><h3>{t.name}</h3><p>{t.desc}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
)

/* ---------- 屏 23 已有基石 ---------- */
const Foundation = () => (
  <section class="sec sec-foundation" id="foundation">
    <SectionHead kicker="FOUNDATION" title={<>这不是一张白纸,<span class="grad-gold">是一个正在运转的起点</span></>} />
    <div class="found-grid reveal">
      {foundation.map(f => (
        <div class="found">
          <b class="count" data-count={f.v}>{f.v}</b><span>{f.l}</span>
        </div>
      ))}
    </div>
    <p class="found-note reveal">QuantumPredict 已在 BSC 上稳定运营 · 7 语种覆盖东亚与东南亚 · 已有 Staking 分红、Buyback 回购、Affiliate 推广机制</p>
  </section>
)

/* ---------- 屏 24 CTA ---------- */
const Cta = () => (
  <section class="cta" id="contact">
    <canvas id="stars2" class="stars"></canvas>
    <div class="cta-inner reveal">
      <div class="kicker">JOIN THE UNIVERSE</div>
      <h2>加入 JYC Verse,<br />投资下一个<span class="grad-gold">万亿级娱乐宇宙</span></h2>
      <p>12 大星域 · {totalPlays}+ 玩法 · 7 种博彩人格 · 1 枚代币</p>
      <div class="hero-cta">
        <a class="btn btn-gold" href="mailto:invest@qpred.io">投资人咨询 <i class="fa-solid fa-envelope"></i></a>
        <a class="btn btn-ghost" href="https://wp.qpred.com/" target="_blank" rel="noopener">查看白皮书</a>
        <a class="btn btn-ghost" href="https://www.qpred.io" target="_blank" rel="noopener">访问 QuantumPredict</a>
      </div>
    </div>
    <footer class="footer">
      <div class="footer-brand">
        <span class="logo-coin"><span>J</span></span> JYC Verse <em>by QuantumPredict</em>
      </div>
      <div class="footer-links">
        <a href="https://www.qpred.io" target="_blank" rel="noopener">官网</a>
        <a href="https://wp.qpred.com/" target="_blank" rel="noopener">白皮书</a>
        <a href="https://m.qpred.io/" target="_blank" rel="noopener">App</a>
      </div>
      <p class="footer-disc">本网站内容仅用于展示 JYC Verse 生态愿景与发展策略,不构成任何投资建议或收益承诺。数字资产具有高风险,请遵守所在地区法律法规。© 2026 JYC Verse. All rights reserved.</p>
    </footer>
  </section>
)

/* ---------- 星域浮层 ---------- */
const RealmModal = () => (
  <div class="modal" id="realm-modal" aria-hidden="true">
    <div class="modal-backdrop" data-close></div>
    <div class="modal-panel glass" role="dialog" aria-modal="true">
      <button class="modal-close" data-close aria-label="关闭"><i class="fa-solid fa-xmark"></i></button>
      <div class="modal-head">
        <span class="modal-icon"><i class="fa-solid" id="m-icon"></i></span>
        <div>
          <div class="realm-no">星域 <b id="m-no"></b> <span class="realm-code" id="m-code"></span></div>
          <h3 id="m-name"></h3>
          <p id="m-tagline"></p>
        </div>
        <div class="modal-count"><b id="m-count"></b><span>玩法</span></div>
      </div>
      <p class="modal-desc" id="m-desc"></p>
      <div class="modal-hl" id="m-hl"></div>
      <div class="modal-plays" id="m-plays"></div>
      <div class="modal-nav">
        <button class="btn btn-outline btn-sm" id="m-prev" type="button"><i class="fa-solid fa-chevron-left"></i> 上一星域</button>
        <button class="btn btn-outline btn-sm" id="m-next" type="button">下一星域 <i class="fa-solid fa-chevron-right"></i></button>
      </div>
    </div>
  </div>
)

/* ---------- 页面 ---------- */
app.get('/', (c) => {
  const data = realms.map(r => ({ id: r.id, no: r.no, code: r.code, name: r.name, tagline: r.tagline, desc: r.desc, color: r.color, color2: r.color2, icon: r.icon, count: r.count, plays: r.plays, highlight: r.highlight ?? '' }))
  return c.render(
    <>
      <div class="bg-nebula" aria-hidden="true"></div>
      <Nav />
      <main id="main">
        <Hero />
        <Ticker />
        <Problem />
        <Evolution />
        <Galaxy />
        <div id="realms">
          {realms.map((r, i) => <RealmSection r={r} i={i} />)}
        </div>
        <Personas />
        <Systems />
        <Economy />
        <Roadmap />
        <Trust />
        <Foundation />
        <Cta />
      </main>
      <RealmModal />
      <script type="application/json" id="realms-data" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}></script>
    </>
  )
})

app.get('/api/realms', (c) => c.json({ total: totalPlays, realms }))

export default app
