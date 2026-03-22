/**
 * steps.js — 7 bước BrandScript (SB7 Framework)
 * Nguồn sự thật: SPEC_BRANDSCRIPT.md
 * KHÔNG ĐƯỢC THAY ĐỔI NỘI DUNG CÂU HỎI mà không có sự đồng ý của Xuyen.
 */

export const steps = [
  {
    id: 1,
    slug: "character",
    title: "Nhân vật chính",
    emoji: "👤",
    color: "#8B5E3C",
    colorClass: "step-color-01",
    bgClass: "step-bg-01",
    fields: [
      {
        key: "business_name",
        type: "input",
        label: "Tên thương hiệu / doanh nghiệp của bạn",
        placeholder: "VD: Phở Hùng, Tiệm tóc Mai, Shop Linh…",
        hint: null,
      },
      {
        key: "business_type",
        type: "input",
        label: "Ngành nghề / lĩnh vực",
        placeholder: "VD: quán ăn, tiệm tóc, bán hàng online…",
        hint: null,
      },
      {
        key: "customer_want",
        type: "textarea",
        label: "Khách hàng của bạn đang mong muốn điều gì nhất?",
        placeholder: "VD: Có bữa sáng ngon mà không phải chờ lâu…",
        hint: "Hãy nghĩ về 1 điều duy nhất",
      },
    ],
  },
  {
    id: 2,
    slug: "problem",
    title: "Vấn đề",
    emoji: "⚡",
    color: "#E85D4A",
    colorClass: "step-color-02",
    bgClass: "step-bg-02",
    fields: [
      {
        key: "external_problem",
        type: "textarea",
        label: "Vấn đề thực tế — Khách hàng đang gặp khó khăn gì?",
        placeholder: "VD: Phải mất nhiều giờ tìm hiểu mà vẫn không biết bắt đầu từ đâu…",
        hint: "Vấn đề cụ thể, nhìn thấy được",
      },
      {
        key: "internal_problem",
        type: "textarea",
        label: "Cảm xúc bên trong — Vấn đề đó khiến họ cảm thấy thế nào?",
        placeholder: "VD: Cảm thấy lạc hậu, lo sợ bị bỏ lại phía sau…",
        hint: "Bực bội? Lo lắng? Mệt mỏi?",
      },
      {
        key: "philosophical_problem",
        type: "textarea",
        label: "Điều gì là không công bằng?",
        placeholder: 'VD: Ai cũng xứng đáng được tiếp cận công nghệ AI dù không có nền tảng kỹ thuật…',
        hint: '"Ai cũng xứng đáng được…"',
      },
    ],
  },
  {
    id: 3,
    slug: "guide",
    title: "Người dẫn đường",
    emoji: "🧭",
    color: "#2563EB",
    colorClass: "step-color-03",
    bgClass: "step-bg-03",
    fields: [
      {
        key: "empathy",
        type: "textarea",
        label: "Sự đồng cảm — Bạn hiểu khách hàng như thế nào?",
        placeholder: "VD: Tôi hiểu cảm giác muốn học AI nhưng không biết bắt đầu từ đâu, vì tôi đã từng ở đó…",
        hint: null,
      },
      {
        key: "authority",
        type: "textarea",
        label: "Năng lực & uy tín — Bạn có bằng chứng gì?",
        placeholder: "VD: Đã giúp 200+ học viên từ 0 đến dùng AI trong công việc hàng ngày…",
        hint: null,
      },
    ],
  },
  {
    id: 4,
    slug: "plan",
    title: "Kế hoạch",
    emoji: "📋",
    color: "#5CB85C",
    colorClass: "step-color-04",
    bgClass: "step-bg-04",
    fields: [
      {
        key: "step_1",
        type: "input",
        label: "Bước 1",
        placeholder: "VD: Đăng ký khoá học",
        hint: null,
      },
      {
        key: "step_2",
        type: "input",
        label: "Bước 2",
        placeholder: "VD: Học theo lộ trình từng module",
        hint: null,
      },
      {
        key: "step_3",
        type: "input",
        label: "Bước 3",
        placeholder: "VD: Áp dụng vào công việc thực tế",
        hint: null,
      },
    ],
  },
  {
    id: 5,
    slug: "cta",
    title: "Kêu gọi hành động",
    emoji: "🎯",
    color: "#5C3A22",
    colorClass: "step-color-05",
    bgClass: "step-bg-05",
    fields: [
      {
        key: "direct_cta",
        type: "input",
        label: "Kêu gọi trực tiếp",
        placeholder: "VD: Đăng ký ngay hôm nay",
        hint: null,
      },
      {
        key: "transitional_cta",
        type: "input",
        label: "Kêu gọi gián tiếp",
        placeholder: "VD: Xem chương trình học thử miễn phí",
        hint: null,
      },
    ],
  },
  {
    id: 6,
    slug: "stakes",
    title: "Thành công & Thất bại",
    emoji: "⚖️",
    color: "#F39C12",
    colorClass: "step-color-06",
    bgClass: "step-bg-06",
    fields: [
      {
        key: "success",
        type: "textarea",
        label: "Thành công — Cuộc sống tốt đẹp thế nào?",
        placeholder: "VD: Làm việc nhanh hơn 3x, có thời gian cho gia đình, tự tin dùng AI như công cụ hàng ngày…",
        hint: null,
      },
      {
        key: "failure",
        type: "textarea",
        label: "Thất bại — Nếu không hành động, hậu quả gì?",
        placeholder: "VD: Tiếp tục mất hàng giờ cho công việc lặp lại, bị đồng nghiệp vượt mặt…",
        hint: null,
      },
    ],
  },
  {
    id: 7,
    slug: "transform",
    title: "Chuyển hóa",
    emoji: "🦋",
    color: "#1ABC9C",
    colorClass: "step-color-07",
    bgClass: "step-bg-07",
    fields: [
      {
        key: "from_identity",
        type: "input",
        label: "TRƯỚC — Khách hàng tự nhìn mình như thế nào?",
        placeholder: "VD: Người không giỏi công nghệ, sợ AI",
        hint: null,
      },
      {
        key: "to_identity",
        type: "input",
        label: "SAU — Khách hàng muốn trở thành ai?",
        placeholder: "VD: Người làm chủ AI, làm việc thông minh hơn",
        hint: null,
      },
      {
        key: "controlling_idea",
        type: "textarea",
        label: "Thông điệp cốt lõi — Tóm gọn 1-2 câu",
        placeholder: "VD: AI không phải để thay thế bạn — mà để giải phóng bạn khỏi những công việc lặp đi lặp lại.",
        hint: "(Bonus) Tóm tắt toàn bộ câu chuyện thương hiệu trong 1-2 câu",
      },
    ],
  },
];

export default steps;
