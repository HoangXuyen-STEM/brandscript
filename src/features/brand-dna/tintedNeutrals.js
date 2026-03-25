import {
  hexToHsl,
  hslToHex,
  hexToRgb,
  contrastRatio,
  isWcagAA,
  isWcagAALarge,
} from './colorUtils.js'

/**
 * Sinh toàn bộ design tokens từ 1 brand color + 1 accent color + mood.
 *
 * @param {string} brandColor - hex color, VD: "#8B5E3C"
 * @param {string} accentColor - hex color, VD: "#2563EB"
 * @param {object} mood - mood object từ moods.js
 * @returns {object} { light: {...tokens}, dark: {...tokens}, warnings: [] }
 */
export function generateTokens(brandColor, accentColor, mood) {
  const warnings = []

  // 1. Parse hex → HSL
  const brand = hexToHsl(brandColor)
  const accent = hexToHsl(accentColor)

  // 2. Clamp saturation: min 15%, max 85%
  const brandSat = Math.max(15, Math.min(85, brand.s))

  // 3. Adjust hue 40-80 (yellow/lime) for perceived luminance
  let brandHue = brand.h
  if (brandHue >= 40 && brandHue <= 80) {
    // Yellow/lime range appears brighter — shift lightness down for text tokens
    // and reduce saturation slightly for neutrals to avoid muddy greens
    brandHue = brandHue < 60 ? brandHue - 5 : brandHue + 5
  }

  // Tint coefficient: how much brand hue affects neutrals
  const tintCoeff = brandSat > 85 ? 0.03 : 0.05

  // ── Light mode tokens ──
  const light = generateLightTokens(brandHue, brandSat, brand.l, brandColor, accent, accentColor, mood, tintCoeff)

  // ── Dark mode tokens (separate generation, NOT just inverted lightness) ──
  const dark = generateDarkTokens(brandHue, brandSat, brand.l, brandColor, accent, accentColor, mood, tintCoeff)

  // 6. Validate WCAG AA for all text/bg combinations
  validateContrast(light, 'light', warnings)
  validateContrast(dark, 'dark', warnings)

  return { light, dark, warnings }
}

function generateLightTokens(brandHue, brandSat, brandL, brandColor, accent, accentColor, mood, tintCoeff) {
  const tintSat = brandSat * tintCoeff * 100 // very low saturation for neutrals

  // Backgrounds: very high lightness, tiny brand hue tint
  const bg = hslToHex(brandHue, Math.min(tintSat, 12), 97.5)
  const surface = hslToHex(brandHue, Math.min(tintSat, 10), 98.5)
  const surface2 = hslToHex(brandHue, Math.min(tintSat, 14), 93)

  // Borders: medium-light, slightly more saturation
  const border = hslToHex(brandHue, Math.min(tintSat + 4, 18), 88)
  const borderStrong = hslToHex(brandHue, Math.min(tintSat + 6, 20), 76)

  // Text: very dark, brand-hue tinted
  const text = hslToHex(brandHue, Math.min(brandSat * 0.3, 20), 7)
  const text2 = hslToHex(brandHue, Math.min(brandSat * 0.25, 16), 26)
  const textMuted = hslToHex(brandHue, Math.min(brandSat * 0.2, 14), 55)

  // Brand colors
  const brand = brandColor
  const brandDark = hslToHex(brandHue, Math.min(brandSat + 5, 85), Math.max(brandL - 15, 12))
  const brandSubtle = hslToHex(brandHue, Math.min(brandSat * 0.35, 30), 94)

  // Accent colors
  const accentHex = accentColor
  const accentSubtle = hslToHex(accent.h, Math.min(accent.s * 0.3, 30), 95)

  // Shadow hue from mood
  const shadowHue = mood.shadowHue || brandHue
  const { r: sr, g: sg, b: sb } = hexToRgb(hslToHex(shadowHue, 50, 25))

  return {
    bg, surface, surface2,
    border, borderStrong,
    text, text2, textMuted,
    brand, brandDark, brandSubtle,
    accent: accentHex, accentSubtle,
    shadowSm: `0 1px 3px rgba(${sr},${sg},${sb},0.08), 0 0 0 1px rgba(${sr},${sg},${sb},0.04)`,
    shadowMd: `0 4px 16px rgba(${sr},${sg},${sb},0.10), 0 1px 4px rgba(${sr},${sg},${sb},0.06)`,
    shadowLg: `0 12px 40px rgba(${sr},${sg},${sb},0.12), 0 2px 8px rgba(${sr},${sg},${sb},0.06)`,
  }
}

function generateDarkTokens(brandHue, brandSat, brandL, brandColor, accent, accentColor, mood, tintCoeff) {
  const tintSat = brandSat * tintCoeff * 100

  // Backgrounds: very dark, tiny brand hue tint
  const bg = hslToHex(brandHue, Math.min(tintSat, 14), 5)
  const surface = hslToHex(brandHue, Math.min(tintSat, 12), 9)
  const surface2 = hslToHex(brandHue, Math.min(tintSat, 16), 13)

  // Borders: dark, slightly warm
  const border = hslToHex(brandHue, Math.min(tintSat + 4, 18), 20)
  const borderStrong = hslToHex(brandHue, Math.min(tintSat + 6, 22), 32)

  // Text: light, brand-tinted (not pure white)
  const text = hslToHex(brandHue, Math.min(brandSat * 0.2, 14), 88)
  const text2 = hslToHex(brandHue, Math.min(brandSat * 0.18, 12), 68)
  const textMuted = hslToHex(brandHue, Math.min(brandSat * 0.15, 10), 42)

  // Brand: lighter for dark bg
  const brand = hslToHex(brandHue, Math.min(brandSat, 85), Math.min(brandL + 20, 70))
  const brandDark = brandColor // original brand becomes "dark" variant in dark mode
  const brandSubtle = hslToHex(brandHue, Math.min(brandSat * 0.3, 25), 11)

  // Accent: lighter for dark bg
  const accentHsl = { h: hexToHsl(accentColor).h, s: hexToHsl(accentColor).s, l: hexToHsl(accentColor).l }
  const accentHex = hslToHex(accentHsl.h, Math.min(accentHsl.s, 85), Math.min(accentHsl.l + 20, 72))
  const accentSubtle = hslToHex(accentHsl.h, Math.min(accentHsl.s * 0.3, 25), 13)

  // Shadow — darker in dark mode
  const shadowHue = mood.shadowHue || brandHue
  const { r: sr, g: sg, b: sb } = hexToRgb(hslToHex(shadowHue, 35, 45))

  return {
    bg, surface, surface2,
    border, borderStrong,
    text, text2, textMuted,
    brand, brandDark, brandSubtle,
    accent: accentHex, accentSubtle,
    shadowSm: `0 0 0 1px rgba(${sr},${sg},${sb},0.08)`,
    shadowMd: `0 4px 20px rgba(0,0,0,0.4), 0 0 0 1px rgba(${sr},${sg},${sb},0.06)`,
    shadowLg: `0 12px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(${sr},${sg},${sb},0.08)`,
  }
}

function validateContrast(tokens, mode, warnings) {
  const checks = [
    { fg: 'text', bg: 'bg', min: 4.5, label: 'text on bg' },
    { fg: 'text', bg: 'surface', min: 4.5, label: 'text on surface' },
    { fg: 'text2', bg: 'surface', min: 4.5, label: 'text2 on surface' },
    { fg: 'textMuted', bg: 'surface', min: 3.0, label: 'textMuted on surface' },
  ]

  for (const check of checks) {
    const fgHex = tokens[check.fg]
    const bgHex = tokens[check.bg]
    const ratio = contrastRatio(fgHex, bgHex)

    if (ratio < check.min) {
      // Auto-fix: adjust foreground lightness
      const fixed = autoFixContrast(fgHex, bgHex, check.min)
      tokens[check.fg] = fixed
      warnings.push(
        `[${mode}] ${check.label}: ratio ${ratio.toFixed(2)}:1 < ${check.min}:1 → auto-adjusted to ${fixed}`
      )
    }
  }

  // Check button label on brand
  const brandBg = tokens.brand
  const whiteRatio = contrastRatio('#ffffff', brandBg)
  const darkRatio = contrastRatio(tokens.text, brandBg)

  if (whiteRatio < 4.5 && darkRatio < 4.5) {
    warnings.push(
      `[${mode}] Neither white nor text color meets AA on brand (${brandBg}). White: ${whiteRatio.toFixed(2)}:1, Text: ${darkRatio.toFixed(2)}:1`
    )
  }
}

function autoFixContrast(fgHex, bgHex, minRatio) {
  const fg = hexToHsl(fgHex)
  const bgLum = hexToHsl(bgHex).l
  const isLightBg = bgLum > 50

  // Iteratively adjust lightness
  let l = fg.l
  for (let i = 0; i < 40; i++) {
    const candidate = hslToHex(fg.h, fg.s, l)
    if (contrastRatio(candidate, bgHex) >= minRatio) {
      return candidate
    }
    l += isLightBg ? -2 : 2
    l = Math.max(0, Math.min(100, l))
  }

  return fgHex // fallback if can't fix
}

/**
 * Get appropriate button text color (white or dark) for a brand background.
 */
export function getButtonTextColor(brandHex, textHex) {
  const whiteRatio = contrastRatio('#ffffff', brandHex)
  const darkRatio = contrastRatio(textHex || '#1a1410', brandHex)
  return whiteRatio >= darkRatio ? '#ffffff' : (textHex || '#1a1410')
}
