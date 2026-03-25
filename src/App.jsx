import { useEffect, useMemo, useState } from 'react'
import BrandScriptResult from './features/brandscript/BrandScriptResult.jsx'
import BrandDNAWizard from './features/brand-dna/BrandDNAWizard.jsx'
import BrandDNAResult from './features/brand-dna/BrandDNAResult.jsx'
import Landing from './Landing.jsx'
import Wizard, { STORAGE_KEY } from './features/brandscript/Wizard.jsx'
import exampleXuyen from './data/example-xuyen.js'
import steps from './data/steps.js'
import { initUmami, trackEvent } from './shared/analytics.js'

const ROUTES = {
  LANDING: 'landing',
  WIZARD: 'wizard',
  RESULT: 'result',
  BRAND_DNA: 'brand_dna',
  BRAND_DNA_RESULT: 'brand_dna_result',
}

const BRAND_DNA_STORAGE_KEY = 'bs_brand_dna'

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

function readBrandDNAState() {
  try {
    const raw = window.localStorage.getItem(BRAND_DNA_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function App() {
  const [route, setRoute] = useState(ROUTES.LANDING)
  const [resultData, setResultData] = useState(null)
  const [brandDNAData, setBrandDNAData] = useState(readBrandDNAState())

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

  function handleBrandDNA() {
    setRoute(ROUTES.BRAND_DNA)
    trackEvent('brand_dna_started')
  }

  function handleBrandDNAComplete(dnaState) {
    setBrandDNAData(dnaState)
    trackEvent('brand_dna_completed', dnaState)
    setRoute(ROUTES.BRAND_DNA_RESULT)
  }

  function handleBrandDNABack() {
    setRoute(ROUTES.RESULT)
    trackEvent('brand_dna_back_to_result')
  }

  function handleBrandDNAEdit() {
    setRoute(ROUTES.BRAND_DNA)
    trackEvent('brand_dna_edit_clicked')
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
      <BrandScriptResult data={activeResultData} onEdit={handleEdit} onReset={handleReset} onBrandDNA={handleBrandDNA} />
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

  if (route === ROUTES.BRAND_DNA) {
    pageContent = <BrandDNAWizard onComplete={handleBrandDNAComplete} onBack={handleBrandDNABack} />
  }

  if (route === ROUTES.BRAND_DNA_RESULT) {
    pageContent = brandDNAData ? (
      <BrandDNAResult
        businessName={activeResultData?.business_name}
        data={brandDNAData}
        onEdit={handleBrandDNAEdit}
      />
    ) : (
      <section className="card fade-in result-empty">
        <p className="card-label">Brand DNA</p>
        <h1 className="card-title">Chua co du lieu Brand DNA</h1>
        <p className="card-body">Hay hoan thanh cac buoc Brand DNA Wizard truoc khi xem ket qua.</p>
        <div className="landing-actions">
          <button type="button" className="wizard-button wizard-button-primary" onClick={handleBrandDNA}>
            Vao Brand DNA Wizard
          </button>
          <button type="button" className="wizard-button wizard-button-secondary" onClick={() => setRoute(ROUTES.RESULT)}>
            Ve ket qua BrandScript
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
