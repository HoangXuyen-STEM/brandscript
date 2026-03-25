# COPILOT TASK — Loại bỏ nút tải HTML, chỉ giữ tải PDF

> Đọc file này trước khi bắt đầu. Task nhỏ, ước tính 15-20 phút.
> KHÔNG commit/push sau khi xong — chờ Xuyen review trước.

---

## Mục tiêu

Loại bỏ hoàn toàn chức năng tải HTML. Người dùng chỉ có thể tải PDF sau khi nhập mã truy cập.

## Lý do

- PDF là sản phẩm trả phí — tải HTML miễn phí làm giảm giá trị
- Người dùng vẫn có thể dùng wizard + xem kết quả miễn phí (không giới hạn)
- Khuyến khích làm 2-3 lần để tìm đúng insight, sau đó mới tải PDF

---

## Tasks

### 1. Xóa nút "Tải HTML" khỏi ExportButtons

**File:** `src/shared/components/ExportButtons.jsx` (hoặc vị trí tương đương sau refactor)

- Xóa nút "Tải HTML" / "Download HTML" khỏi giao diện
- Chỉ giữ lại nút "Tải PDF" (vẫn yêu cầu access code)

### 2. Xóa file exportHTML.js

**File:** `src/shared/export/exportHTML.js` (hoặc vị trí tương đương)

- Xóa hoàn toàn file này
- Xóa mọi import liên quan đến exportHTML trong các file khác

### 3. Cập nhật BrandScriptResult.jsx

**File:** `src/features/brandscript/BrandScriptResult.jsx`

- Đảm bảo không còn reference đến exportHTML
- Giữ nguyên thông báo khuyến khích: "Hãy thử làm lại 2-3 lần để tìm đúng insight"
- Cập nhật text thông báo thành: "Hãy thử làm lại 2-3 lần để tìm đúng insight cho thương hiệu của bạn. Khi đã hài lòng, hãy tải PDF để lưu trữ và chia sẻ."

### 4. Cập nhật BrandDNAResult.jsx (nếu có nút tải HTML)

**File:** `src/features/brand-dna/BrandDNAResult.jsx`

- Đảm bảo không có nút tải HTML
- Chỉ có nút "Tải PDF" (cùng access code gate)

### 5. Dọn dẹp

- Xóa mọi reference đến `exportHTML` trong codebase: `grep -r "exportHTML\|export.*HTML\|html_downloaded" src/`
- Xóa Umami event `html_downloaded` nếu có (giữ các events khác)
- Kiểm tra `npm run build` thành công, không có dead imports

---

## Testing checklist

- [ ] Không còn nút "Tải HTML" trên trang BrandScriptResult
- [ ] Không còn nút "Tải HTML" trên trang BrandDNAResult
- [ ] Nút "Tải PDF" vẫn hoạt động, hiện AccessCodeGate modal
- [ ] Nhập mã đúng → tải PDF thành công
- [ ] File exportHTML.js đã bị xóa
- [ ] `grep -r "exportHTML" src/` trả về 0 kết quả
- [ ] `npm run build` thành công, không lỗi
- [ ] Thông báo khuyến khích đã cập nhật text mới

Báo cáo PASS/FAIL cho từng item. KHÔNG commit/push — chờ review.
