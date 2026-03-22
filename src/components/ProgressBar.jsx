function ProgressBar({ currentStep, totalSteps, color }) {
  const percentage = Math.round((currentStep / totalSteps) * 100)

  return (
    <section className="progress-panel" aria-label="Tiến độ hoàn thành wizard">
      <div className="progress-header">
        <div>
          <p className="progress-label">Tiến độ</p>
          <p className="progress-value">
            Bước {currentStep}/{totalSteps}
          </p>
        </div>
        <strong className="progress-percent" style={{ color }}>
          {percentage}%
        </strong>
      </div>

      <div className="progress-track" aria-hidden="true">
        <div className="progress-fill" style={{ width: `${percentage}%`, backgroundColor: color }} />
      </div>
    </section>
  )
}

export default ProgressBar