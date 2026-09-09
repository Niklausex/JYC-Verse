/* Sandbox-only front proxy.
 * wrangler pages dev crashes (EPIPE / "Network connection lost") when browsers abort
 * in-flight video requests. This tiny zero-dep server serves /static/* straight from
 * ./public (with HTTP Range support for iOS Safari) and proxies everything else to
 * wrangler on UPSTREAM_PORT. Not used in production (Cloudflare Pages serves static natively).
 */
const http = require('http'), fs = require('fs'), path = require('path')
const PORT = +(process.env.PORT || 3000), UP = +(process.env.UPSTREAM_PORT || 3100)
const ROOT = path.join(__dirname, 'public')
const MIME = { '.mp4': 'video/mp4', '.webm': 'video/webm', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.gif': 'image/gif', '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.woff2': 'font/woff2', '.woff': 'font/woff', '.txt': 'text/plain; charset=utf-8', '.map': 'application/json' }

function serveStatic(req, res, urlPath) {
  const rel = decodeURIComponent(urlPath.split('?')[0])
  const file = path.normalize(path.join(ROOT, rel))
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end() }
  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) { res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('Not found') }
    const type = MIME[path.extname(file).toLowerCase()] || 'application/octet-stream'
    const headers = { 'Content-Type': type, 'Accept-Ranges': 'bytes', 'Cache-Control': 'public, max-age=3600', 'Last-Modified': st.mtime.toUTCString() }
    if (req.headers['if-modified-since'] && new Date(req.headers['if-modified-since']) >= new Date(st.mtime.toUTCString())) { res.writeHead(304, headers); return res.end() }
    let start = 0, end = st.size - 1, status = 200
    const range = req.headers.range
    if (range) {
      const m = /bytes=(\d*)-(\d*)/.exec(range)
      if (m) {
        if (m[1]) start = parseInt(m[1], 10)
        if (m[2]) end = parseInt(m[2], 10)
        if (!m[1] && m[2]) { start = Math.max(0, st.size - parseInt(m[2], 10)); end = st.size - 1 }
        end = Math.min(end, st.size - 1)
        if (start > end || start >= st.size) { res.writeHead(416, { 'Content-Range': `bytes */${st.size}` }); return res.end() }
        status = 206; headers['Content-Range'] = `bytes ${start}-${end}/${st.size}`
      }
    }
    headers['Content-Length'] = end - start + 1
    res.writeHead(status, headers)
    if (req.method === 'HEAD') return res.end()
    const stream = fs.createReadStream(file, { start, end })
    stream.on('error', () => res.destroy())
    res.on('close', () => stream.destroy())
    stream.pipe(res)
  })
}

function proxy(req, res) {
  const opts = { host: '127.0.0.1', port: UP, method: req.method, path: req.url, headers: { ...req.headers, host: `localhost:${UP}` } }
  const up = http.request(opts, (ur) => { res.writeHead(ur.statusCode, ur.headers); ur.pipe(res) })
  up.on('error', (e) => { if (!res.headersSent) res.writeHead(502, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(`<h1>502</h1><p>upstream (wrangler) not ready: ${e.code}</p><script>setTimeout(()=>location.reload(),1500)</script>`) })
  req.on('aborted', () => up.destroy())
  req.pipe(up)
}

http.createServer((req, res) => {
  if (req.url.startsWith('/static/')) return serveStatic(req, res, req.url)
  proxy(req, res)
}).on('clientError', (err, socket) => { try { socket.destroy() } catch {} })
  .listen(PORT, '0.0.0.0', () => console.log(`[dev-proxy] :${PORT} → static ./public, proxy → :${UP}`))
process.on('uncaughtException', (e) => console.error('[dev-proxy] uncaught', e.code || e.message))
