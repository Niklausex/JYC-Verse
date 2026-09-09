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
    // Helper: GSAP takes over from the CSS .reveal system for these elements
    const takeover = el => { el.classList.remove('reveal'); el.classList.add('in') }
    $$('.sec-title').forEach(t => {
      takeover(t)
      gsap.from(t, { y: 30, opacity: 0, duration: .9, ease: 'power3.out', clearProps: 'all', scrollTrigger: { trigger: t, start: 'top 88%' } })
    })
    // Staggered grids
    ;['.guard-grid', '.lobby-grid', '.hot-grid', '.why-grid', '.layers', '.rcard-grid', '.pillars', '.plays-grid'].forEach(sel => {
      $$(sel).forEach(grid => {
        const kids = [...grid.children].filter(k => k.offsetParent !== null)
        if (!kids.length) return
        kids.forEach(takeover)
        gsap.from(kids, { y: 40, opacity: 0, scale: .96, duration: .7, ease: 'back.out(1.4)', clearProps: 'all', stagger: { each: .06, from: 'start' }, scrollTrigger: { trigger: grid, start: 'top 85%' } })
      })
    })
    // Guardian band slide
    $$('.guardian-band').forEach(b => { takeover(b); gsap.from(b, { x: -60, opacity: 0, duration: .9, ease: 'power3.out', clearProps: 'all', scrollTrigger: { trigger: b, start: 'top 85%' } }) })
    // Layout shifts (lazy video/img, fonts) → recompute trigger positions
    let rt; const refresh = () => { clearTimeout(rt); rt = setTimeout(() => ScrollTrigger.refresh(), 120) }
    addEventListener('load', refresh)
    $$('img').forEach(im => { if (!im.complete) im.addEventListener('load', refresh, { once: true }) })
    $$('video').forEach(v => v.addEventListener('loadedmetadata', refresh, { once: true }))
    if ('ResizeObserver' in window) { const ro = new ResizeObserver(refresh); ro.observe(document.body) }
    // Safety net: anything GSAP left invisible after its trigger passed gets forced visible
    setInterval(() => ScrollTrigger.getAll().forEach(t => { if (t.progress === 1) (t.trigger ? [t.trigger] : []).forEach(el => { if (getComputedStyle(el).opacity === '0') gsap.set(el, { clearProps: 'all' }) }) }), 1500)
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

  /* ============================================================
     v9 — Video system
     ============================================================ */
  // Concurrency-limited loader: at most MAXC videos fetching at once (mobile data + dev-proxy friendly)
  const MAXC = 3, queue = []; let active = 0
  const pump = () => {
    while (active < MAXC && queue.length) {
      const v = queue.shift(); if (!v.isConnected || v.dataset.loaded === '2') continue
      active++; v.dataset.loaded = '2'
      const done = () => { if (v.__done) return; v.__done = 1; active--; pump() }
      v.addEventListener('loadeddata', done, { once: true }); v.addEventListener('error', done, { once: true })
      setTimeout(done, 8000) // never block the queue
      $$('source', v).forEach(src => { if (src.dataset.src) src.src = src.dataset.src }); v.load()
      if (v.__wantPlay && !reduced) { const p = v.play(); if (p && p.catch) p.catch(() => {}) }
    }
  }
  const loadVideo = (v) => { if (v.dataset.loaded) return; v.dataset.loaded = '1'; queue.push(v); pump() }
  const tryPlay = (v) => { v.__wantPlay = 1; if (v.dataset.loaded && v.dataset.loaded !== '2') return; const p = v.play(); if (p && p.catch) p.catch(() => {}) }
  // lazy: load + autoplay when in view, pause when out (saves battery/data)
  const vio = new IntersectionObserver(es => es.forEach(e => {
    const v = e.target
    if (e.isIntersecting) { loadVideo(v); if (!reduced) tryPlay(v); v.closest('.vid')?.classList.add('playing') }
    else { v.__wantPlay = 0; v.pause(); v.closest('.vid')?.classList.remove('playing') }
  }), { threshold: .25, rootMargin: '120px 0px' })
  $$('video[data-lazy-video]').forEach(v => vio.observe(v))
  // hover videos: play on hover (desktop) or when in view (touch)
  $$('video[data-hover-video]').forEach(v => {
    const host = v.closest('a, .guard, .hot, .gcard-lobby') || v.parentElement
    if (matchMedia('(pointer:fine)').matches) {
      host.addEventListener('pointerenter', () => { loadVideo(v); tryPlay(v); host.classList.add('vid-on') })
      host.addEventListener('pointerleave', () => { v.__wantPlay = 0; v.pause(); if (v.readyState) v.currentTime = 0; host.classList.remove('vid-on') })
    } else {
      const hio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting && e.intersectionRatio > .6) { loadVideo(v); tryPlay(v); host.classList.add('vid-on') } else { v.__wantPlay = 0; v.pause(); host.classList.remove('vid-on') } }), { threshold: [0, .6] })
      hio.observe(v)
    }
  })
  // play/pause toggle button on .vid
  $$('[data-vid-sound]').forEach(b => b.addEventListener('click', e => { e.preventDefault(); const v = $('video', b.parentElement); loadVideo(v); if (v.paused) { tryPlay(v); b.innerHTML = '<i class="fa-solid fa-pause"></i>' } else { v.pause(); b.innerHTML = '<i class="fa-solid fa-play"></i>' } }))
  $$('.vid video').forEach(v => { v.addEventListener('play', () => { const b = $('[data-vid-sound]', v.parentElement); if (b) b.innerHTML = '<i class="fa-solid fa-pause"></i>' }); v.addEventListener('pause', () => { const b = $('[data-vid-sound]', v.parentElement); if (b) b.innerHTML = '<i class="fa-solid fa-play"></i>' }) })
  // cinema player (universe page)
  const cv = $('#cinema-video')
  if (cv) {
    let idx = 1, items = $$('.cinema-item'), timer
    const show = (i) => {
      idx = (i + items.length) % items.length; const it = items[idx]
      items.forEach(x => x.classList.toggle('on', x === it))
      const main = $('.cinema-main'); main.classList.add('switch')
      setTimeout(() => {
        cv.poster = it.dataset.poster; $('source', cv).src = it.dataset.video; cv.load(); tryPlay(cv)
        $('#cinema-code').textContent = it.dataset.code; $('#cinema-title').textContent = it.dataset.title; $('#cinema-tag').textContent = it.dataset.tag; $('#cinema-link').href = `/realms/${it.dataset.cinema}`
        main.style.setProperty('--c', it.style.getPropertyValue('--c')); main.classList.remove('switch')
      }, 220)
      it.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
    }
    items.forEach((it, i) => it.addEventListener('click', () => { show(i); clearInterval(timer); timer = setInterval(() => show(idx + 1), 9000) }))
    cv.addEventListener('ended', () => show(idx + 1))
    timer = setInterval(() => show(idx + 1), 9000)
    $('#cinema-mute')?.addEventListener('click', function () { cv.muted = !cv.muted; this.innerHTML = cv.muted ? '<i class="fa-solid fa-volume-xmark"></i>' : '<i class="fa-solid fa-volume-high"></i>' })
  }
  // universe hero video: fade in once playable
  const uv = $('.uv-video'); if (uv) { uv.addEventListener('canplay', () => uv.classList.add('ready')); if (reduced) uv.pause() }
  // reel marquee: pause on hover
  const reel = $('.reel-track'); if (reel) { reel.addEventListener('pointerenter', () => reel.style.animationPlayState = 'paused'); reel.addEventListener('pointerleave', () => reel.style.animationPlayState = '') }
})()
