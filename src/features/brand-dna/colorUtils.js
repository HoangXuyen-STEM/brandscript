/**
 * Color utilities — hex ↔ HSL ↔ RGB conversions, WCAG contrast, harmony suggestions.
 */

export function hexToRgb(hex) {
  const h = hex.replace('#', '')
  const n = h.length === 3
    ? [h[0] + h[0], h[1] + h[1], h[2] + h[2]]
    : [h.slice(0, 2), h.slice(2, 4), h.slice(4, 6)]
  return { r: parseInt(n[0], 16), g: parseInt(n[1], 16), b: parseInt(n[2], 16) }
}

export function rgbToHex(r, g, b) {
  const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)))
  return '#' + [clamp(r), clamp(g), clamp(b)].map((c) => c.toString(16).padStart(2, '0')).join('')
}

export function hexToHsl(hex) {
  const { r, g, b } = hexToRgb(hex)
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const d = max - min
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6
    else if (max === gn) h = ((bn - rn) / d + 2) / 6
    else h = ((rn - gn) / d + 4) / 6
  }

  return { h: h * 360, s: s * 100, l: l * 100 }
}

export function hslToHex(h, s, l) {
  const sn = s / 100
  const ln = l / 100
  const c = (1 - Math.abs(2 * ln - 1)) * sn
  const hp = ((h % 360) + 360) % 360 / 60
  const x = c * (1 - Math.abs((hp % 2) - 1))
  let r1 = 0, g1 = 0, b1 = 0

  if (hp < 1) { r1 = c; g1 = x }
  else if (hp < 2) { r1 = x; g1 = c }
  else if (hp < 3) { g1 = c; b1 = x }
  else if (hp < 4) { g1 = x; b1 = c }
  else if (hp < 5) { r1 = x; b1 = c }
  else { r1 = c; b1 = x }

  const m = ln - c / 2
  return rgbToHex((r1 + m) * 255, (g1 + m) * 255, (b1 + m) * 255)
}

export function relativeLuminance(hex) {
  const { r, g, b } = hexToRgb(hex)
  const linearize = (c) => {
    const srgb = c / 255
    return srgb <= 0.04045 ? srgb / 12.92 : Math.pow((srgb + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b)
}

export function contrastRatio(hex1, hex2) {
  const l1 = relativeLuminance(hex1)
  const l2 = relativeLuminance(hex2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

export function isWcagAA(foreground, background) {
  return contrastRatio(foreground, background) >= 4.5
}

export function isWcagAALarge(foreground, background) {
  return contrastRatio(foreground, background) >= 3.0
}

export function complementaryColor(hex) {
  const { h, s, l } = hexToHsl(hex)
  return hslToHex((h + 180) % 360, s, l)
}

export function analogousColors(hex) {
  const { h, s, l } = hexToHsl(hex)
  return [
    hslToHex((h + 30) % 360, s, l),
    hslToHex((h + 330) % 360, s, l),
  ]
}

export function triadicColors(hex) {
  const { h, s, l } = hexToHsl(hex)
  return [
    hslToHex((h + 120) % 360, s, l),
    hslToHex((h + 240) % 360, s, l),
  ]
}
