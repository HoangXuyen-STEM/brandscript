# SPEC — BrandScript Builder (brandscript.xuyenlab.com)

> **Tài liệu này là nguồn sự thật duy nhất (single source of truth) cho dự án.**
> Agent (Copilot/Antigravity) đọc file này + BRAND_DNA.md + SKILLS.md trước khi bắt đầu bất kỳ task nào.
> **ĐỌC SETUP.md ĐẦU TIÊN** nếu chưa scaffold project.
> Không được thay đổi nội dung câu hỏi, cấu trúc dữ liệu, hoặc logic bảo mật mà không có sự đồng ý của Xuyen.
> **KHÔNG BAO GIỜ xóa các file .md ở root.**

---

## Project overview

- **Product:** XuyenLab BrandScript Builder
- **Domain:** `brandscript.xuyenlab.com`
- **Package name:** `brandscript-xuyenlab` (KHÔNG có dấu chấm)
- **Stack:** React + Vite + Tailwind CSS → Cloudflare Pages
- **Status:** Prototype done in Claude.ai artifact, needs production build
- **Approach:** Agentic engineering — human (Xuyen) owns architecture, AI implements from this spec

---

## What this is

A Vietnamese-localized StoryBrand BrandScript builder tool. Users answer 7 guided questions (wizard flow) to create their brand story. Based on Donald Miller's SB7 Framework, adapted for Vietnamese small businesses and solo entrepreneurs.

**Core value:** Giúp hộ kinh doanh nhỏ tìm được câu chuyện thương hiệu rõ ràng, hấp dẫn — trong 15 phút.

---

## Architecture

### Tech stack

| Layer | Choice | Reason |
| --- | --- | --- |
| Frontend | React + Vite | Fast build, single-page app |
| Styling | Tailwind CSS | Utility-first, easy theming |
| Font | Be Vietnam Pro (Google Fonts) | Vietnamese-optimized |
| Hosting | Cloudflare Pages | Free, fast, same infra as blog.xuyenlab.com |
| PDF export | Client-side (jsPDF + html2canvas) | No server needed |
| AI features (Phase 3) | Claude API via Cloudflare Worker | Proxy to hide API key |
| Analytics | Umami (self-hosted at umami.xuyenlab.com) | Privacy-friendly, already running |
| Payment | VietQR (Agribank) + access code system | No payment gateway needed |

### Folder structure

```
brandscript/
├── SPEC_BRANDSCRIPT.md          ← KHÔNG ĐƯỢC XÓA
├── BRAND_DNA.md                 ← KHÔNG ĐƯỢC XÓA
├── SKILLS.md                    ← KHÔNG ĐƯỢC XÓA
├── SETUP.md                     ← KHÔNG ĐƯỢC XÓA
├── public/
│   └── favicon.svg
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── components/
│   │   ├── Landing.jsx
│   │   ├── Wizard.jsx
│   │   ├── StepForm.jsx
│   │   ├── FieldInput.jsx
│   │   ├── ProgressBar.jsx
│   │   ├── StepChips.jsx
│   │   ├── BrandScriptResult.jsx
│   │   ├── OneLiner.jsx
│   │   ├── ExportButtons.jsx
│   │   └── AccessCodeGate.jsx
│   ├── data/
│   │   ├── steps.js
│   │   ├── example-xuyen.js
│   │   └── access-codes.js
│   ├── utils/
│   │   ├── oneliner.js
│   │   ├── exportHTML.js
│   │   ├── exportPDF.js
│   │   └── hash.js
│   └── styles/
│       └── globals.css
├── package.json                 ← name: "brandscript-xuyenlab"
├── vite.config.js
├── tailwind.config.js
└── index.html
```

---

## Security architecture — 3 cổng kiểm tra

MỌI request đều phải qua 3 cổng:

### Cổng 1: Xác thực — Người gửi là ai?

| Ngữ cảnh | Cách xác thực |
| --- | --- |
| Người dùng thường (Phase 1) | Không cần đăng nhập. Định danh bằng fingerprint: localStorage ID + device info hash |
| Người dùng có access code (Phase 2) | Xác thực qua SHA-256 hash của access code. Code hợp lệ → gán role |
| Admin — Xuyen (Phase 3) | API key trong Cloudflare Worker env var. KHÔNG bao giờ expose ra client |

### Cổng 2: Phân quyền — Quyền của họ là gì?

| Role | Quyền |
| --- | --- |
| anonymous | Dùng wizard 7 bước, xem kết quả, tải HTML |
| solo-vip | Tất cả anonymous + tải PDF không giới hạn |
| paid-user | Tất cả anonymous + tải PDF (giới hạn 3-5 lần) |
| ai-user (Phase 3) | Tất cả paid-user + gọi AI gợi ý nội dung |
| admin | Full access + quản lý access codes |

### Cổng 3: Kiểm soát hành vi — Có được thực hiện không?

| Hành vi | Kiểm soát |
| --- | --- |
| Nhập form | Rate limit: max 60 thay đổi/phút (chống bot spam) |
| Tải HTML | Không giới hạn, nhưng log event qua Umami |
| Tải PDF | Kiểm tra: code hợp lệ → role đúng → còn lượt dùng → cho phép |
| Gọi AI API (Phase 3) | Rate limit: max 10 request/giờ/user |
| Nhập access code sai | Max 5 lần sai liên tiếp → khóa 15 phút (chống brute-force) |

### Implementation chi tiết

**Access code verification flow:**
```javascript
// 1. User nhập code
// 2. Hash client-side: SHA-256(code)
// 3. So sánh với danh sách hash trong access-codes.js
// 4. Nếu khớp → kiểm tra max_uses vs usage count trong localStorage
// 5. Nếu còn lượt → cho phép tải PDF, tăng usage count
// 6. Nếu hết lượt → hiển thị "Mã đã hết lượt sử dụng"
```

**Brute-force protection:**
```javascript
// localStorage key: 'bs_failed_attempts'
// Mỗi lần sai → tăng counter + lưu timestamp
// counter >= 5 trong 15 phút → disable input, hiện countdown
// Sau 15 phút → reset
```

**Phase 3: Cloudflare Worker security:**
```javascript
// 1. Xác thực: request phải có valid access code hash trong header
// 2. Phân quyền: code phải thuộc role 'ai-user' hoặc 'admin'
// 3. Rate limit: Cloudflare KV lưu count per user per hour
// API key Claude KHÔNG BAO GIỜ gửi về client
```

---

## Phases — triển khai từng bước, test sau mỗi phase

> **Nguyên tắc: Agent chỉ thực hiện 1 phase. Hoàn thành testing 100% trước khi chuyển phase. Test fail → fix trước, KHÔNG skip.**

### Phase 1A: Scaffold + Data (45 phút)

**Tasks:**
1. Scaffold Vite + React + Tailwind **(ĐỌC SETUP.md TRƯỚC — KHÔNG dùng `npm create vite@latest .`)**
2. Cài dependencies: jspdf, html2canvas
3. Tạo `src/data/steps.js` — copy chính xác từ section "7 Steps" bên dưới
4. Tạo `src/data/example-xuyen.js` — dữ liệu ví dụ khóa học AI
5. Tạo `src/styles/globals.css` — design tokens từ BRAND_DNA.md
6. Tạo `src/utils/oneliner.js` — thuật toán one-liner

**Testing checklist Phase 1A:**
- [ ] `npm run dev` chạy không lỗi
- [ ] 4 file .md vẫn còn nguyên ở root
- [ ] `package.json` name = "brandscript-xuyenlab"
- [ ] Import steps.js → đúng 7 steps, mỗi step có fields
- [ ] Import example data → có đủ 18 fields
- [ ] CSS variables render đúng (kiểm tra DevTools)
- [ ] oneliner.js trả về string hợp lệ với example data
- [ ] oneliner.js trả về null khi data rỗng

### Phase 1B: Wizard UI (1.5 giờ)

**Tasks:**
1. Build `FieldInput.jsx`
2. Build `ProgressBar.jsx`
3. Build `StepChips.jsx`
4. Build `StepForm.jsx`
5. Build `Wizard.jsx`
6. Tích hợp localStorage auto-save (debounce 500ms)

**Testing checklist Phase 1B:**
- [ ] 7 bước hiển thị đúng tiếng Việt
- [ ] Placeholder hiển thị ví dụ tiếng Việt
- [ ] Forward/back navigation hoạt động
- [ ] Chip navigation nhảy đúng bước
- [ ] Nhập text → lưu vào state
- [ ] Refresh trang → dữ liệu còn nguyên (localStorage)
- [ ] FadeIn animation khi chuyển bước
- [ ] Mobile responsive: 360px, 768px

### Phase 1C: Landing + Result + Export HTML (1.5 giờ)

**Tasks:**
1. Build `Landing.jsx` — 2 cards + overview 7 bước
2. Build `OneLiner.jsx`
3. Build `BrandScriptResult.jsx`
4. Build `ExportButtons.jsx` + `exportHTML.js`
5. Build `App.jsx` — router
6. Load example data khi bấm "Xem ví dụ mẫu"

**Testing checklist Phase 1C:**
- [ ] Landing page hiển thị 2 cards
- [ ] "Bắt đầu" → vào Wizard bước 1
- [ ] "Xem ví dụ" → load data + vào Wizard
- [ ] Điền xong → "Xem BrandScript" → Result page
- [ ] One-liner tự động hiển thị đúng
- [ ] "Chỉnh sửa" → quay lại Wizard
- [ ] "Làm lại" → xóa sạch + về Landing
- [ ] Tải HTML → file mở được, tiếng Việt đúng
- [ ] HTML responsive khi in (Ctrl+P)

### Phase 2A: PDF + Access Code + Security (2 giờ)

**Tasks:**
1. `src/utils/exportPDF.js` — jsPDF
2. `AccessCodeGate.jsx` — modal nhập mã
3. `src/utils/hash.js` — SHA-256 (Web Crypto API)
4. `src/data/access-codes.js` — danh sách hash
5. Brute-force protection
6. Usage tracking localStorage
7. VietQR payment instructions

**Testing checklist Phase 2A:**
- [ ] "Tải PDF" không có code → hiện modal
- [ ] Code đúng (VIP) → tải PDF thành công
- [ ] Code paid (3 lượt) → tải 3 lần OK
- [ ] Lần 4 → "Mã đã hết lượt"
- [ ] Sai 5 lần → khóa 15 phút
- [ ] Sau 15 phút → unlock
- [ ] PDF tiếng Việt đúng, layout A4 OK
- [ ] **SECURITY: DevTools → access-codes.js chỉ chứa hash**
- [ ] **SECURITY: Console gọi exportPDF → bị chặn (kiểm tra auth trước)**
- [ ] **SECURITY: Xóa localStorage → vẫn cần code hợp lệ**

### Phase 2B: Deployment + Analytics (1 giờ)

**Tasks:**
1. GitHub repo `xuyenlab/brandscript`
2. Cloudflare Pages + custom domain
3. Umami analytics + events tracking
4. Production testing

**Testing checklist Phase 2B:**
- [ ] `brandscript.xuyenlab.com` load OK
- [ ] HTTPS OK
- [ ] PDF tải được trên production
- [ ] Umami events fire đúng
- [ ] Mobile: iPhone Safari + Android Chrome
- [ ] Lighthouse: Performance > 90, Accessibility > 90

### Phase 3: AI Features (future)
Chỉ bắt đầu khi Phase 2B xong + 20 người dùng thực. Xem chi tiết trong Notion.

---

## Data model

### BrandScript data

```json
{
  "business_name": "string",
  "business_type": "string",
  "customer_want": "string",
  "external_problem": "string",
  "internal_problem": "string",
  "philosophical_problem": "string",
  "empathy": "string",
  "authority": "string",
  "step_1": "string",
  "step_2": "string",
  "step_3": "string",
  "direct_cta": "string",
  "transitional_cta": "string",
  "success": "string",
  "failure": "string",
  "from_identity": "string",
  "to_identity": "string",
  "controlling_idea": "string"
}
```

### Access codes

```json
[
  { "hash": "sha256-of-code", "max_uses": -1, "label": "SOLO-VIP" },
  { "hash": "sha256-of-paid-code", "max_uses": 5, "label": "PAID-001" }
]
```

---

## 7 Steps — exact questions (Vietnamese)

> Do NOT change wording without Xuyen's approval.

### Step 01: Nhân vật chính (👤 #8B5E3C)
1. **business_name** (input): "Tên thương hiệu / doanh nghiệp của bạn" — placeholder: "VD: Phở Hùng, Tiệm tóc Mai, Shop Linh…"
2. **business_type** (input): "Ngành nghề / lĩnh vực" — placeholder: "VD: quán ăn, tiệm tóc, bán hàng online…"
3. **customer_want** (textarea): "Khách hàng của bạn đang mong muốn điều gì nhất?" — hint: "Hãy nghĩ về 1 điều duy nhất" — placeholder: "VD: Có bữa sáng ngon mà không phải chờ lâu…"

### Step 02: Vấn đề (⚡ #E85D4A)
1. **external_problem** (textarea): "Vấn đề thực tế — Khách hàng đang gặp khó khăn gì?" — hint: "Vấn đề cụ thể, nhìn thấy được"
2. **internal_problem** (textarea): "Cảm xúc bên trong — Vấn đề đó khiến họ cảm thấy thế nào?" — hint: "Bực bội? Lo lắng? Mệt mỏi?"
3. **philosophical_problem** (textarea): "Điều gì là không công bằng?" — hint: '"Ai cũng xứng đáng được…"'

### Step 03: Người dẫn đường (🧭 #2563EB)
1. **empathy** (textarea): "Sự đồng cảm — Bạn hiểu khách hàng như thế nào?"
2. **authority** (textarea): "Năng lực & uy tín — Bạn có bằng chứng gì?"

### Step 04: Kế hoạch (📋 #5CB85C)
1. **step_1** (input): "Bước 1"
2. **step_2** (input): "Bước 2"
3. **step_3** (input): "Bước 3"

### Step 05: Kêu gọi hành động (🎯 #5C3A22)
1. **direct_cta** (input): "Kêu gọi trực tiếp"
2. **transitional_cta** (input): "Kêu gọi gián tiếp"

### Step 06: Thành công & Thất bại (⚖️ #F39C12)
1. **success** (textarea): "Thành công — Cuộc sống tốt đẹp thế nào?"
2. **failure** (textarea): "Thất bại — Nếu không hành động, hậu quả gì?"

### Step 07: Chuyển hóa (🦋 #1ABC9C)
1. **from_identity** (input): "TRƯỚC — Khách hàng tự nhìn mình như thế nào?"
2. **to_identity** (input): "SAU — Khách hàng muốn trở thành ai?"
3. **controlling_idea** (textarea, bonus): "Thông điệp cốt lõi — Tóm gọn 1-2 câu"

---

## One-liner algorithm

```javascript
// "Hầu hết [khách hàng ngành {business_type}] đều gặp phải: [{external_problem} first sentence, lowercase].
// {business_name} giúp bạn [{customer_want} first sentence, lowercase].
// Để bạn [{success} first sentence, lowercase]."
// Truncate each part at 80 chars + "…"
```

---

## Design tokens

> Xem chi tiết: `BRAND_DNA.md`. Step colors:

| Step | Color |
| --- | --- |
| 01 Character | #8B5E3C (brand brown) |
| 02 Problem | #E85D4A |
| 03 Guide | #2563EB (accent blue) |
| 04 Plan | #5CB85C |
| 05 CTA | #5C3A22 (brand dark) |
| 06 Stakes | #F39C12 |
| 07 Transform | #1ABC9C |

---

## Deployment

1. GitHub repo: `xuyenlab/brandscript`
2. Cloudflare Pages, build: `npm run build`, output: `dist`
3. Custom domain: `brandscript.xuyenlab.com`
4. Umami: `umami.xuyenlab.com`, track events

---

## Tổng thời gian

| Phase | Nội dung | Thời gian |
| --- | --- | --- |
| 1A | Scaffold + Data | 45 phút |
| 1B | Wizard UI | 1.5 giờ |
| 1C | Landing + Result + HTML | 1.5 giờ |
| 2A | PDF + Security | 2 giờ |
| 2B | Deploy + Analytics | 1 giờ |
| **Tổng** | **Production-ready** | **~7 giờ** |

---

## Boundaries — KHÔNG build

- NO user accounts / login
- NO server-side database
- NO payment gateway (VietQR + manual codes)
- NO multi-language (Vietnamese only)
- NO AI in Phase 1-2
- NO complex state management

---

## Testing — quy tắc

> Agent PHẢI hoàn thành 100% checklist mỗi phase trước khi chuyển tiếp.
> Security tests (SECURITY) là bắt buộc — không skip.

**Quy trình:** Đọc spec → Implement → Test checklist → Fix fails → 100% PASS → Báo cáo Xuyen → Approve → Phase tiếp.

---

## References

- StoryBrand SB7: Donald Miller — Building a StoryBrand
- Prototype: React artifact in Claude.ai
- Design: `BRAND_DNA.md`
- Skills: `SKILLS.md`
- Setup: `SETUP.md`
- Notion SPEC: https://www.notion.so/32b0ed5fbd47819a8306dcbfa0c06693
- Notion Brand DNA: https://www.notion.so/32b0ed5fbd478185a45acfe9bc13153d
