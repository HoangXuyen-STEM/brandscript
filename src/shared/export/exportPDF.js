import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import steps from '../../data/steps.js'
import { generateOneLiner } from '../../features/brandscript/oneliner.js'

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
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

function buildPDFHTML(data) {
  const oneLiner = generateOneLiner(data)

  const sections = steps
    .map(
      (step) => `
      <div class="step-card" style="break-inside:avoid;background:#fdfaf7;border:1px solid #e8ddd2;border-radius:12px;padding:16px;margin-top:12px;">
        <h2 style="margin:0 0 10px;font-size:16px;display:flex;gap:8px;align-items:center;color:#1a1410;">
          <span>${escapeHtml(step.emoji)}</span>
          <span>${String(step.id).padStart(2, '0')}. ${escapeHtml(step.title)}</span>
        </h2>
        <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;">
          ${step.fields
            .map(
              (field) => `
            <div style="break-inside:avoid;border:1px solid #e8ddd2;border-radius:10px;padding:10px;background:#fffaf6;">
              <h3 style="margin:0;font-size:12px;color:#1a1410;">${escapeHtml(field.label)}</h3>
              <p style="margin:6px 0 0;font-size:13px;color:#4a3e34;line-height:1.6;">${lineBreaks(data[field.key] || 'Chưa điền')}</p>
            </div>
          `,
            )
            .join('')}
        </div>
      </div>
    `,
    )
    .join('')

  return `<!doctype html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <style>
    @import url("https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap");
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: "Be Vietnam Pro", sans-serif;
      background: #faf7f4;
      color: #1a1410;
      line-height: 1.55;
      padding: 24px;
      width: 794px;
    }
    .hero {
      background: #fdfaf7;
      border: 1px solid #e8ddd2;
      border-radius: 14px;
      padding: 20px;
    }
    .label {
      font-size: 10px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #9a8878;
      margin-bottom: 6px;
    }
    h1 { font-size: 26px; line-height: 1.15; color: #1a1410; }
    .subtitle { margin-top: 8px; color: #4a3e34; font-size: 14px; }
    .oneliner {
      background: #f5eae4;
      border-left: 4px solid #8b5e3c;
      border-radius: 10px;
      padding: 14px;
      margin: 14px 0;
      font-size: 14px;
      line-height: 1.6;
    }
    .footer {
      margin-top: 18px;
      color: #9a8878;
      font-size: 11px;
    }
  </style>
</head>
<body>
  <div class="hero">
    <p class="label">XuyenLab BrandScript</p>
    <h1>${escapeHtml(data.business_name || 'BrandScript')}</h1>
    <p class="subtitle">Ngành nghề: ${escapeHtml(data.business_type || 'Chưa điền')}</p>
  </div>
  <div class="oneliner">
    <strong>One-liner:</strong>
    <p>${lineBreaks(oneLiner || 'Chưa đủ dữ liệu để tạo one-liner.')}</p>
  </div>
  ${sections}
  <p class="footer">Tạo bởi BrandScript Builder — brandscript.xuyenlab.com</p>
</body>
</html>`
}

/**
 * Renders BrandScript data to a PDF file and triggers download.
 */
export async function exportBrandScriptPDF(data) {
  const html = buildPDFHTML(data)

  const container = document.createElement('div')
  container.style.cssText = 'position:fixed;left:-9999px;top:0;width:794px;'
  container.innerHTML = html
  document.body.appendChild(container)

  // Wait for fonts to load
  await document.fonts.ready

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#faf7f4',
      width: 794,
      windowWidth: 794,
    })

    const imgData = canvas.toDataURL('image/png')
    const imgWidth = 210 // A4 mm
    const pageHeight = 297 // A4 mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    const marginX = 0
    const marginY = 0

    const pdf = new jsPDF('p', 'mm', 'a4')
    let heightLeft = imgHeight
    let position = marginY

    pdf.addImage(imgData, 'PNG', marginX, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    while (heightLeft > 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', marginX, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    const filename = `brandscript-${makeSlug(data.business_name || 'xuyenlab')}.pdf`
    pdf.save(filename)
    return filename
  } finally {
    container.remove()
  }
}
