import FieldInput from './FieldInput.jsx'

function StepForm({
  step,
  stepIndex,
  totalSteps,
  values,
  onChange,
  onBack,
  onNext,
  onComplete,
  isFirstStep,
  isLastStep,
}) {
  function handlePrimaryAction() {
    if (isLastStep) {
      onComplete()
      return
    }

    onNext()
  }

  return (
    <section className="card step-form fade-in" key={step.id}>
      <div className="step-form-head">
        <span className="step-badge" style={{ backgroundColor: `${step.color}1A`, color: step.color }}>
          <span aria-hidden="true">{step.emoji}</span>
          <span>
            Bước {String(step.id).padStart(2, '0')} / {String(totalSteps).padStart(2, '0')}
          </span>
        </span>

        <div className="step-form-copy">
          <h2 className="step-title">{step.title}</h2>
          <p className="step-subtitle">
            Hoàn thiện phần này để câu chuyện thương hiệu của bạn đi từ vấn đề đến chuyển hóa một cách mạch lạc.
          </p>
        </div>
      </div>

      <div className="step-form-fields">
        {step.fields.map((field) => (
          <FieldInput
            key={field.key}
            field={field}
            value={values[field.key]}
            onChange={onChange}
            accentColor={step.color}
          />
        ))}
      </div>

      <div className="step-form-footer">
        <div className="step-footnote">
          <span className="step-footnote-label">Đang chỉnh</span>
          <strong>
            {stepIndex + 1}/{totalSteps} bước
          </strong>
        </div>

        <div className="wizard-actions">
          <button type="button" className="wizard-button wizard-button-secondary" onClick={onBack} disabled={isFirstStep}>
            Quay lại
          </button>
          <button type="button" className="wizard-button wizard-button-primary" onClick={handlePrimaryAction}>
            {isLastStep ? 'Xem BrandScript' : 'Tiếp tục'}
          </button>
        </div>
      </div>
    </section>
  )
}

export default StepForm