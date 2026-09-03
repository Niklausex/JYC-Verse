/* JYC Verse — interactions */
(() => {
  const $ = (s, r = document) => r.querySelector(s)
  const $$ = (s, r = document) => [...r.querySelectorAll(s)]

  /* ---------- Star field ---------- */
  function starField(canvas) {
    if (!canvas) return
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
      requestAnimationFrame(draw)
    }
    resize(); addEventListener('resize', resize); draw()
  }
  starField($('#stars')); starField($('#stars2'))

  /* ---------- Nav ---------- */
  const nav = $('#site-nav')
  const onScroll = () => nav.classList.toggle('scrolled', scrollY > 30)
  addEventListener('scroll', onScroll, { passive: true }); onScroll()
  $('#nav-burger')?.addEventListener('click', () => nav.classList.toggle('menu-open'))
  $$('.nav-links a').forEach(a => a.addEventListener('click', () => nav.classList.remove('menu-open')))

  // active link
  const secIds = ['galaxy', 'realms', 'economy', 'roadmap', 'foundation']
  const links = Object.fromEntries($$('.nav-links a').map(a => [a.getAttribute('href').slice(1), a]))
  const spy = new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting) { Object.values(links).forEach(l => l.classList.remove('active')); links[e.target.id]?.classList.add('active') } })
  }, { rootMargin: '-40% 0px -55% 0px' })
  secIds.forEach(id => { const el = document.getElementById(id); el && spy.observe(el) })

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } })
  }, { threshold: .12, rootMargin: '0px 0px -8% 0px' })
  $$('.reveal').forEach(el => io.observe(el))

  /* ---------- Hero parallax ---------- */
  const orbit = $('#hero-orbit')
  if (orbit && matchMedia('(pointer:fine)').matches) {
    addEventListener('mousemove', e => {
      const x = (e.clientX / innerWidth - .5) * 18, y = (e.clientY / innerHeight - .5) * 18
      orbit.style.transform = `perspective(1200px) rotateY(${x}deg) rotateX(${-y}deg)`
    }, { passive: true })
  }

  /* ---------- Realm modal ---------- */
  const realms = JSON.parse($('#realms-data').textContent)
  const modal = $('#realm-modal'), panel = $('.modal-panel', modal)
  let cur = 0
  const fill = (i) => {
    cur = (i + realms.length) % realms.length
    const r = realms[cur]
    panel.style.setProperty('--c', r.color); panel.style.setProperty('--c2', r.color2)
    $('#m-icon').className = `fa-solid ${r.icon}`
    $('#m-no').textContent = r.no; $('#m-code').textContent = r.code
    $('#m-name').textContent = r.name; $('#m-tagline').textContent = r.tagline
    $('#m-count').textContent = r.count; $('#m-desc').textContent = r.desc
    $('#m-hl').innerHTML = r.highlight ? `<i class="fa-solid fa-bolt" style="color:var(--c);margin-right:8px"></i>${r.highlight}` : ''
    $('#m-plays').innerHTML = r.plays.map((p, i) => `<span style="--i:${i}">${p}</span>`).join('')
    panel.scrollTop = 0
  }
  const open = (id) => {
    const i = realms.findIndex(r => r.id === id); if (i < 0) return
    fill(i); modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); document.body.classList.add('modal-open')
  }
  const close = () => { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); document.body.classList.remove('modal-open') }
  $$('[data-realm]').forEach(b => b.addEventListener('click', () => open(b.dataset.realm)))
  $$('[data-close]', modal).forEach(b => b.addEventListener('click', close))
  $('#m-prev').addEventListener('click', () => fill(cur - 1))
  $('#m-next').addEventListener('click', () => fill(cur + 1))
  addEventListener('keydown', e => {
    if (!modal.classList.contains('open')) return
    if (e.key === 'Escape') close()
    if (e.key === 'ArrowLeft') fill(cur - 1)
    if (e.key === 'ArrowRight') fill(cur + 1)
  })

  /* ---------- Galaxy slow rotation (planets counter-rotate labels) ---------- */
  const galaxy = $('#galaxy-map')
  if (galaxy && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
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
    requestAnimationFrame(step)
  }
  const cio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { countUp(e.target); cio.unobserve(e.target) } }), { threshold: .5 })
  $$('.count').forEach(el => cio.observe(el))
})()
