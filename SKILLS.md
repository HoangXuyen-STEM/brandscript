# SKILLS — Hướng dẫn sử dụng Skills & Tools cho Agents

> **File này hướng dẫn agent dùng skill/tool nào cho từng task.**
> Đọc kèm: `SETUP.md` (thiết lập) → `SPEC_BRANDSCRIPT.md` (logic) → `BRAND_DNA.md` (design).
> **KHÔNG ĐƯỢC XÓA FILE NÀY.**

---

## Nguyên tắc chung

1. **Đọc SETUP.md trước** nếu project chưa scaffold
2. **Đọc skill trước, code sau.** Mỗi skill có SKILL.md chứa best practices
3. **Một phase, một lúc.** Hoàn thành testing 100% trước khi chuyển
4. **Security tests không skip**

---

## Thứ tự đọc file khi agent mới vào project

```
1. SETUP.md          → biết cách scaffold đúng (tránh xóa files)
2. SPEC_BRANDSCRIPT.md → hiểu dự án, đang ở phase nào
3. BRAND_DNA.md      → hiểu design system
4. SKILLS.md         → biết dùng tool nào (file này)
```

---

## Skills map theo Phase

### Phase 1A: Scaffold + Data

| Task | Skill | Ghi chú |
| --- | --- | --- |
| Scaffold project | **Đọc SETUP.md** | KHÔNG dùng `npm create vite@latest .` |
| Tạo steps.js | Copy từ SPEC | Section "7 Steps" |
| Tạo example-xuyen.js | Copy từ SPEC | Dữ liệu ví dụ |
| Tạo globals.css | **BRAND_DNA.md** | Copy CSS variables |
| Tạo oneliner.js | Copy từ SPEC | Section "One-liner algorithm" |

### Phase 1B: Wizard UI

| Task | Skill | Ghi chú |
| --- | --- | --- |
| Build components | **frontend-design** | Đọc SKILL.md trước. Dùng tokens từ BRAND_DNA.md |
| localStorage save | Không cần skill | useState + useEffect + debounce |

### Phase 1C: Landing + Result + Export HTML

| Task | Skill | Ghi chú |
| --- | --- | --- |
| Build pages | **frontend-design** | Landing = ấn tượng đầu tiên |
| Export HTML | Không cần skill | Blob + URL.createObjectURL |

### Phase 2A: PDF + Access Code + Security

| Task | Skill | Ghi chú |
| --- | --- | --- |
| exportPDF.js | **pdf** (reference) | Client-side dùng jsPDF, tham khảo layout từ Python script |
| AccessCodeGate | **frontend-design** | Modal consistent với design system |
| hash.js | Không cần skill | Web Crypto API SHA-256 |
| Brute-force | Không cần skill | localStorage counter |

### Phase 2B: Deployment

| Task | Skill | Ghi chú |
| --- | --- | --- |
| Deploy | Không cần skill | Theo SPEC section "Deployment" |

### Phase 3: AI Features (future)

| Task | Skill | Ghi chú |
| --- | --- | --- |
| Cloudflare Worker | **mcp-builder** (reference) | Pattern tương tự API proxy |
| Claude API | **product-self-knowledge** | Chính xác model name, pricing |
| UI nút AI | **frontend-design** | Consistent design system |

---

## Skills reference

| Skill | Path | Khi nào |
| --- | --- | --- |
| **frontend-design** | `/mnt/skills/public/frontend-design/SKILL.md` | Mọi UI/component/styling |
| **pdf** | `/mnt/skills/public/pdf/SKILL.md` | Tạo/đọc PDF |
| **product-self-knowledge** | `/mnt/skills/public/product-self-knowledge/SKILL.md` | Claude API |
| **mcp-builder** | `/mnt/skills/examples/mcp-builder/SKILL.md` | API proxy pattern |
| **web-artifacts-builder** | `/mnt/skills/examples/web-artifacts-builder/SKILL.md` | Complex React |
| **theme-factory** | `/mnt/skills/examples/theme-factory/SKILL.md` | Theme variants |

---

## KHÔNG được làm

- Dùng font Inter, Roboto, Arial → chỉ Be Vietnam Pro
- Dùng #FFFFFF, #000000 → dùng tokens từ BRAND_DNA.md
- Dùng shadow rgba(0,0,0) → dùng rgba(100,60,30)
- Dùng grey cho badges → dùng brand-subtle / accent-subtle
- Skip SKILL.md và tự viết theo cách riêng
- Skip security tests
- **Xóa các file .md ở root**

---

## Workflow mẫu

```
1. Nhận task: "Build Phase 1B"
2. Đọc SPEC_BRANDSCRIPT.md → section "Phase 1B"
3. Đọc BRAND_DNA.md → CSS variables
4. Đọc frontend-design SKILL.md → best practices
5. Implement từng component
6. Chạy testing checklist
7. Báo cáo: "Phase 1B — 8/8 PASS"
8. Nếu FAIL → fix → test lại
9. 100% PASS → báo Xuyen review
```
