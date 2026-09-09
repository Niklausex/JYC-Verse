/* ============================================================
   JYC Verse — Playable Demo Engine (simulation only, no real money)
   - Wallet: demo JYC balance persisted in localStorage
   - Registry: window.JYCGames[id] = { title, mount(root, api) }
   - Every game receives api = { bet(amount) -> ok, win(amount), toast(msg), fx(...) }
   ============================================================ */
(() => {
  const $ = (s, r = document) => r.querySelector(s)
  const $$ = (s, r = document) => [...r.querySelectorAll(s)]
  const rnd = (a, b) => a + Math.random() * (b - a)
  const ri = (a, b) => Math.floor(rnd(a, b + 1))
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
  const fmt = (n) => Number(n).toLocaleString('en-US', { maximumFractionDigits: 2 })
  const sleep = (ms) => new Promise(r => setTimeout(r, ms))
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches

  /* ---------------- Wallet ---------------- */
  const KEY = 'jyc_demo_wallet_v1'
  const wallet = {
    bal: 10000, wins: 0, plays: 0, best: 0, jackpot: 0,
    load() { try { Object.assign(this, JSON.parse(localStorage.getItem(KEY) || '{}')) } catch {} ; this.render() },
    save() { localStorage.setItem(KEY, JSON.stringify({ bal: this.bal, wins: this.wins, plays: this.plays, best: this.best })) ; this.render() },
    reset() { this.bal = 10000; this.wins = 0; this.plays = 0; this.best = 0; this.save(); toast('已重置为 10,000 试玩 JYC', 'ok') },
    render() {
      $$('[data-wallet-bal]').forEach(el => el.textContent = fmt(Math.floor(this.bal)))
      $$('[data-wallet-plays]').forEach(el => el.textContent = this.plays)
      $$('[data-wallet-wins]').forEach(el => el.textContent = this.wins)
      $$('[data-wallet-best]').forEach(el => el.textContent = fmt(this.best))
    },
  }
  wallet.load()
  // global jackpot ticker (simulated shared pool)
  let jackpot = 1284320 + (Date.now() % 100000) / 3
  setInterval(() => { jackpot += rnd(0.4, 3.2); $$('[data-jackpot]').forEach(el => el.textContent = fmt(Math.floor(jackpot))) }, 400)

  /* ---------------- Toast & FX ---------------- */
  let toastBox
  function toast(msg, kind = 'info') {
    if (!toastBox) { toastBox = document.createElement('div'); toastBox.className = 'g-toasts'; document.body.appendChild(toastBox) }
    const t = document.createElement('div'); t.className = `g-toast ${kind}`; t.textContent = msg
    toastBox.appendChild(t); requestAnimationFrame(() => t.classList.add('in'))
    setTimeout(() => { t.classList.remove('in'); setTimeout(() => t.remove(), 300) }, 2200)
  }
  function confetti(root, n = 70, colors = ['#FFC531', '#FF4FB8', '#3DE8FF', '#A855FF', '#4DFFB5']) {
    if (reduced) return
    const box = document.createElement('div'); box.className = 'g-confetti'; root.appendChild(box)
    for (let i = 0; i < n; i++) {
      const p = document.createElement('i')
      p.style.cssText = `left:${rnd(5, 95)}%;background:${colors[i % colors.length]};animation-delay:${rnd(0, .4)}s;animation-duration:${rnd(1.2, 2.2)}s;--r:${rnd(-360, 360)}deg;--x:${rnd(-80, 80)}px`
      box.appendChild(p)
    }
    setTimeout(() => box.remove(), 2600)
  }
  function coinBurst(root, n = 14) {
    if (reduced) return
    const box = document.createElement('div'); box.className = 'g-coins'; root.appendChild(box)
    for (let i = 0; i < n; i++) {
      const c = document.createElement('b'); c.innerHTML = '<img src="/static/img/props/coin.webp" alt="">'
      c.style.cssText = `--dx:${rnd(-160, 160)}px;--dy:${rnd(-220, -80)}px;animation-delay:${rnd(0, .25)}s`
      box.appendChild(c)
    }
    setTimeout(() => box.remove(), 1600)
  }
  function shake(el) { if (reduced) return; el.classList.remove('g-shake'); void el.offsetWidth; el.classList.add('g-shake') }
  function flashWin(root, amount, mult) {
    const w = document.createElement('div'); w.className = 'g-winflash'
    w.innerHTML = `<small>WIN${mult ? ` · ${mult}x` : ''}</small><b>+${fmt(amount)}</b><span>JYC</span>`
    root.appendChild(w); requestAnimationFrame(() => w.classList.add('in'))
    setTimeout(() => { w.classList.remove('in'); setTimeout(() => w.remove(), 400) }, 1700)
  }

  /* ---------------- Game API ---------------- */
  function makeApi(root) {
    return {
      bet(amount) {
        amount = Math.floor(Number(amount) || 0)
        if (amount <= 0) { toast('请输入有效下注金额', 'warn'); return false }
        if (amount > wallet.bal) { toast('试玩余额不足,可点击右上角重置', 'warn'); shake(root); return false }
        wallet.bal -= amount; wallet.plays++; jackpot += amount * 0.005; wallet.save(); return true
      },
      win(amount, mult) {
        amount = Math.round(amount * 100) / 100
        if (amount <= 0) return
        wallet.bal += amount; wallet.wins++; wallet.best = Math.max(wallet.best, amount); wallet.save()
        flashWin(root, amount, mult); coinBurst(root)
        if (amount >= 500) confetti(root)
      },
      lose() { shake(root) },
      toast, rnd, ri, clamp, fmt, sleep, reduced, confetti, coinBurst,
      balance: () => wallet.bal,
    }
  }

  /* ---------------- Shared UI helpers ---------------- */
  const betBox = (id, def = 100, opts = {}) => `
    <div class="g-bet">
      <label>下注 <small>JYC</small></label>
      <div class="g-bet-row">
        <button type="button" data-bet-half>½</button>
        <input type="number" inputmode="numeric" min="1" step="1" value="${def}" data-bet-input aria-label="下注金额" />
        <button type="button" data-bet-double>2×</button>
      </div>
      <div class="g-chips">${(opts.chips || [50, 100, 500, 1000]).map(c => `<button type="button" data-chip="${c}">${c >= 1000 ? c / 1000 + 'K' : c}</button>`).join('')}</div>
    </div>`
  function wireBet(root) {
    const inp = $('[data-bet-input]', root)
    if (!inp) return () => 0
    $('[data-bet-half]', root)?.addEventListener('click', () => inp.value = Math.max(1, Math.floor(inp.value / 2)))
    $('[data-bet-double]', root)?.addEventListener('click', () => inp.value = Math.floor(inp.value * 2))
    $$('[data-chip]', root).forEach(b => b.addEventListener('click', () => { inp.value = b.dataset.chip; $$('[data-chip]', root).forEach(x => x.classList.toggle('on', x === b)) }))
    return () => Math.floor(Number(inp.value) || 0)
  }
  const fairTag = () => `<div class="g-fair"><i class="fa-solid fa-shield-halved"></i> Provably Fair · 随机数 <code>${Math.random().toString(16).slice(2, 10)}</code></div>`

  const G = (window.JYCGames = window.JYCGames || {})

  /* ============================================================
     1. CRASH
     ============================================================ */
  G.crash = {
    title: 'Crash 火箭',
    mount(root, api) {
      root.innerHTML = `
        <div class="g-stage crash-stage">
          <canvas class="crash-canvas"></canvas>
          <div class="crash-rocket"><img class="crash-rocket-img" src="/static/img/props/rocket.webp" alt="" /><img class="crash-rider" src="/static/img/mouse-arcade.webp" alt="" /><i class="crash-flame"></i></div><div class="crash-boom" data-boom></div>
          <div class="crash-mult">1.00<small>x</small></div>
          <div class="crash-status">准备发射</div>
          <div class="crash-hist" data-hist></div>
        </div>
        <div class="g-panel">
          ${betBox('crash', 100)}
          <div class="g-field"><label>自动兑现</label><input type="number" step="0.1" min="1.1" value="2.0" data-auto /> <small>x</small></div>
          <button class="g-btn g-btn-gold" data-go>发射 <i class="fa-solid fa-rocket"></i></button>
          <button class="g-btn g-btn-cash" data-cash disabled>兑现</button>
          ${fairTag()}
        </div>`
      const getBet = wireBet(root)
      const cv = $('.crash-canvas', root), ctx = cv.getContext('2d')
      const rocket = $('.crash-rocket', root), multEl = $('.crash-mult', root), status = $('.crash-status', root), hist = $('[data-hist]', root)
      const go = $('[data-go]', root), cash = $('[data-cash]', root), auto = $('[data-auto]', root)
      let running = false, mult = 1, crashAt = 1, t0 = 0, bet = 0, cashed = false, raf, history = [2.31, 1.08, 5.6, 1.72, 12.4, 1.01, 3.3]
      const drawHist = () => hist.innerHTML = history.slice(-8).map(h => `<span class="${h < 2 ? 'lo' : h < 5 ? 'mid' : 'hi'}">${h.toFixed(2)}x</span>`).join('')
      drawHist()
      const resize = () => { const r = cv.parentElement.getBoundingClientRect(); cv.width = r.width * devicePixelRatio; cv.height = r.height * devicePixelRatio }
      resize(); addEventListener('resize', resize)
      const pts = []
      function draw(crashed) {
        const w = cv.width, h = cv.height
        ctx.clearRect(0, 0, w, h)
        // grid
        ctx.strokeStyle = 'rgba(255,255,255,.06)'; ctx.lineWidth = 1
        for (let i = 1; i < 6; i++) { ctx.beginPath(); ctx.moveTo(0, h * i / 6); ctx.lineTo(w, h * i / 6); ctx.stroke() }
        if (pts.length < 2) return
        const maxT = Math.max(4, pts[pts.length - 1].t), maxM = Math.max(2, mult * 1.15)
        const X = (t) => (t / maxT) * w * .92 + w * .04, Y = (m) => h - ((m - 1) / (maxM - 1)) * h * .8 - h * .08
        const grad = ctx.createLinearGradient(0, 0, w, 0); grad.addColorStop(0, '#FF4FB8'); grad.addColorStop(1, crashed ? '#FF3B3B' : '#FFC531')
        ctx.beginPath(); ctx.moveTo(X(0), Y(1))
        pts.forEach(p => ctx.lineTo(X(p.t), Y(p.m)))
        ctx.strokeStyle = grad; ctx.lineWidth = 4 * devicePixelRatio; ctx.lineCap = 'round'; ctx.shadowColor = crashed ? '#FF3B3B' : '#FFC531'; ctx.shadowBlur = 18; ctx.stroke(); ctx.shadowBlur = 0
        // fill
        ctx.lineTo(X(pts[pts.length - 1].t), h); ctx.lineTo(X(0), h); ctx.closePath()
        ctx.fillStyle = crashed ? 'rgba(255,59,59,.12)' : 'rgba(255,197,49,.10)'; ctx.fill()
        const last = pts[pts.length - 1]
        rocket.style.left = (X(last.t) / devicePixelRatio) + 'px'; rocket.style.top = (Y(last.m) / devicePixelRatio) + 'px'
        rocket.style.transform = `translate(-50%,-50%) rotate(${crashed ? 120 : -20 + Math.min(20, mult * 2)}deg) scale(${crashed ? .6 : 1})`
        rocket.style.opacity = crashed ? 0 : 1
        if (crashed) { const bm = $('[data-boom]', root); bm.style.left = rocket.style.left; bm.style.top = rocket.style.top; bm.classList.remove('go'); void bm.offsetWidth; bm.classList.add('go') }
      }
      function start() {
        bet = getBet(); if (!api.bet(bet)) return
        running = true; cashed = false; mult = 1; pts.length = 0; t0 = performance.now()
        // house edge 3%: P(crash >= m) = 0.97/m
        const r = Math.random(); crashAt = Math.max(1, Math.floor((0.97 / (1 - r)) * 100) / 100); if (r < 0.03) crashAt = 1
        go.disabled = true; cash.disabled = false; root.classList.remove('crashed'); root.classList.add('flying'); status.textContent = '飞行中 · 随时兑现'
        rocket.style.opacity = 1
        loop()
      }
      function loop() {
        const t = (performance.now() - t0) / 1000
        mult = Math.pow(Math.E, 0.11 * t * (1 + t * 0.08))
        mult = Math.floor(mult * 100) / 100
        pts.push({ t, m: mult })
        multEl.innerHTML = `${mult.toFixed(2)}<small>x</small>`
        if (!cashed && mult >= parseFloat(auto.value || 0) && parseFloat(auto.value) >= 1.1) doCash()
        if (mult >= crashAt) { crash(); return }
        draw(false); raf = requestAnimationFrame(loop)
      }
      function doCash() {
        if (!running || cashed) return
        cashed = true; cash.disabled = true
        api.win(bet * mult, mult.toFixed(2)); status.textContent = `已兑现 @ ${mult.toFixed(2)}x`
        root.classList.add('cashed')
      }
      function crash() {
        running = false; cancelAnimationFrame(raf); mult = crashAt
        multEl.innerHTML = `${crashAt.toFixed(2)}<small>x</small>`
        history.push(crashAt); drawHist(); draw(true)
        root.classList.remove('flying', 'cashed'); root.classList.add('crashed')
        if (!cashed && !api.reduced) { const st = $('.crash-stage', root); st.classList.remove('boomflash'); void st.offsetWidth; st.classList.add('boomflash') }
        status.textContent = cashed ? `火箭在 ${crashAt.toFixed(2)}x 爆炸 · 你已安全兑现` : `💥 爆炸 @ ${crashAt.toFixed(2)}x`
        if (!cashed) api.lose()
        cash.disabled = true; go.disabled = false
      }
      go.addEventListener('click', start); cash.addEventListener('click', doCash)
      draw(false)
    },
  }

  /* ============================================================
     2. DICE
     ============================================================ */
  G.dice = {
    title: 'Dice 骰子',
    mount(root, api) {
      root.innerHTML = `
        <div class="g-stage dice-stage">
          <div class="dice-result"><b data-res>50.00</b><span data-verdict>拖动滑块设置目标</span></div>
          <div class="dice-track"><div class="dice-fill" data-fill></div><div class="dice-marker" data-marker></div><input type="range" min="2" max="98" value="50" data-range aria-label="目标" /></div>
          <div class="dice-stats"><div><small>目标</small><b data-target>&lt; 50.00</b></div><div><small>胜率</small><b data-chance>50%</b></div><div><small>倍数</small><b data-mult>1.94x</b></div></div>
          <div class="dice-mode"><button type="button" class="on" data-mode="under">押小 (Under)</button><button type="button" data-mode="over">押大 (Over)</button></div>
        </div>
        <div class="g-panel">${betBox('dice', 100)}<button class="g-btn g-btn-gold" data-go>掷骰 <i class="fa-solid fa-dice"></i></button>${fairTag()}</div>`
      const getBet = wireBet(root)
      const range = $('[data-range]', root), fill = $('[data-fill]', root), marker = $('[data-marker]', root)
      const res = $('[data-res]', root), verdict = $('[data-verdict]', root), tEl = $('[data-target]', root), cEl = $('[data-chance]', root), mEl = $('[data-mult]', root)
      let mode = 'under'
      const update = () => {
        const v = +range.value, chance = mode === 'under' ? v : 100 - v, mult = (97 / chance)
        fill.style.left = mode === 'under' ? '0' : v + '%'; fill.style.width = chance + '%'
        tEl.textContent = (mode === 'under' ? '< ' : '> ') + v.toFixed(2); cEl.textContent = chance.toFixed(0) + '%'; mEl.textContent = mult.toFixed(2) + 'x'
      }
      range.addEventListener('input', update); update()
      $$('[data-mode]', root).forEach(b => b.addEventListener('click', () => { mode = b.dataset.mode; $$('[data-mode]', root).forEach(x => x.classList.toggle('on', x === b)); update() }))
      $('[data-go]', root).addEventListener('click', async () => {
        const bet = getBet(); if (!api.bet(bet)) return
        const v = +range.value, chance = mode === 'under' ? v : 100 - v, mult = 97 / chance
        const roll = Math.random() * 100
        root.classList.add('rolling')
        for (let i = 0; i < 14; i++) { res.textContent = (Math.random() * 100).toFixed(2); await api.sleep(45) }
        res.textContent = roll.toFixed(2); marker.style.left = roll + '%'; root.classList.remove('rolling')
        const won = mode === 'under' ? roll < v : roll > v
        root.classList.toggle('won', won); root.classList.toggle('lost', !won)
        if (won) { api.win(bet * mult, mult.toFixed(2)); verdict.textContent = `命中!${mult.toFixed(2)}x` } else { api.lose(); verdict.textContent = '未命中' }
      })
    },
  }

  /* ============================================================
     3. PLINKO (canvas physics)
     ============================================================ */
  G.plinko = {
    title: 'Plinko 弹珠',
    mount(root, api) {
      const ROWS = 12
      const MULTS = [16, 9, 2, 1.4, 1.1, 0.6, 0.4, 0.6, 1.1, 1.4, 2, 9, 16]
      root.innerHTML = `
        <div class="g-stage plinko-stage"><canvas class="plinko-canvas"></canvas><div class="plinko-slots">${MULTS.map(m => `<span class="${m >= 9 ? 'hi' : m >= 1.4 ? 'mid' : 'lo'}">${m}x</span>`).join('')}</div></div>
        <div class="g-panel">${betBox('plinko', 50, { chips: [10, 50, 100, 500] })}<button class="g-btn g-btn-gold" data-go>投球 <i class="fa-solid fa-circle-dot"></i></button><div class="g-hint">最高 16x · 中间概率最高、两侧最诱人。可连续投多颗。</div>${fairTag()}</div>`
      const getBet = wireBet(root)
      const cv = $('.plinko-canvas', root), ctx = cv.getContext('2d')
      let W, H, pegs = [], balls = []
      const resize = () => {
        const r = cv.parentElement.getBoundingClientRect(); W = cv.width = r.width * devicePixelRatio; H = (cv.height = (r.height - 44) * devicePixelRatio)
        pegs = []
        const gapY = H / (ROWS + 2), gapX = W / (ROWS + 2)
        for (let r = 0; r < ROWS; r++) for (let c = 0; c <= r + 1; c++) pegs.push({ x: W / 2 + (c - (r + 1) / 2) * gapX, y: gapY * (r + 1.2), r: 3.2 * devicePixelRatio })
      }
      resize(); addEventListener('resize', resize)
      function drop(bet) {
        // pre-decide slot via binomial (fair), then animate a ball biased toward it
        let k = 0; for (let i = 0; i < ROWS; i++) k += Math.random() < .5 ? 0 : 1
        balls.push({ x: W / 2 + rnd(-2, 2), y: 6, vx: 0, vy: 0, bet, target: k, r: 6 * devicePixelRatio, path: [], row: 0 })
      }
      function step() {
        const gapX = W / (ROWS + 2), g = 0.35 * devicePixelRatio
        for (const b of balls) {
          b.vy += g; b.y += b.vy; b.x += b.vx; b.vx *= .985
          for (const p of pegs) {
            const dx = b.x - p.x, dy = b.y - p.y, d = Math.hypot(dx, dy)
            if (d < b.r + p.r && b.vy > 0) {
              // bias direction toward target slot
              const rowIdx = Math.round(p.y / (H / (ROWS + 2)) - 1.2)
              const currentCol = Math.round((b.x - W / 2) / gapX + ROWS / 2)
              const wantRight = currentCol < b.target ? 1 : currentCol > b.target ? -1 : (Math.random() < .5 ? -1 : 1)
              b.vx = wantRight * rnd(1.2, 2.4) * devicePixelRatio; b.vy = -Math.abs(b.vy) * .35
              b.y = p.y - (b.r + p.r) - .5
              p.hit = 6
            }
          }
          b.x = clamp(b.x, b.r, W - b.r)
        }
        // settle
        for (let i = balls.length - 1; i >= 0; i--) {
          const b = balls[i]
          if (b.y > H - b.r) {
            const slot = clamp(Math.round((b.x - W / 2) / gapX + ROWS / 2), 0, MULTS.length - 1)
            const m = MULTS[slot]; balls.splice(i, 1)
            const el = $$('.plinko-slots span', root)[slot]; el.classList.add('hit'); setTimeout(() => el.classList.remove('hit'), 500)
            if (m >= 1) api.win(b.bet * m, m + '') ; else { wallet.bal += b.bet * m; wallet.save(); api.toast(`落入 ${m}x · 返还 ${fmt(b.bet * m)}`, 'warn') }
          }
        }
        ctx.clearRect(0, 0, W, H)
        for (const p of pegs) { ctx.beginPath(); ctx.arc(p.x, p.y, p.r + (p.hit ? 2 : 0), 0, 7); ctx.fillStyle = p.hit ? '#FFC531' : 'rgba(255,255,255,.55)'; if (p.hit) { ctx.shadowColor = '#FFC531'; ctx.shadowBlur = 12; p.hit-- } ctx.fill(); ctx.shadowBlur = 0 }
        for (const b of balls) { const gr = ctx.createRadialGradient(b.x - 2, b.y - 2, 1, b.x, b.y, b.r); gr.addColorStop(0, '#FFF3C4'); gr.addColorStop(1, '#FF8A00'); ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, 7); ctx.fillStyle = gr; ctx.shadowColor = '#FFC531'; ctx.shadowBlur = 14; ctx.fill(); ctx.shadowBlur = 0 }
        requestAnimationFrame(step)
      }
      step()
      $('[data-go]', root).addEventListener('click', () => { const bet = getBet(); if (api.bet(bet)) drop(bet) })
    },
  }

  /* ============================================================
     4. MINES
     ============================================================ */
  G.mines = {
    title: 'Mines 扫雷',
    mount(root, api) {
      root.innerHTML = `
        <div class="g-stage mines-stage"><div class="mines-grid" data-grid></div><div class="mines-info"><span>已开 <b data-open>0</b></span><span>当前 <b data-mult>1.00x</b></span><span>下一格 <b data-next>1.13x</b></span></div></div>
        <div class="g-panel">${betBox('mines', 100)}<div class="g-field"><label>地雷数</label><select data-mines>${[1, 3, 5, 8, 12].map(n => `<option ${n === 3 ? 'selected' : ''}>${n}</option>`).join('')}</select></div><button class="g-btn g-btn-gold" data-go>开始 <i class="fa-solid fa-bomb"></i></button><button class="g-btn g-btn-cash" data-cash disabled>兑现</button>${fairTag()}</div>`
      const getBet = wireBet(root)
      const grid = $('[data-grid]', root), go = $('[data-go]', root), cash = $('[data-cash]', root)
      let mines = new Set(), opened = 0, bet = 0, active = false, mult = 1
      const N = 25
      const multFor = (k, m) => { let p = 1; for (let i = 0; i < k; i++) p *= (N - m - i) / (N - i); return Math.floor((0.97 / p) * 100) / 100 }
      const refresh = () => { const m = +$('[data-mines]', root).value; $('[data-open]', root).textContent = opened; $('[data-mult]', root).textContent = mult.toFixed(2) + 'x'; $('[data-next]', root).textContent = multFor(opened + 1, m).toFixed(2) + 'x' }
      const render = () => { grid.innerHTML = Array.from({ length: N }, (_, i) => `<button type="button" class="mine-cell" data-i="${i}"><img class="mc-gem" src="/static/img/props/gem.webp" alt=""><img class="mc-bomb" src="/static/img/props/bomb.webp" alt=""></button>`).join('') }
      render(); refresh()
      const revealAll = () => $$('.mine-cell', grid).forEach(c => { c.classList.add(mines.has(+c.dataset.i) ? 'bomb' : 'safe-dim'); c.disabled = true })
      go.addEventListener('click', () => {
        bet = getBet(); if (!api.bet(bet)) return
        const m = +$('[data-mines]', root).value; mines = new Set(); while (mines.size < m) mines.add(ri(0, N - 1))
        opened = 0; mult = 1; active = true; render(); refresh(); root.classList.remove('boom'); go.disabled = true; cash.disabled = true
        $$('.mine-cell', grid).forEach(c => c.addEventListener('click', () => {
          if (!active) return; const i = +c.dataset.i
          if (mines.has(i)) { active = false; c.classList.add('bomb', 'boom'); root.classList.add('boom'); revealAll(); api.lose(); api.toast('💥 踩雷了', 'warn'); go.disabled = false; cash.disabled = true; return }
          c.classList.add('safe'); c.disabled = true; opened++; mult = multFor(opened, m); refresh(); cash.disabled = false
          if (opened === N - m) doCash()
        }))
      })
      const doCash = () => { if (!active) return; active = false; api.win(bet * mult, mult.toFixed(2)); revealAll(); go.disabled = false; cash.disabled = true }
      cash.addEventListener('click', doCash)
    },
  }

  /* ============================================================
     5. COINFLIP
     ============================================================ */
  G.coinflip = {
    title: 'Coinflip 硬币',
    mount(root, api) {
      root.innerHTML = `
        <div class="g-stage coin-stage"><div class="coin3d" data-coin><div class="coin-face heads"><img src="/static/img/props/coin.webp" alt=""></div><div class="coin-face tails"><img src="/static/img/props/mousecoin.webp" alt=""></div></div><div class="coin-streak" data-streak></div></div>
        <div class="g-panel">${betBox('coin', 100)}<div class="coin-pick"><button type="button" class="on" data-pick="heads">JYC 面</button><button type="button" data-pick="tails">鼠王面</button></div><button class="g-btn g-btn-gold" data-go>翻转 · 1.96x</button>${fairTag()}</div>`
      const getBet = wireBet(root); let pick = 'heads', streak = []
      $$('[data-pick]', root).forEach(b => b.addEventListener('click', () => { pick = b.dataset.pick; $$('[data-pick]', root).forEach(x => x.classList.toggle('on', x === b)) }))
      const coin = $('[data-coin]', root), go = $('[data-go]', root)
      let rot = 0
      go.addEventListener('click', async () => {
        const bet = getBet(); if (!api.bet(bet)) return
        go.disabled = true
        const res = Math.random() < .5 ? 'heads' : 'tails'
        rot += 1800 + (res === 'heads' ? 0 : 180) - (rot % 360)
        coin.style.transform = `rotateY(${rot}deg)`; coin.classList.add('flip')
        await api.sleep(1500); coin.classList.remove('flip')
        streak.push(res); $('[data-streak]', root).innerHTML = streak.slice(-10).map(s => `<i class="${s}"></i>`).join('')
        if (res === pick) api.win(bet * 1.96, '1.96'); else api.lose()
        go.disabled = false
      })
    },
  }

  /* ============================================================
     6. WHEEL
     ============================================================ */
  G.wheel = {
    title: 'Wheel 幸运轮盘',
    mount(root, api) {
      const SEG = [1.5, 0, 2, 0, 1.2, 5, 0, 1.5, 0, 3, 0, 1.2, 0, 10, 0, 1.5, 0, 2, 0, 1.2, 0, 3, 0, 1.5]
      const n = SEG.length, colors = { 0: '#3A2A5C', 1.2: '#38A8FF', 1.5: '#2EE59D', 2: '#A855FF', 3: '#FF4FB8', 5: '#FF8A00', 10: '#FFC531' }
      const grad = SEG.map((m, i) => `${colors[m]} ${i * 360 / n}deg ${(i + 1) * 360 / n}deg`).join(',')
      root.innerHTML = `
        <div class="g-stage wheel-stage"><div class="wheel-pointer"></div><div class="wheel" data-wheel style="background:conic-gradient(${grad})">${SEG.map((m, i) => `<span style="--a:${(i + .5) * 360 / n}deg">${m ? m + 'x' : ''}</span>`).join('')}<div class="wheel-hub"><img src="/static/img/props/mousecoin.webp" alt=""></div></div><div class="wheel-res" data-res>转一转</div></div>
        <div class="g-panel">${betBox('wheel', 100)}<button class="g-btn g-btn-gold" data-go>转动轮盘 <i class="fa-solid fa-rotate"></i></button><div class="g-hint">10x 仅 1 格 · 5x 1 格 · 3x 2 格 · 半数格子为 0</div>${fairTag()}</div>`
      const getBet = wireBet(root), wheel = $('[data-wheel]', root), go = $('[data-go]', root), res = $('[data-res]', root)
      let rot = 0
      go.addEventListener('click', async () => {
        const bet = getBet(); if (!api.bet(bet)) return
        go.disabled = true; res.textContent = '...'
        const idx = ri(0, n - 1), target = 360 - (idx + .5) * 360 / n
        rot += 1440 + ((target - rot % 360) + 360) % 360
        wheel.style.transform = `rotate(${rot}deg)`
        await api.sleep(4200)
        const m = SEG[idx]; res.textContent = m ? `${m}x!` : '0x · 再来'
        if (m) api.win(bet * m, m + ''); else api.lose()
        go.disabled = false
      })
    },
  }

  /* ============================================================
     7. LOTTO (6/33 quick draw)
     ============================================================ */
  G.lotto = {
    title: '5 分钟快开彩',
    mount(root, api) {
      const PAY = { 3: 5, 4: 50, 5: 1000, 6: 50000 }
      root.innerHTML = `
        <div class="g-stage lotto-stage"><div class="lotto-machine"><div class="lotto-drum" data-drum>${Array.from({ length: 22 }, (_, i) => `<i style="--i:${i}"><img src="/static/img/props/ball7.webp" alt=""></i>`).join('')}</div><div class="lotto-out" data-out></div></div><div class="lotto-pick" data-pick>${Array.from({ length: 33 }, (_, i) => `<button type="button">${i + 1}</button>`).join('')}</div><div class="lotto-sel">已选 <b data-count>0</b>/6 · <button type="button" class="g-link" data-quick>机选</button></div></div>
        <div class="g-panel">${betBox('lotto', 20, { chips: [10, 20, 50, 100] })}<button class="g-btn g-btn-gold" data-go>开奖 <i class="fa-solid fa-ticket"></i></button><div class="g-hint">中 3 个 ×5 · 中 4 个 ×50 · 中 5 个 ×1,000 · 中 6 个 ×50,000</div>${fairTag()}</div>`
      const getBet = wireBet(root); const sel = new Set(); const pick = $('[data-pick]', root), out = $('[data-out]', root), go = $('[data-go]', root)
      const upd = () => { $('[data-count]', root).textContent = sel.size; $$('button', pick).forEach(b => b.classList.toggle('on', sel.has(+b.textContent))) }
      $$('button', pick).forEach(b => b.addEventListener('click', () => { const v = +b.textContent; if (sel.has(v)) sel.delete(v); else if (sel.size < 6) sel.add(v); upd() }))
      $('[data-quick]', root).addEventListener('click', () => { sel.clear(); while (sel.size < 6) sel.add(ri(1, 33)); upd() })
      go.addEventListener('click', async () => {
        if (sel.size < 6) return api.toast('请选择 6 个号码', 'warn')
        const bet = getBet(); if (!api.bet(bet)) return
        go.disabled = true; out.innerHTML = ''; root.classList.add('drawing')
        const pool = Array.from({ length: 33 }, (_, i) => i + 1), draw = []
        for (let i = 0; i < 6; i++) { await api.sleep(650); const v = pool.splice(ri(0, pool.length - 1), 1)[0]; draw.push(v); out.innerHTML += `<b class="${sel.has(v) ? 'hit' : ''}">${v}</b>` }
        root.classList.remove('drawing')
        const hits = draw.filter(v => sel.has(v)).length, m = PAY[hits] || 0
        if (m) api.win(bet * m, m + ''); else { api.lose(); api.toast(`命中 ${hits} 个 · 未中奖`, 'warn') }
        go.disabled = false
      })
    },
  }

  /* ============================================================
     8. SCRATCH card
     ============================================================ */
  G.scratch = {
    title: '刮刮乐',
    mount(root, api) {
      root.innerHTML = `
        <div class="g-stage scratch-stage"><div class="scratch-card" data-card><div class="scratch-under" data-under></div><canvas class="scratch-cover" data-cover></canvas><div class="scratch-hint" data-hint>先购买一张再刮</div></div></div>
        <div class="g-panel">${betBox('scratch', 50, { chips: [20, 50, 100, 200] })}<button class="g-btn g-btn-gold" data-go>买一张 <i class="fa-solid fa-hand-pointer"></i></button><div class="g-hint">刮出 3 个相同图标即中奖:鼠王币 ×20 · 金币 ×10 · 宝石 ×5 · 骰子 ×2</div>${fairTag()}</div>`
      const getBet = wireBet(root), card = $('[data-card]', root), under = $('[data-under]', root), cv = $('[data-cover]', root), ctx = cv.getContext('2d'), hint = $('[data-hint]', root), go = $('[data-go]', root)
      const ICONS = [['mousecoin', 20], ['coin', 10], ['gem', 5], ['dice', 2], ['star', 0], ['cherry', 0]]
      let bet = 0, active = false, scratched = 0, result = null, total = 0
      const size = () => { const r = card.getBoundingClientRect(); cv.width = r.width * devicePixelRatio; cv.height = r.height * devicePixelRatio; cover() }
      const cover = () => { ctx.globalCompositeOperation = 'source-over'; const g = ctx.createLinearGradient(0, 0, cv.width, cv.height); g.addColorStop(0, '#C9A24A'); g.addColorStop(.5, '#F5D97A'); g.addColorStop(1, '#B8862B'); ctx.fillStyle = g; ctx.fillRect(0, 0, cv.width, cv.height); ctx.fillStyle = 'rgba(58,34,0,.55)'; ctx.font = `${18 * devicePixelRatio}px Baloo 2, sans-serif`; ctx.textAlign = 'center'; for (let y = 30; y < cv.height; y += 60 * devicePixelRatio) for (let x = 40; x < cv.width; x += 120 * devicePixelRatio) ctx.fillText('JYC', x, y) }
      size(); addEventListener('resize', size)
      go.addEventListener('click', () => {
        bet = getBet(); if (!api.bet(bet)) return
        active = true; scratched = 0; hint.style.display = 'none'; cover(); ctx.globalCompositeOperation = 'destination-out'
        // decide result: 12% 🎲, 5% 💎, 2.5% 🪙, 0.8% 🐭
        const r = Math.random(); const winIdx = r < .008 ? 0 : r < .033 ? 1 : r < .083 ? 2 : r < .2 ? 3 : -1
        let cells
        if (winIdx >= 0) { cells = [ICONS[winIdx][0], ICONS[winIdx][0], ICONS[winIdx][0]]; for (let i = 0; i < 6; i++) cells.push(ICONS[ri(0, 5)][0]); result = ICONS[winIdx][1] }
        else { cells = []; const cnt = {}; while (cells.length < 9) { const ic = ICONS[ri(0, 5)][0]; if ((cnt[ic] || 0) < 2) { cnt[ic] = (cnt[ic] || 0) + 1; cells.push(ic) } } result = 0 }
        cells.sort(() => Math.random() - .5)
        under.innerHTML = cells.map(c => `<span><img src="/static/img/props/${c}.webp" alt=""></span>`).join('')
        total = cv.width * cv.height
      })
      let drawing = false
      const pos = (e) => { const r = cv.getBoundingClientRect(); const p = e.touches ? e.touches[0] : e; return [(p.clientX - r.left) * devicePixelRatio, (p.clientY - r.top) * devicePixelRatio] }
      const scratch = (e) => { if (!active || !drawing) return; e.preventDefault(); const [x, y] = pos(e); ctx.beginPath(); ctx.arc(x, y, 22 * devicePixelRatio, 0, 7); ctx.fill(); scratched++; if (scratched % 12 === 0) check() }
      const check = () => { const d = ctx.getImageData(0, 0, cv.width, cv.height).data; let clear = 0; for (let i = 3; i < d.length; i += 16) if (d[i] === 0) clear++; if (clear / (d.length / 16) > .55) finish() }
      const finish = () => { if (!active) return; active = false; ctx.globalCompositeOperation = 'destination-out'; ctx.fillRect(0, 0, cv.width, cv.height); if (result) api.win(bet * result, result + ''); else { api.lose(); api.toast('这张没中 · 再买一张?', 'warn') } }
      cv.addEventListener('pointerdown', (e) => { drawing = true; scratch(e) }); cv.addEventListener('pointermove', scratch); addEventListener('pointerup', () => drawing = false)
    },
  }

  /* ---------------- expose helpers to other game files ---------------- */
  window.__JYC = { $, $$, rnd, ri, clamp, fmt, sleep, betBox, wireBet, fairTag, wallet, toast, makeApi, confetti }

  /* ---------------- Auto-mount: [data-game="id"] ---------------- */
  function mountAll() {
    $$('[data-game]').forEach(root => {
      if (root.dataset.mounted) return
      const id = root.dataset.game, g = G[id]
      if (!g) { if (!window.__JYC_ALL_LOADED) return; root.innerHTML = `<div class="g-soon"><img src="/static/img/mascot-head.webp" alt=""><b>该玩法演示即将上线</b><span>正在由守护鼠们调试中…</span></div>`; root.dataset.mounted = 1; return }
      root.dataset.mounted = 1; root.classList.add('g-root')
      try { g.mount(root, makeApi(root)) } catch (e) { console.error(id, e); root.innerHTML = `<div class="g-soon"><b>加载失败</b><span>${e.message}</span></div>` }
    })
    $$('[data-wallet-reset]').forEach(b => b.onclick = () => wallet.reset())
    wallet.render()
  }
  window.JYCMount = mountAll
  document.readyState === 'loading' ? addEventListener('DOMContentLoaded', mountAll) : mountAll()
})()
