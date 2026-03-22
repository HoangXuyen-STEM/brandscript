# BRAND DNA — XuyenLab Design Tokens

> **File này là nguồn sự thật duy nhất cho thiết kế giao diện XuyenLab.**
> Mọi component, page, artifact đều phải tuân theo các token trong file này.
> **KHÔNG ĐƯỢC XÓA FILE NÀY.**

---

## Triết lý thiết kế

Dựa trên bài viết "The One Color Decision That Makes a UI Look Expensive":

- **Không bao giờ dùng neutral thuần.** Mọi nền, viền, text muted đều mang 3-5% sắc nâu ấm từ brand hue.
- **Shadow mang nhiệt độ.** Shadow dùng `rgba(100,60,30)` thay vì `rgba(0,0,0)`.
- **Text không bao giờ là pure black.** Mọi cấp text đều nghiêng về nâu ấm.
- **Brand color không nằm trên thiết kế — nó chạy xuyên qua thiết kế.**

---

## Brand personality

| Yếu tố | Giá trị |
| --- | --- |
| Nhiệt độ | Ấm (warm) — cà phê, đất Đắk Lắk, người thầy |
| Tính cách | Chuyên nghiệp + gần gũi, như "anh bạn biết nhiều" |
| Màu chủ đạo | Nâu sáng `#8B5E3C` + Nâu sẫm `#5C3A22` |
| Màu accent | Blue `#2563EB` (AI, công nghệ, chuyên môn) |
| Font | Be Vietnam Pro |

---

## Light mode tokens

```css
:root, :root[data-theme="light"] {
  /* === Nền (warm-tinted) === */
  --color-bg:            #FAF7F4;
  --color-surface:       #FDFAF7;
  --color-surface-2:     #F2EDE6;

  /* === Viền (warm-tinted) === */
  --color-border:        #E8DDD2;
  --color-border-strong: #C8B8A8;

  /* === Text (warm, không pure black) === */
  --color-text:          #1A1410;
  --color-text-2:        #4A3E34;
  --color-text-muted:    #9A8878;

  /* === Brand: Nâu === */
  --color-brand:         #8B5E3C;
  --color-brand-dark:    #5C3A22;
  --color-brand-subtle:  #F5EAE4;

  /* === Accent: Blue === */
  --color-accent:        #2563EB;
  --color-accent-subtle: #EEF3FF;

  /* === Shadow (warm-tinted, NEVER rgba(0,0,0)) === */
  --shadow-sm: 0 1px 3px rgba(100,60,30,0.08), 0 0 0 1px rgba(100,60,30,0.04);
  --shadow-md: 0 4px 16px rgba(100,60,30,0.10), 0 1px 4px rgba(100,60,30,0.06);
  --shadow-lg: 0 12px 40px rgba(100,60,30,0.12), 0 2px 8px rgba(100,60,30,0.06);
}
```

---

## Dark mode tokens

```css
@media (prefers-color-scheme: dark) {
  :root, :root[data-theme="dark"] {
    --color-bg:            #120E0A;
    --color-surface:       #1C1610;
    --color-surface-2:     #261E16;

    --color-border:        #3A2E24;
    --color-border-strong: #5A4A3A;

    --color-text:          #E8DDD2;
    --color-text-2:        #B5A898;
    --color-text-muted:    #7A6E62;

    --color-brand:         #D4956A;
    --color-brand-dark:    #8B5E3C;
    --color-brand-subtle:  #2A1E14;

    --color-accent:        #60A5FA;
    --color-accent-subtle: #1A2540;

    --shadow-sm: 0 0 0 1px rgba(180,140,100,0.08);
    --shadow-md: 0 4px 20px rgba(0,0,0,0.4), 0 0 0 1px rgba(180,140,100,0.06);
    --shadow-lg: 0 12px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(180,140,100,0.08);
  }
}
```

---

## Card component

```css
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  box-shadow: var(--shadow-md);
  padding: 24px;
}

.card-label {
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  margin-bottom: 8px;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
  line-height: 1.3;
  margin-bottom: 8px;
}

.card-body {
  font-size: 0.9rem;
  line-height: 1.65;
  color: var(--color-text-2);
}

.badge-brand {
  display: inline-block;
  background: var(--color-brand-subtle);
  color: var(--color-brand);
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.06em;
  padding: 3px 10px;
  border-radius: 4px;
}

.badge-accent {
  display: inline-block;
  background: var(--color-accent-subtle);
  color: var(--color-accent);
  font-size: 0.72rem;
  font-weight: 500;
  padding: 3px 10px;
  border-radius: 4px;
}
```

---

## Typography

| Element | Font | Size | Weight | Color token |
| --- | --- | --- | --- | --- |
| H1 | Be Vietnam Pro | 28-32px | 800-900 | --color-text |
| H2 | Be Vietnam Pro | 22-24px | 700-800 | --color-text |
| H3 | Be Vietnam Pro | 18px | 700 | --color-text |
| Body | Be Vietnam Pro | 15-16px | 400 | --color-text-2 |
| Label | Be Vietnam Pro | 14px | 600 | --color-text |
| Hint | Be Vietnam Pro | 12.5px | 400 italic | --color-text-muted |
| Caption | Be Vietnam Pro | 11-12px | 500 | --color-text-muted |
| Overline | Be Vietnam Pro | 11px | 700 | --color-brand |

---

## Quy tắc tuyệt đối

1. **KHÔNG dùng `#FFFFFF`, `#000000`, `#F5F5F5`, `#808080`** — tất cả neutral phải tinted
2. **KHÔNG dùng `rgba(0,0,0)` trong shadow** — luôn dùng `rgba(100,60,30)`
3. **KHÔNG dùng grey overlay cho hover** — dùng `--color-surface-2` hoặc `--color-brand-subtle`
4. **MỌI badge phải dùng `brand-subtle` hoặc `accent-subtle`** — không generic grey
5. **KHÔNG dùng font Inter, Roboto, Arial** — chỉ Be Vietnam Pro

---

## Sử dụng màu

### Nâu (brand) dùng cho:
CTA button, link, active state, header/footer bg (nâu sẫm), step indicators, badge "XuyenLab"

### Blue (accent) dùng cho:
Tính năng AI, badge "AI-powered", informational alerts, external links, progress indicators

---

## Áp dụng vào sản phẩm

| Sản phẩm | Nhiệt độ | Accent |
| --- | --- | --- |
| brandscript.xuyenlab.com | Nâu ấm | Blue (AI) |
| blog.xuyenlab.com | Nâu ấm | Blue (links) |
| eakarcoffee.xuyenlab.com | Nâu ấm (đậm) | Green |
| Khóa học AI | Nâu ấm | Blue (đậm) |
