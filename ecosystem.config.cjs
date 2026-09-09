// Sandbox dev topology:
//   :3000  dev-proxy.cjs  → serves /static/* (video/img, Range-capable) directly from ./public
//                          → proxies pages/API to wrangler on :3100
//   :3100  wrangler pages dev dist
// Reason: wrangler's dev proxy crashes on aborted media streams (EPIPE / "Network connection lost").
// Production (Cloudflare Pages) needs none of this — static assets are served natively.
module.exports = {
  apps: [
    {
      name: 'webapp',
      script: 'npx',
      args: 'wrangler pages dev dist --ip 127.0.0.1 --port 3100',
      env: { NODE_ENV: 'development', PORT: 3100 },
      watch: false, instances: 1, exec_mode: 'fork',
      max_restarts: 50, restart_delay: 500
    },
    {
      name: 'webapp-proxy',
      script: './dev-proxy.cjs',
      env: { PORT: 3000, UPSTREAM_PORT: 3100 },
      watch: false, instances: 1, exec_mode: 'fork'
    }
  ]
}
