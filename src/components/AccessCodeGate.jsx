import { useEffect, useState } from 'react'
import { findCodeByHash } from '../data/access-codes.js'
import { trackEvent } from '../utils/analytics.js'
import { hashCode } from '../utils/hash.js'

const FAILED_KEY = 'bs_failed_attempts'
const USAGE_KEY = 'bs_code_usage'
const MAX_ATTEMPTS = 5
const LOCKOUT_MS = 15 * 60 * 1000 // 15 phút

function readFailedAttempts() {
  try {
    const raw = window.localStorage.getItem(FAILED_KEY)
    if (!raw) return { count: 0, firstFailAt: 0 }
    return JSON.parse(raw)
  } catch {
    return { count: 0, firstFailAt: 0 }
  }
}

function writeFailedAttempts(state) {
  window.localStorage.setItem(FAILED_KEY, JSON.stringify(state))
}

function clearFailedAttempts() {
  window.localStorage.removeItem(FAILED_KEY)
}

function readUsage(codeHash) {
  try {
    const raw = window.localStorage.getItem(USAGE_KEY)
    if (!raw) return 0
    const map = JSON.parse(raw)
    return map[codeHash] || 0
  } catch {
    return 0
  }
}

function incrementUsage(codeHash) {
  let map = {}
  try {
    const raw = window.localStorage.getItem(USAGE_KEY)
    if (raw) map = JSON.parse(raw)
  } catch {
    /* ignore */
  }
  map[codeHash] = (map[codeHash] || 0) + 1
  window.localStorage.setItem(USAGE_KEY, JSON.stringify(map))
  return map[codeHash]
}

function getRemainingLockout(failedState) {
  if (failedState.count < MAX_ATTEMPTS) return 0
  const elapsed = Date.now() - failedState.firstFailAt
  const remaining = LOCKOUT_MS - elapsed
  return remaining > 0 ? remaining : 0
}

function formatTime(ms) {
  const totalSeconds = Math.ceil(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

/**
 * AccessCodeGate — Modal nhập mã truy cập để tải PDF.
 * Props:
 *   onSuccess(codeEntry) — gọi khi xác thực thành công và còn lượt
 *   onClose() — đóng modal
 */
function AccessCodeGate({ onSuccess, onClose }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [lockoutMs, setLockoutMs] = useState(0)

  // Check lockout on mount and via interval
  useEffect(() => {
    function checkLockout() {
      const failed = readFailedAttempts()
      const remaining = getRemainingLockout(failed)
      if (remaining <= 0 && failed.count >= MAX_ATTEMPTS) {
        clearFailedAttempts()
        setLockoutMs(0)
      } else {
        setLockoutMs(remaining)
      }
    }

    checkLockout()
    const interval = setInterval(checkLockout, 1000)
    return () => clearInterval(interval)
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()

    const trimmed = code.trim()
    if (!trimmed) {
      setError('Vui lòng nhập mã truy cập.')
      return
    }

    if (lockoutMs > 0) return

    setLoading(true)
    setError('')

    try {
      const hashed = await hashCode(trimmed)
      const codeEntry = findCodeByHash(hashed)

      if (!codeEntry) {
        // Invalid code — track failed attempt
        const failed = readFailedAttempts()
        const now = Date.now()
        const isWithinWindow = now - failed.firstFailAt < LOCKOUT_MS

        const newState = {
          count: isWithinWindow ? failed.count + 1 : 1,
          firstFailAt: isWithinWindow ? failed.firstFailAt : now,
        }
        writeFailedAttempts(newState)

        if (newState.count >= MAX_ATTEMPTS) {
          setLockoutMs(getRemainingLockout(newState))
          setError(`Nhập sai quá ${MAX_ATTEMPTS} lần. Vui lòng đợi 15 phút.`)
          trackEvent('access_code_locked_out')
        } else {
          const remaining = MAX_ATTEMPTS - newState.count
          setError(`Mã không hợp lệ. Còn ${remaining} lần thử.`)
          trackEvent('access_code_invalid', { attempts_remaining: remaining })
        }
        setLoading(false)
        return
      }

      // Valid code — check usage
      if (codeEntry.max_uses > 0) {
        const used = readUsage(hashed)
        if (used >= codeEntry.max_uses) {
          setError(`Mã đã hết lượt sử dụng (${codeEntry.max_uses}/${codeEntry.max_uses}).`)
          trackEvent('access_code_exhausted', {
            code_label: codeEntry.label,
            max_uses: codeEntry.max_uses,
          })
          setLoading(false)
          return
        }
      }

      // Success — clear failed attempts, increment usage
      clearFailedAttempts()
      if (codeEntry.max_uses > 0) {
        incrementUsage(hashed)
      }

      trackEvent('access_code_validated', {
        code_label: codeEntry.label,
        max_uses: codeEntry.max_uses,
      })

      onSuccess(codeEntry, hashed)
    } catch {
      setError('Đã xảy ra lỗi. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  const isLocked = lockoutMs > 0

  return (
    <div className="gate-overlay" onClick={onClose}>
      <div className="card gate-modal fade-in" onClick={(e) => e.stopPropagation()}>
        <p className="card-label">Xác thực</p>
        <h2 className="card-title">Nhập mã truy cập để tải PDF</h2>
        <p className="card-body">
          Bạn cần mã truy cập để tải file PDF. Nếu chưa có, hãy liên hệ XuyenLab để nhận mã.
        </p>

        <form className="gate-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="field-input gate-input"
            placeholder="Nhập mã truy cập (VD: ABC-123)"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={isLocked || loading}
            autoFocus
            autoComplete="off"
          />

          {error ? <p className="gate-error">{error}</p> : null}

          {isLocked ? (
            <p className="gate-lockout">
              Đã bị khóa. Thử lại sau {formatTime(lockoutMs)}
            </p>
          ) : null}

          <div className="gate-actions">
            <button
              type="submit"
              className="wizard-button wizard-button-primary"
              disabled={isLocked || loading}
            >
              {loading ? 'Đang kiểm tra…' : 'Xác nhận'}
            </button>
            <button
              type="button"
              className="wizard-button wizard-button-secondary"
              onClick={onClose}
            >
              Hủy
            </button>
          </div>
        </form>

        <div className="gate-info">
          <p className="card-label">Hướng dẫn thanh toán</p>
          <p className="gate-info-text">
            Chuyển khoản qua VietQR (Agribank) và gửi ảnh chụp cho XuyenLab để nhận mã.
            Chi tiết tại <strong>brandscript.xuyenlab.com</strong>.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AccessCodeGate
