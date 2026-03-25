import { readFileSync } from 'fs'
import { generateTokens } from './src/features/brand-dna/tintedNeutrals.js'
import { moods } from './src/features/brand-dna/moods.js'

const results = []

function check(name, pass, detail = '') {
  results.push({ name, pass, detail })
  console.log(`[${pass ? 'PASS' : 'FAIL'}] ${name}${detail ? ` - ${detail}` : ''}`)
}

function has(source, pattern) {
  return typeof pattern === 'string' ? source.includes(pattern) : pattern.test(source)
}

const resultSrc = readFileSync('./src/features/brand-dna/BrandDNAResult.jsx', 'utf-8')
const appSrc = readFileSync('./src/App.jsx', 'utf-8')
const cssSrc = readFileSync('./src/styles/globals.css', 'utf-8')
const exportSrc = readFileSync('./src/shared/export/exportBrandDNAPDF.js', 'utf-8')

// 1) Palette section
check(
  '1. BrandDNAResult render palette swatches dung mau',
  has(resultSrc, 'TokenSwatch label="bg"')
    && has(resultSrc, 'TokenSwatch label="surface"')
    && has(resultSrc, 'TokenSwatch label="surface2"')
    && has(resultSrc, 'TokenSwatch label="brand"')
    && has(resultSrc, 'TokenSwatch label="accent"')
)

// 2) Typography preview uses tokens
check(
  '2. Typography preview dung token',
  has(resultSrc, 'style={{ color: tokens.text }}')
    && has(resultSrc, 'style={{ color: tokens.text2 }}')
    && has(resultSrc, "style={{ color: tokens.textMuted, fontStyle: 'italic' }}")
)

// 3) Shadow preview has 3 levels
check(
  '3. Shadow preview co 3 cap ro ret',
  has(resultSrc, 'tokens.shadowSm')
    && has(resultSrc, 'tokens.shadowMd')
    && has(resultSrc, 'tokens.shadowLg')
)

// 4) Card demo uses generated tokens
check(
  '4. Card demo dung toan bo token',
  has(resultSrc, 'className="dna-card-preview"')
    && has(resultSrc, 'backgroundColor: tokens.surface')
    && has(resultSrc, 'borderColor: tokens.border')
    && has(resultSrc, 'boxShadow: tokens.shadowMd')
)

// 5) Badge brand + accent
check(
  '5. Badge brand + accent hien thi dung',
  has(resultSrc, 'badge-brand')
    && has(resultSrc, 'badge-accent')
    && has(resultSrc, 'backgroundColor: tokens.brandSubtle')
    && has(resultSrc, 'backgroundColor: tokens.accentSubtle')
)

// 6) CSS variables section copy/paste
check(
  '6. CSS variables section copy-paste duoc',
  has(resultSrc, 'function buildCssVariables')
    && has(resultSrc, 'navigator.clipboard.writeText')
    && has(resultSrc, 'className="dna-css-code"')
)

// 7) WCAG warnings when contrast fails
const forcedWarnings = generateTokens('#ffff00', '#00ffff', moods[2]).warnings
check(
  '7. WCAG warnings hien khi contrast khong dat',
  forcedWarnings.length > 0
    && has(resultSrc, 'generated.warnings.length > 0')
    && has(resultSrc, 'Mot so mau chua dat chuan WCAG AA')
)

// 8) Edit button returns to wizard
check(
  '8. Nut Chinh sua quay lai wizard',
  has(resultSrc, 'onClick={onEdit}')
    && has(appSrc, 'function handleBrandDNAEdit()')
    && has(appSrc, 'setRoute(ROUTES.BRAND_DNA)')
)

// 9) PDF button shows AccessCodeGate (same code system)
check(
  '9. Nut Tai PDF hien AccessCodeGate',
  has(resultSrc, 'AccessCodeGate')
    && has(resultSrc, 'setShowGate(true)')
    && has(resultSrc, 'onSuccess={handleAuthSuccess}')
    && has(exportSrc, 'findCodeByHash')
)

// 10) Mobile responsive 360/768
check(
  '10. Mobile responsive 360px, 768px',
  has(cssSrc, '@media (max-width: 768px)')
    && has(cssSrc, '@media (max-width: 480px)')
    && has(cssSrc, '.dna-swatch-grid')
    && has(cssSrc, '.brand-dna-section-head')
)

console.log('\n=== SUMMARY ===')
const passCount = results.filter((r) => r.pass).length
const failCount = results.length - passCount
console.log(`${passCount} PASS / ${failCount} FAIL / ${results.length} TOTAL`)

if (failCount > 0) {
  console.log('\nFailed items:')
  for (const item of results.filter((r) => !r.pass)) {
    console.log(`- ${item.name}`)
  }
  process.exitCode = 1
}
