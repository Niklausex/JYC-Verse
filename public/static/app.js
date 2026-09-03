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
    $('#nav-burger')?.addEventListener('click', () => nav.classList.toggle('menu-open'))
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
})()
