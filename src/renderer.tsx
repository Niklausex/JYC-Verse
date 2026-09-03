import { jsxRenderer } from 'hono/jsx-renderer'

declare module 'hono' {
  interface ContextRenderer {
    (content: string | Promise<string>, props?: { title?: string; desc?: string; path?: string }): Response
  }
}

const SITE = 'JYC Verse'

export const renderer = jsxRenderer(({ children, title, desc }) => {
  const fullTitle = title ? `${title} · ${SITE}` : `${SITE} · One Token. Every Thrill. — 全球最大的 Web3 娱乐宇宙`
  const description = desc ?? 'JYC Verse:全球首个覆盖全部博彩人格的一站式 Web3 娱乐宇宙。预测、竞猜、赌场、彩票、玄学、竞技、卡牌、直播、元宇宙——12 大星域、160+ 玩法,只用一枚筹码:JYC。'
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
        <meta name="theme-color" content="#05060F" />
        <link rel="icon" href="/static/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500;600;700;800;900&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500;700&family=Noto+Sans+SC:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.2/css/all.min.css" rel="stylesheet" />
        <link href="/static/style.css?v=2" rel="stylesheet" />
      </head>
      <body>
        {children}
        <script src="/static/app.js?v=2" defer></script>
      </body>
    </html>
  )
})
