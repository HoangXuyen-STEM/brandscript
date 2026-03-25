import { generateOneLiner } from './oneliner.js'

function OneLiner({ data }) {
  const oneLiner = generateOneLiner(data)

  return (
    <section className="card one-liner-card">
      <p className="card-label">One-liner tự động</p>
      <h2 className="card-title">Thông điệp ngắn gọn của thương hiệu</h2>
      {oneLiner ? (
        <p className="one-liner-text">{oneLiner}</p>
      ) : (
        <p className="one-liner-empty">Cần thêm dữ liệu ở các mục chính để tạo one-liner tự động.</p>
      )}
    </section>
  )
}

export default OneLiner
