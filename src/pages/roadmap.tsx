import { realms, roadmap, foundation } from '../data'
import { Page, PageHero, SectionHead, CtaBand } from '../components'

const Track = () => (
  <section class="sec" id="track">
    <div class="rm-track reveal">
      <div class="rm-line"><span id="rm-progress"></span></div>
      {roadmap.map((m, i) => (
        <article class="rm-stage" style={`--c:${m.color};--d:${i * 0.15}s`}>
          <div class="rm-node"><span>{i + 1}</span></div>
          <div class="rm-q">{m.q}</div>
          <h3>{m.title}</h3>
          <div class="rm-realms">
            {m.realms.map(id => { const r = realms.find(x => x.id === id)!; return <a href={`/realms/${r.id}`} style={`--c:${r.color}`} title={r.code}><i class={`fa-solid ${r.icon}`}></i>{r.code}</a> })}
          </div>
        </article>
      ))}
    </div>
  </section>
)

const Detail = () => (
  <section class="sec" id="milestones">
    <SectionHead kicker="MILESTONES" title={<>四个季度,<span class="grad-gold">逐项落地</span></>} />
    <div class="ms-list">
      {roadmap.map((m, i) => (
        <article class="ms glass reveal" style={`--c:${m.color};--d:${i * 0.08}s`}>
          <div class="ms-side">
            <span class="ms-idx">0{i + 1}</span>
            <div class="ms-q">{m.q}</div>
            <h3>{m.title}</h3>
            <div class="rm-realms">
              {m.realms.map(id => { const r = realms.find(x => x.id === id)!; return <a href={`/realms/${r.id}`} style={`--c:${r.color}`}><i class={`fa-solid ${r.icon}`}></i>{r.code}</a> })}
            </div>
          </div>
          <ul class="ms-items">
            {m.items.map(it => <li><i class="fa-solid fa-circle-check"></i>{it}</li>)}
          </ul>
        </article>
      ))}
    </div>
  </section>
)

const Lit = () => {
  // 每个星域在哪个季度点亮
  const stageOf = (id: string) => roadmap.findIndex(m => m.realms.includes(id))
  return (
    <section class="sec" id="lit">
      <SectionHead kicker="LIGHTING UP" title={<>星域<span class="grad-cyan">点亮时间表</span></>} sub="从 3 个星域到 12 个星域全部点亮。" />
      <div class="lit-grid reveal">
        {realms.map(r => {
          const s = stageOf(r.id)
          return (
            <a class="lit" href={`/realms/${r.id}`} style={`--c:${r.color};--sc:${roadmap[s]?.color ?? '#fff'}`}>
              <span class="lit-planet"><i class={`fa-solid ${r.icon}`}></i></span>
              <b>{r.name}</b>
              <small>{roadmap[s]?.q} · {roadmap[s]?.title}</small>
              <div class="lit-bar">{roadmap.map((_, i) => <i class={i <= s ? 'on' : ''}></i>)}</div>
            </a>
          )
        })}
      </div>
    </section>
  )
}

const Now = () => (
  <section class="sec sec-foundation" id="now">
    <SectionHead kicker="WHERE WE ARE" title={<>起点:<span class="grad-gold">QuantumPredict</span></>}
      sub="路线图不是从零开始。QuantumPredict 已在 BSC 上稳定运营,Staking、Buyback、Affiliate、7 语种已就位。" />
    <div class="found-grid reveal">
      {foundation.map(f => <div class="found"><b class="count" data-count={f.v}>{f.v}</b><span>{f.l}</span></div>)}
    </div>
  </section>
)

export const RoadmapPage = () => (
  <Page path="/roadmap">
    <PageHero kicker="ROADMAP · 12 MONTHS" crumbs={[['路线图']]}
      title={<>一年,<span class="grad-cyan">点亮十二星域</span></>}
      sub="2026 Q4 奠基 → 2027 Q1 扩张 → 2027 Q2 社交 → 2027 Q3 宇宙。四个季度,从 3 个星域到 12 个星域全部点亮。" />
    <Track />
    <Detail />
    <Lit />
    <Now />
    <CtaBand title={<>加入 JYC Verse,投资下一个<span class="grad-gold">万亿级娱乐宇宙</span></>} sub="欢迎投资机构与战略合作伙伴联系我们。"
      secondary={['回到首页', '/']} />
  </Page>
)
