import { realms, totalPlays } from './data'

/* ---------- 站点开关:二级页面暂不对外展示(路由保留,可随时打开) ---------- */
export const SHOW_SUBPAGES = false

/* ---------- 首页锚点导航(单页模式) ---------- */
export const HOME_NAV = [
  { href: '#home-realms', label: '十二星域' },
  { href: '#home-economy', label: 'JYC 经济' },
  { href: '#home-roadmap', label: '路线图' },
  { href: '#home-foundation', label: '起点' },
]

/* ---------- 站点地图 ---------- */
export const NAV = [
  { href: '/', label: '首页' },
  { href: '/vision', label: '愿景' },
  { href: '/realms', label: '十二星域' },
  { href: '/economy', label: 'JYC 经济' },
  { href: '/platform', label: '平台架构' },
  { href: '/roadmap', label: '路线图' },
]

/* ---------- 图片:真图优先,失败自动回落到风格化占位 ---------- */
export const Pic = ({ src, alt, icon, color, cls }: { src: string; alt: string; icon: string; color: string; cls?: string }) => (
  <figure class={`pic ${cls ?? ''}`} style={`--pc:${color}`}>
    <div class="pic-ph"><i class={`fa-solid ${icon}`}></i></div>
    <img src={src} alt={alt} loading="lazy" onload="this.parentElement.classList.add('loaded')" onerror="this.remove()" />
  </figure>
)

/* ---------- 导航 ---------- */
export const Nav = ({ path }: { path: string }) => {
  const isActive = (href: string) => href === '/' ? path === '/' : path.startsWith(href)
  const links = SHOW_SUBPAGES ? NAV : HOME_NAV.map(n => ({ ...n, href: path === '/' ? n.href : '/' + n.href }))
  return (
    <header class="nav" id="site-nav">
      <a class="nav-logo" href="/">
        <span class="logo-text">JYC <em>Verse</em></span>
      </a>
      <nav class="nav-links" aria-label="主导航">
        {links.map(n => <a href={n.href} class={SHOW_SUBPAGES && isActive(n.href) ? 'active' : ''} aria-current={SHOW_SUBPAGES && isActive(n.href) ? 'page' : undefined}>{n.label}</a>)}
      </nav>
      <button class="nav-burger" id="nav-burger" aria-label="菜单"><i class="fa-solid fa-bars"></i></button>
    </header>
  )
}

/* ---------- 页脚 ---------- */
export const Footer = () => (
  <footer class="footer" id="site-footer">
    <div class="footer-grid">
      <div class="footer-col footer-about">
        <div class="footer-brand">JYC <em>Verse</em></div>
        <p>全球首个覆盖全部博彩人格的一站式 Web3 娱乐宇宙。12 大星域 · {totalPlays}+ 玩法 · 1 枚代币。</p>
        <div class="footer-social">
          <a href="https://www.qpred.io" target="_blank" rel="noopener" aria-label="官网"><i class="fa-solid fa-globe"></i></a>
          <a href="https://m.qpred.io/" target="_blank" rel="noopener" aria-label="App"><i class="fa-solid fa-mobile-screen"></i></a>
          <a href="https://wp.qpred.com/" target="_blank" rel="noopener" aria-label="白皮书"><i class="fa-solid fa-file-lines"></i></a>
          <a href="mailto:invest@qpred.io" aria-label="邮件"><i class="fa-solid fa-envelope"></i></a>
        </div>
      </div>
      {SHOW_SUBPAGES ? <>
      <div class="footer-col">
        <h4>探索</h4>
        {NAV.slice(1).map(n => <a href={n.href}>{n.label}</a>)}
        <a href="/contact">投资人咨询</a>
      </div>
      <div class="footer-col">
        <h4>十二星域</h4>
        {realms.slice(0, 6).map(r => <a href={`/realms/${r.id}`}>{r.name}</a>)}
      </div>
      <div class="footer-col">
        <h4>&nbsp;</h4>
        {realms.slice(6).map(r => <a href={`/realms/${r.id}`}>{r.name}</a>)}
      </div>
      </> : <>
      <div class="footer-col">
        <h4>导航</h4>
        {HOME_NAV.map(n => <a href={'/' + n.href}>{n.label}</a>)}
      </div>
      <div class="footer-col">
        <h4>十二星域</h4>
        {realms.slice(0, 6).map(r => <span class="footer-plain">{r.name}</span>)}
      </div>
      <div class="footer-col">
        <h4>&nbsp;</h4>
        {realms.slice(6).map(r => <span class="footer-plain">{r.name}</span>)}
      </div>
      </>}
      <div class="footer-col">
        <h4>QuantumPredict</h4>
        <a href="https://www.qpred.io" target="_blank" rel="noopener">官网 qpred.io</a>
        <a href="https://m.qpred.io/" target="_blank" rel="noopener">App</a>
        <a href="https://wp.qpred.com/" target="_blank" rel="noopener">白皮书</a>
        <a href="mailto:invest@qpred.io">invest@qpred.io</a>
      </div>
    </div>
    <div class="footer-bottom">
      <p class="footer-disc">本网站内容仅用于展示 JYC Verse 生态愿景与发展策略,不构成任何投资建议或收益承诺。数字资产具有高风险,请遵守所在地区法律法规。</p>
      <p class="footer-copy">© 2026 JYC Verse · Powered by QuantumPredict · Built on BSC</p>
    </div>
  </footer>
)

/* ---------- 内页页头(面包屑 + 标题) ---------- */
export const PageHero = ({ kicker, title, sub, crumbs, color }: { kicker: string; title: any; sub?: string; crumbs: [string, string?][]; color?: string }) => (
  <section class="page-hero" style={color ? `--c:${color}` : ''}>
    <canvas class="stars" data-stars></canvas>
    <div class="page-hero-inner">
      <nav class="crumbs" aria-label="面包屑">
        <a href="/"><i class="fa-solid fa-house"></i></a>
        {crumbs.map(([label, href]) => <>
          <i class="fa-solid fa-chevron-right"></i>
          {href ? <a href={href}>{label}</a> : <span>{label}</span>}
        </>)}
      </nav>
      <div class="kicker">{kicker}</div>
      <h1 class="page-title">{title}</h1>
      {sub && <p class="page-sub">{sub}</p>}
    </div>
  </section>
)

export const SectionHead = ({ kicker, title, sub, align }: { kicker: string; title: any; sub?: string; align?: 'left' | 'center' }) => (
  <div class={`sec-head reveal ${align === 'left' ? 'left' : ''}`}>
    <div class="kicker">{kicker}</div>
    <h2 class="sec-title">{title}</h2>
    {sub && <p class="sec-sub">{sub}</p>}
  </div>
)

/* ---------- 星域卡片:游戏厅贴片(场景图 + 3D 星球) ---------- */
export const RealmCard = ({ r, i, compact }: { r: (typeof realms)[number]; i: number; compact?: boolean }) => {
  const Tag: any = SHOW_SUBPAGES ? 'a' : 'div'
  return (
  <Tag class={`rcard glass reveal ${compact ? 'compact' : ''}`} href={SHOW_SUBPAGES ? `/realms/${r.id}` : undefined} style={`--c:${r.color};--c2:${r.color2};--d:${(i % 4) * 0.07}s`}>
    <div class="rcard-scene">
      <img src={r.sceneImg} alt={`${r.name} 场景`} loading="lazy" />
      <span class="rcard-no">{r.no}</span>
      
    </div>
    <div class="rcard-body">
      <div class="rcard-code">{r.code}</div>
      <h3>{r.name}</h3>
      <p class="rcard-tag">{r.tagline}</p>
      {!compact && <div class="rcard-tags">{r.plays.slice(0, 3).map(p => <span>{p}</span>)}<span class="more">+{r.count - 3}</span></div>}
      <div class="rcard-foot"><b>{r.count}</b> 种玩法 {SHOW_SUBPAGES && <i class="fa-solid fa-arrow-right"></i>}</div>
    </div>
  </Tag>
)}

/* ---------- 横幅大图 ---------- */
export const Banner = ({ src, alt, cap, sub }: { src: string; alt: string; cap?: string; sub?: string }) => (
  <figure class="banner reveal">
    <img src={src} alt={alt} loading="lazy" />
    {cap && <figcaption class="banner-cap">{cap}{sub && <small>{sub}</small>}</figcaption>}
  </figure>
)

/* ---------- 吉祥物 ---------- */
export const Mascot = ({ cls }: { cls?: string }) => (
  <img class={`mascot ${cls ?? ''}`} src="/static/img/mascot.webp" alt="JYC 吉祥物" loading="lazy" />
)

/* ---------- 通用底部 CTA 条 ---------- */
export const CtaBand = ({ title, sub, primary, secondary }: { title: any; sub?: string; primary?: [string, string]; secondary?: [string, string] }) => (
  <section class="cta-band reveal">
    <div class="cta-band-inner">
      <div>
        <h2>{title}</h2>
        {sub && <p>{sub}</p>}
      </div>
      <div class="cta-band-actions">
        <a class="btn btn-gold" href={primary?.[1] ?? (SHOW_SUBPAGES ? '/contact' : 'mailto:invest@qpred.io')}>{primary?.[0] ?? (SHOW_SUBPAGES ? '投资人咨询' : '联系我们')} <i class={`fa-solid ${SHOW_SUBPAGES ? 'fa-arrow-right' : 'fa-envelope'}`}></i></a>
        {secondary && (SHOW_SUBPAGES || !secondary[1].startsWith('/')) && <a class="btn btn-ghost" href={secondary[1]}>{secondary[0]}</a>}
      </div>
      <div class="cta-mascot" aria-hidden="true"><Mascot /></div>
    </div>
  </section>
)

/* ---------- 页面外壳 ---------- */
export const Page = ({ path, children }: { path: string; children: any }) => (
  <>
    <div class="bg-nebula" aria-hidden="true"></div>
    <Nav path={path} />
    <main id="main" class="page-main">{children}</main>
    <Footer />
  </>
)
