import { useState } from 'react'
import { trackEvent } from '../analytics.js'
import AccessCodeGate from '../auth/AccessCodeGate.jsx'
import { exportBrandScriptPDF } from '../export/exportPDF.js'

function ExportButtons({ data }) {
  const [status, setStatus] = useState('')
  const [showGate, setShowGate] = useState(false)
  const [pdfLoading, setPdfLoading] = useState(false)

  function handlePDFClick() {
    setShowGate(true)
    trackEvent('export_pdf_gate_opened')
  }

  async function handleAuthSuccess(codeEntry, codeHash) {
    setShowGate(false)
    setPdfLoading(true)
    setStatus('Đang tạo PDF…')

    try {
      const filename = await exportBrandScriptPDF(data, codeHash)
      setStatus(`Đã tải file: ${filename}`)
      trackEvent('export_pdf_success', {
        code_label: codeEntry?.label || 'unknown',
      })
    } catch {
      setStatus('Lỗi khi tạo PDF. Vui lòng thử lại.')
      trackEvent('export_pdf_failed')
    } finally {
      setPdfLoading(false)
    }
  }

  return (
    <section className="card export-card">
      <p className="card-label">Export</p>
      <h2 className="card-title">Tải xuống bản BrandScript</h2>
      <p className="card-body">Tải file PDF (cần mã truy cập).</p>

      <div className="export-actions">
        <button
          type="button"
          className="wizard-button wizard-button-primary"
          onClick={handlePDFClick}
          disabled={pdfLoading}
        >
          {pdfLoading ? 'Đang tạo PDF…' : 'Tải PDF'}
        </button>
      </div>

      {status ? <p className="export-status">{status}</p> : null}

      {showGate ? (
        <AccessCodeGate
          onSuccess={handleAuthSuccess}
          onClose={() => setShowGate(false)}
        />
      ) : null}
    </section>
  )
}

export default ExportButtons
