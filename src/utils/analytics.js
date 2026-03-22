const DEFAULT_UMAMI_SRC = 'https://umami.xuyenlab.com/script.js'

function getUmamiConfig() {
  return {
    websiteId: import.meta.env.VITE_UMAMI_WEBSITE_ID || '',
    scriptSrc: import.meta.env.VITE_UMAMI_SRC || DEFAULT_UMAMI_SRC,
    domains: import.meta.env.VITE_UMAMI_DOMAINS || '',
  }
}

export function initUmami() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false

  const { websiteId, scriptSrc, domains } = getUmamiConfig()
  if (!websiteId) return false

  const existing = document.querySelector('script[data-umami-script="true"]')
  if (existing) return true

  const script = document.createElement('script')
  script.defer = true
  script.src = scriptSrc
  script.dataset.websiteId = websiteId
  script.dataset.umamiScript = 'true'
  if (domains) {
    script.dataset.domains = domains
  }

  document.head.appendChild(script)
  return true
}

export function trackEvent(eventName, eventData = undefined) {
  if (typeof window === 'undefined') return
  if (!window.umami || typeof window.umami.track !== 'function') return

  if (eventData && Object.keys(eventData).length > 0) {
    window.umami.track(eventName, eventData)
    return
  }

  window.umami.track(eventName)
}
