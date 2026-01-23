# Pokémon Game Assistant (Next.js)

`pga`는 기존 React + Vite 기반 앱을 Next.js 16 (App Router) + React 19로 마이그레이션한 포켓몬 정보/학습 플랫폼입니다. PokéAPI와 CSV 데이터를 혼합하여 통합 검색, 도감, 기술·특성·도구 상세, 배틀 트레이닝 등을 제공합니다.

## 기술 스택

- **Next.js 16 App Router**: Route segment, metadata API, ISR/캐시 태그를 활용한 SEO 최적화 및 서버/클라이언트 분리
- **React 19 + Tailwind 4**: shadcn/ui 기반 디자인 시스템과 다크 모드 지원
- **CSV 데이터 로더**: `src/data/*.csv` + `csv-loader`로 통합 검색 및 퀴즈 데이터를 비동기로 채움
- **Vitest**: 핵심 유틸/검색/캐시 전략에 대한 테스트 (`pnpm test`)

## 개발/빌드

```bash
pnpm install          # 의존성 설치
pnpm dev              # http://localhost:3000 개발 서버 (Next.js)
pnpm build            # 프로덕션 빌드
pnpm start            # build 결과로 서버 실행
pnpm lint             # next lint
pnpm test             # vitest
```

## 주요 파일/디렉터리

- `src/app/`: App Router 기반 라우트. `layout.tsx`, `page.tsx`, `dex`, `moves`, `abilities`, `items`, `training`, `search` 등의 HTTP 핸들러 포함
- `src/components`: 공통 UI 컴포넌트(`global-header`, `client-providers`, shadcn/ui 커스텀 등)
- `src/lib`: 캐시/React Query 설정(`query-clients.ts`, `cache-strategy.ts`, `pokeapi.ts`, `query-provider.tsx`)
- `src/features`: 도메인별 기능(검색, 도감, 포켓몬 상세, 퀴즈, generation 등)의 API·훅·컴포넌트 집합
- `scripts/revalidate.ts`: ISR/태그 기반 재검증 도구 (`BASE_URL`, `NEXT_REVALIDATE_TOKEN` 환경 변수 필요)

## 참고 문서

- PokéAPI 관련 동작은 `src/lib/pokeapi.md`, `src/lib/cache-strategy.md`, `src/lib/cache-optimization.md`에서 확인하세요.
- 컴포넌트/상태 설계는 `.cursor/rules/CHECKLIST.mdc`, `COMPONENT_ARCHITECTURE.mdc`, `STATE_MANAGEMENT.mdc`에서 정리되어 있습니다.

## 환경 변수

- `.env.local`/`.env.production`에서 `NEXT_PUBLIC_API_URL` 등을 정의합니다.
- `scripts/revalidate.ts`를 사용할 때 `NEXT_REVALIDATE_TOKEN` 값을 설정해야 합니다.

