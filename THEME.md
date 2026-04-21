# 테마 적용 가이드

이 프로젝트는 [tweakcn.com](https://tweakcn.com)을 통해 shadcn/ui 테마를 관리합니다.  
Tailwind CSS v4 + oklch 색상 포맷 기준입니다.

---

## 현재 적용된 테마

| 항목 | 값 |
|---|---|
| 이름 | **Bold Wikipedia** |
| 출처 | [tweakcn.com/themes/cmlmpb3qp000004l5go47hzsv](https://tweakcn.com/themes/cmlmpb3qp000004l5go47hzsv) |
| ID | `cmlmpb3qp000004l5go47hzsv` |
| 폰트 (sans) | Inter, Segoe UI, Helvetica Neue (시스템 폰트) |
| 폰트 (serif) | Georgia, Times New Roman (시스템 폰트) |
| 폰트 (mono) | monospace (시스템 폰트) |
| radius | 0.125rem (거의 각진 모서리) |
| 스타일 | professional, minimal, flat |

---

## 테마 변경 방법

### 방법 A: CLI 설치 (권장)

tweakcn에 공개된 테마는 shadcn CLI로 한 번에 설치됩니다.

```bash
# 테마 페이지 URL: https://tweakcn.com/themes/<ID>
# 레지스트리 URL:  https://tweakcn.com/r/themes/<ID>
bunx shadcn@latest add https://tweakcn.com/r/themes/<테마-ID>
```

**예시:**
```bash
# Bold Wikipedia
bunx shadcn@latest add https://tweakcn.com/r/themes/cmlmpb3qp000004l5go47hzsv

# T3 Chat (프리셋)
bunx shadcn@latest add https://tweakcn.com/r/themes/t3-chat

# Catppuccin (프리셋)
bunx shadcn@latest add https://tweakcn.com/r/themes/catppuccin
```

> CLI 실행 후 `globals.css`의 CSS 변수가 자동으로 교체됩니다.

---

### 방법 B: 수동 복사

커스텀 조정이 필요하거나 저장하지 않은 테마에 사용합니다.

1. [tweakcn.com/editor/theme](https://tweakcn.com/editor/theme) 접속
2. 원하는 테마 선택 또는 색상/폰트 직접 조정
3. 우측 상단 **Code** 버튼 → "Tailwind v4" + "oklch" 선택
4. 아래 내용만 복사해서 `globals.css`에 붙여넣기:

```css
/* 이 두 블록만 교체 */
:root {
  --background: oklch(...);
  --foreground: oklch(...);
  /* ... */
}

.dark {
  --background: oklch(...);
  /* ... */
}
```

**복사하지 말아야 할 항목:**

| tweakcn 출력 | 이유 |
|---|---|
| `@import "tailwindcss"` | 이 프로젝트는 `@import "shadcn/tailwind.css"` 사용 |
| `@custom-variant dark` | 이미 존재 |
| `@theme inline { ... }` | 프로젝트 전용 커스텀 매핑이 있음 |
| `@layer base { ... }` | 이미 존재 |

---

## 테마 설치 후 폰트 처리

CLI 설치 후 `globals.css`의 `@theme inline` 블록에서 `--font-sans` 값을 확인합니다.

### 시스템 폰트인 경우 (추가 작업 없음)

```css
/* 이런 경우 — layout.tsx 수정 불필요 */
--font-sans: "Inter", "Segoe UI", "Helvetica Neue", sans-serif;
--font-mono: monospace;
```

### Google Fonts인 경우 (layout.tsx에 link 태그 추가)

```css
/* 이런 경우 — Google Fonts 로딩 필요 */
--font-sans: 'Montserrat', sans-serif;
--font-mono: 'Space Mono', monospace;
--font-serif: 'Lora', serif;
```

`src/app/layout.tsx`의 `<head>`에 추가:

```tsx
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
  <link
    href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap"
    rel="stylesheet"
  />
</head>
```

Google Fonts URL은 [fonts.google.com](https://fonts.google.com)에서 폰트 이름으로 검색 후 복사합니다.

---

## 빌트인 프리셋 테마 목록

tweakcn.com 에디터 드롭다운에서 직접 미리보기 가능합니다.

| 테마 이름 | CLI 슬러그 | 특징 |
|---|---|---|
| Default | `default` | 기본 흑백 |
| T3 Chat | `t3-chat` | 핑크/자홍, 다크 |
| Catppuccin | `catppuccin` | 파스텔 다크 |
| Vercel | `vercel` | 미니멀 흑백 |
| Supabase | `supabase` | 녹색 계열 |
| Mocha Mousse | `mocha-mousse` | 따뜻한 갈색 |
| Neo Brutalism | `neo-brutalism` | 굵은 테두리, 원색 |
| Midnight Bloom | `midnight-bloom` | 다크 퍼플 |
| Cyberpunk | `cyberpunk` | 네온 노랑/핑크 |
| Ocean Breeze | `ocean-breeze` | 청록색 |
| Vintage Paper | `vintage-paper` | 크림/세피아 |
| Graphite | `graphite` | 회색 계열 미니멀 |
| Northern Lights | `northern-lights` | 오로라 그라디언트 |
| Kodama Grove | `kodama-grove` | 자연/초록 |

전체 목록: [tweakcn.com/themes](https://tweakcn.com/themes)

---

## 적용 범위

tweakcn 테마는 **shadcn/ui 컴포넌트 변수**를 교체합니다.  
이 프로젝트에는 Tale Weaver 에디터/대시보드용 별도 CSS 시스템도 존재합니다.

| 페이지 | tweakcn 영향 | 사용 변수 |
|---|---|---|
| `/login`, `/signup` | ✅ 전체 적용 | `--primary`, `--background`, `--border` 등 shadcn 표준 변수 |
| `/` (프로젝트 대시보드) | ⚠️ 일부 적용 | `--bg`, `--surface`, `--ink`, `--accent` (커스텀) |
| `/editor` | ⚠️ 일부 적용 | `--bg`, `--surface`, `--ink`, `--accent` (커스텀) |

Tale Weaver 커스텀 변수는 `globals.css`의 `/* TALE WEAVER */` 섹션에서 별도 관리합니다.

---

## 테마 탐색

- **갤러리**: [tweakcn.com/themes](https://tweakcn.com/themes) — 커뮤니티 테마 목록, 라이크 순 정렬 가능
- **에디터**: [tweakcn.com/editor/theme](https://tweakcn.com/editor/theme) — 실시간 미리보기 + 직접 커스터마이징
- **테마 페이지 URL 구조**: `https://tweakcn.com/themes/<ID>`
- **레지스트리 URL 구조**: `https://tweakcn.com/r/themes/<ID>` (CLI에 사용)

> 테마 페이지의 **Open in Editor** 버튼으로 에디터에서 추가 수정 가능합니다.
