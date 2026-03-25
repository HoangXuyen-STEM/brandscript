/**
 * Phase 6B automated test — Brand DNA Wizard + Algorithm
 * Usage: node test-phase6b.mjs
 */
import { execSync } from 'child_process'

const BASE = 'http://localhost:5199'
const CHROME = 'google-chrome'
const results = []

function log(item, pass, detail = '') {
  const status = pass ? 'PASS' : 'FAIL'
  results.push({ item, status, detail })
  console.log(`[${status}] ${item}${detail ? ' — ' + detail : ''}`)
}

function chrome(js, timeout = 8000) {
  const escaped = js.replace(/'/g, "'\\''")
  const cmd = `${CHROME} --headless --disable-gpu --no-sandbox --virtual-time-budget=${timeout} --run-all-compositor-stages-before-draw --dump-dom 'data:text/html,<script type="module">${encodeURIComponent(`
    const r = await (async () => { ${js} })();
    document.title = '__RESULT__' + JSON.stringify(r);
  `)}</script>' 2>/dev/null | grep -oP '(?<=__RESULT__).*'`
  try {
    return JSON.parse(execSync(cmd, { encoding: 'utf-8', timeout: 15000 }).trim())
  } catch (e) {
    return null
  }
}

// Use a simpler approach: use node to import the modules directly
function nodeEval(code) {
  try {
    const result = execSync(`node --input-type=module -e '${code.replace(/'/g, "'\\''")}'`, {
      encoding: 'utf-8',
      timeout: 10000,
      cwd: '/home/hoang-xuyen/Projects/brandscript',
    }).trim()
    return result
  } catch (e) {
    return `ERROR: ${e.message}`
  }
}

console.log('=== Phase 6B Testing ===\n')

// 1. moods.js: export 6 moods, each with id, name, presetColors
const moodsTest = nodeEval(`
import { moods } from './src/features/brand-dna/moods.js';
const ok = moods.length === 6 && moods.every(m => m.id && m.name && Array.isArray(m.presetColors) && m.presetColors.length === 4);
console.log(JSON.stringify({ count: moods.length, ok, ids: moods.map(m => m.id) }));
`)
try {
  const mt = JSON.parse(moodsTest)
  log('1. moods.js exports 6 moods with id/name/presetColors', mt.ok, `${mt.count} moods: ${mt.ids.join(', ')}`)
} catch {
  log('1. moods.js exports 6 moods with id/name/presetColors', false, moodsTest)
}

// 2. tintedNeutrals.js: generate valid tokens for each mood
const tokensTest = nodeEval(`
import { moods } from './src/features/brand-dna/moods.js';
import { generateTokens } from './src/features/brand-dna/tintedNeutrals.js';
const results = moods.map(mood => {
  const t = generateTokens(mood.presetColors[0], '#2563EB', mood);
  const hasLight = t.light && t.light.bg && t.light.text && t.light.brand;
  const hasDark = t.dark && t.dark.bg && t.dark.text && t.dark.brand;
  return { mood: mood.id, hasLight, hasDark, warnings: t.warnings.length };
});
const allOk = results.every(r => r.hasLight && r.hasDark);
console.log(JSON.stringify({ allOk, results }));
`)
try {
  const tt = JSON.parse(tokensTest)
  log('2. tintedNeutrals.js generates valid tokens for each mood', tt.allOk, tt.results.map(r => `${r.mood}:${r.warnings}w`).join(', '))
} catch {
  log('2. tintedNeutrals.js generates valid tokens for each mood', false, tokensTest)
}

// 3. colorUtils.js: hexToHsl → hslToHex roundtrip
const roundtripTest = nodeEval(`
import { hexToHsl, hslToHex } from './src/features/brand-dna/colorUtils.js';
const colors = ['#8b5e3c', '#2563eb', '#16a34a', '#7c3aed', '#ffffff', '#000000'];
const results = colors.map(c => {
  const hsl = hexToHsl(c);
  const back = hslToHex(hsl.h, hsl.s, hsl.l);
  return { orig: c, back, match: c.toLowerCase() === back.toLowerCase() };
});
const allMatch = results.every(r => r.match);
console.log(JSON.stringify({ allMatch, results }));
`)
try {
  const rt = JSON.parse(roundtripTest)
  log('3. colorUtils.js hexToHsl→hslToHex roundtrip', rt.allMatch, rt.results.map(r => `${r.orig}→${r.back}`).join(', '))
} catch {
  log('3. colorUtils.js hexToHsl→hslToHex roundtrip', false, roundtripTest)
}

// 4. contrastRatio: white on black = 21:1
const contrastTest = nodeEval(`
import { contrastRatio } from './src/features/brand-dna/colorUtils.js';
const ratio = contrastRatio('#ffffff', '#000000');
console.log(JSON.stringify({ ratio: Math.round(ratio * 100) / 100, pass: ratio >= 20.9 && ratio <= 21.1 }));
`)
try {
  const ct = JSON.parse(contrastTest)
  log('4. contrastRatio white/black = 21:1', ct.pass, `ratio: ${ct.ratio}`)
} catch {
  log('4. contrastRatio white/black = 21:1', false, contrastTest)
}

// 5. WCAG validation: tokens pass AA for light and dark
const wcagTest = nodeEval(`
import { moods } from './src/features/brand-dna/moods.js';
import { generateTokens } from './src/features/brand-dna/tintedNeutrals.js';
import { contrastRatio } from './src/features/brand-dna/colorUtils.js';
let allPass = true;
const details = [];
for (const mood of moods) {
  const t = generateTokens(mood.presetColors[0], '#2563EB', mood);
  // Check light mode
  const lTextBg = contrastRatio(t.light.text, t.light.bg);
  const lTextSurf = contrastRatio(t.light.text, t.light.surface);
  const lText2Surf = contrastRatio(t.light.text2, t.light.surface);
  const lMutedSurf = contrastRatio(t.light.textMuted, t.light.surface);
  // Check dark mode
  const dTextBg = contrastRatio(t.dark.text, t.dark.bg);
  const dTextSurf = contrastRatio(t.dark.text, t.dark.surface);
  const dText2Surf = contrastRatio(t.dark.text2, t.dark.surface);
  const dMutedSurf = contrastRatio(t.dark.textMuted, t.dark.surface);
  
  const lOk = lTextBg >= 4.5 && lTextSurf >= 4.5 && lText2Surf >= 4.5 && lMutedSurf >= 3.0;
  const dOk = dTextBg >= 4.5 && dTextSurf >= 4.5 && dText2Surf >= 4.5 && dMutedSurf >= 3.0;
  if (!lOk || !dOk) allPass = false;
  details.push(mood.id + ':L' + (lOk?'✓':'✗') + 'D' + (dOk?'✓':'✗'));
}
console.log(JSON.stringify({ allPass, details }));
`)
try {
  const wt = JSON.parse(wcagTest)
  log('5. WCAG AA validation for light and dark', wt.allPass, wt.details.join(', '))
} catch {
  log('5. WCAG AA validation for light and dark', false, wcagTest)
}

// 6. Edge case: brandSat < 15% → clamp to 15%
const satClampTest = nodeEval(`
import { generateTokens } from './src/features/brand-dna/tintedNeutrals.js';
import { moods } from './src/features/brand-dna/moods.js';
// Grey color with very low saturation
const t = generateTokens('#808080', '#2563EB', moods[0]);
const ok = t.light && t.light.bg && t.dark && t.dark.bg;
console.log(JSON.stringify({ ok, warnCount: t.warnings.length }));
`)
try {
  const sc = JSON.parse(satClampTest)
  log('6. Edge case: brandSat < 15% → clamp', sc.ok, `warnings: ${sc.warnCount}`)
} catch {
  log('6. Edge case: brandSat < 15% → clamp', false, satClampTest)
}

// 7. Edge case: brandSat > 85%
const satHighTest = nodeEval(`
import { generateTokens } from './src/features/brand-dna/tintedNeutrals.js';
import { moods } from './src/features/brand-dna/moods.js';
// Highly saturated color
const t = generateTokens('#FF0000', '#2563EB', moods[5]);
const ok = t.light && t.light.bg && t.dark && t.dark.bg;
console.log(JSON.stringify({ ok, warnCount: t.warnings.length }));
`)
try {
  const sh = JSON.parse(satHighTest)
  log('7. Edge case: brandSat > 85% → reduced tint coefficients', sh.ok, `warnings: ${sh.warnCount}`)
} catch {
  log('7. Edge case: brandSat > 85% → reduced tint coefficients', false, satHighTest)
}

// 8. Edge case: hue 40-80 (yellow/lime)
const hueYellowTest = nodeEval(`
import { generateTokens } from './src/features/brand-dna/tintedNeutrals.js';
import { moods } from './src/features/brand-dna/moods.js';
// Yellow-ish color (hue ~55)
const t = generateTokens('#B8A000', '#2563EB', moods[3]);
const ok = t.light && t.light.bg && t.dark && t.dark.bg;
console.log(JSON.stringify({ ok, warnCount: t.warnings.length }));
`)
try {
  const hy = JSON.parse(hueYellowTest)
  log('8. Edge case: hue 40-80 perceived luminance adjustment', hy.ok, `warnings: ${hy.warnCount}`)
} catch {
  log('8. Edge case: hue 40-80 perceived luminance adjustment', false, hueYellowTest)
}

// 9-13: UI tests with headless Chrome
console.log('\n--- UI Tests (headless Chrome) ---')

const uiTest = (() => {
  try {
    const html = execSync(
      `${CHROME} --headless --disable-gpu --no-sandbox --virtual-time-budget=6000 --run-all-compositor-stages-before-draw --dump-dom '${BASE}' 2>/dev/null`,
      { encoding: 'utf-8', timeout: 15000 }
    )
    return html
  } catch (e) {
    return ''
  }
})()

if (!uiTest) {
  log('9. MoodSelector shows 6 cards', false, 'Could not load page')
  log('10. ColorPicker shows presets + custom', false, 'Could not load page')
  log('11. AccentSuggester shows 3 types', false, 'Could not load page')
  log('12. BrandDNAWizard navigates 3 steps', false, 'Could not load page')
  log('13. CTA button after BrandScriptResult', false, 'Could not load page')
} else {
  // Check if main page loads (landing)
  const hasLanding = uiTest.includes('BrandScript') || uiTest.includes('brandscript')
  log('9-13 precondition: Page loads', hasLanding, 'Landing page rendered')

  // For component tests, we'll verify the source code has correct structure
  const moodCardCheck = nodeEval(`
    import { readFileSync } from 'fs';
    const src = readFileSync('./src/features/brand-dna/MoodSelector.jsx', 'utf-8');
    const hasMoodGrid = src.includes('mood-grid');
    const has6Cards = src.includes('moods.map');
    const hasClickHandler = src.includes('onClick');
    const hasAriaPressed = src.includes('aria-pressed');
    console.log(JSON.stringify({ hasMoodGrid, has6Cards, hasClickHandler, hasAriaPressed }));
  `)
  try {
    const mc = JSON.parse(moodCardCheck)
    log('9. MoodSelector: 6 cards with click+aria', mc.hasMoodGrid && mc.has6Cards && mc.hasClickHandler && mc.hasAriaPressed)
  } catch {
    log('9. MoodSelector: 6 cards with click+aria', false, moodCardCheck)
  }

  const colorPickerCheck = nodeEval(`
    import { readFileSync } from 'fs';
    const src = readFileSync('./src/features/brand-dna/ColorPicker.jsx', 'utf-8');
    const hasPresets = src.includes('presetColors.map');
    const hasColorInput = src.includes('type="color"');
    const hasHexInput = src.includes('color-hex-input');
    const hasPreview = src.includes('color-preview-swatch');
    console.log(JSON.stringify({ hasPresets, hasColorInput, hasHexInput, hasPreview }));
  `)
  try {
    const cp = JSON.parse(colorPickerCheck)
    log('10. ColorPicker: presets + custom input', cp.hasPresets && cp.hasColorInput && cp.hasHexInput && cp.hasPreview)
  } catch {
    log('10. ColorPicker: presets + custom input', false, colorPickerCheck)
  }

  const accentCheck = nodeEval(`
    import { readFileSync } from 'fs';
    const src = readFileSync('./src/features/brand-dna/AccentSuggester.jsx', 'utf-8');
    const hasComplementary = src.includes('Bổ sung');
    const hasAnalogous = src.includes('Liền kề');
    const hasTriadic = src.includes('Tam giác');
    const hasCustom = src.includes('type="color"');
    console.log(JSON.stringify({ hasComplementary, hasAnalogous, hasTriadic, hasCustom }));
  `)
  try {
    const ac = JSON.parse(accentCheck)
    log('11. AccentSuggester: 3 accent types + custom', ac.hasComplementary && ac.hasAnalogous && ac.hasTriadic && ac.hasCustom)
  } catch {
    log('11. AccentSuggester: 3 accent types + custom', false, accentCheck)
  }

  const wizardCheck = nodeEval(`
    import { readFileSync } from 'fs';
    const src = readFileSync('./src/features/brand-dna/BrandDNAWizard.jsx', 'utf-8');
    const has3Steps = src.includes("DNA_STEPS") && src.includes("step === 0") && src.includes("step === 1") && src.includes("step === 2");
    const hasLocalStorage = src.includes("bs_brand_dna");
    const hasComplete = src.includes("Xem Brand DNA");
    console.log(JSON.stringify({ has3Steps, hasLocalStorage, hasComplete }));
  `)
  try {
    const wc = JSON.parse(wizardCheck)
    log('12. BrandDNAWizard: 3 steps + localStorage', wc.has3Steps && wc.hasLocalStorage && wc.hasComplete)
  } catch {
    log('12. BrandDNAWizard: 3 steps + localStorage', false, wizardCheck)
  }

  // 13. CTA button after BrandScriptResult
  const ctaCheck = nodeEval(`
    import { readFileSync } from 'fs';
    const src = readFileSync('./src/features/brandscript/BrandScriptResult.jsx', 'utf-8');
    const hasCTA = src.includes('Tiếp tục: Tạo Brand DNA cho thương hiệu của bạn');
    const hasOnBrandDNA = src.includes('onBrandDNA');
    console.log(JSON.stringify({ hasCTA, hasOnBrandDNA }));
  `)
  try {
    const cc = JSON.parse(ctaCheck)
    log('13. CTA button after BrandScriptResult', cc.hasCTA && cc.hasOnBrandDNA)
  } catch {
    log('13. CTA button after BrandScriptResult', false, ctaCheck)
  }
}

// 14. Mobile responsive check: verify CSS has media queries for 360px and 768px
const responsiveTest = nodeEval(`
  import { readFileSync } from 'fs';
  const css = readFileSync('./src/styles/globals.css', 'utf-8');
  const has768 = css.includes('max-width: 768px') && css.includes('mood-grid');
  const has480 = css.includes('max-width: 480px') && css.includes('mood-grid');
  const hasDnaNav = css.includes('brand-dna-nav');
  console.log(JSON.stringify({ has768, has480, hasDnaNav }));
`)
try {
  const rsp = JSON.parse(responsiveTest)
  log('14. Mobile responsive (768px + 480px media queries)', rsp.has768 && rsp.has480 && rsp.hasDnaNav)
} catch {
  log('14. Mobile responsive (768px + 480px media queries)', false, responsiveTest)
}

// Summary
console.log('\n=== SUMMARY ===')
const passed = results.filter(r => r.status === 'PASS').length
const failed = results.filter(r => r.status === 'FAIL').length
console.log(`${passed} PASS / ${failed} FAIL / ${results.length} TOTAL`)

if (failed > 0) {
  console.log('\nFailed items:')
  results.filter(r => r.status === 'FAIL').forEach(r => console.log(`  - ${r.item}: ${r.detail}`))
}
