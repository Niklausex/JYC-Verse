import { realms, totalPlays, tickerStats, roadmap, foundation } from '../data'
import { Page, SectionHead, RealmCard, CtaBand } from '../components'

const Hero = () => (
  <section class="hero" id="hero">
    <div class="hero-bg" aria-hidden="true"></div>
    <canvas class="stars" data-stars></canvas>
    <div class="hero-content">
      <div class="hero-kicker"><span class="dot"></span> JYC VERSE · 潮玩星际赌城</div>
      <h1 class="hero-title">One Token.<br /><span class="grad-gold">Every Thrill.</span></h1>
      <p class="hero-sub">一枚代币,通吃所有心跳</p>
      <p class="hero-desc">
        全球首个覆盖全部博彩人格的一站式 Web3 娱乐宇宙。<b>12 大星域、{totalPlays}+ 玩法</b>,只用一枚筹码:<b class="grad-gold">JYC</b>。
      </p>
      <div class="hero-cta">
        <a class="btn btn-gold" href="/realms">进入十二星域 <i class="fa-solid fa-rocket"></i></a>
        <a class="btn btn-ghost" href="/economy">查看 JYC 经济</a>
      </div>
      <div class="hero-badges">
        {[['fa-dice', '秒级结算', '#FF4FB8'], ['fa-shield-halved', '可验证公平', '#3DE8FF'], ['fa-gem', 'MEGA JACKPOT', '#FFC531'], ['fa-language', '7 种语言', '#A855FF']].map(([ic, t, c]) => (
          <span style={`--c:${c}`}><i class={`fa-solid ${ic}`}></i>{t}</span>
        ))}
      </div>
    </div>
    <div class="hero-key" id="hero-orbit">
      <img src="/static/img/hero-key.jpg" alt="JYC Verse 主视觉:JYC 金币与环绕的十二星域" fetchpriority="high" />
      {realms.map(r => (
        <a class={`hero-planet orbit-${r.orbit}`} style={`--a:${r.angle}deg;--c:${r.color}`} href={`/realms/${r.id}`} title={`${r.code} · ${r.name}`}>
          <img src={r.planetImg} alt={r.name} loading="lazy" />
        </a>
      ))}
    </div>
    <div class="hero-stats">
      <span><b>12</b> 大星域</span><i></i>
      <span><b>{totalPlays}+</b> 玩法</span><i></i>
      <span><b>7</b> 种语言</span><i></i>
      <span><b>1</b> 枚代币</span>
    </div>
  </section>
)

const Ticker = () => (
  <div class="ticker" aria-hidden="true">
    <div class="ticker-track">
      {[...tickerStats, ...tickerStats].map(s => (
        <span class="ticker-item"><b>{s.v}</b>{s.l}<i class="fa-solid fa-star-of-life"></i></span>
      ))}
    </div>
  </div>
)

const Pillars = () => (
  <section class="sec" id="pillars">
    <SectionHead kicker="WHAT IS JYC VERSE" title={<>一个身份、一枚筹码、<span class="grad-cyan">一个宇宙</span></>}
      sub="体育博彩、线上赌场、彩票、预测市场、算命占卜、电竞竞猜、卡牌抽赏……每一个都是百亿千亿级生意,但它们彼此割裂。JYC Verse 用一枚代币把它们全部连成一体。" />
    <div class="pillars">
      {[
        ['fa-layer-group', '12 大星域', `${totalPlays}+ 种玩法覆盖全部 7 种博彩人格,玩家来了总有一款能停留。`, '/realms', '#38E8FF'],
        ['fa-coins', '一枚代币 JYC', '所有星域唯一结算货币。每一笔投注都在为持币者分红、为 JYC 销毁。', '/economy', '#F5C24B'],
        ['fa-network-wired', '一个平台', '统一账户、VIP、任务、排行榜、公会、MEGA JACKPOT——把 12 个星域织成一张网。', '/platform', '#9D5CFF'],
      ].map(([ic, t, d, href, c], i) => (
        <a class="pillar glass reveal" href={href} style={`--c:${c};--d:${i * 0.1}s`}>
          <i class={`fa-solid ${ic}`}></i>
          <h3>{t}</h3><p>{d}</p>
          <span class="link-more">了解更多 <i class="fa-solid fa-arrow-right"></i></span>
        </a>
      ))}
    </div>
  </section>
)

const RealmsPreview = () => (
  <section class="sec sec-wide" id="home-realms">
    <SectionHead kicker="THE UNIVERSE" title={<>JYC Verse · <span class="grad-cyan">十二星域</span></>}
      sub="从秒级结算的极速游戏城,到玩家做庄的元宇宙赌城——每一个星域都是 JYC 的消耗场景。" />
    <div class="rcard-grid">
      {realms.map((r, i) => <RealmCard r={r} i={i} compact />)}
    </div>
    <div class="sec-more reveal"><a class="btn btn-outline" href="/realms">查看全部 {totalPlays} 种玩法 <i class="fa-solid fa-arrow-right"></i></a></div>
  </section>
)

const EconomyTeaser = () => (
  <section class="sec" id="home-economy">
    <div class="split">
      <div class="split-text reveal">
        <div class="kicker">JYC TOKENOMICS</div>
        <h2 class="sec-title">玩法越多,<span class="grad-gold">JYC 越值钱</span></h2>
        <p class="sec-sub">每一个星域都是 JYC 的消耗场景,每一笔投注都在为持币者创造价值。手续费、抽水、庄家优势汇入生态收入池,一部分分红给质押者,一部分回购销毁。</p>
        <ul class="check-list">
          <li><i class="fa-solid fa-check"></i>每一笔投注,都在为持币者分红</li>
          <li><i class="fa-solid fa-check"></i>每一次抽水,都在为 JYC 销毁</li>
          <li><i class="fa-solid fa-check"></i>每一个新玩法,都是 JYC 的新消耗</li>
        </ul>
        <a class="btn btn-gold" href="/economy">了解 JYC 经济模型 <i class="fa-solid fa-arrow-right"></i></a>
      </div>
      <div class="flywheel-img reveal">
        <img src="/static/img/flywheel.jpg" alt="JYC 价值飞轮" loading="lazy" />
      </div>
    </div>
  </section>
)

const RoadmapTeaser = () => (
  <section class="sec" id="home-roadmap">
    <SectionHead kicker="ROADMAP · 12 MONTHS" title={<>一年,<span class="grad-cyan">点亮十二星域</span></>} />
    <div class="rm-mini reveal">
      {roadmap.map((m, i) => (
        <a class="rm-mini-item" href="/roadmap" style={`--c:${m.color}`}>
          <span class="rm-mini-q">{m.q}</span>
          <b>{m.title}</b>
          <div class="rm-realms">
            {m.realms.map(id => { const r = realms.find(x => x.id === id)!; return <span style={`--c:${r.color}`}><img src={r.planetImg} alt="" loading="lazy" />{r.code}</span> })}
          </div>
          {i < roadmap.length - 1 && <i class="fa-solid fa-chevron-right rm-mini-arrow"></i>}
        </a>
      ))}
    </div>
  </section>
)

const FoundationBand = () => (
  <section class="sec sec-foundation" id="home-foundation">
    <SectionHead kicker="FOUNDATION" title={<>这不是一张白纸,<span class="grad-gold">是一个正在运转的起点</span></>}
      sub="QuantumPredict 已在 BSC 上稳定运营,7 语种覆盖东亚与东南亚,已有 Staking 分红、Buyback 回购、Affiliate 推广机制。" />
    <div class="found-grid reveal">
      {foundation.map(f => (
        <div class="found"><b class="count" data-count={f.v}>{f.v}</b><span>{f.l}</span></div>
      ))}
    </div>
  </section>
)

export const HomePage = () => (
  <Page path="/">
    <Hero />
    <Ticker />
    <Pillars />
    <RealmsPreview />
    <EconomyTeaser />
    <RoadmapTeaser />
    <FoundationBand />
    <CtaBand title={<>加入 JYC Verse,投资下一个<span class="grad-gold">万亿级娱乐宇宙</span></>}
      sub={`12 大星域 · ${totalPlays}+ 玩法 · 7 种博彩人格 · 1 枚代币`}
      secondary={['查看愿景', '/vision']} />
  </Page>
)
