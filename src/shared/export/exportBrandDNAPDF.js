import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import { findCodeByHash } from '../auth/access-codes.js'

function makeSlug(text) {
  return String(text || 'brand-dna')
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'brand-dna'
}

/**
 * Export Brand DNA result area to PDF.
 * Requires a valid codeHash from AccessCodeGate.
 */
export async function exportBrandDNAPDF(targetElement, businessName, codeHash) {
  if (!codeHash || !findCodeByHash(codeHash)) {
    throw new Error('Xac thuc that bai. Can ma truy cap hop le de tai PDF.')
  }

  if (!targetElement) {
    throw new Error('Khong tim thay vung ket qua Brand DNA de xuat PDF.')
  }

  await document.fonts.ready

  const canvas = await html2canvas(targetElement, {
    scale: 2,
    useCORS: true,
    backgroundColor: null,
    windowWidth: Math.max(document.documentElement.clientWidth, 1280),
  })

  const imgData = canvas.toDataURL('image/png')
  const imgWidth = 210
  const pageHeight = 297
  const imgHeight = (canvas.height * imgWidth) / canvas.width

  const pdf = new jsPDF('p', 'mm', 'a4')
  let heightLeft = imgHeight
  let position = 0

  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
  heightLeft -= pageHeight

  while (heightLeft > 0) {
    position = heightLeft - imgHeight
    pdf.addPage()
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight
  }

  const filename = `brand-dna-${makeSlug(businessName || 'xuyenlab')}.pdf`
  pdf.save(filename)
  return filename
}
