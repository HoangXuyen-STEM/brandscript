# SETUP — Hướng dẫn thiết lập dự án BrandScript Builder

> **ĐỌC FILE NÀY ĐẦU TIÊN trước khi làm bất kỳ thao tác nào.**
> File này giải quyết các lỗi thường gặp khi scaffold dự án.

---

## Cấu trúc thư mục mong muốn

```
brandscript/                     ← thư mục gốc (KHÔNG có dấu chấm trong tên)
├── SPEC_BRANDSCRIPT.md          ← spec dự án (KHÔNG được xóa)
├── BRAND_DNA.md                 ← design tokens (KHÔNG được xóa)
├── SKILLS.md                    ← hướng dẫn skills (KHÔNG được xóa)
├── SETUP.md                     ← file này (KHÔNG được xóa)
├── public/
│   └── favicon.svg
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── components/
│   ├── data/
│   ├── utils/
│   └── styles/
├── package.json                 ← name: "brandscript-xuyenlab"
├── vite.config.js
├── tailwind.config.js
└── index.html
```

---

## Quy tắc tuyệt đối

1. **KHÔNG BAO GIỜ xóa 4 file .md ở root** (SPEC, BRAND_DNA, SKILLS, SETUP)
2. **KHÔNG dùng `npm create vite@latest .`** (dấu chấm = thư mục hiện tại → sẽ xóa files)
3. **Package name = `brandscript-xuyenlab`** (KHÔNG có dấu chấm, KHÔNG dùng tên thư mục)
4. **Scaffold vào thư mục tạm, rồi move ra** (xem hướng dẫn bên dưới)

---

## Hướng dẫn scaffold đúng cách

### Bước 1: Kiểm tra Node.js

```bash
node -v    # cần >= 18
npm -v     # cần >= 9
```

### Bước 2: Scaffold Vite vào thư mục tạm

```bash
# Đang ở trong thư mục brandscript/ (nơi có 4 file .md)
# Tạo project Vite vào thư mục tạm _scaffold
npm create vite@latest _scaffold -- --template react
```

### Bước 3: Di chuyển files từ _scaffold ra root

```bash
# Copy tất cả file từ _scaffold ra thư mục hiện tại
# KHÔNG dùng mv vì sẽ ghi đè các file .md
cp -r _scaffold/* .
cp _scaffold/.gitignore .
cp _scaffold/.eslintrc.cjs . 2>/dev/null || true

# Xóa thư mục tạm
rm -rf _scaffold
```

### Bước 4: Sửa package.json

```bash
# Sửa name trong package.json (BẮT BUỘC)
# Tìm: "name": "_scaffold"
# Thay bằng: "name": "brandscript-xuyenlab"
```

Hoặc dùng sed:
```bash
sed -i 's/"name": "_scaffold"/"name": "brandscript-xuyenlab"/' package.json
```

### Bước 5: Cài dependencies

```bash
npm install

# Cài thêm dependencies cho dự án
npm install jspdf html2canvas

# Cài Tailwind CSS
npm install -D tailwindcss @tailwindcss/vite
```

### Bước 6: Cấu hình Tailwind

Tạo file `src/styles/globals.css`:
```css
@import "tailwindcss";

/* Copy toàn bộ CSS variables từ BRAND_DNA.md vào đây */
```

Cập nhật `vite.config.js`:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
```

### Bước 7: Kiểm tra

```bash
# Chạy dev server
npm run dev

# Kiểm tra 4 file .md vẫn còn
ls -la *.md
# Phải thấy: BRAND_DNA.md  SETUP.md  SKILLS.md  SPEC_BRANDSCRIPT.md
```

### Bước 8: Kiểm tra kết quả

- [ ] `npm run dev` chạy không lỗi
- [ ] Browser mở được http://localhost:5173
- [ ] 4 file .md vẫn còn nguyên trong thư mục root
- [ ] `package.json` có `"name": "brandscript-xuyenlab"`

---

## Sau khi scaffold xong

Tiếp tục đọc `SPEC_BRANDSCRIPT.md` → Phase 1A tasks còn lại:
- Tạo `src/data/steps.js`
- Tạo `src/data/example-xuyen.js`
- Tạo `src/styles/globals.css` (design tokens từ BRAND_DNA.md)
- Tạo `src/utils/oneliner.js`

---

## Troubleshooting

### Lỗi "Invalid package.json name"
→ Tên package có dấu chấm. Sửa `package.json`: `"name": "brandscript-xuyenlab"`

### Lỗi "Current directory is not empty"
→ Vite đang cố scaffold vào thư mục có files. KHÔNG chọn "Remove existing files". 
→ Dùng cách scaffold vào thư mục tạm `_scaffold` như hướng dẫn trên.

### Files .md bị xóa
→ Tải lại từ Claude hoặc copy từ Notion. 
→ SPEC: https://www.notion.so/32b0ed5fbd47819a8306dcbfa0c06693
→ BRAND DNA: https://www.notion.so/32b0ed5fbd478185a45acfe9bc13153d
