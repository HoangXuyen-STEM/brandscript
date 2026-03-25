import WebSocket from 'ws'

const URL = 'https://brandscript.xuyenlab.com'

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)) }

async function main() {
  const list = await fetch('http://127.0.0.1:9222/json/list').then((r) => r.json())
  const ws = new WebSocket(list[0].webSocketDebuggerUrl)
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
      }, 30000)
    })
  }

  async function ev(expr) {
    const res = await send('Runtime.evaluate', {
      expression: expr,
      awaitPromise: true,
      returnByValue: true,
    })
    return res.result?.result?.value
  }

  await send('Page.enable')
  await send('Page.navigate', { url: URL })
  await sleep(3000)

  // Enter flow: landing -> example -> step7 -> result
  await ev("(() => { const b=[...document.querySelectorAll('button')].find(x=>x.textContent.includes('ví dụ')); if(b) b.click(); return true })()")
  await sleep(1000)
  await ev("(() => { const chip=document.querySelectorAll('.step-chip')[6]; if(chip) chip.click(); return true })()")
  await sleep(500)
  await ev("(() => { const b=[...document.querySelectorAll('button')].find(x=>x.textContent.includes('Xem BrandScript')); if(b) b.click(); return true })()")
  await sleep(1000)

  // Open PDF gate and submit VIP
  await ev("(() => { const b=[...document.querySelectorAll('button')].find(x=>x.textContent.includes('Tải PDF')); if(b) b.click(); return true })()")
  await sleep(500)
  await ev("(() => { const i=document.querySelector('.gate-input'); if(!i) return false; const set=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set; set.call(i,'XUYENLAB-VIP'); i.dispatchEvent(new Event('input',{bubbles:true})); return true })()")
  await sleep(200)
  await ev("(() => { const b=[...document.querySelectorAll('.gate-modal button')].find(x=>x.textContent.includes('Xác nhận')); if(b) b.click(); return true })()")
  await sleep(7000)

  const result = await ev("JSON.stringify({status:document.querySelector('.export-status')?.textContent||'', modal:!!document.querySelector('.gate-overlay')})")
  console.log(result)

  ws.close()
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
