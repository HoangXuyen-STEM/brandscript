function FieldInput({ field, value, onChange, accentColor }) {
  const inputId = `field-${field.key}`
  const sharedProps = {
    id: inputId,
    name: field.key,
    placeholder: field.placeholder || '',
    value: value || '',
    onChange: (event) => onChange(field.key, event.target.value),
    style: { '--field-accent': accentColor },
  }

  return (
    <div className="field-block">
      <label className="field-label" htmlFor={inputId}>
        {field.label}
      </label>

      {field.hint ? <p className="field-hint">{field.hint}</p> : null}

      {field.type === 'textarea' ? (
        <textarea {...sharedProps} className="field-input field-textarea" rows={5} />
      ) : (
        <input {...sharedProps} className="field-input" type="text" />
      )}
    </div>
  )
}

export default FieldInput