import { realms, totalPlays, roadmap, personas, type Realm } from '../data'
import { Page, PageHero, SectionHead, RealmCard, CtaBand, Pic, Vid, LiveProduct } from '../components'

/* ---------- 星系交互图 ---------- */
const Galaxy = () => (
  <section class="sec sec-galaxy" id="galaxy">
    <div class="galaxy reveal" id="galaxy-map">
      <a class="g-center" href="/economy" title="JYC 经济">
        <div class="g-sun"><span>JYC</span></div>
      </a>
      {[1, 2, 3].map(o => <div class={`g-ring g-ring-${o}`}></div>)}
      {realms.map(r => (
        <a class={`g-planet g-orbit-${r.orbit}`} style={`--a:${r.angle}deg;--c:${r.color};--c2:${r.color2}`} href={`/realms/${r.id}`} aria-label={`${r.code} ${r.name}`}>
          <span class="g-planet-body"><img src={r.planetImg} alt="" loading="lazy" /></span>
          <span class="g-planet-label"><b>{r.code}</b><small>{r.name} · {r.count} 玩法</small></span>
        </a>
      ))}
    </div>
    <p class="galaxy-hint reveal"><i class="fa-solid fa-hand-pointer"></i> 点击任意星球,进入该星域</p>
  </section>
)

export const RealmsPage = () => (
  <Page path="/realms">
    <PageHero kicker="THE UNIVERSE" crumbs={[['十二星域']]}
      title={<>十二星域 · <span class="grad-cyan">{totalPlays}+ 玩法</span></>}
      sub="从秒级结算的极速游戏城,到玩家做庄的元宇宙赌城。每一个星域对应一种“想赢”的心理,每一种玩法都以 JYC 结算。" />
    <Galaxy />
    <section class="sec sec-wide" id="realm-list">
      <SectionHead kicker="ALL REALMS" title={<>全部星域<span class="grad-gold">一览</span></>} />
      <div class="rcard-grid">
        {realms.map((r, i) => <RealmCard r={r} i={i} />)}
      </div>
    </section>
    <CtaBand title={<><span class="nowrap">这些玩法背后,</span><span class="nowrap">只有<span class="grad-gold">一枚代币</span></span></>} sub="了解 JYC 如何从 164+ 种玩法中持续捕获价值。"
      primary={['查看 JYC 经济', '/economy']} secondary={['平台架构', '/platform']} />
  </Page>
)

/* ---------- 星域详情页 ---------- */
export const RealmDetailPage = ({ r }: { r: Realm }) => {
  const idx = realms.findIndex(x => x.id === r.id)
  const prev = realms[(idx - 1 + realms.length) % realms.length]
  const next = realms[(idx + 1) % realms.length]
  const stage = roadmap.find(m => m.realms.includes(r.id))
  const fit = personas.filter(p => p.realms.includes(r.code))
  const others = realms.filter(x => x.id !== r.id).slice(0, 4)

  return (
    <Page path="/realms">
      <section class="realm-hero" style={`--c:${r.color};--c2:${r.color2}`}>
        <canvas class="stars" data-stars></canvas>
        <div class="realm-bg"></div>
        <div class="realm-hero-inner">
          <div class="realm-text">
            <nav class="crumbs" aria-label="面包屑">
              <a href="/"><i class="fa-solid fa-house"></i></a><i class="fa-solid fa-chevron-right"></i>
              <a href="/realms">十二星域</a><i class="fa-solid fa-chevron-right"></i><span>{r.name}</span>
            </nav>
            <div class="realm-no">星域 <b>{r.no}</b> <span class="realm-code">{r.code}</span></div>
            <h1 class="realm-name">{r.name}</h1>
            <p class="realm-tagline">{r.tagline}</p>
            <p class="realm-desc">{r.desc}</p>
            {r.highlight && <div class="realm-hl"><i class="fa-solid fa-bolt"></i>{r.highlight}</div>}
            <div class="realm-meta">
              <div><b>{r.count}</b><span>种玩法</span></div>
              {stage && <div><b>{stage.q}</b><span>{stage.title}阶段上线</span></div>}
              <div><b>JYC</b><span>唯一结算代币</span></div>
            </div>
          </div>
          <div class="realm-visual">
            <Pic src={r.sceneImg} alt={`${r.name} 概念图`} icon={r.icon} color={r.color} cls="realm-scene" />
            <Pic src={r.planetImg} alt={`${r.code} 星球`} icon={r.icon} color={r.color} cls="realm-planet" />
            <img class="realm-guardian float" src={r.mouseImg} alt={r.guardian.name} loading="eager" />
          </div>
        </div>
      </section>

      {/* 守护鼠 + 可试玩 */}
      <section class="sec sec-wide" id="realm-play" style={`--c:${r.color};--c2:${r.color2}`}>
        <div class="realm-video-wrap reveal">
          <Vid src={r.video} poster={r.poster} cls="realm-video" cap={`${r.guardian.name} · ${r.name}玩法演绎`} sub={r.tagline} />
        </div>
        <div class="guardian-band glass reveal">
          <img src={r.mouseImg} alt={r.guardian.name} />
          <div class="guardian-band-text">
            <div class="kicker" style={`color:${r.color};border-color:${r.color}55;background:${r.color}18`}>GUARDIAN</div>
            <h2>{r.guardian.name}</h2>
            <p class="gb-title">{r.guardian.title} · {r.guardian.trait}</p>
            <blockquote>“{r.guardian.quote}”</blockquote>
          </div>
          <div class="guardian-band-games">
            <span class="gb-label">本星域可试玩 · {r.games.length} 款</span>
            {r.games.map(g => g.live
              ? <a class="gb-game is-live" href={g.live.url} target="_blank" rel="noopener"><i class="fa-solid fa-box-open"></i><b>{g.name}</b><small>{g.tag} <i class="fa-solid fa-arrow-up-right-from-square"></i></small></a>
              : <a class="gb-game" href={`/play/${g.id}`}><i class="fa-solid fa-play"></i><b>{g.name}</b><small>{g.tag}</small></a>)}
          </div>
        </div>
        {r.games[0]?.live && <LiveProduct g={r.games[0]} color={r.color} color2={r.color2} />}
        {r.games[0] && !r.games[0].live && <>
          <div class="sec-head left reveal" style="margin-top:56px"><div class="kicker">PLAY NOW</div><h2 class="sec-title">试玩:<span style={`color:${r.color}`}>{r.games[0].name}</span></h2><p class="sec-sub">{r.games[0].desc}</p></div>
          <div class="wallet-bar reveal">
            <div class="wallet-bal"><span class="coin">J</span><b data-wallet-bal>10,000</b><small>试玩 JYC</small></div>
            <span class="wallet-demo">DEMO</span>
            <div class="wallet-stats"><span>局数<b data-wallet-plays>0</b></span><span>获胜<b data-wallet-wins>0</b></span><span>最大单赢<b data-wallet-best>0</b></span></div>
            <button class="wallet-reset" type="button" data-wallet-reset><i class="fa-solid fa-rotate-left"></i> 重置</button>
          </div>
          <div class="game-frame glass" data-game={r.games[0].id} style={`--c:${r.color};--c2:${r.color2}`}></div>
        </>}
      </section>

      <section class="sec" id="plays" style={`--c:${r.color};--c2:${r.color2}`}>
        <SectionHead kicker="GAMEPLAY" title={<>全部 <span style={`color:${r.color}`}>{r.count}</span> 种玩法</>} align="left" />
        <div class="plays-grid">
          {r.plays.map((p, i) => {
            const g = r.games.find(x => p.includes(x.name.split(' ')[0]) || x.name.includes(p.split(' ')[0]))
            const ext = r.games.find(x => x.live && (p.includes('JYC BOX') || p.includes('闪卡')))
            const live = ext?.live ? (p.includes('闪卡') && ext.live.siteUrl ? ext.live.siteUrl : ext.live.url) : undefined
            const href = live ?? (g ? `/play/${g.id}` : undefined)
            const Tag: any = href ? 'a' : 'div'
            return (
            <Tag class={`play glass reveal ${href ? 'playable' : ''}`} href={href} target={live ? '_blank' : undefined} rel={live ? 'noopener' : undefined} style={`--d:${(i % 6) * 0.05}s`}>
              <span class="play-no">{String(i + 1).padStart(2, '0')}</span>
              <span class="play-name">{p}</span>
              {live ? <span class="play-badge live"><i class="fa-solid fa-arrow-up-right-from-square"></i> 已上线</span> : g && <span class="play-badge"><i class="fa-solid fa-play"></i> 可试玩</span>}
            </Tag>
          )})}
        </div>
      </section>

      <section class="sec" id="realm-fit" style={`--c:${r.color}`}>
        <div class="split">
          <div class="reveal">
            <div class="kicker">WHO IS IT FOR</div>
            <h2 class="sec-title">为谁而建</h2>
            <p class="sec-sub">{fit.length ? '这个星域主要服务以下玩家人格:' : '这个星域是横向基础设施,服务所有玩家人格。'}</p>
            <div class="fit-list">
              {(fit.length ? fit : personas.slice(0, 3)).map(p => (
                <div class="fit glass" style={`--c:${p.color}`}><i class={`fa-solid ${p.icon}`}></i><b>{p.name}</b><span>{p.desc}</span></div>
              ))}
            </div>
          </div>
          <div class="reveal">
            <div class="kicker">JYC IN THIS REALM</div>
            <h2 class="sec-title">JYC 在这里如何流转</h2>
            <ul class="flow-list">
              <li><i class="fa-solid fa-coins"></i><div><b>投注 / 消耗</b><span>所有 {r.count} 种玩法以 JYC 下注、购买、支付</span></div></li>
              <li><i class="fa-solid fa-sack-dollar"></i><div><b>手续费 / 抽水</b><span>汇入生态收入池,与其他 11 个星域合并</span></div></li>
              <li><i class="fa-solid fa-gem"></i><div><b>MEGA JACKPOT</b><span>每笔投注抽 0.5% 注入全生态大奖池,本星域任何玩法都可能触发</span></div></li>
              <li><i class="fa-solid fa-fire"></i><div><b>分红 / 销毁</b><span>收入池一部分分红给 JYC 质押者,一部分回购销毁</span></div></li>
            </ul>
            <a class="btn btn-outline" href="/economy" style={`--c:${r.color}`}>查看完整经济模型 <i class="fa-solid fa-arrow-right"></i></a>
          </div>
        </div>
      </section>

      <section class="sec sec-wide" id="realm-others">
        <SectionHead kicker="EXPLORE" title="其他星域" />
        <div class="rcard-grid four">
          {others.map((x, i) => <RealmCard r={x} i={i} compact />)}
        </div>
      </section>

      <nav class="pager" aria-label="上下星域">
        <a class="pager-item" href={`/realms/${prev.id}`} style={`--c:${prev.color}`}>
          <i class="fa-solid fa-arrow-left"></i>
          <div><small>上一星域 · {prev.no}</small><b>{prev.name}</b></div>
        </a>
        <a class="pager-all" href="/realms"><i class="fa-solid fa-grip"></i> 全部星域</a>
        <a class="pager-item next" href={`/realms/${next.id}`} style={`--c:${next.color}`}>
          <div><small>下一星域 · {next.no}</small><b>{next.name}</b></div>
          <i class="fa-solid fa-arrow-right"></i>
        </a>
      </nav>
    </Page>
  )
}
