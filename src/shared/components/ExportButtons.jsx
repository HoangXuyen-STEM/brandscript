import { useState } from 'react'
import { trackEvent } from '../analytics.js'
import { exportBrandScriptPDF } from '../export/exportPDF.js'

function ExportButtons({ data }) {
  const [status, setStatus] = useState('')
  const [pdfLoading, setPdfLoading] = useState(false)

  async function handlePDFClick() {
    setPdfLoading(true)
    setStatus('Đang tạo PDF…')

    try {
      const filename = await exportBrandScriptPDF(data)
      setStatus(`Đã tải file: ${filename}`)
      trackEvent('export_pdf_success')
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
      <p className="card-body">Tải file PDF miễn phí.</p>

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
    </section>
  )
}

export default ExportButtons
