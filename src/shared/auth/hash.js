/**
 * SHA-256 hashing via Web Crypto API.
 * KHÔNG BAO GIỜ lưu plain-text code — chỉ so sánh hash.
 */
export async function hashCode(plainText) {
  const encoder = new TextEncoder()
  const data = encoder.encode(plainText)
  const buffer = await crypto.subtle.digest('SHA-256', data)
  const bytes = new Uint8Array(buffer)
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}
