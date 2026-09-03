import { realms, totalPlays, tickerStats, personas, journey, foundation, trust } from '../data'
import { Page, PageHero, SectionHead, CtaBand, Pic, Banner } from '../components'

const Market = () => (
  <section class="sec" id="market">
    <SectionHead kicker="MARKET" title={<>万亿级市场,<span class="grad-cyan">却从未被统一</span></>}
      sub="体育博彩、线上赌场、彩票、预测市场、算命占卜、电竞竞猜、卡牌抽赏……每一个都是百亿千亿级生意,但它们彼此割裂。" />
    <div class="stat-grid reveal">
      {tickerStats.map(s => (
        <div class="stat glass"><b class="count" data-count={s.v}>{s.v}</b><span>{s.l}</span></div>
      ))}
    </div>
  </section>
)

const Problem = () => (
  <section class="sec" id="problem">
    <div class="problem-grid">
      <Pic src="/static/img/islands.jpg" alt="七座孤岛" icon="fa-water" color="#38E8FF" cls="reveal" />
      <div class="problem-cards">
        <div class="reveal">
          <div class="kicker">THE PROBLEM</div>
          <h2 class="sec-title">七座孤岛</h2>
          <p class="sec-sub">用户在孤岛间迁徙,资金在孤岛间蒸发。</p>
        </div>
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
          <span class="grad-gold">JYC Verse 的答案:</span> <span class="nowrap">一个身份、</span><span class="nowrap">一枚筹码、</span><span class="nowrap">一个宇宙。</span>
        </div>
      </div>
    </div>
  </section>
)

const Evolution = () => (
  <section class="sec" id="evolution">
    <SectionHead kicker="FROM PREDICTION TO UNIVERSE" title={<>我们已经<span class="grad-gold">站在起点上</span></>}
      sub="QuantumPredict 已是一个成熟运营的 Web3 预测市场。但预测市场,只是 JYC Verse 的第一颗行星。" />
    <div class="evo reveal">
      <div class="evo-side evo-today glass">
        <div class="evo-label">TODAY</div>
        <div class="evo-name">QuantumPredict</div>
        <div class="evo-planet single"><img src="/static/img/planet-predict.webp" alt="预测宇宙" loading="lazy" /></div>
        <ul class="evo-stats">
          {foundation.map(f => <li><b>{f.v}</b><span>{f.l.split(' ')[0]}</span></li>)}
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
          {realms.map(r => <a href={`/realms/${r.id}`} style={`--c:${r.color}`} title={r.code}><img src={r.planetImg} alt={r.name} loading="lazy" /></a>)}
        </div>
        <ul class="evo-stats">
          <li><b>12</b><span>大星域</span></li><li><b>{totalPlays}+</b><span>种玩法</span></li>
          <li><b>7</b><span>类玩家画像</span></li><li><b>1</b><span>枚代币 JYC</span></li>
        </ul>
        <p>全球最大的 Web3 娱乐宇宙</p>
      </div>
    </div>
  </section>
)

const Personas = () => (
  <section class="sec" id="personas">
    <SectionHead kicker="RETENTION" title={<>总有一款,<span class="grad-gold">让你停留</span></>}
      sub="玩家不是同一种人。JYC Verse 为每一类玩家画像,准备了对应的星域。" />
    <Banner src="/static/img/personas.jpg" alt="七类玩家画像" cap="七类玩家画像,七条进入 JYC Verse 的路" sub="分析派 · 刺激派 · 梦想派 · 玄学派 · 竞技派 · 收藏派 · 社交派" />
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

export const VisionPage = () => (
  <Page path="/vision">
    <PageHero kicker="VISION" crumbs={[['愿景']]}
      title={<><span class="nowrap">让 JYC 成为</span><span class="grad-gold"><span class="nowrap">全球最大的</span><span class="nowrap">娱乐化代币</span></span></>}
      sub="从一个预测市场,到覆盖全部玩家类型的 Web3 娱乐宇宙。这是 JYC Verse 的起点、问题与答案。" />
    <Market />
    <Problem />
    <Evolution />
    <Personas />
    <Trust />
    <CtaBand title={<>准备好进入<span class="grad-cyan">十二星域</span>了吗?</>} sub="12 个星域,164+ 种玩法,逐一展开。"
      primary={['探索十二星域', '/realms']} secondary={['查看 JYC 经济', '/economy']} />
  </Page>
)
