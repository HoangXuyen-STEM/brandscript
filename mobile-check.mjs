import WebSocket from 'ws'

const URL = 'https://brandscript.xuyenlab.com'

const DEVICES = [
  { name: 'iphone', width: 390, height: 844, ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1' },
  { name: 'android', width: 412, height: 915, ua: 'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Mobile Safari/537.36' },
]

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)) }

async function connectPageWs() {
  const tabs = await fetch('http://127.0.0.1:9222/json/list').then((r) => r.json())
  const ws = new WebSocket(tabs[0].webSocketDebuggerUrl)
  await new Promise((resolve, reject) => {
    ws.on('open', resolve)
    ws.on('error', reject)
  })

  let id = 0
  const pending = new Map()
  ws.on('message', (data) => {
    const msg = JSON.parse(data)
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg)
      pending.delete(msg.id)
    }
  })

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const reqId = ++id
      pending.set(reqId, resolve)
      ws.send(JSON.stringify({ id: reqId, method, params }))
      setTimeout(() => {
        pending.delete(reqId)
        reject(new Error(`timeout: ${method}`))
      }, 20000)
    })
  }

  async function ev(expression) {
    const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
    return r.result?.result?.value
  }

  return { ws, send, ev }
}

async function run() {
  const { ws, send, ev } = await connectPageWs()
  await send('Page.enable')
  await send('Runtime.enable')
  await send('Network.enable')

  const results = []

  for (const d of DEVICES) {
    await send('Network.setUserAgentOverride', { userAgent: d.ua })
    await send('Emulation.setDeviceMetricsOverride', {
      width: d.width,
      height: d.height,
      deviceScaleFactor: 2,
      mobile: true,
    })
    await send('Page.navigate', { url: URL })
    await sleep(2500)

    const data = await ev(`JSON.stringify({
      hasHero: !!document.querySelector('.landing-hero'),
      hasStartButton: !![...document.querySelectorAll('button')].find(b => b.textContent.includes('Bắt đầu')),
      noHorizontalOverflow: document.documentElement.scrollWidth <= window.innerWidth + 1
    })`)

    results.push({ device: d.name, ...JSON.parse(data) })
  }

  console.log(JSON.stringify(results))
  ws.close()
}

run().catch((e) => {
  console.error(e.message)
  process.exit(1)
})
