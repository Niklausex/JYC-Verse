/* JYC Verse — Playable Demo Engine · Part 2 (realm-specific simulations) */
(() => {
  const { $, $$, rnd, ri, clamp, fmt, sleep, betBox, wireBet, fairTag, wallet, toast } = window.__JYC
  const G = window.JYCGames

  /* ============ PREDICT market ============ */
  G.predict = {
    title: '预测市场',
    mount(root, api) {
      const Q = [
        { q: 'BTC 本周收盘会高于开盘吗?', yes: 58 },
        { q: '本赛季欧冠冠军来自英超?', yes: 41 },
        { q: '下一部漫威电影首周票房破 $1.5 亿?', yes: 63 },
        { q: '本周末上海会下雨?', yes: 35 },
        { q: 'JYC Verse 明年 Q1 前上线 LOTTERY 星域?', yes: 77 },
      ]
      let cur = 0, side = 'yes'
      const render = () => {
        const m = Q[cur]
        root.innerHTML = `
          <div class="g-stage predict-stage">
            <div class="pm-card">
              <div class="pm-tag"><i class="fa-solid fa-chart-line"></i> 市场 #${1284 + cur} · 资金池 ${fmt(ri(40000, 320000))} JYC</div>
              <h3>${m.q}</h3>
              <div class="pm-bar"><div class="pm-yes" style="width:${m.yes}%"><span>YES ${m.yes}¢</span></div><div class="pm-no"><span>NO ${100 - m.yes}¢</span></div></div>
              <div class="pm-sides"><button type="button" class="yes ${side === 'yes' ? 'on' : ''}" data-side="yes">买 YES<small>赔付 ${(100 / m.yes).toFixed(2)}x</small></button><button type="button" class="no ${side === 'no' ? 'on' : ''}" data-side="no">买 NO<small>赔付 ${(100 / (100 - m.yes)).toFixed(2)}x</small></button></div>
              <button type="button" class="g-link" data-next><i class="fa-solid fa-shuffle"></i> 换一个市场</button>
            </div>
          </div>
          <div class="g-panel">${betBox('pm', 100)}<button class="g-btn g-btn-gold" data-go>下单并模拟结算</button><div class="g-hint">真实场景中市场会在事件发生后结算;演示按当前隐含概率即时抽签。</div>${fairTag()}</div>`
        const getBet = wireBet(root)
        $$('[data-side]', root).forEach(b => b.addEventListener('click', () => { side = b.dataset.side; render() }))
        $('[data-next]', root).addEventListener('click', () => { cur = (cur + 1) % Q.length; render() })
        $('[data-go]', root).addEventListener('click', async () => {
          const bet = getBet(); if (!api.bet(bet)) return
          const card = $('.pm-card', root); card.classList.add('settling')
          await sleep(1200); card.classList.remove('settling')
          const outcomeYes = Math.random() * 100 < m.yes
          const won = (side === 'yes') === outcomeYes
          const mult = side === 'yes' ? 100 / m.yes : 100 / (100 - m.yes)
          card.classList.add(won ? 'won' : 'lost'); setTimeout(() => card.classList.remove('won', 'lost'), 1500)
          if (won) api.win(bet * mult * 0.98, mult.toFixed(2)); else { api.lose(); toast(`结果:${outcomeYes ? 'YES' : 'NO'} · 未命中`, 'warn') }
        })
      }
      render()
    },
  }

  /* ============ 1-minute UP/DOWN with live candles ============ */
  G.updown = {
    title: '加密 1 分钟涨跌',
    mount(root, api) {
      root.innerHTML = `
        <div class="g-stage ud-stage"><div class="ud-head"><b>BTC/USDT</b><span data-price>—</span><em data-chg></em></div><canvas class="ud-canvas"></canvas><div class="ud-timer" data-timer></div></div>
        <div class="g-panel">${betBox('ud', 100)}<div class="ud-btns"><button class="g-btn g-btn-up" data-dir="up">押涨 <i class="fa-solid fa-arrow-trend-up"></i></button><button class="g-btn g-btn-down" data-dir="down">押跌 <i class="fa-solid fa-arrow-trend-down"></i></button></div><div class="g-hint">下单后 15 秒结算 · 1.94x</div>${fairTag()}</div>`
      const getBet = wireBet(root), cv = $('.ud-canvas', root), ctx = cv.getContext('2d'), priceEl = $('[data-price]', root), chg = $('[data-chg]', root), timer = $('[data-timer]', root)
      let price = 67420, candles = [], cur = null, W, H, open0 = price
      for (let i = 0; i < 40; i++) { const o = price, c = o + rnd(-120, 120); candles.push({ o, c, h: Math.max(o, c) + rnd(0, 60), l: Math.min(o, c) - rnd(0, 60) }); price = c }
      const resize = () => { const r = cv.parentElement.getBoundingClientRect(); W = cv.width = r.width * devicePixelRatio; H = cv.height = (r.height - 40) * devicePixelRatio }
      resize(); addEventListener('resize', resize)
      let bets = []
      function draw() {
        const all = [...candles, cur].filter(Boolean).slice(-44)
        const hi = Math.max(...all.map(c => c.h)), lo = Math.min(...all.map(c => c.l)), Y = v => H - ((v - lo) / (hi - lo || 1)) * H * .85 - H * .07, cw = W / 46
        ctx.clearRect(0, 0, W, H)
        all.forEach((c, i) => { const x = (i + 1) * cw, up = c.c >= c.o; ctx.strokeStyle = ctx.fillStyle = up ? '#4DFFB5' : '#FF4F6E'; ctx.lineWidth = 1.5 * devicePixelRatio; ctx.beginPath(); ctx.moveTo(x, Y(c.h)); ctx.lineTo(x, Y(c.l)); ctx.stroke(); ctx.fillRect(x - cw * .32, Y(Math.max(c.o, c.c)), cw * .64, Math.max(2, Y(Math.min(c.o, c.c)) - Y(Math.max(c.o, c.c)))) })
        bets.forEach(b => { ctx.setLineDash([6, 6]); ctx.strokeStyle = b.dir === 'up' ? '#4DFFB5' : '#FF4F6E'; ctx.beginPath(); ctx.moveTo(0, Y(b.entry)); ctx.lineTo(W, Y(b.entry)); ctx.stroke(); ctx.setLineDash([]) })
      }
      setInterval(() => {
        if (!cur) cur = { o: price, c: price, h: price, l: price, n: 0 }
        price += rnd(-45, 45) + (Math.random() < .02 ? rnd(-200, 200) : 0); cur.c = price; cur.h = Math.max(cur.h, price); cur.l = Math.min(cur.l, price); cur.n++
        if (cur.n >= 10) { candles.push(cur); cur = null; if (candles.length > 80) candles.shift() }
        priceEl.textContent = price.toFixed(1); const d = ((price - open0) / open0 * 100); chg.textContent = (d >= 0 ? '+' : '') + d.toFixed(2) + '%'; chg.className = d >= 0 ? 'up' : 'down'
        draw()
        const now = Date.now()
        bets = bets.filter(b => { if (now < b.until) { timer.textContent = `${Math.ceil((b.until - now) / 1000)}s · 入场 ${b.entry.toFixed(1)}`; return true }
          const won = b.dir === 'up' ? price > b.entry : price < b.entry
          if (won) api.win(b.bet * 1.94, '1.94'); else { api.lose(); toast(`结算 ${price.toFixed(1)} · 未命中`, 'warn') }
          timer.textContent = ''; return false })
      }, 300)
      $$('[data-dir]', root).forEach(b => b.addEventListener('click', () => { const bet = getBet(); if (!api.bet(bet)) return; bets.push({ dir: b.dataset.dir, bet, entry: price, until: Date.now() + 15000 }); toast(`已${b.dataset.dir === 'up' ? '押涨' : '押跌'} @ ${price.toFixed(1)}`, 'ok') }))
    },
  }

  /* ============ TAROT ============ */
  G.tarot = {
    title: '塔罗牌',
    mount(root, api) {
      const CARDS = [['愚者', '新的开始,放下包袱去冒险', '🃏'], ['魔术师', '你手握所有工具,时机就是现在', '🪄'], ['女祭司', '相信直觉,答案在沉默里', '🌙'], ['皇后', '丰盛与收获,财运正旺', '👑'], ['战车', '意志驱动胜利,别犹豫', '⚔️'], ['命运之轮', '转折点已至,运势将变', '☸️'], ['力量', '以柔克刚,耐心是筹码', '🦁'], ['星星', '希望与灵感,幸运数字 17', '⭐'], ['太阳', '万事顺遂,今日宜下注', '☀️'], ['世界', '圆满完成,收网时刻', '🌍'], ['隐士', '独处思考,暂时观望', '🏮'], ['正义', '因果分明,公平回报', '⚖️']]
      root.innerHTML = `
        <div class="g-stage tarot-stage"><div class="tarot-spread">${['过去', '现在', '未来'].map((l, i) => `<div class="tarot-slot" data-slot="${i}"><span class="tarot-label">${l}</span><div class="tarot-card"><div class="tarot-back"><img src="/static/img/mouse-fortune.webp" alt=""></div><div class="tarot-front"><i></i><b></b><p></p></div></div></div>`).join('')}</div><div class="tarot-read" data-read>星语鼠正在洗牌…点击「抽牌」开始。</div></div>
        <div class="g-panel"><button class="g-btn g-btn-gold" data-go>抽三张牌 <i class="fa-solid fa-wand-sparkles"></i></button><button class="g-btn g-btn-cash" data-lucky disabled>带着幸运数字去买彩票 →</button><div class="g-hint">占卜免费 · 结果生成幸运数字,可一键转投 LOTTERY 星域</div></div>`
      const go = $('[data-go]', root), lucky = $('[data-lucky]', root), read = $('[data-read]', root)
      go.addEventListener('click', async () => {
        go.disabled = true; $$('.tarot-slot', root).forEach(s => s.classList.remove('flip'))
        await sleep(300)
        const pick = [...CARDS].sort(() => Math.random() - .5).slice(0, 3)
        for (let i = 0; i < 3; i++) { const s = $$('.tarot-slot', root)[i]; $('.tarot-front i', s).textContent = pick[i][2]; $('.tarot-front b', s).textContent = pick[i][0]; $('.tarot-front p', s).textContent = pick[i][1]; await sleep(350); s.classList.add('flip') }
        const nums = new Set(); while (nums.size < 6) nums.add(ri(1, 33))
        read.innerHTML = `<b>解读:</b>${pick.map(p => p[0]).join(' → ')}。${pick[2][1]}。<br><span class="tarot-nums">今日幸运数字 ${[...nums].map(n => `<i>${n}</i>`).join('')}</span>`
        lucky.disabled = false; lucky.onclick = () => location.href = '/play/lotto'; go.disabled = false
        api.confetti(root, 30, ['#A855FF', '#FFC531', '#E86BFF'])
      })
    },
  }

  /* ============ DAILY FORTUNE ============ */
  G.fortune = {
    title: '每日运势',
    mount(root, api) {
      const SIGNS = ['白羊', '金牛', '双子', '巨蟹', '狮子', '处女', '天秤', '天蝎', '射手', '摩羯', '水瓶', '双鱼']
      root.innerHTML = `
        <div class="g-stage fortune-stage"><div class="fortune-orb" data-orb><img src="/static/img/mouse-fortune.webp" alt=""><div class="orb-glow"></div></div><div class="fortune-out" data-out><div class="fo-score"><small>综合运势</small><b>—</b></div><div class="fo-grid"></div><p class="fo-text">选择星座,摇一摇水晶球</p></div></div>
        <div class="g-panel"><div class="fortune-signs">${SIGNS.map((s, i) => `<button type="button" class="${i === 0 ? 'on' : ''}">${s}</button>`).join('')}</div><button class="g-btn g-btn-gold" data-go>摇一摇 <i class="fa-solid fa-hand-sparkles"></i></button><div class="g-hint">运势 → 幸运数字 / 幸运方向 → 一键转化为下注,这是 FORTUNE 导流全生态的核心机制</div></div>`
      let sign = 0; $$('.fortune-signs button', root).forEach((b, i) => b.addEventListener('click', () => { sign = i; $$('.fortune-signs button', root).forEach(x => x.classList.toggle('on', x === b)) }))
      const out = $('[data-out]', root), orb = $('[data-orb]', root)
      $('[data-go]', root).addEventListener('click', async () => {
        orb.classList.add('shake'); await sleep(900); orb.classList.remove('shake')
        const s = ri(60, 99), items = [['财运', ri(2, 5)], ['手气', ri(2, 5)], ['竞技', ri(1, 5)], ['社交', ri(2, 5)]]
        const dirs = ['押大', '押小', '押涨', '押跌'], realms = [['ARCADE · Crash', '/play/crash'], ['LOTTERY · 快开彩', '/play/lotto'], ['SPORTS · 赛鼠', '/play/race'], ['PREDICT · 涨跌', '/play/updown']]
        const rr = realms[ri(0, 3)]
        $('.fo-score b', out).textContent = s; $('.fo-grid', out).innerHTML = items.map(([n, v]) => `<div><span>${n}</span><i>${'★'.repeat(v)}${'☆'.repeat(5 - v)}</i></div>`).join('')
        $('.fo-text', out).innerHTML = `${SIGNS[sign]}座今日${s >= 85 ? '运势极佳,宜果断出手' : s >= 70 ? '运势平稳,小注怡情' : '宜守不宜攻,观望为上'}。幸运数字 <b>${ri(1, 33)}</b> · 幸运方向 <b>${dirs[ri(0, 3)]}</b> · 推荐星域 <a href="${rr[1]}">${rr[0]} →</a>`
        out.classList.add('in'); api.confetti(root, 24, ['#A855FF', '#FFC531'])
      })
    },
  }

  /* ============ MOUSE RACE (virtual sports) ============ */
  G.race = {
    title: '虚拟赛鼠',
    mount(root, api) {
      const NAMES = ['闪电', '奶酪', '金冠', '夜行', '火箭', '幸运']
      const COLORS = ['#3DE8FF', '#FFC531', '#FF4FB8', '#A855FF', '#FF5A3C', '#4DFFB5']
      const odds = NAMES.map(() => +(rnd(2.2, 7.5)).toFixed(1))
      root.innerHTML = `
        <div class="g-stage race-stage"><div class="race-track" data-track>${NAMES.map((n, i) => `<div class="race-lane"><span class="lane-no">${i + 1}</span><div class="racer" style="--c:${COLORS[i]}" data-r="${i}"><img src="/static/img/mouse-sports.webp" alt=""><b>${n}</b></div></div>`).join('')}<div class="finish"></div></div><div class="race-status" data-status>选择你的赛鼠</div></div>
        <div class="g-panel">${betBox('race', 100)}<div class="race-pick">${NAMES.map((n, i) => `<button type="button" data-pick="${i}" style="--c:${COLORS[i]}" class="${i === 0 ? 'on' : ''}"><b>${i + 1}</b>${n}<small>${odds[i]}x</small></button>`).join('')}</div><button class="g-btn g-btn-gold" data-go>开赛 <i class="fa-solid fa-flag-checkered"></i></button>${fairTag()}</div>`
      const getBet = wireBet(root); let pick = 0
      $$('[data-pick]', root).forEach(b => b.addEventListener('click', () => { pick = +b.dataset.pick; $$('[data-pick]', root).forEach(x => x.classList.toggle('on', x === b)) }))
      const go = $('[data-go]', root), status = $('[data-status]', root)
      go.addEventListener('click', async () => {
        const bet = getBet(); if (!api.bet(bet)) return
        go.disabled = true; status.textContent = '3…'; await sleep(500); status.textContent = '2…'; await sleep(500); status.textContent = '1… GO!'; await sleep(400)
        const racers = $$('.racer', root), pos = NAMES.map(() => 0), speed = NAMES.map((_, i) => rnd(.7, 1.1) * (1 / Math.sqrt(odds[i])) * 2.1)
        let winner = -1, t0 = performance.now()
        await new Promise(res => { const tick = () => { let done = false; racers.forEach((r, i) => { pos[i] += speed[i] * rnd(.5, 1.5); r.style.left = Math.min(92, pos[i]) + '%'; r.classList.add('run'); if (pos[i] >= 92 && winner < 0) { winner = i } if (pos[i] >= 92) done = true }); if (!done || winner < 0) requestAnimationFrame(tick); else res() }; requestAnimationFrame(tick) })
        racers.forEach((r, i) => { r.classList.remove('run'); r.classList.toggle('win', i === winner) })
        status.innerHTML = `🏁 <b style="color:${COLORS[winner]}">${winner + 1} 号 ${NAMES[winner]}</b> 夺冠!`
        if (winner === pick) api.win(bet * odds[winner], odds[winner] + ''); else api.lose()
        await sleep(2000); racers.forEach(r => { r.style.left = '0'; r.classList.remove('win') }); go.disabled = false; status.textContent = '下一场 3 分钟后 · 演示可立即开赛'
      })
    },
  }

  /* ============ FOOTBALL 1X2 ============ */
  G.match = {
    title: '足球竞猜',
    mount(root, api) {
      const TEAMS = [['曼城', '皇马'], ['拜仁', '巴黎'], ['阿森纳', '国米'], ['巴萨', '利物浦']]
      const [h, a] = TEAMS[ri(0, 3)], o = { home: +(rnd(1.7, 2.8)).toFixed(2), draw: +(rnd(3.1, 3.9)).toFixed(2), away: +(rnd(2.2, 4.2)).toFixed(2) }
      root.innerHTML = `
        <div class="g-stage match-stage"><div class="match-board"><div class="team"><i class="fa-solid fa-shield"></i><b>${h}</b></div><div class="score"><b data-score>0 : 0</b><span data-clock>未开始</span></div><div class="team"><i class="fa-solid fa-shield"></i><b>${a}</b></div></div><div class="match-feed" data-feed></div></div>
        <div class="g-panel">${betBox('match', 100)}<div class="match-pick"><button type="button" class="on" data-pick="home">主胜<small>${o.home}</small></button><button type="button" data-pick="draw">平<small>${o.draw}</small></button><button type="button" data-pick="away">客胜<small>${o.away}</small></button></div><button class="g-btn g-btn-gold" data-go>下注并快进 90 分钟 <i class="fa-solid fa-forward"></i></button>${fairTag()}</div>`
      const getBet = wireBet(root); let pick = 'home'
      $$('[data-pick]', root).forEach(b => b.addEventListener('click', () => { pick = b.dataset.pick; $$('[data-pick]', root).forEach(x => x.classList.toggle('on', x === b)) }))
      const go = $('[data-go]', root), score = $('[data-score]', root), clock = $('[data-clock]', root), feed = $('[data-feed]', root)
      go.addEventListener('click', async () => {
        const bet = getBet(); if (!api.bet(bet)) return
        go.disabled = true; feed.innerHTML = ''; let hs = 0, as = 0
        const pH = 1 / o.home, pA = 1 / o.away
        for (let m = 1; m <= 90; m += 3) {
          clock.textContent = `${m}'`; await sleep(80)
          if (Math.random() < .045) { if (Math.random() < pH / (pH + pA)) hs++; else as++; score.textContent = `${hs} : ${as}`; score.classList.add('pop'); setTimeout(() => score.classList.remove('pop'), 400); feed.insertAdjacentHTML('afterbegin', `<div>⚽ ${m}' ${hs > as || (hs === as && Math.random() < .5) ? h : a} 进球! ${hs}:${as}</div>`) }
        }
        clock.textContent = '完场'
        const res = hs > as ? 'home' : hs < as ? 'away' : 'draw'
        if (res === pick) api.win(bet * o[pick], o[pick] + ''); else api.lose()
        go.disabled = false
      })
    },
  }

  /* ============ RPS 1v1 ============ */
  G.rps = {
    title: '1v1 猜拳对赌',
    mount(root, api) {
      const H = { rock: '✊', paper: '✋', scissors: '✌️' }
      root.innerHTML = `
        <div class="g-stage rps-stage"><div class="rps-side you"><img src="/static/img/mascot-head.webp" alt=""><b>你</b><span data-you>?</span></div><div class="rps-vs"><b data-rounds>0 : 0</b><small>三局两胜</small></div><div class="rps-side foe"><img src="/static/img/mouse-arena.webp" alt=""><b>拳王鼠</b><span data-foe>?</span></div></div>
        <div class="g-panel">${betBox('rps', 100)}<div class="rps-pick"><button type="button" data-h="rock">✊</button><button type="button" data-h="paper">✋</button><button type="button" data-h="scissors">✌️</button></div><div class="g-hint">P2P 对局:平台只抽 3% 水,赢家拿走对手的注</div></div>`
      const getBet = wireBet(root); let you = 0, foe = 0, bet = 0, inRound = false
      const reset = () => { you = foe = 0; $('[data-rounds]', root).textContent = '0 : 0' }
      $$('[data-h]', root).forEach(b => b.addEventListener('click', async () => {
        if (inRound) return
        if (you === 0 && foe === 0) { bet = getBet(); if (!api.bet(bet)) return }
        inRound = true
        const f = ['rock', 'paper', 'scissors'][ri(0, 2)], y = b.dataset.h
        $('[data-you]', root).textContent = '✊'; $('[data-foe]', root).textContent = '✊'; root.classList.add('pump'); await sleep(700); root.classList.remove('pump')
        $('[data-you]', root).textContent = H[y]; $('[data-foe]', root).textContent = H[f]
        const w = (y === f) ? 0 : ((y === 'rock' && f === 'scissors') || (y === 'paper' && f === 'rock') || (y === 'scissors' && f === 'paper')) ? 1 : -1
        if (w > 0) you++; if (w < 0) foe++
        $('[data-rounds]', root).textContent = `${you} : ${foe}`
        await sleep(600)
        if (you === 2) { api.win(bet * 1.94, '1.94'); reset() } else if (foe === 2) { api.lose(); toast('拳王鼠赢了这局', 'warn'); reset() }
        inRound = false
      }))
    },
  }

  /* ============ TRIVIA ============ */
  G.trivia = {
    title: 'Trivia 直播答题',
    mount(root, api) {
      const QS = [['JYC Verse 一共有多少个星域?', ['10', '12', '16', '24'], 1], ['Crash 游戏中玩家要在什么之前兑现?', ['倒计时结束', '火箭爆炸', '别人兑现', '倍数到 2x'], 1], ['MEGA JACKPOT 每笔投注抽取多少注入?', ['0.1%', '0.5%', '1%', '5%'], 1], ['Provably Fair 通常使用哪种机制?', ['人工审核', 'commit-reveal', '抽签', '投票'], 1], ['JYC Verse 部署在哪条链上?', ['以太坊', 'Solana', 'BSC', 'TON'], 2], ['下列哪个是 FORTUNE 星域的玩法?', ['Plinko', '塔罗牌', '滚球', '扫雷'], 1]]
      root.innerHTML = `
        <div class="g-stage trivia-stage"><div class="trivia-live"><i></i> LIVE · <b data-players>${fmt(ri(1200, 4800))}</b> 人在线 · 奖池 <b data-pool>${fmt(ri(30000, 90000))}</b> JYC</div><div class="trivia-q" data-q>点击「入场」开始答题</div><div class="trivia-timer"><div data-bar></div></div><div class="trivia-opts" data-opts></div></div>
        <div class="g-panel">${betBox('trivia', 50, { chips: [20, 50, 100, 200] })}<button class="g-btn g-btn-gold" data-go>入场 · 3 题连对分池</button></div>`
      const getBet = wireBet(root), go = $('[data-go]', root), qEl = $('[data-q]', root), opts = $('[data-opts]', root), bar = $('[data-bar]', root)
      go.addEventListener('click', async () => {
        const bet = getBet(); if (!api.bet(bet)) return
        go.disabled = true
        const qs = [...QS].sort(() => Math.random() - .5).slice(0, 3); let correct = 0
        for (const [q, os, ans] of qs) {
          qEl.textContent = q; opts.innerHTML = os.map((o, i) => `<button type="button" data-i="${i}">${o}</button>`).join('')
          bar.style.transition = 'none'; bar.style.width = '100%'; await sleep(30); bar.style.transition = 'width 10s linear'; bar.style.width = '0%'
          const picked = await new Promise(res => { const t = setTimeout(() => res(-1), 10000); $$('button', opts).forEach(b => b.onclick = () => { clearTimeout(t); res(+b.dataset.i) }) })
          $$('button', opts).forEach((b, i) => { b.classList.toggle('ok', i === ans); b.classList.toggle('bad', i === picked && picked !== ans); b.disabled = true })
          if (picked === ans) correct++; await sleep(900)
          if (picked !== ans) break
        }
        if (correct === 3) { api.win(bet * 4.5, '4.5'); qEl.textContent = '🎉 三题全对!奖池分成到账' } else { api.lose(); qEl.textContent = `答对 ${correct} 题 · 被淘汰` }
        bar.style.width = '0'; go.disabled = false
      })
    },
  }

  /* ============ GACHA ============ */
  G.gacha = {
    title: '命运卡抽卡',
    mount(root, api) {
      const R = [['N', .55, '#9AA5B8', 0.4], ['R', .28, '#38A8FF', 1], ['SR', .12, '#A855FF', 3], ['SSR', .045, '#FFC531', 12], ['UR', .005, '#FF4FB8', 60]]
      const MICE = ['predict', 'arcade', 'lottery', 'fortune', 'sports', 'arena', 'cards', 'live', 'city', 'earn', 'ai', 'open']
      root.innerHTML = `
        <div class="g-stage gacha-stage"><div class="gacha-pack" data-pack><img class="gp-back" src="/static/img/props/cardback.webp" alt=""><img class="gp-mouse" src="/static/img/mouse-cards.webp" alt=""><span>命运卡包</span></div><div class="gacha-cards" data-cards></div></div>
        <div class="g-panel"><div class="g-field"><label>卡包价格</label><b>100 JYC / 包</b></div><button class="g-btn g-btn-gold" data-go="1">开 1 包</button><button class="g-btn g-btn-cash" data-go="5">开 5 包 (500)</button><div class="g-hint">概率公示:N 55% · R 28% · SR 12% · SSR 4.5% · UR 0.5% · 卡牌可在全生态生效(手续费折扣 / 彩票加倍 / 分红加成)</div></div>`
      const cards = $('[data-cards]', root), pack = $('[data-pack]', root)
      const roll = () => { const r = Math.random(); let acc = 0; for (const t of R) { acc += t[1]; if (r < acc) return t } return R[0] }
      $$('[data-go]', root).forEach(b => b.addEventListener('click', async () => {
        const n = +b.dataset.go; if (!api.bet(100 * n)) return
        $$('[data-go]', root).forEach(x => x.disabled = true); cards.innerHTML = ''; pack.classList.add('open'); await sleep(600)
        let total = 0
        for (let i = 0; i < n; i++) {
          const [tier, , col, val] = roll(), m = MICE[ri(0, 11)]; total += val * 100
          cards.insertAdjacentHTML('beforeend', `<div class="gcard ${tier.toLowerCase()}" style="--c:${col};--d:${i * .12}s"><div class="gcard-in"><img src="/static/img/mouse-${m}.webp" alt=""><b>${tier}</b><small>${m.toUpperCase()} 守护鼠</small></div></div>`)
          await sleep(160)
          if (tier === 'SSR' || tier === 'UR') api.confetti(root, 60, [col, '#fff'])
        }
        await sleep(400); pack.classList.remove('open')
        if (total > 0) api.win(total, null); toast(`本次卡牌估值 ${fmt(total)} JYC`, total >= 100 * n ? 'ok' : 'warn')
        $$('[data-go]', root).forEach(x => x.disabled = false)
      }))
    },
  }

  function hongbaoRain(root) { if (api_reduced()) return; const box = document.createElement('div'); box.className = 'hb-rain'; root.appendChild(box); for (let i = 0; i < 18; i++) { const h = document.createElement('img'); h.src = '/static/img/props/hongbao.webp'; h.style.cssText = `left:${rnd(2, 95)}%;animation-delay:${rnd(0, .8)}s;animation-duration:${rnd(1.4, 2.4)}s;--r:${rnd(-200, 200)}deg`; box.appendChild(h) } setTimeout(() => box.remove(), 3500) }
  const api_reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches
  /* ============ LIVE ROOM ============ */
  G.liveroom = {
    title: '主播竞猜房',
    mount(root, api) {
      const NAMES = ['小明爱冲', 'Crypto猫', '夜猫子', 'Lucky7', '阿伦', 'JYC老铁', '梭哈王', '稳健哥']
      const MSGS = ['跟了跟了', '主播开大!', '这局稳', '红包雨来了', '押小押小', '上一局赢了 3 倍', '冲啊', '6666', '我押大', 'JYC 到底!']
      root.innerHTML = `
        <div class="g-stage live-stage"><div class="live-video"><img src="/static/img/mouse-live.webp" alt=""><div class="live-badge"><i></i>LIVE</div><div class="live-viewers"><i class="fa-solid fa-eye"></i> <b data-viewers>${fmt(ri(2000, 9000))}</b></div><div class="live-host">麦克鼠 · 正在开盘:<b>下一局骰宝 大 / 小</b></div><div class="live-pool"><span>大 <b data-big>${fmt(ri(20000, 60000))}</b></span><span>小 <b data-small>${fmt(ri(20000, 60000))}</b></span></div></div><div class="live-chat" data-chat></div></div>
        <div class="g-panel">${betBox('live', 100)}<div class="live-pick"><button type="button" class="on" data-pick="big">跟主播押大</button><button type="button" data-pick="small">押小</button></div><button class="g-btn g-btn-gold" data-go>下注 · 主播分成 5%</button></div>`
      const getBet = wireBet(root), chat = $('[data-chat]', root); let pick = 'big'
      $$('[data-pick]', root).forEach(b => b.addEventListener('click', () => { pick = b.dataset.pick; $$('[data-pick]', root).forEach(x => x.classList.toggle('on', x === b)) }))
      const addMsg = (n, m, cls = '') => { chat.insertAdjacentHTML('beforeend', `<div class="${cls}"><b>${n}</b>${m}</div>`); chat.scrollTop = chat.scrollHeight; if (chat.children.length > 40) chat.firstChild.remove() }
      const ticker = setInterval(() => { addMsg(NAMES[ri(0, 7)], MSGS[ri(0, 9)]); $('[data-big]', root).textContent = fmt(+$('[data-big]', root).textContent.replace(/,/g, '') + ri(50, 900)); $('[data-viewers]', root).textContent = fmt(+$('[data-viewers]', root).textContent.replace(/,/g, '') + ri(-20, 40)) }, 900)
      $('[data-go]', root).addEventListener('click', async () => {
        const bet = getBet(); if (!api.bet(bet)) return
        addMsg('你', `押${pick === 'big' ? '大' : '小'} ${fmt(bet)} JYC`, 'me')
        await sleep(800); addMsg('麦克鼠', '开!', 'host')
        const d = [ri(1, 6), ri(1, 6), ri(1, 6)], s = d.reduce((a, b) => a + b), big = s >= 11
        await sleep(600); addMsg('系统', `🎲 ${d.join(' + ')} = ${s} · ${big ? '大' : '小'}`, 'sys')
        if ((pick === 'big') === big) { api.win(bet * 1.9, '1.9'); if (Math.random() < .5) { addMsg('麦克鼠', '🧧 红包雨!', 'host'); hongbaoRain(root) } } else api.lose()
      })
      root.addEventListener('DOMNodeRemoved', () => clearInterval(ticker), { once: true })
    },
  }

  /* ============ PLAYER AS BANKER ============ */
  G.banker = {
    title: '玩家做庄',
    mount(root, api) {
      root.innerHTML = `
        <div class="g-stage banker-stage"><div class="banker-table" data-table><img src="/static/img/mouse-city.webp" alt=""><div class="bt-title">你的赌桌 · <b data-name>—</b></div><div class="bt-stats"><div><small>流水</small><b data-vol>0</b></div><div><small>庄家收益</small><b data-pnl>0</b></div><div><small>在座玩家</small><b data-seats>0</b></div></div><div class="bt-feed" data-feed></div></div></div>
        <div class="g-panel"><div class="g-field"><label>牌照</label><select data-lic><option value="1000">百家乐桌 · 1,000 JYC</option><option value="3000">轮盘桌 · 3,000 JYC</option><option value="800">龙虎桌 · 800 JYC</option></select></div><button class="g-btn g-btn-gold" data-go>购买牌照并开桌 <i class="fa-solid fa-store"></i></button><button class="g-btn g-btn-cash" data-close disabled>收桌结算</button><div class="g-hint">庄家优势 ≈ 1.2%–2.7%,盈亏自负。演示以 20 秒模拟一个营业日。</div></div>`
      const go = $('[data-go]', root), close = $('[data-close]', root), feed = $('[data-feed]', root)
      let timer, vol = 0, pnl = 0, lic = 0, running = false
      const NM = ['Lucky7', '阿伦', 'Crypto猫', '夜猫子', '梭哈王', '稳健哥']
      go.addEventListener('click', () => {
        lic = +$('[data-lic]', root).value; if (!api.bet(lic)) return
        $('[data-name]', root).textContent = $('[data-lic] option:checked', root).textContent.split(' ·')[0]
        vol = 0; pnl = 0; running = true; go.disabled = true; close.disabled = false; feed.innerHTML = ''; root.classList.add('open')
        timer = setInterval(() => {
          const b = ri(20, 800); vol += b; const won = Math.random() < .515; pnl += won ? b : -b * .97
          $('[data-vol]', root).textContent = fmt(vol); $('[data-pnl]', root).textContent = (pnl >= 0 ? '+' : '') + fmt(Math.round(pnl)); $('[data-pnl]', root).className = pnl >= 0 ? 'up' : 'down'; $('[data-seats]', root).textContent = ri(3, 8)
          feed.insertAdjacentHTML('afterbegin', `<div>${NM[ri(0, 5)]} 下注 ${b} · ${won ? '<em class="w">庄赢</em>' : '<em class="l">庄输</em>'}</div>`); if (feed.children.length > 8) feed.lastChild.remove()
        }, 350)
        setTimeout(() => close.click(), 20000)
      })
      close.addEventListener('click', () => { if (!running) return; running = false; clearInterval(timer); go.disabled = false; close.disabled = true; root.classList.remove('open'); const back = lic + pnl; if (back > 0) api.win(back, null); toast(`收桌:牌照退还 ${fmt(lic)} + 庄家盈亏 ${pnl >= 0 ? '+' : ''}${fmt(Math.round(pnl))}`, pnl >= 0 ? 'ok' : 'warn') })
    },
  }

  /* ============ STAKING ============ */
  G.stake = {
    title: 'Staking 分红模拟',
    mount(root, api) {
      root.innerHTML = `
        <div class="g-stage stake-stage"><div class="stake-vault"><img src="/static/img/mouse-earn.webp" alt=""><div class="sv-num"><small>已质押</small><b data-staked>0</b></div><div class="sv-num"><small>累计分红</small><b data-earned class="up">0.0000</b></div><div class="sv-flow" data-flow></div></div><div class="stake-src"><span>ARCADE 手续费</span><span>LOTTERY 抽水</span><span>SPORTS 抽水</span><span>PREDICT 手续费</span><span>CARDS 交易税</span></div></div>
        <div class="g-panel">${betBox('stake', 1000, { chips: [500, 1000, 5000, 10000] })}<div class="g-field"><label>锁仓期</label><select data-lock><option value="1">灵活 · 1.0x</option><option value="1.5">30 天 · 1.5x</option><option value="2.5">180 天 · 2.5x</option></select></div><button class="g-btn g-btn-gold" data-go>质押 <i class="fa-solid fa-vault"></i></button><button class="g-btn g-btn-cash" data-out disabled>赎回 + 领取</button><div class="g-hint">演示速率放大 5 万倍,以便观察分红按秒流入。真实场景中收入来自 12 星域全部玩法。</div></div>`
      const getBet = wireBet(root), go = $('[data-go]', root), out = $('[data-out]', root), flow = $('[data-flow]', root)
      let staked = 0, earned = 0, timer
      go.addEventListener('click', () => {
        const amt = getBet(); if (!api.bet(amt)) return
        const mult = +$('[data-lock]', root).value; staked += amt; $('[data-staked]', root).textContent = fmt(staked)
        go.disabled = true; out.disabled = false; root.classList.add('on')
        timer = setInterval(() => { const inc = staked * 0.00018 * mult * rnd(.6, 1.4); earned += inc; $('[data-earned]', root).textContent = earned.toFixed(4); const s = document.createElement('i'); s.style.left = rnd(10, 90) + '%'; flow.appendChild(s); setTimeout(() => s.remove(), 1500) }, 180)
      })
      out.addEventListener('click', () => { clearInterval(timer); api.win(staked + earned, null); toast(`赎回 ${fmt(staked)} + 分红 ${earned.toFixed(2)} JYC`, 'ok'); staked = 0; earned = 0; $('[data-staked]', root).textContent = '0'; $('[data-earned]', root).textContent = '0.0000'; go.disabled = false; out.disabled = true; root.classList.remove('on') })
    },
  }

  /* ============ AI RECOMMENDER ============ */
  G.airec = {
    title: 'AI 推荐官',
    mount(root, api) {
      const MOODS = [['😤', '想搏一把'], ['😌', '佛系放松'], ['🧠', '想动脑'], ['🎉', '想热闹'], ['💰', '想稳赚']]
      const REC = { 0: [['Crash 火箭', '/play/crash', '肾上腺素拉满,爆炸前兑现'], ['MEGA JACKPOT', '/play/jackpot', '一注改变人生']], 1: [['每日运势', '/play/fortune', '先看看今天手气'], ['刮刮乐', '/play/scratch', '慢慢刮,不着急']], 2: [['预测市场', '/play/predict', '用认知赚钱'], ['Mines 扫雷', '/play/mines', '每一步都算概率']], 3: [['主播竞猜房', '/play/liveroom', '跟几千人一起押'], ['Trivia 答题', '/play/trivia', '全场同答分池']], 4: [['Staking 分红', '/play/stake', '睡觉也在赚'], ['玩家做庄', '/play/banker', '庄家优势归你']] }
      root.innerHTML = `
        <div class="g-stage ai-stage"><div class="ai-brain"><img src="/static/img/mouse-ai.webp" alt=""><div class="ai-ring"></div></div><div class="ai-chat" data-chat><div class="ai-msg">你好,我是智脑鼠 Neo。告诉我你现在的心情和预算,我来推荐今天该玩什么。</div></div></div>
        <div class="g-panel"><div class="ai-moods">${MOODS.map((m, i) => `<button type="button" data-m="${i}" class="${i === 0 ? 'on' : ''}">${m[0]}<small>${m[1]}</small></button>`).join('')}</div><div class="g-field"><label>预算</label><input type="range" min="100" max="10000" step="100" value="1000" data-budget /><b data-bv>1,000</b></div><button class="g-btn g-btn-gold" data-go>让 AI 推荐 <i class="fa-solid fa-wand-magic-sparkles"></i></button></div>`
      let mood = 0; $$('[data-m]', root).forEach(b => b.addEventListener('click', () => { mood = +b.dataset.m; $$('[data-m]', root).forEach(x => x.classList.toggle('on', x === b)) }))
      const bud = $('[data-budget]', root); bud.addEventListener('input', () => $('[data-bv]', root).textContent = fmt(bud.value))
      const chat = $('[data-chat]', root)
      $('[data-go]', root).addEventListener('click', async () => {
        chat.insertAdjacentHTML('beforeend', `<div class="ai-msg me">${MOODS[mood][0]} ${MOODS[mood][1]} · 预算 ${fmt(bud.value)} JYC</div>`)
        const think = document.createElement('div'); think.className = 'ai-msg think'; think.innerHTML = '<i></i><i></i><i></i>'; chat.appendChild(think); chat.scrollTop = 1e6; root.classList.add('thinking')
        await sleep(1400); think.remove(); root.classList.remove('thinking')
        const r = REC[mood], per = Math.round(bud.value / 10)
        chat.insertAdjacentHTML('beforeend', `<div class="ai-msg">根据你的画像(${MOODS[mood][1]}型 · 近 7 日偏好 ${['ARCADE', 'FORTUNE', 'PREDICT', 'LIVE', 'EARN'][mood]}),我推荐:<div class="ai-recs">${r.map(x => `<a href="${x[1]}"><b>${x[0]}</b><span>${x[2]}</span><small>建议单注 ${fmt(per)} JYC</small></a>`).join('')}</div>另外,你的 SSR 卡「${['先知', '火箭', '福星'][ri(0, 2)]}鼠」今天可享 20% 手续费折扣。</div>`)
        chat.scrollTop = 1e6
      })
    },
  }

  /* ============ JYC PAY ============ */
  G.pay = {
    title: 'JYC Pay 扫码支付',
    mount(root, api) {
      const ITEMS = [['星际咖啡 · 拿铁', 38], ['鼠王限量手办', 880], ['机票折扣券', 1200], ['Steam 礼品卡 $50', 420]]
      root.innerHTML = `
        <div class="g-stage pay-stage"><div class="pay-phone"><div class="pay-screen" data-screen><div class="pay-merchant"><img src="/static/img/mouse-open.webp" alt=""><b>JYC 联盟商户</b></div><div class="pay-qr"><div class="qr" aria-hidden="true">${Array.from({ length: 121 }, () => `<i class="${Math.random() < .5 ? 'on' : ''}"></i>`).join('')}<img src="/static/img/mascot-head.webp" alt=""></div><span>扫码支付</span></div><div class="pay-steps" data-steps><span class="on">1 扫码</span><span>2 确认</span><span>3 链上到账</span></div></div></div></div>
        <div class="g-panel"><div class="pay-items">${ITEMS.map((it, i) => `<button type="button" data-i="${i}" class="${i === 0 ? 'on' : ''}"><b>${it[0]}</b><small>${fmt(it[1])} JYC</small></button>`).join('')}</div><button class="g-btn g-btn-gold" data-go>确认支付 <i class="fa-solid fa-qrcode"></i></button><div class="g-hint">JYC Pay:任何商户都可以收 JYC。支付即消耗,0.5% 进入 MEGA JACKPOT。</div></div>`
      let sel = 0; $$('[data-i]', root).forEach(b => b.addEventListener('click', () => { sel = +b.dataset.i; $$('[data-i]', root).forEach(x => x.classList.toggle('on', x === b)) }))
      const steps = $$('[data-steps] span', root), screen = $('[data-screen]', root)
      $('[data-go]', root).addEventListener('click', async () => {
        const [name, price] = ITEMS[sel]; if (!api.bet(price)) return
        screen.classList.add('scan'); steps.forEach((s, i) => s.classList.toggle('on', i === 0)); await sleep(900)
        steps.forEach((s, i) => s.classList.toggle('on', i <= 1)); screen.classList.replace('scan', 'confirm'); await sleep(900)
        steps.forEach((s, i) => s.classList.toggle('on', i <= 2)); screen.classList.replace('confirm', 'done')
        screen.insertAdjacentHTML('beforeend', `<div class="pay-done"><i class="fa-solid fa-circle-check"></i><b>支付成功</b><span>${name}</span><small>tx: 0x${Math.random().toString(16).slice(2, 10)}…${Math.random().toString(16).slice(2, 6)}</small></div>`)
        api.coinBurst(root, 12); await sleep(2200); $('.pay-done', root)?.remove(); screen.classList.remove('done')
      })
    },
  }

  /* ============ MEGA JACKPOT viewer ============ */
  G.jackpot = {
    title: 'MEGA JACKPOT',
    mount(root, api) {
      root.innerHTML = `
        <div class="g-stage jackpot-stage"><div class="jp-visual"><img class="jp-chest" src="/static/img/props/chest.webp" alt=""><img class="jp-mouse" src="/static/img/mouse-lottery.webp" alt=""></div><div class="jp-label">MEGA JACKPOT · 全生态滚存</div><div class="jp-num"><b data-jackpot>—</b><span>JYC</span></div><div class="jp-feed" data-feed></div></div>
        <div class="g-panel">${betBox('jp', 100)}<button class="g-btn g-btn-gold" data-go>随机玩一局 · 尝试触发大奖</button><div class="g-hint">每一笔投注抽 0.5% 注入奖池;每一局(任何星域)都有极小概率触发全额奖池。演示中触发概率放大为 1/40。</div>${fairTag()}</div>`
      const getBet = wireBet(root), feed = $('[data-feed]', root)
      const NM = ['Lucky7', '阿伦', 'Crypto猫', '夜猫子', '梭哈王', '稳健哥', '小明爱冲']
      const GM = ['Crash', 'Dice', '快开彩', '百家乐', '赛鼠', '塔罗对赌']
      setInterval(() => { feed.insertAdjacentHTML('afterbegin', `<div>${NM[ri(0, 6)]} 在 ${GM[ri(0, 5)]} 投注 ${fmt(ri(50, 5000))} → 注入 <b>+${(ri(50, 5000) * .005).toFixed(2)}</b></div>`); if (feed.children.length > 6) feed.lastChild.remove() }, 1300)
      $('[data-go]', root).addEventListener('click', async () => {
        const bet = getBet(); if (!api.bet(bet)) return
        root.classList.add('spin'); await sleep(1200); root.classList.remove('spin')
        if (Math.random() < 1 / 40) { const jp = +$('[data-jackpot]', root).textContent.replace(/,/g, ''); api.win(jp, 'JACKPOT'); api.confetti(root, 160); feed.insertAdjacentHTML('afterbegin', `<div class="hit">🎉 你 触发 MEGA JACKPOT!赢得 ${fmt(jp)} JYC</div>`) }
        else if (Math.random() < .45) api.win(bet * 1.9, '1.9'); else api.lose()
      })
    },
  }

  window.JYCMount?.()
})()
