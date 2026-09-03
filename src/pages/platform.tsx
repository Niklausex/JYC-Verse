import { realms, systems, trust } from '../data'
import { Page, PageHero, SectionHead, CtaBand } from '../components'

const Layers = () => (
  <section class="sec" id="layers">
    <SectionHead kicker="ARCHITECTURE" title={<>四层架构,<span class="grad-cyan">一个宇宙</span></>}
      sub="12 个星域不是 12 个孤立的 App。它们共享同一个身份层、同一套横向系统、同一枚代币。" />
    <div class="layers reveal">
      {[
        ['L4 · 星域层', '12 大星域 · 164+ 玩法', realms.map(r => r.code), '#FF4FA3'],
        ['L3 · 系统层', '横向系统', systems.map(s => s.name), '#9D5CFF'],
        ['L2 · 账户层', '统一身份', ['统一账户', 'JYC 钱包', 'VIP 等级', 'KYC 分级', '社交关系', '推荐关系'], '#38E8FF'],
        ['L1 · 链上层', 'BSC + 跨链', ['JYC 代币', 'Provably Fair', '链上开奖', '质押合约', '回购销毁', '跨链桥'], '#F5C24B'],
      ].map(([t, s, items, c]) => (
        <div class="layer glass" style={`--c:${c}`}>
          <div class="layer-head"><b>{t}</b><span>{s}</span></div>
          <div class="layer-items">{(items as string[]).map(x => <span>{x}</span>)}</div>
        </div>
      ))}
    </div>
  </section>
)

const Systems = () => (
  <section class="sec" id="systems">
    <SectionHead kicker="9 CROSS-REALM SYSTEMS" title={<>一个身份,<span class="grad-cyan">九大横向系统</span></>}
      sub="它们把 12 个星域织成一张网:在任何星域的行为,都会在全生态累积等级、任务、排行与分红。" />
    <div class="sys-grid">
      {systems.map((s, i) => (
        <article class="sys glass reveal" style={`--d:${(i % 3) * 0.08}s`}>
          <span class="sys-no">0{i + 1}</span>
          <i class={`fa-solid ${s.icon}`}></i>
          <h3>{s.name}</h3><p>{s.desc}</p>
        </article>
      ))}
    </div>
  </section>
)

const Jackpot = () => (
  <section class="sec" id="jackpot">
    <div class="jackpot glass reveal">
      <div class="jackpot-text">
        <div class="kicker">MEGA JACKPOT</div>
        <h2 class="sec-title">全生态<span class="grad-gold">共享大奖池</span></h2>
        <p class="sec-sub">所有星域每笔投注抽 0.5% 注入。无论你在玩 Crash、买彩票、抽塔罗还是下注欧冠——任何一局都可能触发。滚存大奖是 JYC Verse 最强的传播弹药。</p>
        <ul class="check-list">
          <li><i class="fa-solid fa-check"></i>跨星域触发,任何玩法都有机会</li>
          <li><i class="fa-solid fa-check"></i>链上滚存,实时可见,不可篡改</li>
          <li><i class="fa-solid fa-check"></i>开奖即全网推送,自然裂变</li>
        </ul>
      </div>
      <div class="jackpot-visual">
        <div class="jackpot-num"><small>示意 · 累积奖池</small><b class="count" data-count="8,642,190">8,642,190</b><span>JYC</span></div>
        <div class="jackpot-feed">
          {realms.slice(0, 5).map(r => <span style={`--c:${r.color}`}><img src={r.planetImg} alt="" loading="lazy" style="width:16px;height:16px;object-fit:contain" />{r.code} +0.5%</span>)}
        </div>
      </div>
    </div>
  </section>
)

const Trust = () => (
  <section class="sec" id="trust">
    <SectionHead kicker="TRUST & COMPLIANCE" title={<>一切<span class="grad-gold">可验证</span></>}
      sub="Web3 娱乐平台的信任底线:不是相信我们,而是自己验证。" />
    <div class="trust-grid four">
      {trust.map((t, i) => (
        <article class="glass tcard reveal" style={`--d:${i * 0.08}s`}>
          <i class={`fa-solid ${t.icon}`}></i><h3>{t.name}</h3><p>{t.desc}</p>
        </article>
      ))}
    </div>
  </section>
)

const Global = () => (
  <section class="sec" id="global">
    <SectionHead kicker="GLOBAL" title={<>7 语种,<span class="grad-cyan">本地化玄学与内容</span></>}
      sub="已覆盖东亚与东南亚,内容与玄学矩阵按地区本地化。" />
    <div class="global-wrap">
      <figure class="global-pic reveal"><img src="/static/img/globe.jpg" alt="全球化地图" loading="lazy" /></figure>
    <div class="lang-grid reveal">
      {[
        ['简体中文', '八字 · 关帝灵签 · 麻将 · 斗地主'],
        ['English', 'Tarot · Astrology · Poker · Sports'],
        ['日本語', '御神签 · 星座 · 麻雀'],
        ['한국어', '四柱 · 塔罗 · 电竞'],
        ['Bahasa Melayu', 'Sports · Lottery · Slots'],
        ['ภาษาไทย', '佛牌 · 泰彩 · 泰拳竞猜'],
        ['Tiếng Việt', '越南占卜 · 彩票 · 足球'],
      ].map(([l, d]) => <div class="lang glass"><b>{l}</b><span>{d}</span></div>)}
    </div>
    </div>
  </section>
)

export const PlatformPage = () => (
  <Page path="/platform">
    <PageHero kicker="PLATFORM" crumbs={[['平台架构']]}
      title={<>一个身份,<span class="grad-cyan">一个宇宙</span></>}
      sub="统一账户、九大横向系统、MEGA JACKPOT、可验证公平——把 12 个星域织成一张网,而不是 12 个孤立的 App。" />
    <Layers />
    <Systems />
    <Jackpot />
    <Trust />
    <Global />
    <CtaBand title={<>一年,<span class="grad-cyan">点亮十二星域</span></>} sub="四个季度的落地计划。"
      primary={['查看路线图', '/roadmap']} secondary={['投资人咨询', '/contact']} />
  </Page>
)
