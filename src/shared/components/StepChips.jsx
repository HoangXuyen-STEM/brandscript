function StepChips({ steps, currentStepIndex, onSelectStep }) {
  return (
    <nav className="step-chips" aria-label="Đi tới bước bất kỳ">
      {steps.map((step, index) => {
        const isActive = index === currentStepIndex
        const isCompleted = index < currentStepIndex

        return (
          <button
            key={step.id}
            type="button"
            className={`step-chip${isActive ? ' is-active' : ''}${isCompleted ? ' is-completed' : ''}`}
            onClick={() => onSelectStep(index)}
            style={{ '--chip-color': step.color }}
            aria-current={isActive ? 'step' : undefined}
          >
            <span className="step-chip-number">{String(step.id).padStart(2, '0')}</span>
            <span className="step-chip-text">
              <span className="step-chip-emoji" aria-hidden="true">
                {step.emoji}
              </span>
              <span>{step.title}</span>
            </span>
          </button>
        )
      })}
    </nav>
  )
}

export default StepChips