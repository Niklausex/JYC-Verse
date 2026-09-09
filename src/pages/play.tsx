import { realms, allGames } from '../data'
import { Page, PageHero, CtaBand, Vid } from '../components'

/* ---------- 试玩钱包条(所有游戏页共用) ---------- */
export const WalletBar = () => (
  <div class="wallet-bar reveal" id="wallet-bar">
    <div class="wallet-bal"><span class="coin">J</span><b data-wallet-bal>10,000</b><small>试玩 JYC</small></div>
    <span class="wallet-demo">DEMO</span>
    <div class="wallet-stats">
      <span>局数<b data-wallet-plays>0</b></span>
      <span>获胜<b data-wallet-wins>0</b></span>
      <span>最大单赢<b data-wallet-best>0</b></span>
    </div>
    <button class="wallet-reset" type="button" data-wallet-reset><i class="fa-solid fa-rotate-left"></i> 重置</button>
  </div>
)

/* ---------- 单个游戏卡片(大厅) ---------- */
const GameCard = ({ g, i }: { g: (typeof allGames)[number]; i: number }) => (
  <a class="gcard-lobby glass reveal tilt" href={`/play/${g.id}`} style={`--c:${g.color};--c2:${g.color2};--d:${(i % 4) * .06}s`}>
    <div class="gl-visual">
      <img src={g.mouseImg} alt="" loading="lazy" />
      <span class="gl-tag">{g.tag}</span>
    </div>
    <div class="gl-body">
      <span class="gl-realm"><i class={`fa-solid ${g.icon}`}></i> {g.realmCode}</span>
      <h3>{g.name}</h3>
      <p>{g.desc}</p>
      <span class="gl-play">试玩 <i class="fa-solid fa-play"></i></span>
    </div>
  </a>
)

/* ---------- 游戏大厅 ---------- */
export const PlayPage = () => (
  <Page path="/play">
    <PageHero kicker="GAME HUB · DEMO" crumbs={[['游戏大厅']]}
      title={<>游戏大厅 · <span class="grad-gold">{allGames.length} 款可试玩</span></>}
      sub="所有玩法均为交互式模拟演示,使用 10,000 试玩 JYC。无需钱包、无需注册,直接感受每个星域的核心手感。" />
    <section class="sec sec-wide vid-strip-sec" id="lobby-videos">
      <div class="sec-head left reveal"><div class="kicker">GAMEPLAY REELS</div><h2 class="sec-title">十二星域<span class="grad-gold">玩法演绎</span></h2><p class="sec-sub">守护鼠亲自出镜,6 秒看懂每个星域的核心手感。</p></div>
      <div class="vid-strip" id="vid-strip">
        {realms.map(r => (
          <a class="vid-card" href={`/realms/${r.id}`} style={`--c:${r.color}`}>
            <video data-lazy-video muted playsinline loop preload="none" poster={r.poster}><source data-src={r.video} type="video/mp4" /></video>
            <span class="vid-card-cap"><b>{r.code}</b>{r.guardian.name}</span>
          </a>
        ))}
      </div>
    </section>
    <section class="sec sec-wide" id="lobby">
      <WalletBar />
      <div class="lobby-filter reveal" id="lobby-filter">
        <button type="button" class="on" data-filter="all">全部</button>
        {realms.filter(r => r.games.length).map(r => <button type="button" data-filter={r.id} style={`--c:${r.color}`}><i class={`fa-solid ${r.icon}`}></i> {r.name}</button>)}
      </div>
      <div class="lobby-grid" id="lobby-grid">
        {allGames.map((g, i) => <div data-realm={g.realmId}><GameCard g={g} i={i} /></div>)}
      </div>
    </section>
    <CtaBand title={<>这只是<span class="grad-gold">冰山一角</span></>} sub="164+ 种玩法将在 12 个月内逐步点亮。了解完整路线图与经济模型。" primary={['查看路线图', '/roadmap']} secondary={['JYC 经济', '/economy']} />
  </Page>
)

/* ---------- 单游戏页 ---------- */
export const GamePage = ({ g }: { g: (typeof allGames)[number] }) => {
  const realm = realms.find(r => r.id === g.realmId)!
  const siblings = realm.games.filter(x => x.id !== g.id)
  const others = allGames.filter(x => x.realmId !== g.realmId).sort(() => 0.5 - Math.random()).slice(0, 4)
  return (
    <Page path="/play">
      <section class="game-hero" style={`--c:${g.color};--c2:${g.color2}`}>
        <canvas class="stars" data-stars></canvas>
        <div class="game-hero-inner">
          <nav class="crumbs" aria-label="面包屑">
            <a href="/"><i class="fa-solid fa-house"></i></a><i class="fa-solid fa-chevron-right"></i>
            <a href="/play">游戏大厅</a><i class="fa-solid fa-chevron-right"></i>
            <a href={`/realms/${realm.id}`}>{realm.name}</a><i class="fa-solid fa-chevron-right"></i><span>{g.name}</span>
          </nav>
          <div class="game-head">
            <img class="game-guardian float" src={g.mouseImg} alt={realm.guardian.name} />
            <div>
              <div class="kicker" style={`color:${g.color};border-color:${g.color}55;background:${g.color}18`}>{realm.code} · {g.tag}</div>
              <h1 class="page-title">{g.name}</h1>
              <p class="page-sub">{g.desc}</p>
              <p class="game-quote"><img src="/static/img/mascot-head.webp" alt="" /> <b>{realm.guardian.name}:</b>“{realm.guardian.quote}”</p>
            </div>
          </div>
        </div>
      </section>

      <section class="sec sec-wide game-sec" id="game">
        <WalletBar />
        <div class="game-frame glass" data-game={g.id} style={`--c:${g.color};--c2:${g.color2}`}></div>
        <div class="game-video-row">
          <Vid src={g.video} poster={g.poster} cls="game-video" cap={`${g.guardian.name} 玩法演绎`} sub={`${g.realmName} · ${g.realmCode}`} />
          <div class="game-howto glass">
            <div class="kicker" style={`color:${g.color};border-color:${g.color}55;background:${g.color}18`}>HOW TO PLAY</div>
            <h3>{g.name} · 三步上手</h3>
            <ol>
              <li><b>01</b><span>在右侧面板选择下注金额(可用筹码快捷键)</span></li>
              <li><b>02</b><span>{g.desc}</span></li>
              <li><b>03</b><span>赢得的试玩 JYC 实时进入钱包;每笔投注 0.5% 汇入 MEGA JACKPOT</span></li>
            </ol>
            <blockquote><img src="/static/img/mascot-head.webp" alt="" /> {g.guardian.name}:“{g.guardian.quote}”</blockquote>
          </div>
        </div>
        <p class="game-disc"><i class="fa-solid fa-circle-info"></i> 本页为产品概念演示,所有数字为试玩币,随机数在浏览器本地生成,不涉及真实资产。</p>
      </section>

      {siblings.length > 0 && (
        <section class="sec sec-wide" id="game-siblings">
          <div class="sec-head left reveal"><div class="kicker">SAME REALM</div><h2 class="sec-title">{realm.name}的其他玩法</h2></div>
          <div class="lobby-grid four">
            {siblings.map((s, i) => <GameCard g={allGames.find(x => x.id === s.id)!} i={i} />)}
          </div>
        </section>
      )}

      <section class="sec sec-wide" id="game-others">
        <div class="sec-head left reveal"><div class="kicker">EXPLORE</div><h2 class="sec-title">换个星域试试</h2></div>
        <div class="lobby-grid four">
          {others.map((o, i) => <GameCard g={o} i={i} />)}
        </div>
      </section>

      <nav class="pager" aria-label="导航">
        <a class="pager-item" href={`/realms/${realm.id}`} style={`--c:${g.color}`}><i class="fa-solid fa-arrow-left"></i><div><small>返回星域</small><b>{realm.name}</b></div></a>
        <a class="pager-all" href="/play"><i class="fa-solid fa-grip"></i> 全部游戏</a>
        <a class="pager-item next" href="/universe" style="--c:#FFC531"><div><small>了解世界观</small><b>鼠族元宇宙</b></div><i class="fa-solid fa-arrow-right"></i></a>
      </nav>
    </Page>
  )
}
