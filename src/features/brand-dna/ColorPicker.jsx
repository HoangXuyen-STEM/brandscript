import { useState } from 'react'

function ColorPicker({ label, presetColors, value, onChange }) {
  const [showCustom, setShowCustom] = useState(false)

  return (
    <div className="color-picker">
      <label className="color-picker-label">{label}</label>

      <div className="color-picker-presets">
        {presetColors.map((color) => (
          <button
            key={color}
            type="button"
            className={`color-preset${value === color ? ' color-preset-active' : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => onChange(color)}
            aria-label={`Chọn màu ${color}`}
            aria-pressed={value === color}
          />
        ))}
        <button
          type="button"
          className={`color-preset color-preset-custom${showCustom ? ' color-preset-active' : ''}`}
          onClick={() => setShowCustom(!showCustom)}
          aria-label="Chọn màu tùy chỉnh"
        >
          <span aria-hidden="true">+</span>
        </button>
      </div>

      {showCustom && (
        <div className="color-picker-custom">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="color-input-native"
          />
          <input
            type="text"
            value={value}
            onChange={(e) => {
              const hex = e.target.value
              if (/^#[0-9a-fA-F]{6}$/.test(hex)) {
                onChange(hex)
              }
            }}
            placeholder="#8B5E3C"
            className="field-input color-hex-input"
            maxLength={7}
            pattern="^#[0-9a-fA-F]{6}$"
          />
        </div>
      )}

      <div className="color-preview-row">
        <span
          className="color-preview-swatch"
          style={{ backgroundColor: value }}
        />
        <span className="color-preview-hex">{value}</span>
      </div>
    </div>
  )
}

export default ColorPicker
