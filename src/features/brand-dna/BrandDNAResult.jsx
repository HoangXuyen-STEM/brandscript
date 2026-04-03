import { useMemo, useRef, useState } from 'react'
import { trackEvent } from '../../shared/analytics.js'
import { exportBrandDNAPDF } from '../../shared/export/exportBrandDNAPDF.js'
import { generateTokens } from './tintedNeutrals.js'
import { getButtonTextColor } from './tintedNeutrals.js'
import { moods } from './moods.js'

function buildCssVariables(modeTokens) {
  return `:root {
  --color-bg: ${modeTokens.bg};
  --color-surface: ${modeTokens.surface};
  --color-surface-2: ${modeTokens.surface2};
  --color-border: ${modeTokens.border};
  --color-border-strong: ${modeTokens.borderStrong};

  --color-text: ${modeTokens.text};
  --color-text-2: ${modeTokens.text2};
  --color-text-muted: ${modeTokens.textMuted};

  --color-brand: ${modeTokens.brand};
  --color-brand-dark: ${modeTokens.brandDark};
  --color-brand-subtle: ${modeTokens.brandSubtle};

  --color-accent: ${modeTokens.accent};
  --color-accent-subtle: ${modeTokens.accentSubtle};

  --shadow-sm: ${modeTokens.shadowSm};
  --shadow-md: ${modeTokens.shadowMd};
  --shadow-lg: ${modeTokens.shadowLg};
}`
}

function TokenSwatch({ label, value }) {
  return (
    <article className="dna-swatch-item">
      <span className="dna-swatch-color" style={{ backgroundColor: value }} />
      <h4 className="dna-swatch-label">{label}</h4>
      <p className="dna-swatch-value">{value}</p>
    </article>
  )
}

function BrandDNAResult({ businessName, data, onEdit }) {
  const [mode, setMode] = useState('light')
  const [status, setStatus] = useState('')
  const [pdfLoading, setPdfLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const exportRef = useRef(null)

  const mood = moods.find((item) => item.id === data.brand_mood) || moods[0]
  const generated = useMemo(
    () => generateTokens(data.brand_color, data.accent_color, mood),
    [data.brand_color, data.accent_color, mood],
  )

  const tokens = mode === 'light' ? generated.light : generated.dark

  const rootStyle = {
    backgroundColor: tokens.bg,
    color: tokens.text,
    borderColor: tokens.border,
  }

  async function handleCopyCss() {
    try {
      await navigator.clipboard.writeText(buildCssVariables(tokens))
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      setStatus('Khong copy duoc. Vui long thu lai.')
    }
  }

  async function handlePDFClick() {
    setPdfLoading(true)
    setStatus('Dang tao PDF...')

    try {
      const filename = await exportBrandDNAPDF(exportRef.current, businessName)
      setStatus(`Da tai file: ${filename}`)
      trackEvent('brand_dna_pdf_success')
    } catch {
      setStatus('Loi khi tao PDF. Vui long thu lai.')
      trackEvent('brand_dna_pdf_failed')
    } finally {
      setPdfLoading(false)
    }
  }

  const btnText = getButtonTextColor(tokens.brand, tokens.text)

  return (
    <section className="brand-dna-result-shell fade-in" style={rootStyle}>
      <header className="card brand-dna-result-head" style={{ backgroundColor: tokens.surface, borderColor: tokens.border, boxShadow: tokens.shadowMd }}>
        <div>
          <span className="badge-brand" style={{ backgroundColor: tokens.brandSubtle, color: tokens.brand }}>Brand DNA Result</span>
          <h1 className="brand-dna-result-title">Bang token cho {businessName || 'thuong hieu cua ban'}</h1>
          <p className="brand-dna-result-subtitle" style={{ color: tokens.text2 }}>
            Mood: {mood.name} • Brand: {data.brand_color} • Accent: {data.accent_color}
          </p>
        </div>

        <div className="result-actions">
          <button type="button" className="wizard-button wizard-button-secondary" onClick={onEdit}>
            Chinh sua
          </button>
          <button
            type="button"
            className="wizard-button"
            style={{ backgroundColor: tokens.brand, color: btnText, borderColor: 'transparent' }}
            onClick={handlePDFClick}
            disabled={pdfLoading}
          >
            {pdfLoading ? 'Dang tao PDF...' : 'Tai PDF'}
          </button>
        </div>
      </header>

      {generated.warnings.length > 0 && (
        <div
          className="brand-dna-warning"
          style={{
            backgroundColor: tokens.accentSubtle,
            borderColor: tokens.border,
            color: tokens.text2,
          }}
        >
          <strong style={{ color: tokens.text }}>Canh bao:</strong> ⚠️ Mot so mau chua dat chuan WCAG AA. Hay chon mau dam hon.
          <ul className="brand-dna-warning-list">
            {generated.warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </div>
      )}

      <div ref={exportRef} className="brand-dna-export-root" style={{ backgroundColor: tokens.bg, color: tokens.text }}>
        <section className="card" style={{ backgroundColor: tokens.surface, borderColor: tokens.border, boxShadow: tokens.shadowSm }}>
          <div className="brand-dna-section-head">
            <h2 className="card-title" style={{ color: tokens.text }}>Palette</h2>
            <div className="brand-dna-mode-toggle">
              <button
                type="button"
                className={`wizard-button wizard-button-secondary${mode === 'light' ? ' brand-dna-mode-active' : ''}`}
                onClick={() => setMode('light')}
              >
                Light
              </button>
              <button
                type="button"
                className={`wizard-button wizard-button-secondary${mode === 'dark' ? ' brand-dna-mode-active' : ''}`}
                onClick={() => setMode('dark')}
              >
                Dark
              </button>
            </div>
          </div>

          <div className="dna-swatch-grid">
            <TokenSwatch label="bg" value={tokens.bg} />
            <TokenSwatch label="surface" value={tokens.surface} />
            <TokenSwatch label="surface2" value={tokens.surface2} />
            <TokenSwatch label="border" value={tokens.border} />
            <TokenSwatch label="text" value={tokens.text} />
            <TokenSwatch label="text2" value={tokens.text2} />
            <TokenSwatch label="textMuted" value={tokens.textMuted} />
            <TokenSwatch label="brand" value={tokens.brand} />
            <TokenSwatch label="accent" value={tokens.accent} />
          </div>
        </section>

        <section className="card" style={{ backgroundColor: tokens.surface, borderColor: tokens.border, boxShadow: tokens.shadowSm }}>
          <h2 className="card-title" style={{ color: tokens.text }}>Typography</h2>
          <div className="dna-type-preview">
            <h1 style={{ color: tokens.text }}>H1 - Tieu de chinh thuong hieu</h1>
            <h2 style={{ color: tokens.text }}>H2 - Tieu de section</h2>
            <p style={{ color: tokens.text2 }}>Body - Dong mo ta giup nguoi dung hieu ro gia tri thuong hieu va thong diep ban muon truyen tai.</p>
            <p style={{ color: tokens.text, fontWeight: 700 }}>Label - Nhan thong tin quan trong</p>
            <p style={{ color: tokens.textMuted, fontStyle: 'italic' }}>Hint - Goi y nho de toi uu noi dung</p>
          </div>
        </section>

        <section className="card" style={{ backgroundColor: tokens.surface, borderColor: tokens.border, boxShadow: tokens.shadowSm }}>
          <h2 className="card-title" style={{ color: tokens.text }}>Shadow Preview</h2>
          <div className="dna-shadow-grid">
            <div className="dna-shadow-card" style={{ backgroundColor: tokens.surface2, borderColor: tokens.border, boxShadow: tokens.shadowSm }}>
              shadow-sm
            </div>
            <div className="dna-shadow-card" style={{ backgroundColor: tokens.surface2, borderColor: tokens.border, boxShadow: tokens.shadowMd }}>
              shadow-md
            </div>
            <div className="dna-shadow-card" style={{ backgroundColor: tokens.surface2, borderColor: tokens.border, boxShadow: tokens.shadowLg }}>
              shadow-lg
            </div>
          </div>
        </section>

        <section className="card" style={{ backgroundColor: tokens.surface, borderColor: tokens.border, boxShadow: tokens.shadowSm }}>
          <h2 className="card-title" style={{ color: tokens.text }}>Card Preview</h2>
          <article className="dna-card-preview" style={{ backgroundColor: tokens.surface, borderColor: tokens.border, boxShadow: tokens.shadowMd }}>
            <span className="badge-brand" style={{ backgroundColor: tokens.brandSubtle, color: tokens.brand }}>Brand Badge</span>
            <h3 style={{ color: tokens.text }}>Ten card demo bang token vua sinh ra</h3>
            <p style={{ color: tokens.text2 }}>
              Card nay dung surface, border, shadow-md, va text token de ban nhin duoc giao dien thuc te cua he thong.
            </p>
            <div className="dna-badge-row">
              <span className="badge-brand" style={{ backgroundColor: tokens.brandSubtle, color: tokens.brand }}>Brand subtle</span>
              <span className="badge-accent" style={{ backgroundColor: tokens.accentSubtle, color: tokens.accent }}>Accent subtle</span>
            </div>
          </article>
        </section>

        <section className="card" style={{ backgroundColor: tokens.surface, borderColor: tokens.border, boxShadow: tokens.shadowSm }}>
          <div className="brand-dna-section-head">
            <h2 className="card-title" style={{ color: tokens.text }}>CSS Variables</h2>
            <button type="button" className="wizard-button wizard-button-secondary" onClick={handleCopyCss}>
              {copied ? 'Da copy' : 'Copy'}
            </button>
          </div>
          <pre className="dna-css-code" style={{ backgroundColor: tokens.surface2, borderColor: tokens.border, color: tokens.text2 }}>
{buildCssVariables(tokens)}
          </pre>
        </section>
      </div>

      {status ? <p className="export-status" style={{ color: tokens.brand }}>{status}</p> : null}
    </section>
  )
}

export default BrandDNAResult
