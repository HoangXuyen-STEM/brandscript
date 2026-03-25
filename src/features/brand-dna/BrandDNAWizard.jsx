import { useEffect, useState } from 'react'
import MoodSelector from './MoodSelector.jsx'
import ColorPicker from './ColorPicker.jsx'
import AccentSuggester from './AccentSuggester.jsx'
import { moods } from './moods.js'

const STORAGE_KEY = 'bs_brand_dna'
const ALGO_VERSION = '0.6.0'

const DNA_STEPS = [
  { id: 8, title: 'Chọn tâm trạng thương hiệu', emoji: '🎭' },
  { id: 9, title: 'Chọn màu chủ đạo', emoji: '🎨' },
  { id: 10, title: 'Chọn màu accent', emoji: '✨' },
]

function loadState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function saveState(state) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
    brand_mood: state.brand_mood,
    brand_color: state.brand_color,
    accent_color: state.accent_color,
    brand_dna_algo_version: ALGO_VERSION,
  }))
}

function BrandDNAWizard({ onComplete, onBack }) {
  const saved = loadState()
  const [step, setStep] = useState(0)
  const [brandMood, setBrandMood] = useState(saved?.brand_mood || '')
  const [brandColor, setBrandColor] = useState(saved?.brand_color || '#8B5E3C')
  const [accentColor, setAccentColor] = useState(saved?.accent_color || '#2563EB')

  const selectedMood = moods.find((m) => m.id === brandMood)

  // Persist state on every change
  useEffect(() => {
    if (brandMood) {
      saveState({ brand_mood: brandMood, brand_color: brandColor, accent_color: accentColor })
    }
  }, [brandMood, brandColor, accentColor])

  function handleMoodChange(mood) {
    setBrandMood(mood.id)
    // Auto-set brand color to first preset of the mood
    if (!savedHasColor()) {
      setBrandColor(mood.presetColors[0])
    }
  }

  function savedHasColor() {
    return saved?.brand_color && saved.brand_mood === brandMood
  }

  function canAdvance() {
    if (step === 0) return !!brandMood
    if (step === 1) return !!brandColor
    if (step === 2) return !!accentColor
    return false
  }

  function handleNext() {
    if (step < 2) {
      setStep(step + 1)
    } else {
      // Complete — pass canonical state (not generated tokens)
      onComplete({
        brand_mood: brandMood,
        brand_color: brandColor,
        accent_color: accentColor,
        brand_dna_algo_version: ALGO_VERSION,
      })
    }
  }

  function handlePrev() {
    if (step > 0) setStep(step - 1)
  }

  const currentDnaStep = DNA_STEPS[step]
  const presetColors = selectedMood?.presetColors || moods[0].presetColors

  return (
    <section className="brand-dna-wizard fade-in">
      <header className="card brand-dna-header">
        <span className="badge-brand">Brand DNA</span>
        <h1 className="brand-dna-title">
          {currentDnaStep.emoji} Bước {currentDnaStep.id}: {currentDnaStep.title}
        </h1>
        <p className="brand-dna-subtitle">
          Bước {step + 1} / {DNA_STEPS.length} — Chọn xong để tạo Design Tokens cho thương hiệu.
        </p>
      </header>

      {/* Step chips */}
      <div className="brand-dna-chips">
        {DNA_STEPS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className={`brand-dna-chip${i === step ? ' brand-dna-chip-active' : ''}${i < step ? ' brand-dna-chip-done' : ''}`}
            onClick={() => i <= step && setStep(i)}
            disabled={i > step}
          >
            <span className="brand-dna-chip-num">{s.emoji}</span>
            <span className="brand-dna-chip-text">{s.title}</span>
          </button>
        ))}
      </div>

      {/* Step content */}
      <div className="card brand-dna-content">
        {step === 0 && (
          <MoodSelector value={brandMood} onChange={handleMoodChange} />
        )}

        {step === 1 && (
          <ColorPicker
            label="Màu chủ đạo (Brand Color)"
            presetColors={presetColors}
            value={brandColor}
            onChange={setBrandColor}
          />
        )}

        {step === 2 && (
          <AccentSuggester
            brandColor={brandColor}
            value={accentColor}
            onChange={setAccentColor}
          />
        )}
      </div>

      {/* Navigation */}
      <div className="brand-dna-nav">
        {step > 0 ? (
          <button type="button" className="wizard-button wizard-button-secondary" onClick={handlePrev}>
            ← Quay lại
          </button>
        ) : onBack ? (
          <button type="button" className="wizard-button wizard-button-secondary" onClick={onBack}>
            ← Về kết quả BrandScript
          </button>
        ) : (
          <span />
        )}

        <button
          type="button"
          className="wizard-button wizard-button-primary"
          disabled={!canAdvance()}
          onClick={handleNext}
        >
          {step < 2 ? 'Tiếp tục →' : '🎨 Xem Brand DNA'}
        </button>
      </div>
    </section>
  )
}

export default BrandDNAWizard
