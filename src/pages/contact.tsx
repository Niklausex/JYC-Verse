import { totalPlays, foundation } from '../data'
import { Page, PageHero, Mascot } from '../components'

export const ContactPage = () => (
  <Page path="/contact">
    <PageHero kicker="INVESTOR RELATIONS" crumbs={[['投资人咨询']]}
      title={<>加入 JYC Verse,投资下一个<span class="grad-gold">万亿级娱乐宇宙</span></>}
      sub="欢迎投资机构、战略合作伙伴、游戏开发商与内容创作者与我们联系。" />
    <section class="sec" id="contact">
      <div class="contact-grid">
        <div class="contact-cards reveal">
          {[
            ['fa-envelope', '投资人邮箱', 'invest@qpred.io', 'mailto:invest@qpred.io'],
            ['fa-file-lines', '白皮书', 'wp.qpred.com', 'https://wp.qpred.com/'],
            ['fa-globe', 'QuantumPredict 官网', 'www.qpred.io', 'https://www.qpred.io'],
            ['fa-mobile-screen', '产品 App', 'm.qpred.io', 'https://m.qpred.io/'],
          ].map(([ic, t, v, href]) => (
            <a class="ccard glass" href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener">
              <i class={`fa-solid ${ic}`}></i>
              <div><small>{t}</small><b>{v}</b></div>
              <i class="fa-solid fa-arrow-up-right-from-square ccard-ext"></i>
            </a>
          ))}
        </div>
        <div class="contact-summary glass reveal">
          <div class="kicker">AT A GLANCE</div>
          <h2>JYC Verse 一页纸</h2>
          <dl>
            <div><dt>定位</dt><dd>全球首个覆盖全部博彩人格的一站式 Web3 娱乐宇宙</dd></div>
            <div><dt>代币</dt><dd>JYC(BSC)—— 全生态唯一结算货币</dd></div>
            <div><dt>规模</dt><dd>12 大星域 · {totalPlays}+ 玩法 · 7 语种</dd></div>
            <div><dt>起点</dt><dd>QuantumPredict 预测市场,{foundation[0].v} TVL · {foundation[1].v} 用户</dd></div>
            <div><dt>路线</dt><dd>12 个月点亮全部星域(2026 Q4 – 2027 Q3)</dd></div>
            <div><dt>价值捕获</dt><dd>手续费 / 抽水 → 质押分红 + 回购销毁 + MEGA JACKPOT</dd></div>
          </dl>
          <div class="hero-cta">
            <a class="btn btn-gold" href="mailto:invest@qpred.io?subject=JYC%20Verse%20投资咨询">发送邮件 <i class="fa-solid fa-paper-plane"></i></a>
            <a class="btn btn-ghost" href="/vision">重读愿景</a>
          </div>
          <div class="contact-mascot" aria-hidden="true"><Mascot /></div>
        </div>
      </div>
    </section>
  </Page>
)
