# COPILOT TASK — Hoàn thành Phase 2B + Chuẩn bị beta testing

> Đọc file này + SPEC_BRANDSCRIPT.md + BRAND_DNA.md + SKILLS.md trước khi bắt đầu.
> Đây là các task còn lại để hoàn thành Phase 2B và chuẩn bị cho beta testing.

---

## Task 1: Fix AccessCodeGate modal — thêm thông tin thanh toán đầy đủ

**File:** `src/components/AccessCodeGate.jsx`

Cập nhật modal với nội dung sau:

### 1.1 Thêm trường nhập email (phía TRÊN trường nhập mã)

```
Label: "Email của bạn (để nhận PDF)"
Placeholder: "VD: ten@gmail.com"
Type: email
Required: true
Validation: kiểm tra format email cơ bản (contains @ and .)
```

Khi user nhập email + mã đúng → lưu email vào localStorage key `bs_user_email`.

### 1.2 Cập nhật nội dung HƯỚNG DẪN THANH TOÁN trong modal

Thay thế nội dung hiện tại bằng:

```
📋 BẢNG GIÁ
• 50.000đ — Tải PDF 4 lần
• 79.000đ — Tải PDF mãi mãi
• Solo VIP — Không giới hạn (liên hệ)

💳 CHUYỂN KHOẢN
Ngân hàng: Agribank
Số tài khoản: 5202205009030
Chủ tài khoản: DO HOANG XUYEN
Nội dung CK: BRAND [email hoặc SĐT]

[Hiển thị ảnh QR từ public/vietqr.png nếu có, fallback text nếu không]

Sau khi chuyển khoản, gửi ảnh chụp cho XuyenLab qua Zalo để nhận mã.
```

Styling: dùng design tokens từ BRAND_DNA.md. Bảng giá dùng `--color-brand-subtle` cho background. Thông tin ngân hàng dùng `--color-surface-2` cho background. Font mono cho số tài khoản.

### 1.3 Cập nhật access-codes.js

Thêm pricing tiers mới (giữ nguyên các mã cũ):
- `paid-4x`: max_uses = 4 (cho gói 50K)
- `paid-forever`: max_uses = -1 (cho gói 79K)
- Giữ `solo-vip`: max_uses = -1

Test code hiện có giữ nguyên: PAID-DEMO-001 (3 uses)

---

## Task 2: Thêm thông báo khuyến khích trên trang kết quả

**File:** `src/components/BrandScriptResult.jsx`

Thêm một thông báo **phía trên** các nút export (trước ExportButtons):

```
💡 Hãy thử làm lại 2-3 lần để tìm đúng insight cho thương hiệu của bạn.
Bạn có thể chụp màn hình hoặc tải HTML miễn phí.
```

Styling: dùng `--color-accent-subtle` cho background, `--color-accent` cho icon/text nhấn mạnh. Bo góc 8px. Padding 12px 16px. Font size 14px.

---

## Task 3: Commit và push các file chưa tracked

Chạy các lệnh sau:

```bash
# Commit file .env.production (Umami config)
git add .env.production
git commit -m "Add Umami production config"

# Commit các file test từ Phase 2B
git add lighthouse-phase2b.json check-prod-pdf.mjs mobile-check.mjs
git commit -m "Add Phase 2B test scripts"

# Commit tất cả thay đổi từ Task 1 + Task 2
git add -A
git commit -m "Phase 2B: fix AccessCodeGate modal with VietQR payment details + encouragement message"

# Push lên GitHub
git push
```

---

## Task 4: Chạy Lighthouse trên production

Sau khi deploy xong (Cloudflare Pages tự build từ push):

```bash
npx lighthouse https://brandscript.xuyenlab.com --quiet --chrome-flags='--headless=new --no-sandbox' --only-categories=performance,accessibility --output=json --output-path=./lighthouse-prod.json

# Kiểm tra kết quả
node -e "const r=require('./lighthouse-prod.json'); console.log('Performance:', Math.round(r.categories.performance.score*100)); console.log('Accessibility:', Math.round(r.categories.accessibility.score*100));"
```

Yêu cầu: Performance > 90, Accessibility > 90.

---

## Task 5: Test trên mobile

Mở headless Chrome với viewport mobile:

```bash
google-chrome --headless=new --disable-gpu --no-sandbox --window-size=360,640 --screenshot=mobile-360.png https://brandscript.xuyenlab.com
google-chrome --headless=new --disable-gpu --no-sandbox --window-size=768,1024 --screenshot=mobile-768.png https://brandscript.xuyenlab.com
```

Kiểm tra: layout không bị vỡ, text không bị cắt, buttons đủ lớn để tap.

---

## Testing Checklist Phase 2B (đầy đủ)

- [ ] `brandscript.xuyenlab.com` load được (HTTP 200)
- [ ] HTTPS hoạt động
- [ ] Wizard hoạt động trên production
- [ ] PDF tải được trên production
- [ ] AccessCodeGate modal hiển thị email field
- [ ] AccessCodeGate modal hiển thị bảng giá (50K/4 lần, 79K/mãi mãi)
- [ ] AccessCodeGate modal hiển thị thông tin Agribank + số tài khoản
- [ ] Thông báo khuyến khích hiển thị trên trang kết quả
- [ ] Umami dashboard hiển thị page views
- [ ] Umami events fire đúng (kiểm tra Network tab)
- [ ] Mobile responsive: 360px
- [ ] Mobile responsive: 768px
- [ ] Lighthouse Performance > 90
- [ ] Lighthouse Accessibility > 90
- [ ] Tất cả file đã commit + push lên GitHub

Báo cáo PASS/FAIL cho từng item.

---

## Nguyên tắc quan trọng

- **1 mã = tất cả PDF** (BrandScript + Brand DNA khi có). Không tách mã riêng.
- **KHÔNG xóa 4 file .md ở root** (SETUP, SPEC, BRAND_DNA, SKILLS)
- Dùng design tokens từ BRAND_DNA.md cho mọi styling mới
- Dùng font Be Vietnam Pro, KHÔNG dùng Inter/Roboto/Arial
- Shadow dùng rgba(100,60,30), KHÔNG dùng rgba(0,0,0)
