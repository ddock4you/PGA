# Preferences (resume)

이 폴더는 PGA 앱의 "사용자 환경설정(Preferences)"을 전역에서 공유하고, 브라우저에 저장해 재방문 시 복원하는 역할을 합니다.

## PREFERENCES_STORAGE_KEY

`PREFERENCES_STORAGE_KEY`는 Preferences를 `localStorage`에 저장/복원할 때 사용하는 키 문자열의 단일 소스입니다.

- 현재 값: `pga.preferences.v1`
- 저장 위치: `localStorage[PREFERENCES_STORAGE_KEY]`
- 저장되는 내용(요약): `theme`, `selectedGameId`, `selectedGenerationId`, `selectedVersionGroup`

## 이 키가 필요한 이유

Preferences를 `localStorage`에 저장하는 방식이라면, "어떤 키로 저장했는지"를 코드가 알고 있어야 동일한 값을 다시 읽어올 수 있습니다.

특히 테마(`theme`)는 FOUC(첫 페인트 때 라이트/다크가 번쩍이며 바뀌는 현상)를 줄이기 위해 "hydration 전에" 미리 적용하는 흐름이 필요합니다.
PGA는 이때도 `localStorage`를 읽어 테마를 판단하므로, 동일한 저장 키가 반드시 필요합니다.

## 상수로 두면 좋은 점

- 키 오타/불일치 방지: 저장은 A키, 초기 스크립트/복원은 B키로 읽는 실수를 예방합니다.
- 버전 관리 용이: 스키마 변경 시 `v1 -> v2`처럼 키를 바꿔도 한 곳만 수정하면 됩니다.
- 의도 명확화: 단순 문자열보다 "Preferences 저장 키"라는 의미가 코드에 드러납니다.

## 실제 사용처

- `src/features/preferences/PreferencesContext.tsx`: 상태를 로드/저장
- `src/app/layout.tsx`: hydration 이전에 저장된 `theme === 'dark'`를 선적용해 FOUC를 완화
