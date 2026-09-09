/* JYC Verse — interactions (multi-page) */
(() => {
  const $ = (s, r = document) => r.querySelector(s)
  const $$ = (s, r = document) => [...r.querySelectorAll(s)]
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches

  /* ---------- Star field (any canvas[data-stars]) ---------- */
  function starField(canvas) {
    const ctx = canvas.getContext('2d')
    let w, h, stars = []
    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect()
      w = canvas.width = rect.width * devicePixelRatio
      h = canvas.height = rect.height * devicePixelRatio
      stars = Array.from({ length: Math.min(260, Math.floor(w * h / 9000)) }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        r: (Math.random() * 1.2 + .3) * devicePixelRatio,
        a: Math.random(), s: Math.random() * .006 + .002,
        c: Math.random() < .12 ? '245,194,75' : Math.random() < .5 ? '56,232,255' : '238,241,255',
      }))
    }
    let t = 0
    const draw = () => {
      ctx.clearRect(0, 0, w, h); t++
      for (const s of stars) {
        const tw = .45 + .55 * Math.abs(Math.sin(t * s.s + s.a * 6.28))
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.283)
        ctx.fillStyle = `rgba(${s.c},${tw})`; ctx.fill()
      }
      if (!reduced) requestAnimationFrame(draw)
    }
    resize(); addEventListener('resize', resize); draw()
  }
  $$('canvas[data-stars]').forEach(starField)

  /* ---------- Nav ---------- */
  const nav = $('#site-nav')
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', scrollY > 30)
    addEventListener('scroll', onScroll, { passive: true }); onScroll()
  }
  const toTop = $('#to-top')
  if (toTop) {
    const onTop = () => toTop.classList.toggle('show', scrollY > 600)
    addEventListener('scroll', onTop, { passive: true }); onTop()
    toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }))
    $('#nav-burger')?.addEventListener('click', () => nav.classList.toggle('menu-open'))
    $$('.nav-links a').forEach(a => a.addEventListener('click', () => nav.classList.remove('menu-open')))
  }

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } })
  }, { threshold: .12, rootMargin: '0px 0px -8% 0px' })
  $$('.reveal').forEach(el => io.observe(el))

  /* ---------- Hero parallax ---------- */
  const orbit = $('#hero-orbit')
  if (orbit && matchMedia('(pointer:fine)').matches && !reduced) {
    addEventListener('mousemove', e => {
      const x = (e.clientX / innerWidth - .5) * 18, y = (e.clientY / innerHeight - .5) * 18
      orbit.style.transform = `perspective(1200px) rotateY(${x}deg) rotateX(${-y}deg)`
    }, { passive: true })
  }

  /* ---------- Galaxy slow rotation ---------- */
  const galaxy = $('#galaxy-map')
  if (galaxy && !reduced) {
    const planets = $$('.g-planet', galaxy).map(p => ({ el: p, a: parseFloat(p.style.getPropertyValue('--a')) }))
    let paused = false, off = 0, last = performance.now()
    galaxy.addEventListener('mouseenter', () => paused = true)
    galaxy.addEventListener('mouseleave', () => paused = false)
    const tick = (now) => {
      const dt = now - last; last = now
      if (!paused) { off += dt * 0.0025; planets.forEach(p => p.el.style.setProperty('--a', `${p.a + off}deg`)) }
      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }

  /* ---------- Roadmap progress ---------- */
  const rm = $('.rm-track')
  if (rm) new IntersectionObserver((es, o) => { es.forEach(e => { if (e.isIntersecting) { rm.classList.add('in'); o.disconnect() } }) }, { threshold: .25 }).observe(rm)

  /* ---------- Count-up numbers ---------- */
  const countUp = (el) => {
    const raw = el.dataset.count || el.textContent
    const m = raw.match(/^([^\d]*)([\d,.]+)(.*)$/); if (!m) return
    const [, pre, num, suf] = m
    const target = parseFloat(num.replace(/,/g, '')), dec = (num.split('.')[1] || '').length
    const hasComma = num.includes(',')
    const t0 = performance.now(), dur = 1600
    const step = (now) => {
      const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3)
      let v = (target * e).toFixed(dec)
      if (hasComma) v = Number(v).toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec })
      el.textContent = pre + v + suf
      if (p < 1) requestAnimationFrame(step)
    }
    if (reduced) { el.textContent = raw; return }
    requestAnimationFrame(step)
  }
  const cio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { countUp(e.target); cio.unobserve(e.target) } }), { threshold: .5 })
  $$('.count').forEach(el => cio.observe(el))

  /* ---------- Realm detail: keyboard prev/next ---------- */
  const pagerPrev = $('.pager-item:not(.next)'), pagerNext = $('.pager-item.next')
  if (pagerPrev && pagerNext) addEventListener('keydown', e => {
    if (e.target.closest('input,textarea')) return
    if (e.key === 'ArrowLeft') location.href = pagerPrev.href
    if (e.key === 'ArrowRight') location.href = pagerNext.href
  })

  /* ============================================================
     v8 — Motion upgrade
     ============================================================ */

  /* ---------- 3D tilt cards (pointer:fine only) ---------- */
  if (matchMedia('(pointer:fine)').matches && !reduced) {
    $$('.tilt').forEach(card => {
      const shine = document.createElement('span'); shine.className = 'tilt-shine'; card.appendChild(shine)
      let raf
      card.addEventListener('pointermove', e => {
        cancelAnimationFrame(raf)
        raf = requestAnimationFrame(() => {
          const r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height
          card.classList.add('tilting')
          card.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 10}deg) rotateY(${(x - 0.5) * 12}deg) translateY(-6px) scale(1.02)`
          card.style.setProperty('--sx', `${x * 100}%`); card.style.setProperty('--sy', `${y * 100}%`)
        })
      })
      card.addEventListener('pointerleave', () => { card.classList.remove('tilting'); card.style.transform = '' })
    })
    /* magnetic glow on gold buttons */
    $$('.btn-gold').forEach(b => b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); b.style.setProperty('--mx', `${(e.clientX - r.left) / r.width * 100}%`); b.style.setProperty('--my', `${(e.clientY - r.top) / r.height * 100}%`) }))
  }

  /* ---------- GSAP scroll motion (progressive; falls back to .reveal) ---------- */
  const useGsap = () => {
    if (reduced || !window.gsap || !window.ScrollTrigger) return
    gsap.registerPlugin(ScrollTrigger)
    // Parallax for hero visuals
    $$('.hero-key, .uv-key img, .realm-visual, .king-visual').forEach(el => {
      gsap.to(el, { yPercent: 12, ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true } })
    })
    // Section titles: split-ish pop
    $$('.sec-title').forEach(t => {
      gsap.from(t, { y: 30, opacity: 0, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: t, start: 'top 88%' } })
    })
    // Staggered grids
    ;['.guard-grid', '.lobby-grid', '.hot-grid', '.why-grid', '.layers', '.rcard-grid', '.pillars', '.plays-grid'].forEach(sel => {
      $$(sel).forEach(grid => {
        const kids = [...grid.children].filter(k => k.offsetParent !== null)
        if (!kids.length) return
        kids.forEach(k => k.classList.remove('reveal'))
        gsap.from(kids, { y: 40, opacity: 0, scale: .96, duration: .7, ease: 'back.out(1.4)', stagger: { each: .06, from: 'start' }, scrollTrigger: { trigger: grid, start: 'top 85%' } })
      })
    })
    // Guardian band slide
    $$('.guardian-band').forEach(b => gsap.from(b, { x: -60, opacity: 0, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: b, start: 'top 85%' } }))
    // Mouseverse ring: rotate on scroll
    const mv = $('#mv-stage')
    if (mv) gsap.to(mv.querySelector('.mv-ring'), { rotate: 180, ease: 'none', scrollTrigger: { trigger: mv, start: 'top bottom', end: 'bottom top', scrub: 1 } })
    // Universe parade: entrance
    $$('.uv-parade img').forEach((img, i) => gsap.fromTo(img, { y: 60, opacity: 0, scale: .5 }, { y: 0, opacity: 1, scale: 1, duration: .7, delay: .3 + i * .07, ease: 'back.out(2)', clearProps: 'transform,opacity' }))
  }
  if (window.gsap) useGsap(); else addEventListener('load', useGsap)

  /* ---------- Cursor sparkle trail (desktop only) ---------- */
  if (matchMedia('(pointer:fine)').matches && !reduced) {
    const cv = document.createElement('canvas'); cv.className = 'cursor-fx'; document.body.appendChild(cv)
    const ctx = cv.getContext('2d'); let W, H, parts = []
    const rs = () => { W = cv.width = innerWidth * devicePixelRatio; H = cv.height = innerHeight * devicePixelRatio }
    rs(); addEventListener('resize', rs)
    let last = 0
    addEventListener('pointermove', e => {
      const now = performance.now(); if (now - last < 28) return; last = now
      for (let i = 0; i < 2; i++) parts.push({ x: e.clientX * devicePixelRatio, y: e.clientY * devicePixelRatio, vx: (Math.random() - .5) * 1.4, vy: (Math.random() - .5) * 1.4 - .6, life: 1, r: (Math.random() * 2 + 1) * devicePixelRatio, c: ['255,197,49', '61,232,255', '255,79,184', '168,85,255'][Math.floor(Math.random() * 4)] })
      if (parts.length > 90) parts.splice(0, parts.length - 90)
    }, { passive: true })
    const loop = () => {
      ctx.clearRect(0, 0, W, H)
      parts = parts.filter(p => p.life > 0)
      for (const p of parts) { p.x += p.vx * devicePixelRatio; p.y += p.vy * devicePixelRatio; p.life -= .03; ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(0, p.r * p.life), 0, 7); ctx.fillStyle = `rgba(${p.c},${p.life * .9})`; ctx.shadowColor = `rgb(${p.c})`; ctx.shadowBlur = 8; ctx.fill() }
      ctx.shadowBlur = 0
      requestAnimationFrame(loop)
    }
    loop()
  }

  /* ---------- Page transition (fade-out on internal nav) ---------- */
  if (!reduced) addEventListener('click', e => {
    const a = e.target.closest('a[href]'); if (!a) return
    const url = new URL(a.href, location.href)
    if (url.origin !== location.origin || a.target === '_blank' || url.hash && url.pathname === location.pathname || e.metaKey || e.ctrlKey || a.hasAttribute('download')) return
    e.preventDefault(); document.body.classList.add('page-leaving'); setTimeout(() => location.href = a.href, 240)
  })

  /* ---------- Lobby filter ---------- */
  const lf = $('#lobby-filter')
  if (lf) lf.addEventListener('click', e => {
    const b = e.target.closest('[data-filter]'); if (!b) return
    $$('[data-filter]', lf).forEach(x => x.classList.toggle('on', x === b))
    const f = b.dataset.filter
    $$('#lobby-grid > div').forEach(d => d.classList.toggle('hide', f !== 'all' && d.dataset.realm !== f))
    $$('#lobby-grid > div:not(.hide) .gcard-lobby').forEach((c, i) => { c.style.animation = 'none'; void c.offsetWidth; c.style.animation = `popcard .5s ${i * .04}s var(--bounce) both` })
  })

  /* ---------- Mobile: haptic-like press feedback ---------- */
  if (matchMedia('(pointer:coarse)').matches) {
    document.addEventListener('touchstart', e => { const t = e.target.closest('.btn, .g-btn, .mnav a, .rcard, .guard, .gcard-lobby, .hot'); if (t) { t.classList.add('pressed'); setTimeout(() => t.classList.remove('pressed'), 200) } }, { passive: true })
  }
})()
