import { complementaryColor, analogousColors, triadicColors } from './colorUtils.js'
import { useState } from 'react'

function AccentSuggester({ brandColor, value, onChange }) {
  const [showCustom, setShowCustom] = useState(false)

  const complementary = complementaryColor(brandColor)
  const [analog1, analog2] = analogousColors(brandColor)
  const [tri1, tri2] = triadicColors(brandColor)

  const suggestions = [
    { label: 'Bổ sung', sublabel: 'Complementary', colors: [complementary] },
    { label: 'Liền kề', sublabel: 'Analogous', colors: [analog1, analog2] },
    { label: 'Tam giác', sublabel: 'Triadic', colors: [tri1, tri2] },
  ]

  return (
    <div className="accent-suggester">
      <label className="color-picker-label">Màu accent</label>

      <div className="accent-suggestions">
        {suggestions.map((group) => (
          <div key={group.label} className="accent-group">
            <span className="accent-group-label">
              {group.label}
              <small className="accent-group-sublabel"> ({group.sublabel})</small>
            </span>
            <div className="accent-group-swatches">
              {group.colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`color-preset${value === color ? ' color-preset-active' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => onChange(color)}
                  aria-label={`Chọn accent ${color}`}
                  aria-pressed={value === color}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="accent-custom-toggle"
        onClick={() => setShowCustom(!showCustom)}
      >
        {showCustom ? 'Ẩn tùy chỉnh' : 'Chọn màu tùy chỉnh'}
      </button>

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
            placeholder="#2563EB"
            className="field-input color-hex-input"
            maxLength={7}
            pattern="^#[0-9a-fA-F]{6}$"
          />
        </div>
      )}

      <div className="accent-preview">
        <span className="accent-preview-swatch" style={{ backgroundColor: brandColor }} />
        <span className="accent-preview-plus" aria-hidden="true">+</span>
        <span className="accent-preview-swatch" style={{ backgroundColor: value }} />
        <span className="color-preview-hex">{value}</span>
      </div>
    </div>
  )
}

export default AccentSuggester
