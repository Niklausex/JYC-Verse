import { jsxRenderer, useRequestContext } from 'hono/jsx-renderer'

declare module 'hono' {
  interface ContextRenderer {
    (content: string | Promise<string>, props?: { title?: string; desc?: string; path?: string }): Response
  }
}

const SITE = 'JYC Verse'

export const renderer = jsxRenderer(({ children, title, desc }) => {
  const fullTitle = title ? `${title} · ${SITE}` : `${SITE} · One Token. Every Thrill. — 全球最大的 Web3 娱乐宇宙`
  const c = useRequestContext()
  const url = new URL(c.req.url)
  const canonical = `https://jyc.xnebul.com${url.pathname === '/' ? '/' : url.pathname.replace(/\/$/, '')}`
  const description = desc ?? 'JYC Verse:全球首个覆盖全部玩家类型的一站式 Web3 娱乐宇宙。预测、竞猜、赌场、彩票、玄学、竞技、卡牌、直播、元宇宙——12 大星域、160+ 玩法,一枚代币贯通全生态:JYC。'
  return (
    <html lang="zh-CN">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{fullTitle}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="JYC Verse" />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content="https://jyc.xnebul.com/static/img/og.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="zh_CN" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="https://jyc.xnebul.com/static/img/og.jpg" />
        <link rel="canonical" href={canonical} />
        <meta name="theme-color" content="#0E0720" />
        <link rel="icon" href="/static/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito:wght@600;700;800;900&family=JetBrains+Mono:wght@400;500;700&family=Noto+Sans+SC:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="preload" as="font" type="font/woff2" crossorigin href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.2/webfonts/fa-solid-900.woff2" />
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.2/css/all.min.css" rel="stylesheet" />
        <link rel="preload" as="image" href="/static/img/hero-key.jpg" />
        <link href="/static/style.css?v=10" rel="stylesheet" />
        <link href="/static/games.css?v=9" rel="stylesheet" />
      </head>
      <body>
        {children}
        <button class="to-top" id="to-top" type="button" aria-label="回到顶部" title="回到顶部">
          <i class="fas fa-arrow-up"></i>
        </button>
        <script src="/static/vendor/gsap.min.js" defer></script>
        <script src="/static/vendor/ScrollTrigger.min.js" defer></script>
        <script src="/static/app.js?v=10" defer></script>
        <script src="/static/games.js?v=9" defer></script>
        <script src="/static/games2.js?v=9" defer></script>
        <script src="/static/games3.js?v=9" defer></script>
      </body>
    </html>
  )
})
