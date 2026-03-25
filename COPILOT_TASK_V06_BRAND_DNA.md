# COPILOT TASK — v0.6 Brand DNA Generator

> Đọc file này + SPEC_BRANDSCRIPT.md + BRAND_DNA.md + SKILLS.md trước khi bắt đầu.
> Đọc frontend-design SKILL.md trước khi build components.
> v0.6 có 3 sub-phases: 6A (refactor), 6B (Brand DNA wizard), 6C (kết quả + preview).
> Hoàn thành testing checklist 100% mỗi sub-phase trước khi chuyển tiếp.

---

## QUAN TRỌNG — Đọc trước khi code

- **1 mã = tất cả PDF** (BrandScript + Brand DNA). Không tách mã riêng.
- **generated_tokens là DERIVED STATE** — sinh từ thuật toán, KHÔNG lưu vào localStorage.
- **Canonical state cho Brand DNA** chỉ gồm: brand_mood, brand_color, accent_color, brand_dna_algo_version.
- **WCAG AA contrast validation là BẮT BUỘC** cho mọi text/bg combination.
- **KHÔNG xóa 4 file .md ở root.**

---

## Phase 6A: Refactor folder structure (30 phút)

### Mục tiêu
Tách code hiện tại theo domain TRƯỚC KHI thêm Brand DNA. Không thay đổi logic, chỉ di chuyển files.

### Folder structure mới

```
src/
├── features/
│   ├── brandscript/
│   │   ├── Wizard.jsx
│   │   ├── StepForm.jsx
│   │   ├── BrandScriptResult.jsx
│   │   ├── OneLiner.jsx
│   │   └── oneliner.js
│   └── brand-dna/               ← TẠO MỚI (trống, để Phase 6B)
├── shared/
│   ├── components/
│   │   ├── FieldInput.jsx
│   │   ├── ProgressBar.jsx
│   │   ├── StepChips.jsx
│   │   └── ExportButtons.jsx
│   ├── export/
│   │   ├── exportHTML.js
│   │   └── exportPDF.js
│   └── auth/
│       ├── hash.js
│       ├── access-codes.js
│       └── AccessCodeGate.jsx
├── data/
│   ├── steps.js
│   └── example-xuyen.js
├── styles/
│   └── globals.css
├── App.jsx
├── Landing.jsx
└── main.jsx
```

### Tasks
1. Tạo thư mục `src/features/brandscript/`, `src/features/brand-dna/`, `src/shared/components/`, `src/shared/export/`, `src/shared/auth/`
2. Di chuyển files theo cấu trúc trên
3. Cập nhật TẤT CẢ import paths trong mọi file
4. Landing.jsx và App.jsx ở root src/ (chúng dùng cả 2 features)

### Testing checklist Phase 6A
- [ ] `npm run build` thành công, không lỗi
- [ ] `npm run dev` chạy OK
- [ ] Wizard 7 bước hoạt động bình thường (không regression)
- [ ] Tải HTML hoạt động
- [ ] Tải PDF hoạt động (cần mã)
- [ ] AccessCodeGate modal hiển thị đúng
- [ ] Thư mục `src/features/brand-dna/` đã tồn tại (trống)
- [ ] Không còn file nào trong `src/components/` hay `src/utils/` (đã di chuyển hết)

---

## Phase 6B: Brand DNA Wizard — Bước 8-10 (2 giờ)

### Mục tiêu
Thêm 3 bước mới (8, 9, 10) sau khi user xem kết quả BrandScript. Tạo thuật toán tinted neutrals.

### 6B.1 — Data: moods.js

**File:** `src/features/brand-dna/moods.js`

6 mood presets:

```javascript
export const moods = [
  {
    id: 'warm',
    name: 'Ấm áp & gần gũi',
    description: 'Cà phê, handmade, gia đình',
    temperature: 1,        // warm = positive
    suggestedHues: [20, 35], // nâu, cam
    shadowHue: 25,
    presetColors: ['#8B5E3C', '#C4651A', '#A0522D', '#D2691E']
  },
  {
    id: 'cool',
    name: 'Chuyên nghiệp & đáng tin',
    description: 'Công nghệ, tài chính, tư vấn',
    temperature: -1,       // cool = negative
    suggestedHues: [210, 230],
    shadowHue: 220,
    presetColors: ['#2563EB', '#1E40AF', '#3B82F6', '#1D4ED8']
  },
  {
    id: 'bright',
    name: 'Tươi trẻ & năng động',
    description: 'Giáo dục, thể thao, trẻ em',
    temperature: 0.5,
    suggestedHues: [90, 160],
    shadowHue: 120,
    presetColors: ['#16A34A', '#059669', '#84CC16', '#10B981']
  },
  {
    id: 'dark',
    name: 'Sang trọng & tinh tế',
    description: 'Thời trang, spa, nhà hàng cao cấp',
    temperature: -0.5,
    suggestedHues: [40, 50],
    shadowHue: 35,
    presetColors: ['#92400E', '#78350F', '#B45309', '#A16207']
  },
  {
    id: 'earth',
    name: 'Mộc mạc & tự nhiên',
    description: 'Nông sản, organic, thủ công',
    temperature: 0.8,
    suggestedHues: [25, 45],
    shadowHue: 30,
    presetColors: ['#6B4423', '#8B6914', '#7C5B2A', '#5D4037']
  },
  {
    id: 'bold',
    name: 'Sáng tạo & khác biệt',
    description: 'Design, nghệ thuật, startup',
    temperature: 0,
    suggestedHues: [270, 330],
    shadowHue: 280,
    presetColors: ['#7C3AED', '#DB2777', '#9333EA', '#C026D3']
  }
];
```

### 6B.2 — Thuật toán: tintedNeutrals.js

**File:** `src/features/brand-dna/tintedNeutrals.js`

```javascript
/**
 * Sinh toàn bộ design tokens từ 1 brand color + 1 accent color + mood.
 * 
 * @param {string} brandColor - hex color, VD: "#8B5E3C"
 * @param {string} accentColor - hex color, VD: "#2563EB"
 * @param {object} mood - mood object từ moods.js
 * @returns {object} { light: {...tokens}, dark: {...tokens}, warnings: [] }
 */
export function generateTokens(brandColor, accentColor, mood) {
  // 1. Parse hex → HSL
  // 2. Clamp saturation: min 15%, max 85%
  // 3. Adjust hue 40-80 (vàng/lime) cho perceived luminance
  // 4. Sinh light mode tokens theo công thức trong Technical Overview section 3.4
  // 5. Sinh dark mode tokens RIÊNG (không chỉ đảo lightness)
  // 6. Validate WCAG AA cho mọi text/bg combination
  // 7. Trả về tokens + warnings nếu contrast không đạt
}
```

**WCAG AA validation bắt buộc:**
- `text` trên `bg` ≥ 4.5:1
- `text` trên `surface` ≥ 4.5:1
- `text2` trên `surface` ≥ 4.5:1
- `textMuted` trên `surface` ≥ 3:1
- Button label (white hoặc dark) trên `brand` ≥ 4.5:1
- Test cả light và dark mode

Nếu contrast không đạt → tự động adjust lightness và thêm warning vào output.

### 6B.3 — Color utilities: colorUtils.js

**File:** `src/features/brand-dna/colorUtils.js`

```javascript
export function hexToHsl(hex) { /* ... */ }
export function hslToHex(h, s, l) { /* ... */ }
export function hexToRgb(hex) { /* ... */ }
export function contrastRatio(hex1, hex2) { /* ... */ }  // WCAG formula
export function relativeLuminance(hex) { /* ... */ }
export function isWcagAA(foreground, background) { /* ratio >= 4.5 */ }
export function isWcagAALarge(foreground, background) { /* ratio >= 3.0 */ }
export function complementaryColor(hex) { /* ... */ }
export function analogousColors(hex) { /* ... */ }
export function triadicColors(hex) { /* ... */ }
```

### 6B.4 — Components

**MoodSelector.jsx** (`src/features/brand-dna/MoodSelector.jsx`)
- Hiển thị 6 mood cards dạng grid (2x3 hoặc 3x2)
- Mỗi card: tên, mô tả, 4 color swatches nhỏ, border highlight khi selected
- Click chọn 1 mood → lưu vào state

**ColorPicker.jsx** (`src/features/brand-dna/ColorPicker.jsx`)
- Hiển thị preset colors từ mood đã chọn (4 presetColors)
- Color input cho custom color (`<input type="color">`)
- Preview swatch lớn cho màu đang chọn
- Hiển thị HEX code

**AccentSuggester.jsx** (`src/features/brand-dna/AccentSuggester.jsx`)
- Gợi ý 3 accent colors: complementary, analogous, triadic
- Mỗi gợi ý: swatch + tên loại (VD: "Bổ sung", "Liền kề", "Tam giác")
- Cho phép chọn custom accent bằng color input
- Preview: brand color + accent color cạnh nhau

**BrandDNAWizard.jsx** (`src/features/brand-dna/BrandDNAWizard.jsx`)
- Container cho 3 bước 8-9-10
- Quản lý state: brand_mood, brand_color, accent_color
- Lưu canonical state vào localStorage (key: 'bs_brand_dna')
- Nút "Xem Brand DNA" khi hoàn thành bước 10

### 6B.5 — Tích hợp vào App.jsx

Sau trang BrandScriptResult, thêm nút CTA:
```
🎨 Tiếp tục: Tạo Brand DNA cho thương hiệu của bạn
```

Click → chuyển sang BrandDNAWizard (bước 8-10).

### Testing checklist Phase 6B
- [ ] moods.js export đúng 6 moods, mỗi mood có id, name, presetColors
- [ ] tintedNeutrals.js sinh tokens hợp lệ cho mỗi mood
- [ ] colorUtils.js: hexToHsl → hslToHex roundtrip chính xác
- [ ] contrastRatio tính đúng (test: white trên black = 21:1)
- [ ] WCAG validation: tokens sinh ra đạt AA cho cả light và dark
- [ ] Edge case: brandSat < 15% → clamp lên 15%
- [ ] Edge case: brandSat > 85% → giảm tint coefficients
- [ ] Edge case: hue 40-80 (vàng/lime) → perceived luminance adjustment
- [ ] MoodSelector hiển thị 6 cards, click chọn được
- [ ] ColorPicker hiển thị presets + custom color input
- [ ] AccentSuggester gợi ý 3 loại accent
- [ ] BrandDNAWizard navigate 3 bước, lưu state localStorage
- [ ] Nút CTA hiện sau BrandScriptResult
- [ ] Mobile responsive: 360px, 768px

---

## Phase 6C: Brand DNA Result + Preview (1.5 giờ)

### Mục tiêu
Hiển thị kết quả Brand DNA: palette, typography, shadows, card preview. Chưa export PDF (để v0.7).

### Components

**BrandDNAResult.jsx** (`src/features/brand-dna/BrandDNAResult.jsx`)
- Gọi `generateTokens(brand_color, accent_color, mood)` → lấy tokens
- Hiển thị:
  1. **Palette section**: swatches cho bg, surface, surface2, border, text (3 cấp), brand, accent
  2. **Typography section**: preview text ở mỗi cấp (H1, H2, Body, Label, Hint) dùng tokens
  3. **Shadow section**: 3 card examples với shadow-sm, shadow-md, shadow-lg
  4. **Card preview**: 1 card demo dùng toàn bộ tokens (giống card demo trong BRAND_DNA.md)
  5. **Badge preview**: brand badge + accent badge
  6. **Warnings**: hiện nếu WCAG validation có cảnh báo
- Nút "Chỉnh sửa" → quay lại BrandDNAWizard
- Nút "Tải PDF" (cùng access code gate với BrandScript)
- CSS variables section: hiện code CSS copy-paste được

### Quy tắc hiển thị
- Dùng tokens VỪA SINH RA để style chính trang kết quả (dogfooding)
- Swatch hiển thị HEX code bên dưới
- Card preview phải dùng đúng: surface bg, border, shadow-md, text tokens, badge tokens
- Nếu có WCAG warnings, hiện banner cam: "⚠️ Một số màu chưa đạt chuẩn WCAG AA. Hãy chọn màu đậm hơn."

### Testing checklist Phase 6C
- [ ] BrandDNAResult render palette swatches đúng màu
- [ ] Typography preview dùng đúng tokens
- [ ] Shadow preview có 3 cấp rõ rệt
- [ ] Card demo dùng toàn bộ tokens sinh ra
- [ ] Badge brand + accent hiển thị đúng
- [ ] CSS variables section copy-paste được
- [ ] WCAG warnings hiện khi contrast không đạt
- [ ] Nút "Chỉnh sửa" quay lại wizard
- [ ] Nút "Tải PDF" hiện AccessCodeGate (cùng mã với BrandScript)
- [ ] Mobile responsive: 360px, 768px

---

## Nguyên tắc styling

- Font: Be Vietnam Pro — KHÔNG dùng Inter/Roboto/Arial
- Shadow: rgba(100,60,30) cho XuyenLab app — Brand DNA preview dùng shadow tokens VỪA SINH RA
- KHÔNG dùng #FFFFFF, #000000, #F5F5F5 — dùng tokens từ BRAND_DNA.md cho app shell
- Mọi badge dùng brand-subtle hoặc accent-subtle

---

## Tóm tắt thời gian

| Phase | Nội dung | Ước tính |
| --- | --- | --- |
| 6A | Refactor folder structure | 30 phút |
| 6B | Brand DNA Wizard + Algorithm | 2 giờ |
| 6C | Result + Preview | 1.5 giờ |
| **Tổng v0.6** | | **~4 giờ** |
