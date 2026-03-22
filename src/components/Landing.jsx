import steps from '../data/steps.js'

function Landing({ onStart, onLoadExample }) {
  return (
    <section className="landing-shell fade-in">
      <header className="landing-hero card">
        <span className="badge-brand">XuyenLab BrandScript Builder</span>
        <h1 className="landing-title">Làm rõ câu chuyện thương hiệu của bạn trong 15 phút.</h1>
        <p className="landing-subtitle">
          Công cụ tiếng Việt theo framework StoryBrand SB7, dành cho hộ kinh doanh nhỏ và solo entrepreneur muốn diễn
          đạt thông điệp rõ ràng, hấp dẫn và dễ dùng ngay để bán hàng.
        </p>

        <div className="landing-actions">
          <button type="button" className="wizard-button wizard-button-primary" onClick={onStart}>
            Bắt đầu
          </button>
          <button type="button" className="wizard-button wizard-button-secondary" onClick={onLoadExample}>
            Xem ví dụ mẫu
          </button>
        </div>
      </header>

      <div className="landing-cards-grid">
        <article className="card">
          <p className="card-label">Phương pháp</p>
          <h2 className="card-title">StoryBrand SB7 đã Việt hóa</h2>
          <p className="card-body">
            Mỗi bước đi từ mong muốn khách hàng, vấn đề, giải pháp đến chuyển hóa. Bạn hoàn thành form một lần là có
            ngay bản BrandScript có thể dùng trong landing page, profile và pitch ngắn.
          </p>
        </article>

        <article className="card">
          <p className="card-label">Kết quả</p>
          <h2 className="card-title">One-liner + BrandScript đầy đủ</h2>
          <p className="card-body">
            Sau khi điền xong, bạn nhận bản tóm tắt one-liner tự động và toàn bộ nội dung 7 bước. Có thể chỉnh sửa bất
            kỳ lúc nào và tải HTML để lưu trữ hoặc in.
          </p>
        </article>
      </div>

      <section className="card steps-overview">
        <div className="steps-overview-head">
          <span className="badge-accent">Overview 7 bước</span>
          <p className="steps-overview-note">Bạn có thể đi tuần tự hoặc nhảy qua lại từng bước trong wizard.</p>
        </div>

        <div className="steps-overview-grid">
          {steps.map((step) => (
            <article key={step.id} className="step-overview-item" style={{ '--step-color': step.color }}>
              <div className="step-overview-index">
                <span aria-hidden="true">{step.emoji}</span>
                <strong>{String(step.id).padStart(2, '0')}</strong>
              </div>
              <div>
                <h3 className="step-overview-title">{step.title}</h3>
                <p className="step-overview-fields">{step.fields.length} câu hỏi</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  )
}

export default Landing
