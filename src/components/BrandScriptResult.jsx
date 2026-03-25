import steps from '../data/steps.js'
import ExportButtons from './ExportButtons.jsx'
import OneLiner from './OneLiner.jsx'

function BrandScriptResult({ data, onEdit, onReset }) {
  return (
    <section className="result-shell fade-in">
      <header className="card result-header">
        <div>
          <span className="badge-brand">Kết quả BrandScript</span>
          <h1 className="result-title">{data.business_name || 'Thương hiệu của bạn'}</h1>
          <p className="result-subtitle">Bạn đã hoàn thành 7 bước. Bây giờ có thể tải HTML, chỉnh sửa hoặc làm lại.</p>
        </div>

        <div className="result-actions">
          <button type="button" className="wizard-button wizard-button-secondary" onClick={onEdit}>
            Chỉnh sửa
          </button>
          <button type="button" className="wizard-button wizard-button-primary" onClick={onReset}>
            Làm lại
          </button>
        </div>
      </header>

      <OneLiner data={data} />

      <section className="result-sections">
        {steps.map((step) => (
          <article key={step.id} className="card result-step-card">
            <div className="result-step-head">
              <span className="result-step-badge" style={{ backgroundColor: `${step.color}1A`, color: step.color }}>
                <span aria-hidden="true">{step.emoji}</span>
                <strong>
                  {String(step.id).padStart(2, '0')} - {step.title}
                </strong>
              </span>
            </div>

            <div className="result-fields-grid">
              {step.fields.map((field) => (
                <section key={field.key} className="result-field-item">
                  <h3 className="result-field-label">{field.label}</h3>
                  <p className="result-field-value">{data[field.key]?.trim() || 'Chưa điền'}</p>
                </section>
              ))}
            </div>
          </article>
        ))}
      </section>

      <div className="result-encouragement" role="note" aria-live="polite">
        <p className="result-encouragement-text">
          <span className="result-encouragement-icon" aria-hidden="true">💡</span>{' '}
          Hãy thử làm lại 2-3 lần để tìm đúng insight cho thương hiệu của bạn.
        </p>
        <p className="result-encouragement-text">Bạn có thể chụp màn hình hoặc tải HTML miễn phí.</p>
      </div>

      <ExportButtons data={data} />
    </section>
  )
}

export default BrandScriptResult
