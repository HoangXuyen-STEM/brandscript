import { moods } from './moods.js'

function MoodSelector({ value, onChange }) {
  return (
    <div className="mood-grid">
      {moods.map((mood) => (
        <button
          key={mood.id}
          type="button"
          className={`mood-card${value === mood.id ? ' mood-card-active' : ''}`}
          onClick={() => onChange(mood)}
          aria-pressed={value === mood.id}
        >
          <div className="mood-card-header">
            <strong className="mood-card-name">{mood.name}</strong>
            <p className="mood-card-desc">{mood.description}</p>
          </div>
          <div className="mood-swatches">
            {mood.presetColors.map((color) => (
              <span
                key={color}
                className="mood-swatch"
                style={{ backgroundColor: color }}
                aria-label={color}
              />
            ))}
          </div>
        </button>
      ))}
    </div>
  )
}

export default MoodSelector
