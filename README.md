# Pokémon Game Assistant (Next.js)

`pga`는 포켓몬 정보를 탐색하고 타입 상성을 훈련할 수 있는 웹 앱입니다. Next.js App Router 기반으로 서버 데이터(PokéAPI)와 클라이언트 CSV 데이터를 조합해 통합 검색, 도감/기술/특성/도구 상세, 배틀 트레이닝을 제공합니다.

[데모 시연해보기](https://pga-brown.vercel.app/)

## 주요 기능

- 통합 검색: 포켓몬/기술/특성/도구를 한국어 기준으로 한 번에 검색
- 포켓몬 도감: 세대/게임 맥락에 맞춘 리스트와 상세 정보
- 기술/특성/도구 상세: 최신 버전 그룹 기준의 설명 및 한글화 우선 표시
- 배틀 트레이닝: 타입 상성/포켓몬 기반 퀴즈로 학습 흐름 제공

## 기술 스택

- **Next.js 16 App Router**: 라우트 엔트리/로딩/에러 분리, 서버 컴포넌트 중심 데이터 로딩
- **React 19 + Tailwind 4**: shadcn/ui 기반 UI, 라이트/다크 모드 지원
- **CSV 데이터 로더**: `src/data/*.csv` + `PapaParse`로 검색/퀴즈 데이터 구성
- **Vitest**: 핵심 유틸/검색/캐시 전략 테스트

## 개발에 사용된 AI 도구

- cursor, opencode

### 사용한 LLM

- GPT-5.2 (10%), GPT-5.1 Codex Mini (50%), Grok Code Fast 1 (40%)

## .cursor/rules 문서 역할

아래 문서들은 Cursor 에이전트가 따르는 규칙이자, 코드베이스의 설계 기준을 정의합니다. 파일별 역할은 다음과 같습니다.

- `AGENT_BASE.mdc`: 최우선 규칙. App Router 구조/서버-클라이언트 경계/안전 규칙의 단일 기준
- `COMPONENT_ARCHITECTURE.mdc`: 컴포넌트 레벨/폴더 구조/파일 분리 기준과 도메인 구조 원칙
- `STATE_MANAGEMENT.mdc`: 서버-클라이언트 데이터 흐름, 페이지별 상태 관리, 로딩/에러 처리 원칙
- `DESIGN_SYSTEM.mdc`: 타이포그래피/간격/카드/뱃지 등 시각 규칙과 UI 컴포넌트 스타일 가이드
- `UI_PATTERNS.mdc`: 각 라우트(/, /search, /dex, /training 등)의 레이아웃/섹션 패턴 정의
- `API_TYPES.mdc`: PokéAPI 리소스의 주요 사용 필드/매핑 기준과 데이터 로딩 전략
- `DEVELOPMENT_PLAN.mdc`: 개발 계획/히스토리 문서(현 규칙과 충돌 시 참고용)
- `CONCEPT.mdc`: 초기 컨셉/기획 초안(현 구현과 충돌 시 참고용)
- `command/APPLY_POST_PROCESSING.mdc`: 작업 후 처리 규칙(커밋 메시지 가이드 포함)

## .cursor/skills 폴더 소개

Vercel에서 배포한 리액트 사용 모범 사례들을 Skills로 적용되어 있습니다.

- SKills에 대한 자세한 내용 [링크](https://ywc.life/posts/vercel-react-best-practice/)
- `vercel-react-best-practices/SKILL.md`: React/Next.js 성능 최적화 가이드 개요와 규칙 카테고리 요약
- `vercel-react-best-practices/AGENTS.md`: 8개 카테고리(워터폴 제거, 번들 최적화, 서버/클라이언트 성능 등)로 구성된 전체 가이드
- `vercel-react-best-practices/rules/*.md`: 개별 룰 설명과 잘못된/올바른 코드 예시 모음## 개발에 사용된 AI tool


## 로컬 개발

```bash
pnpm install          # 의존성 설치
pnpm dev              # http://localhost:3000 개발 서버
pnpm build            # 프로덕션 빌드
pnpm start            # build 결과로 서버 실행
pnpm lint             # next lint
pnpm test             # vitest
```

## 폴더 구조 요약

- `src/app/`: App Router 라우트 엔트리와 라우트 상태 파일
- `src/features/`: 도메인 기능(검색, 도감, 트레이닝 등)별 컴포넌트/훅/유틸
- `src/components/`: 재사용 가능한 공통 UI 및 패턴 컴포넌트
- `src/components/ui/`: shadcn/ui 기반 저수준 UI 컴포넌트
- `src/lib/`: 공통 유틸, PokéAPI 래퍼, 캐시 전략
- `src/data/`: CSV 원천 데이터
- `scripts/`: 운영/유틸 스크립트 (예: `revalidate.ts`)

## 참고

- PokéAPI 관련 상세: `src/lib/pokeapi.md`, `src/lib/cache-strategy.md`, `src/lib/cache-optimization.md`
- 서버 전용 유틸은 `*.server.ts`로 분리하고 `import "server-only";`를 포함합니다.

## 환경 변수

- `.env.local`/`.env.production`에서 `NEXT_PUBLIC_API_URL` 등을 정의합니다.
- `scripts/revalidate.ts` 사용 시 `NEXT_REVALIDATE_TOKEN` 필요

## 이후 작업

- 전반적인 UI 개편 (현재는 주요 기능들을 확인하기 위해 만든 알파 테스트용)
  - 개편 UI 컨셉 [링크](https://excalidraw.com/#json=ZNw4qltsVdpQZzVTNBZMT,nzgt65OCg4X2iNujIT7jUQ) (작성중) 
- PokéAPI 데이터가 노후화되어 이 앱을 위한 전용 포켓몬 데이터셋 구축 필요
- 신규 콘텐츠 추가
