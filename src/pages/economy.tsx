import { realms, totalPlays, utilities } from '../data'
import { Page, PageHero, SectionHead, CtaBand } from '../components'

const Flywheel = () => (
  <section class="sec" id="flywheel-sec">
    <div class="economy">
      <div class="flywheel reveal" id="flywheel">
        <div class="fw-ring"></div>
        <div class="fw-center"><span>JYC</span><small>飞轮</small></div>
        {[
          ['fa-gamepad', `${totalPlays}+ 玩法`, '消耗 JYC'],
          ['fa-sack-dollar', '生态收入池', '手续费 · 抽水 · 庄优'],
          ['fa-hand-holding-dollar', '质押分红', '持币者获利'],
          ['fa-fire', '回购销毁', 'JYC 更稀缺'],
          ['fa-gem', 'MEGA JACKPOT', '拉新弹药'],
          ['fa-users', '用户量 ↑', '持币动机 ↑'],
        ].map(([ic, t, d], i) => (
          <div class="fw-node" style={`--i:${i}`}>
            <i class={`fa-solid ${ic}`}></i><b>{t}</b><small>{d}</small>
          </div>
        ))}
      </div>
      <div class="eco-side reveal">
        <div class="kicker">THE FLYWHEEL</div>
        <h2 class="sec-title">玩法越多,<span class="grad-gold">JYC 越值钱</span></h2>
        <p class="sec-sub">每一个星域都是 JYC 的消耗场景。手续费、抽水、庄家优势汇入统一的生态收入池——一部分分红给质押者,一部分回购销毁,一部分注入 MEGA JACKPOT 拉新。用户越多,消耗越多;消耗越多,分红与销毁越多;持币动机越强,用户越多。</p>
        <div class="eco-quotes">
          <p><i class="fa-solid fa-quote-left"></i> 每一笔投注,都在为持币者分红</p>
          <p><i class="fa-solid fa-quote-left"></i> 每一次抽水,都在为 JYC 销毁</p>
          <p><i class="fa-solid fa-quote-left"></i> 每一个新玩法,都是 JYC 的新消耗</p>
        </div>
      </div>
    </div>
  </section>
)

const Utilities = () => (
  <section class="sec" id="utilities">
    <SectionHead kicker="8 UTILITIES" title={<>JYC 的 <span class="grad-cyan">8 重效用</span></>}
      sub="JYC 不只是筹码。它同时是分红凭证、VIP 门票、资产计价单位、做庄资格、治理权与支付货币。" />
    <div class="util-grid big">
      {utilities.map((u, i) => (
        <div class="util glass reveal" style={`--d:${(i % 4) * 0.07}s`}>
          <span class="util-no">0{i + 1}</span>
          <i class={`fa-solid ${u.icon}`}></i><b>{u.name}</b><span>{u.desc}</span>
        </div>
      ))}
    </div>
  </section>
)

const Revenue = () => (
  <section class="sec" id="revenue">
    <SectionHead kicker="REVENUE SOURCES" title={<>12 个星域,<span class="grad-gold">12 条收入管道</span></>}
      sub="每个星域的商业模式不同,但终点相同——全部汇入生态收入池。" />
    <div class="rev-table reveal">
      <div class="rev-head"><span>星域</span><span>主要收入来源</span><span>JYC 消耗强度</span></div>
      {[
        ['predict', '市场手续费 · UGC 开盘分成 · 串关抽水', 4],
        ['arcade', '每局 House Edge · 老虎机抽水 · 锦标赛门票', 5],
        ['lottery', '彩票销售 · 奖池抽成 · 刮刮乐', 5],
        ['fortune', 'AI 算命付费 · 海报 · 命运挑战抽水', 3],
        ['sports', '滚球投注抽水 · 串关 · 虚拟体育', 4],
        ['arena', '对战桌抽水 (Rake) · 锦标赛报名费', 4],
        ['cards', '卡包销售 · 交易市场手续费 · 合成费', 3],
        ['live', '真人荷官 House Edge · 主播房分成 · 打赏', 4],
        ['city', '地产销售 · 租金 · 赌桌牌照 · 庄家分成', 4],
        ['earn', 'Bankroll 管理费 · 复活险保费', 2],
        ['ai', 'AI 服务订阅 · 高级预测助手', 2],
        ['open', 'JYC Pay 手续费 · SDK 接入 · 白标授权', 3],
      ].map(([id, src, lv]) => {
        const r = realms.find(x => x.id === id)!
        return (
          <a class="rev-row" href={`/realms/${r.id}`} style={`--c:${r.color}`}>
            <span class="rev-realm"><i class={`fa-solid ${r.icon}`}></i>{r.name}<small>{r.code}</small></span>
            <span class="rev-src">{src}</span>
            <span class="rev-lv">{[1, 2, 3, 4, 5].map(n => <i class={n <= (lv as number) ? 'on' : ''}></i>)}</span>
          </a>
        )
      })}
    </div>
  </section>
)

const Distribution = () => (
  <section class="sec" id="distribution">
    <SectionHead kicker="VALUE DISTRIBUTION" title={<>收入池<span class="grad-cyan">去向</span></>}
      sub="生态收入池按固定比例自动分配,全部链上可查。具体比例将由 DAO 治理动态调整。" />
    <div class="dist-grid">
      {[
        ['fa-hand-holding-dollar', '质押分红', '分给 JYC 质押者,持币即分享全生态收入', '#F5C24B'],
        ['fa-fire', '回购销毁', '从二级市场回购 JYC 并永久销毁,持续减少流通', '#FF4FA3'],
        ['fa-gem', 'MEGA JACKPOT', '注入全生态大奖池,滚存大奖是最强传播弹药', '#9D5CFF'],
        ['fa-seedling', '生态基金', '扶持第三方开发者、公会、主播与市场推广', '#38E8FF'],
      ].map(([ic, t, d, c], i) => (
        <article class="dist glass reveal" style={`--c:${c};--d:${i * 0.08}s`}>
          <i class={`fa-solid ${ic}`}></i><h3>{t}</h3><p>{d}</p>
        </article>
      ))}
    </div>
  </section>
)

export const EconomyPage = () => (
  <Page path="/economy">
    <PageHero kicker="JYC TOKENOMICS" crumbs={[['JYC 经济']]}
      title={<>一枚代币,<span class="grad-gold">{totalPlays}+ 个消耗场景</span></>}
      sub="JYC 是 JYC Verse 唯一的结算货币。每一笔投注、每一次抽水、每一个新玩法,都在为持币者创造价值。" />
    <Flywheel />
    <Utilities />
    <Revenue />
    <Distribution />
    <CtaBand title={<>把 12 个星域织成一张网的,是<span class="grad-cyan">平台层</span></>} sub="统一账户、VIP、任务、排行榜、公会、MEGA JACKPOT。"
      primary={['查看平台架构', '/platform']} secondary={['路线图', '/roadmap']} />
  </Page>
)
