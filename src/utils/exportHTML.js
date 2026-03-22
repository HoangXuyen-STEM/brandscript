import steps from '../data/steps.js'
import { generateOneLiner } from './oneliner.js'

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function lineBreaks(text) {
  return escapeHtml(text).replace(/\n/g, '<br />')
}

function makeSlug(text) {
  return String(text || 'brandscript')
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'brandscript'
}

function buildHTML(data) {
  const oneLiner = generateOneLiner(data)

  const sections = steps
    .map(
      (step) => `
        <article class="step-card">
          <h2>
            <span>${escapeHtml(step.emoji)}</span>
            <span>${String(step.id).padStart(2, '0')}. ${escapeHtml(step.title)}</span>
          </h2>
          <div class="step-grid">
            ${step.fields
              .map(
                (field) => `
                  <section class="field-block">
                    <h3>${escapeHtml(field.label)}</h3>
                    <p>${lineBreaks(data[field.key] || 'Chưa điền')}</p>
                  </section>
                `,
              )
              .join('')}
          </div>
        </article>
      `,
    )
    .join('')

  return `<!doctype html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>BrandScript - ${escapeHtml(data.business_name || 'XuyenLab')}</title>
    <style>
      :root {
        --color-bg: #faf7f4;
        --color-surface: #fdfaf7;
        --color-border: #e8ddd2;
        --color-text: #1a1410;
        --color-text-2: #4a3e34;
        --color-muted: #9a8878;
        --color-brand: #8b5e3c;
        --color-brand-dark: #5c3a22;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        font-family: "Be Vietnam Pro", sans-serif;
        background: var(--color-bg);
        color: var(--color-text);
        line-height: 1.65;
      }

      .page {
        max-width: 980px;
        margin: 0 auto;
        padding: 32px 20px 56px;
      }

      .hero {
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: 16px;
        padding: 24px;
        margin-bottom: 18px;
      }

      .label {
        font-size: 11px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--color-muted);
        margin: 0 0 8px;
      }

      h1 {
        margin: 0;
        font-size: 32px;
        line-height: 1.12;
      }

      .subtitle {
        margin: 10px 0 0;
        color: var(--color-text-2);
      }

      .oneliner {
        background: #f5eae4;
        border-left: 4px solid var(--color-brand);
        border-radius: 12px;
        padding: 16px;
        margin: 18px 0;
        font-size: 17px;
      }

      .step-card {
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: 16px;
        padding: 20px;
        margin-top: 14px;
      }

      .step-card h2 {
        margin: 0 0 14px;
        font-size: 21px;
        display: flex;
        gap: 10px;
        align-items: center;
      }

      .step-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }

      .field-block {
        border: 1px solid var(--color-border);
        border-radius: 12px;
        padding: 12px;
        background: #fffaf6;
      }

      .field-block h3 {
        margin: 0;
        font-size: 14px;
      }

      .field-block p {
        margin: 8px 0 0;
        color: var(--color-text-2);
      }

      .footer {
        margin-top: 24px;
        color: var(--color-muted);
        font-size: 13px;
      }

      @media (max-width: 768px) {
        h1 {
          font-size: 26px;
        }

        .step-grid {
          grid-template-columns: 1fr;
        }
      }

      @media print {
        @page {
          size: A4;
          margin: 12mm;
        }

        body {
          background: #ffffff;
        }

        .page {
          max-width: none;
          padding: 0;
        }

        .hero,
        .step-card,
        .field-block {
          break-inside: avoid;
        }
      }
    </style>
  </head>
  <body>
    <main class="page">
      <header class="hero">
        <p class="label">XuyenLab BrandScript</p>
        <h1>${escapeHtml(data.business_name || 'BrandScript')}</h1>
        <p class="subtitle">Ngành nghề: ${escapeHtml(data.business_type || 'Chưa điền')}</p>
      </header>

      <section class="oneliner">
        <strong>One-liner:</strong>
        <p>${lineBreaks(oneLiner || 'Chưa đủ dữ liệu để tạo one-liner.')}</p>
      </section>

      ${sections}

      <footer class="footer">
        Tạo bởi BrandScript Builder - brandscript.xuyenlab.com
      </footer>
    </main>
  </body>
</html>`
}

export function exportBrandScriptHTML(data) {
  const filename = `brandscript-${makeSlug(data.business_name || 'xuyenlab')}.html`
  const html = buildHTML(data)
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)

  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()

  window.setTimeout(() => URL.revokeObjectURL(url), 0)
  return filename
}

export default exportBrandScriptHTML
