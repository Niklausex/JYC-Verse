/* JYC Verse — Playable Demo Engine · Part 3 (casino classics, high-animation, prop assets) */
(() => {
  const { $, $$, rnd, ri, clamp, fmt, sleep, betBox, wireBet, fairTag, wallet, toast } = window.__JYC
  const G = window.JYCGames
  const P = (n) => `/static/img/props/${n}.webp`

  /* ============ JYC SLOT MACHINE (3x3, 5 lines) ============ */
  G.slot = {
    title: 'JYC 老虎机',
    mount(root, api) {
      // symbols: weight, pay3 (per line, x bet/5)
      const SYM = [
        { id: 'cherry', w: 30, pay: 2 }, { id: 'bell', w: 22, pay: 4 }, { id: 'star', w: 16, pay: 6 },
        { id: 'gem', w: 12, pay: 10 }, { id: 'seven', w: 8, pay: 25 }, { id: 'mousecoin', w: 5, pay: 60, wild: true },
        { id: 'chest', w: 3, pay: 0, scatter: true },
      ]
      const total = SYM.reduce((s, x) => s + x.w, 0)
      const pick = () => { let r = Math.random() * total; for (const s of SYM) { r -= s.w; if (r < 0) return s } return SYM[0] }
      const LINES = [[1, 1, 1], [0, 0, 0], [2, 2, 2], [0, 1, 2], [2, 1, 0]]
      root.innerHTML = `
        <div class="g-stage slot-stage">
          <div class="slot-top"><img src="${P('mousecoin')}" alt=""><b>JYC <span>SLOTS</span></b><img src="${P('mousecoin')}" alt=""></div>
          <div class="slot-cab">
            <div class="slot-reels" data-reels>${[0, 1, 2].map(c => `<div class="reel" data-reel="${c}"><div class="reel-strip">${Array.from({ length: 3 }, () => `<i><img src="${P(pick().id)}" alt=""></i>`).join('')}</div></div>`).join('')}</div>
            <svg class="slot-lines" data-lines viewBox="0 0 300 300" preserveAspectRatio="none">${LINES.map((l, i) => `<polyline data-line="${i}" points="${l.map((r, c) => `${c * 100 + 50},${r * 100 + 50}`).join(' ')}" />`).join('')}</svg>
          </div>
          <div class="slot-msg" data-msg>拉动拉杆,三连即中</div>
          <div class="slot-pays">${SYM.filter(s => s.pay).map(s => `<span><img src="${P(s.id)}" alt="">×3 = ${s.pay}x</span>`).join('')}<span><img src="${P('chest')}" alt="">×3 = 免费旋转</span></div>
        </div>
        <div class="g-panel">${betBox('slot', 50, { chips: [10, 50, 100, 500] })}<div class="g-hint">5 条线 · 下注平分到每条线 · 鼠王币为 Wild · 宝箱 ×3 触发 5 次免费旋转</div><button class="g-btn g-btn-gold slot-lever" data-go>SPIN <i class="fa-solid fa-arrows-rotate"></i></button>${fairTag()}</div>`
      const getBet = wireBet(root), reels = $$('.reel', root), msg = $('[data-msg]', root), go = $('[data-go]', root), lines = $$('[data-line]', root)
      let free = 0, spinning = false
      async function spin() {
        if (spinning) return
        const bet = getBet(); if (free <= 0 && !api.bet(bet)) return
        if (free > 0) { free--; msg.textContent = `免费旋转 · 剩余 ${free}` }
        spinning = true; go.disabled = true; lines.forEach(l => l.classList.remove('hit'))
        const grid = [0, 1, 2].map(() => [pick(), pick(), pick()])  // grid[col][row]
        // animate reels: blur spin then settle each with delay
        await Promise.all(reels.map((reel, c) => new Promise(async res => {
          const strip = $('.reel-strip', reel); reel.classList.add('spin')
          const t0 = performance.now(), dur = 900 + c * 350
          const tick = () => { if (performance.now() - t0 < dur) { if (Math.random() < .5) strip.innerHTML = Array.from({ length: 3 }, () => `<i><img src="${P(pick().id)}" alt=""></i>`).join(''); requestAnimationFrame(tick) } else { strip.innerHTML = grid[c].map(s => `<i><img src="${P(s.id)}" alt=""></i>`).join(''); reel.classList.remove('spin'); reel.classList.add('stop'); setTimeout(() => reel.classList.remove('stop'), 300); res() } }
          tick()
        })))
        // evaluate
        const lineBet = bet / LINES.length; let win = 0, hits = []
        LINES.forEach((l, i) => {
          const syms = l.map((r, c) => grid[c][r])
          const nonWild = syms.filter(s => !s.wild)
          const base = nonWild[0] || SYM[5]
          if (nonWild.every(s => s.id === base.id) && !base.scatter) { const pay = nonWild.length === 0 ? 60 : base.pay; win += lineBet * pay; hits.push(i) }
        })
        const scat = grid.flat().filter(s => s.scatter).length
        hits.forEach(i => lines[i].classList.add('hit'))
        $$('.reel-strip i img', root).forEach((img, k) => { const c = Math.floor(k / 3), r = k % 3; const onLine = hits.some(i => LINES[i][c] === r); img.parentElement.classList.toggle('lit', onLine) })
        if (scat >= 3) { free += 5; msg.textContent = '🎁 宝箱 ×3!获得 5 次免费旋转'; api.confetti(root, 50, ['#FFC531', '#FF4FB8']) }
        if (win > 0) { api.win(win, (win / bet).toFixed(1)); if (scat < 3) msg.textContent = `${hits.length} 条线中奖!` } else if (scat < 3) { api.lose(); msg.textContent = free > 0 ? `免费旋转 · 剩余 ${free}` : '再转一次' }
        spinning = false; go.disabled = false
        if (free > 0) setTimeout(spin, 900)
      }
      go.addEventListener('click', spin)
    },
  }

  /* ============ ROULETTE (European, single zero) ============ */
  G.roulette = {
    title: '轮盘 Roulette',
    mount(root, api) {
      const ORDER = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26]
      const RED = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36])
      const col = n => n === 0 ? '#1FA971' : RED.has(n) ? '#E0231A' : '#1A1030'
      const seg = 360 / 37
      const grad = ORDER.map((n, i) => `${col(n)} ${i * seg}deg ${(i + 1) * seg}deg`).join(',')
      root.innerHTML = `
        <div class="g-stage rou-stage">
          <div class="rou-wheel-wrap"><div class="rou-pointer"></div><div class="rou-wheel" data-wheel style="background:conic-gradient(${grad})">${ORDER.map((n, i) => `<span style="--a:${(i + .5) * seg}deg">${n}</span>`).join('')}<div class="rou-hub"><img src="${P('mousecoin')}" alt=""></div></div><div class="rou-ball" data-ball></div></div>
          <div class="rou-result" data-res>—</div>
          <div class="rou-hist" data-hist></div>
        </div>
        <div class="g-panel">${betBox('rou', 100)}
          <div class="rou-bets">
            <button type="button" data-b="red" style="--c:#E0231A">红 <small>2x</small></button><button type="button" data-b="black" style="--c:#2A2040">黑 <small>2x</small></button>
            <button type="button" data-b="odd">单 <small>2x</small></button><button type="button" data-b="even">双 <small>2x</small></button>
            <button type="button" data-b="low">1–18 <small>2x</small></button><button type="button" data-b="high">19–36 <small>2x</small></button>
            <button type="button" data-b="d1">1–12 <small>3x</small></button><button type="button" data-b="d2">13–24 <small>3x</small></button><button type="button" data-b="d3">25–36 <small>3x</small></button>
            <button type="button" data-b="zero" style="--c:#1FA971">0 <small>36x</small></button>
            <button type="button" data-b="lucky" style="--c:#FFC531">幸运 7 <small>36x</small></button>
          </div>
          <button class="g-btn g-btn-gold" data-go>转动 <i class="fa-solid fa-circle-notch"></i></button>${fairTag()}</div>`
      const getBet = wireBet(root), wheel = $('[data-wheel]', root), ball = $('[data-ball]', root), res = $('[data-res]', root), hist = $('[data-hist]', root), go = $('[data-go]', root)
      let sel = 'red', rot = 0, brot = 0, history = []
      $$('[data-b]', root).forEach(b => b.addEventListener('click', () => { sel = b.dataset.b; $$('[data-b]', root).forEach(x => x.classList.toggle('on', x === b)) }))
      $('[data-b="red"]', root).classList.add('on')
      const check = (n) => ({ red: RED.has(n) ? 2 : 0, black: n && !RED.has(n) ? 2 : 0, odd: n % 2 === 1 ? 2 : 0, even: n && n % 2 === 0 ? 2 : 0, low: n >= 1 && n <= 18 ? 2 : 0, high: n >= 19 ? 2 : 0, d1: n >= 1 && n <= 12 ? 3 : 0, d2: n >= 13 && n <= 24 ? 3 : 0, d3: n >= 25 ? 3 : 0, zero: n === 0 ? 36 : 0, lucky: n === 7 ? 36 : 0 })[sel]
      go.addEventListener('click', async () => {
        const bet = getBet(); if (!api.bet(bet)) return
        go.disabled = true; res.textContent = '…'; res.style.color = ''
        const idx = ri(0, 36), n = ORDER[idx]
        const target = -(idx + .5) * seg
        rot += 1080 + ((target - (rot % 360)) % 360 + 360) % 360 + 360
        brot -= 1800 + ri(0, 360)
        wheel.style.transform = `rotate(${rot}deg)`; ball.style.transform = `rotate(${brot}deg)`; ball.classList.add('drop')
        await sleep(4200); ball.classList.remove('drop')
        res.textContent = n; res.style.color = col(n) === '#1A1030' ? '#fff' : col(n); res.classList.add('pop'); setTimeout(() => res.classList.remove('pop'), 500)
        history.unshift(n); hist.innerHTML = history.slice(0, 10).map(h => `<b style="background:${col(h)}">${h}</b>`).join('')
        const m = check(n); if (m) api.win(bet * m, m + ''); else api.lose()
        go.disabled = false
      })
    },
  }

  /* ============ DRAGON TIGER ============ */
  G.dragontiger = {
    title: '龙虎',
    mount(root, api) {
      const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'], SUITS = ['♠', '♥', '♦', '♣']
      root.innerHTML = `
        <div class="g-stage dt-stage">
          <div class="dt-side dragon"><img src="${P('dragon')}" alt=""><b>龙 DRAGON</b><div class="dt-card" data-card="d"><div class="dt-back"><img src="${P('cardred')}" alt=""></div><div class="dt-front"></div></div></div>
          <div class="dt-vs"><img src="${P('mousecoin')}" alt=""><span data-res>选择龙 / 虎 / 和</span></div>
          <div class="dt-side tiger"><img src="${P('tiger')}" alt=""><b>虎 TIGER</b><div class="dt-card" data-card="t"><div class="dt-back"><img src="${P('cardred')}" alt=""></div><div class="dt-front"></div></div></div>
        </div>
        <div class="g-panel">${betBox('dt', 100)}<div class="dt-pick"><button type="button" class="on" data-p="d" style="--c:#3DE8FF">龙 <small>2x</small></button><button type="button" data-p="tie" style="--c:#FFC531">和 <small>8x</small></button><button type="button" data-p="t" style="--c:#FF8A00">虎 <small>2x</small></button></div><button class="g-btn g-btn-gold" data-go>发牌 <i class="fa-solid fa-clone"></i></button><div class="g-hint">一张定胜负,比点数大小(K 最大 A 最小),和局时龙/虎注退一半</div>${fairTag()}</div>`
      const getBet = wireBet(root), go = $('[data-go]', root), res = $('[data-res]', root)
      let pick = 'd'
      $$('[data-p]', root).forEach(b => b.addEventListener('click', () => { pick = b.dataset.p; $$('[data-p]', root).forEach(x => x.classList.toggle('on', x === b)) }))
      const draw = () => ({ r: ri(0, 12), s: SUITS[ri(0, 3)] })
      const face = (c) => `<span class="${c.s === '♥' || c.s === '♦' ? 'red' : ''}"><b>${RANKS[c.r]}</b><i>${c.s}</i></span>`
      go.addEventListener('click', async () => {
        const bet = getBet(); if (!api.bet(bet)) return
        go.disabled = true; $$('.dt-card', root).forEach(c => c.classList.remove('flip', 'win')); $$('.dt-side', root).forEach(s => s.classList.remove('win')); res.textContent = '发牌中…'
        await sleep(300)
        const d = draw(), t = draw()
        $('[data-card="d"] .dt-front', root).innerHTML = face(d); await sleep(200); $('[data-card="d"]', root).classList.add('flip'); await sleep(700)
        $('[data-card="t"] .dt-front', root).innerHTML = face(t); $('[data-card="t"]', root).classList.add('flip'); await sleep(800)
        const out = d.r > t.r ? 'd' : t.r > d.r ? 't' : 'tie'
        if (out !== 'tie') $(`.dt-side.${out === 'd' ? 'dragon' : 'tiger'}`, root).classList.add('win')
        res.textContent = out === 'd' ? '🐉 龙赢!' : out === 't' ? '🐯 虎赢!' : '🤝 和局'
        if (out === pick) api.win(bet * (out === 'tie' ? 8 : 2), out === 'tie' ? '8' : '2')
        else if (out === 'tie') { wallet.bal += bet / 2; wallet.save(); toast('和局 · 退还一半', 'warn') }
        else api.lose()
        go.disabled = false
      })
    },
  }

  /* ============ SIC BO (骰宝) ============ */
  const PIPS = { 1: ['2/2'], 2: ['1/1', '3/3'], 3: ['1/1', '2/2', '3/3'], 4: ['1/1', '1/3', '3/1', '3/3'], 5: ['1/1', '1/3', '2/2', '3/1', '3/3'], 6: ['1/1', '2/1', '3/1', '1/3', '2/3', '3/3'] }
  G.sicbo = {
    title: '骰宝',
    mount(root, api) {
      root.innerHTML = `
        <div class="g-stage sb-stage">
          <div class="sb-cup" data-cup><img src="${P('chips')}" alt="" class="sb-chips"><div class="sb-dice">${[0, 1, 2].map(i => `<div class="d3" data-d="${i}">${[1,2,3,4,5,6].map(n => `<div class="face f${n}">${PIPS[n].map(g => `<i style="grid-area:${g}"></i>`).join('')}</div>`).join('')}</div>`).join('')}</div></div>
          <div class="sb-res" data-res>摇一摇</div>
        </div>
        <div class="g-panel">${betBox('sb', 100)}
          <div class="sb-bets">
            <button type="button" class="on" data-b="small">小 4–10 <small>2x</small></button><button type="button" data-b="big">大 11–17 <small>2x</small></button>
            <button type="button" data-b="odd">单 <small>2x</small></button><button type="button" data-b="even">双 <small>2x</small></button>
            <button type="button" data-b="triple">围骰 <small>30x</small></button><button type="button" data-b="pair">对子 <small>3x</small></button>
          </div>
          <button class="g-btn g-btn-gold" data-go>摇骰 <i class="fa-solid fa-dice-three"></i></button><div class="g-hint">三颗骰子;围骰(三同)时大小单双全输</div>${fairTag()}</div>`
      const getBet = wireBet(root), go = $('[data-go]', root), res = $('[data-res]', root), cup = $('[data-cup]', root)
      let sel = 'small'
      $$('[data-b]', root).forEach(b => b.addEventListener('click', () => { sel = b.dataset.b; $$('[data-b]', root).forEach(x => x.classList.toggle('on', x === b)) }))
      const ROT = { 1: [0, 0], 2: [0, -90], 3: [0, 180], 4: [0, 90], 5: [-90, 0], 6: [90, 0] }
      go.addEventListener('click', async () => {
        const bet = getBet(); if (!api.bet(bet)) return
        go.disabled = true; res.textContent = '…'; cup.classList.add('shake')
        const d = [ri(1, 6), ri(1, 6), ri(1, 6)]
        $$('.d3', root).forEach((el, i) => { const [rx, ry] = ROT[d[i]]; el.style.transform = `rotateX(${rx + 720 + ri(0, 1) * 360}deg) rotateY(${ry + 720}deg) rotateZ(${ri(-15, 15)}deg)` })
        await sleep(1500); cup.classList.remove('shake')
        const s = d[0] + d[1] + d[2], triple = d[0] === d[1] && d[1] === d[2], pair = !triple && (d[0] === d[1] || d[1] === d[2] || d[0] === d[2])
        res.innerHTML = `${d.join(' · ')} = <b>${s}</b> ${triple ? '围骰!' : s >= 11 ? '大' : '小'}`
        const win = { small: !triple && s <= 10 ? 2 : 0, big: !triple && s >= 11 ? 2 : 0, odd: !triple && s % 2 ? 2 : 0, even: !triple && s % 2 === 0 ? 2 : 0, triple: triple ? 30 : 0, pair: pair ? 3 : 0 }[sel]
        if (win) api.win(bet * win, win + ''); else api.lose()
        go.disabled = false
      })
    },
  }

  /* ============ BACCARAT (simplified) ============ */
  G.baccarat = {
    title: '百家乐',
    mount(root, api) {
      const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'], SUITS = ['♠', '♥', '♦', '♣']
      const val = c => c.r === 0 ? 1 : c.r >= 9 ? 0 : c.r + 1
      const draw = () => ({ r: ri(0, 12), s: SUITS[ri(0, 3)] })
      const face = (c) => `<div class="bc-card ${c.s === '♥' || c.s === '♦' ? 'red' : ''}"><b>${RANKS[c.r]}</b><i>${c.s}</i></div>`
      root.innerHTML = `
        <div class="g-stage bc-stage">
          <div class="bc-table">
            <div class="bc-hand player"><span>闲 PLAYER</span><div class="bc-cards" data-h="p"></div><b data-v="p">—</b></div>
            <img class="bc-dealer" src="/static/img/mouse-city.webp" alt="">
            <div class="bc-hand banker"><span>庄 BANKER</span><div class="bc-cards" data-h="b"></div><b data-v="b">—</b></div>
          </div>
          <div class="bc-res" data-res>选择庄 / 闲 / 和</div>
        </div>
        <div class="g-panel">${betBox('bc', 100)}<div class="bc-pick"><button type="button" data-p="p" style="--c:#3DE8FF">闲 <small>2x</small></button><button type="button" data-p="tie" style="--c:#4DFFB5">和 <small>9x</small></button><button type="button" class="on" data-p="b" style="--c:#FF4FB8">庄 <small>1.95x</small></button></div><button class="g-btn g-btn-gold" data-go>发牌 <i class="fa-solid fa-layer-group"></i></button>${fairTag()}</div>`
      const getBet = wireBet(root), go = $('[data-go]', root), res = $('[data-res]', root)
      let pick = 'b'
      $$('[data-p]', root).forEach(b => b.addEventListener('click', () => { pick = b.dataset.p; $$('[data-p]', root).forEach(x => x.classList.toggle('on', x === b)) }))
      go.addEventListener('click', async () => {
        const bet = getBet(); if (!api.bet(bet)) return
        go.disabled = true; $$('.bc-cards', root).forEach(h => h.innerHTML = ''); $$('.bc-hand', root).forEach(h => h.classList.remove('win')); res.textContent = '发牌中…'
        const p = [draw(), draw()], b = [draw(), draw()]
        const pv = () => p.reduce((s, c) => s + val(c), 0) % 10, bv = () => b.reduce((s, c) => s + val(c), 0) % 10
        for (const [h, c] of [['p', p[0]], ['b', b[0]], ['p', p[1]], ['b', b[1]]]) { $(`[data-h="${h}"]`, root).insertAdjacentHTML('beforeend', face(c)); await sleep(350) }
        $('[data-v="p"]', root).textContent = pv(); $('[data-v="b"]', root).textContent = bv()
        if (pv() < 8 && bv() < 8) { if (pv() <= 5) { p.push(draw()); $('[data-h="p"]', root).insertAdjacentHTML('beforeend', face(p[2])); await sleep(400); $('[data-v="p"]', root).textContent = pv() } if (bv() <= 5) { b.push(draw()); $('[data-h="b"]', root).insertAdjacentHTML('beforeend', face(b[2])); await sleep(400); $('[data-v="b"]', root).textContent = bv() } }
        const out = pv() > bv() ? 'p' : bv() > pv() ? 'b' : 'tie'
        if (out !== 'tie') $(`.bc-hand.${out === 'p' ? 'player' : 'banker'}`, root).classList.add('win')
        res.textContent = out === 'p' ? '闲赢!' : out === 'b' ? '庄赢!' : '和局'
        if (out === pick) api.win(bet * (out === 'tie' ? 9 : out === 'b' ? 1.95 : 2), out === 'tie' ? '9' : out === 'b' ? '1.95' : '2')
        else if (out === 'tie') { wallet.bal += bet; wallet.save(); toast('和局 · 退注', 'warn') }
        else api.lose()
        go.disabled = false
      })
    },
  }

  window.__JYC_ALL_LOADED = true
  window.JYCMount?.()
})()
