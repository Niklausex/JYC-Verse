import { realms, universeLore, totalPlays } from '../data'
import { Page, SectionHead, CtaBand, Vid } from '../components'

/* ---------- 鼠族元宇宙 · 概念页 ---------- */
export const UniversePage = () => (
  <Page path="/universe">
    {/* Hero: 元宇宙全景 + 鼠王 */}
    <section class="uv-hero" id="universe-hero">
      <canvas class="stars" data-stars></canvas>
      <picture class="uv-key">
        <source media="(max-width: 700px)" srcset="/static/img/universe-key-m.jpg" />
        <img src="/static/img/universe-key.jpg" alt="JYC 鼠族元宇宙全景:鼠王站在 JYC 金币上,十二座星岛环绕" fetchpriority="high" />
      </picture>
      <video class="uv-video" autoplay muted playsinline loop poster="/static/video/universe-hero.jpg" aria-hidden="true"><source src="/static/video/universe-hero.mp4" type="video/mp4" /></video>
      <div class="uv-hero-fade"></div>
      <div class="uv-hero-text">
        <div class="kicker">MOUSE METAVERSE</div>
        <h1 class="page-title">{universeLore.title}</h1>
        <p class="uv-slogan grad-gold">{universeLore.slogan}</p>
        <p class="page-sub">{universeLore.intro}</p>
        <div class="hero-cta">
          <a class="btn btn-gold" href="#guardians">认识十二守护鼠 <i class="fa-solid fa-arrow-down"></i></a>
          <a class="btn btn-ghost" href="/play">进入游戏大厅 <i class="fa-solid fa-gamepad"></i></a>
        </div>
      </div>
      <div class="uv-parade" aria-hidden="true">
        {realms.map((r, i) => <img src={r.mouseImg} alt="" style={`--i:${i};--c:${r.color}`} loading="lazy" />)}
      </div>
    </section>

    {/* 为什么是老鼠 */}
    <section class="sec" id="why-mouse">
      <SectionHead kicker="WHY A MOUSE" title={<>为什么是<span class="grad-gold">一只鼠</span></>} sub="IP 不是贴图,是商业逻辑的具象化。鼠族的每一个特性,都对应 JYC Verse 的一条底层设计。" />
      <div class="why-grid">
        {universeLore.whyMouse.map((w, i) => (
          <div class="why glass reveal tilt" style={`--d:${i * .08}s`}>
            <i class={`fa-solid ${w.icon}`}></i>
            <h3>{w.title}</h3>
            <p>{w.desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* 鼠王 */}
    <section class="sec king-sec" id="king">
      <div class="king-wrap reveal">
        <div class="king-visual">
          <div class="king-halo"></div>
          <img class="king-img float" src="/static/img/mascot.webp" alt="鼠王 JYC King" />
          <div class="king-coins" aria-hidden="true">{Array.from({ length: 8 }, (_, i) => <b style={`--i:${i}`}>J</b>)}</div>
        </div>
        <div class="king-text">
          <div class="kicker">THE KING</div>
          <h2 class="sec-title">{universeLore.king.name}</h2>
          <p class="king-title grad-gold">{universeLore.king.title}</p>
          <p class="sec-sub">{universeLore.king.desc}</p>
          <ul class="check-list">
            <li><i class="fa-solid fa-crown"></i> 全生态品牌形象,出现在每一个星域的加载页与胜利动画</li>
            <li><i class="fa-solid fa-shirt"></i> 皮肤系统:赛季限定穿搭、IP 联名、玩家 UGC 皮肤市场</li>
            <li><i class="fa-solid fa-cube"></i> 潮玩衍生:手办、盲盒、NFT 数字藏品三位一体</li>
          </ul>
        </div>
      </div>
    </section>

    {/* 十二守护鼠 */}
    <section class="sec sec-wide" id="guardians">
      <SectionHead kicker="12 GUARDIANS" title={<>十二<span class="grad-cyan">守护鼠</span></>} sub="每颗星球由一位守护鼠掌管。它们是玩法的引导者、赛季的代言人,也是未来卡牌、皮肤与 NFT 的角色底座。" />
      <div class="guard-grid">
        {realms.map((r, i) => (
          <a class="guard glass reveal tilt" href={`/realms/${r.id}`} style={`--c:${r.color};--c2:${r.color2};--d:${(i % 4) * .07}s`}>
            <div class="guard-bg"></div>
            <div class="guard-media">
              <img class="guard-img" src={r.mouseImg} alt={r.guardian.name} loading="lazy" />
              <video class="guard-vid" data-hover-video muted playsinline loop preload="none" poster={r.poster}><source data-src={r.video} type="video/mp4" /></video>
            </div>
            <div class="guard-body">
              <span class="guard-no">{r.no} · {r.code}</span>
              <h3>{r.guardian.name}</h3>
              <p class="guard-title">{r.guardian.title}</p>
              <p class="guard-trait">{r.guardian.trait}</p>
              <blockquote>“{r.guardian.quote}”</blockquote>
              <span class="guard-foot"><b>{r.count}</b> 种玩法 · <b>{r.games.length}</b> 款可试玩 <i class="fa-solid fa-arrow-right"></i></span>
            </div>
          </a>
        ))}
      </div>
    </section>

    {/* 影院:十二星域玩法演绎 */}
    <section class="sec sec-wide" id="cinema">
      <SectionHead kicker="CINEMA" title={<>十二星域<span class="grad-gold">玩法演绎</span></>} sub="每位守护鼠在自己的星域里演示核心玩法——这是 JYC Verse 未来游戏内 CG 与营销素材的风格基线。" />
      <div class="cinema reveal" id="cinema-player">
        <div class="cinema-main">
          <video id="cinema-video" muted playsinline loop autoplay poster={realms[1].poster}><source src={realms[1].video} type="video/mp4" /></video>
          <div class="cinema-info"><span class="kicker" id="cinema-code">{realms[1].code}</span><h3 id="cinema-title">{realms[1].guardian.name} · {realms[1].name}</h3><p id="cinema-tag">{realms[1].tagline}</p><a class="btn btn-gold btn-sm" id="cinema-link" href={`/realms/${realms[1].id}`}>进入星域试玩 <i class="fa-solid fa-play"></i></a></div>
          <button class="cinema-mute" type="button" id="cinema-mute" aria-label="静音切换"><i class="fa-solid fa-volume-xmark"></i></button>
        </div>
        <div class="cinema-list">
          {realms.map((r, i) => (
            <button type="button" class={`cinema-item ${i === 1 ? 'on' : ''}`} data-cinema={r.id} data-video={r.video} data-poster={r.poster} data-code={r.code} data-title={`${r.guardian.name} · ${r.name}`} data-tag={r.tagline} style={`--c:${r.color}`}>
              <img src={r.poster} alt="" loading="lazy" /><span><b>{r.code}</b>{r.guardian.name}</span>
            </button>
          ))}
        </div>
      </div>
    </section>

    {/* 四层结构 */}
    <section class="sec" id="layers">
      <SectionHead kicker="ARCHITECTURE" title={<>元宇宙的<span class="grad-gold">四层结构</span></>} />
      <div class="layers">
        {universeLore.layers.map((l, i) => (
          <div class="layer glass reveal" style={`--d:${i * .1}s`}>
            <span class="layer-no">{l.n}</span>
            <h3>{l.title}</h3>
            <p>{l.desc}</p>
          </div>
        ))}
      </div>
    </section>

    <CtaBand title={<>{totalPlays}+ 种玩法,<span class="grad-gold">现在就能试玩</span></>} sub="所有演示使用试玩 JYC,无需钱包、无需注册。感受一枚代币贯通全宇宙的体验。" primary={['进入游戏大厅', '/play']} secondary={['投资人咨询', '/contact']} />
  </Page>
)
