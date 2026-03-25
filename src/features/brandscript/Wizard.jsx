import { useEffect, useMemo, useState } from 'react'
import steps from '../../data/steps.js'
import ProgressBar from '../../shared/components/ProgressBar.jsx'
import StepChips from '../../shared/components/StepChips.jsx'
import StepForm from './StepForm.jsx'

export const STORAGE_KEY = 'brandscript_wizard_draft'

function buildEmptyFormData() {
  return steps.reduce((accumulator, step) => {
    step.fields.forEach((field) => {
      accumulator[field.key] = ''
    })

    return accumulator
  }, {})
}

function readDraft() {
  const emptyFormData = buildEmptyFormData()

  if (typeof window === 'undefined') {
    return {
      currentStepIndex: 0,
      formData: emptyFormData,
    }
  }

  try {
    const rawDraft = window.localStorage.getItem(STORAGE_KEY)

    if (!rawDraft) {
      return {
        currentStepIndex: 0,
        formData: emptyFormData,
      }
    }

    const parsedDraft = JSON.parse(rawDraft)
    const safeStepIndex = Number.isInteger(parsedDraft.currentStepIndex)
      ? Math.min(Math.max(parsedDraft.currentStepIndex, 0), steps.length - 1)
      : 0

    return {
      currentStepIndex: safeStepIndex,
      formData: {
        ...emptyFormData,
        ...(parsedDraft.formData || {}),
      },
    }
  } catch {
    return {
      currentStepIndex: 0,
      formData: emptyFormData,
    }
  }
}

function Wizard({ onComplete }) {
  const [wizardState, setWizardState] = useState(readDraft)
  const { currentStepIndex, formData } = wizardState
  const currentStep = steps[currentStepIndex]

  const completedFields = useMemo(
    () => Object.values(formData).filter((value) => typeof value === 'string' && value.trim().length > 0).length,
    [formData],
  )

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(wizardState))
    }, 500)

    return () => window.clearTimeout(timeoutId)
  }, [wizardState])

  function handleFieldChange(fieldKey, nextValue) {
    setWizardState((previousState) => ({
      ...previousState,
      formData: {
        ...previousState.formData,
        [fieldKey]: nextValue,
      },
    }))
  }

  function goToStep(nextStepIndex) {
    setWizardState((previousState) => ({
      ...previousState,
      currentStepIndex: Math.min(Math.max(nextStepIndex, 0), steps.length - 1),
    }))
  }

  function goForward() {
    goToStep(currentStepIndex + 1)
  }

  function goBackward() {
    goToStep(currentStepIndex - 1)
  }

  function handleComplete() {
    if (onComplete) {
      onComplete(formData)
    }
  }

  return (
    <section className="wizard-layout">
      <aside className="card wizard-sidebar">
        <div className="wizard-sidebar-copy">
          <span className="badge-accent">Wizard 7 bước</span>
          <h2 className="wizard-sidebar-title">Điền từng bước, lưu tự động sau 500ms.</h2>
          <p className="wizard-sidebar-text">
            Bạn có thể đi tuần tự hoặc bấm trực tiếp vào chip của từng bước để chỉnh lại nội dung bất kỳ lúc nào.
          </p>
        </div>

        <ProgressBar currentStep={currentStepIndex + 1} totalSteps={steps.length} color={currentStep.color} />
        <StepChips steps={steps} currentStepIndex={currentStepIndex} onSelectStep={goToStep} />

        <div className="wizard-sidebar-stats">
          <div className="wizard-stat card">
            <p className="card-label">Đã điền</p>
            <p className="wizard-stat-value">{completedFields}/18 field</p>
          </div>
          <div className="wizard-stat card">
            <p className="card-label">Bước hiện tại</p>
            <p className="wizard-stat-value">{currentStep.title}</p>
          </div>
        </div>
      </aside>

      <div className="wizard-main">
        <StepForm
          step={currentStep}
          stepIndex={currentStepIndex}
          totalSteps={steps.length}
          values={formData}
          onChange={handleFieldChange}
          onBack={goBackward}
          onNext={goForward}
          onComplete={handleComplete}
          isFirstStep={currentStepIndex === 0}
          isLastStep={currentStepIndex === steps.length - 1}
        />
      </div>
    </section>
  )
}

export default Wizard