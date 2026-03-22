/**
 * Danh sách access codes (CHỈ CHỨA HASH — KHÔNG có plain-text code).
 * max_uses: -1 = unlimited (VIP), số dương = giới hạn lượt
 */
const ACCESS_CODES = [
  {
    hash: 'adcd92ae0e609d609e0f6039703b3e64fad410e642b8cdcf66d2df471a1033c6',
    max_uses: -1,
    label: 'SOLO-VIP',
  },
  {
    hash: '94cc9306223d09242115c20cbfc18ccb28ac7d804e33ad1c7237562ece91891d',
    max_uses: 3,
    label: 'PAID-001',
  },
]

export function findCodeByHash(hash) {
  return ACCESS_CODES.find((entry) => entry.hash === hash) || null
}

export default ACCESS_CODES
