import { useEffect, useMemo, useState } from 'react'
import BrandScriptResult from './components/BrandScriptResult.jsx'
import Landing from './components/Landing.jsx'
import Wizard, { STORAGE_KEY } from './components/Wizard.jsx'
import exampleXuyen from './data/example-xuyen.js'
import steps from './data/steps.js'
import { initUmami, trackEvent } from './utils/analytics.js'

const ROUTES = {
  LANDING: 'landing',
  WIZARD: 'wizard',
  RESULT: 'result',
}

function buildEmptyFormData() {
  return steps.reduce((accumulator, step) => {
    step.fields.forEach((field) => {
      accumulator[field.key] = ''
    })
    return accumulator
  }, {})
}

function readDraftFormData() {
  const empty = buildEmptyFormData()

  try {
    const rawDraft = window.localStorage.getItem(STORAGE_KEY)
    if (!rawDraft) return null

    const parsed = JSON.parse(rawDraft)
    return {
      ...empty,
      ...(parsed.formData || {}),
    }
  } catch {
    return null
  }
}

function writeDraft(formData, stepIndex = 0) {
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      currentStepIndex: stepIndex,
      formData,
    }),
  )
}

function App() {
  const [route, setRoute] = useState(ROUTES.LANDING)
  const [resultData, setResultData] = useState(null)

  const activeResultData = useMemo(() => resultData || readDraftFormData(), [resultData, route])

  useEffect(() => {
    initUmami()
  }, [])

  useEffect(() => {
    trackEvent('route_view', { route })
  }, [route])

  function handleStart() {
    writeDraft(buildEmptyFormData(), 0)
    setResultData(null)
    setRoute(ROUTES.WIZARD)
    trackEvent('landing_start_clicked')
  }

  function handleLoadExample() {
    writeDraft(exampleXuyen, 0)
    setResultData(exampleXuyen)
    setRoute(ROUTES.WIZARD)
    trackEvent('landing_example_clicked')
  }

  function handleWizardComplete(formData) {
    setResultData(formData)
    setRoute(ROUTES.RESULT)
    trackEvent('wizard_completed')
  }

  function handleEdit() {
    setRoute(ROUTES.WIZARD)
    trackEvent('result_edit_clicked')
  }

  function handleReset() {
    window.localStorage.removeItem(STORAGE_KEY)
    setResultData(null)
    setRoute(ROUTES.LANDING)
    trackEvent('result_reset_clicked')
  }

  let pageContent = null

  if (route === ROUTES.LANDING) {
    pageContent = <Landing onStart={handleStart} onLoadExample={handleLoadExample} />
  }

  if (route === ROUTES.WIZARD) {
    pageContent = <Wizard onComplete={handleWizardComplete} />
  }

  if (route === ROUTES.RESULT) {
    pageContent = activeResultData ? (
      <BrandScriptResult data={activeResultData} onEdit={handleEdit} onReset={handleReset} />
    ) : (
      <section className="card fade-in result-empty">
        <p className="card-label">BrandScript</p>
        <h1 className="card-title">Chưa có dữ liệu để hiển thị kết quả</h1>
        <p className="card-body">Hãy điền wizard trước, sau đó quay lại màn hình kết quả.</p>
        <div className="landing-actions">
          <button type="button" className="wizard-button wizard-button-primary" onClick={() => setRoute(ROUTES.WIZARD)}>
            Vào Wizard
          </button>
          <button type="button" className="wizard-button wizard-button-secondary" onClick={handleStart}>
            Bắt đầu lại
          </button>
        </div>
      </section>
    )
  }

  return (
    <main className="app-shell">
      <div className="app-orb app-orb-warm" aria-hidden="true" />
      <div className="app-orb app-orb-cool" aria-hidden="true" />

      <div className="app-container">
        {pageContent}
      </div>
    </main>
  )
}

export default App
