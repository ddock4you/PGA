# Client Providers 퍼시스트 전략

`src/components/client-providers.tsx`에서 정의한 `PersistQueryClientProvider`는 React Query 캐시를 IndexedDB에 저장하고 복원하는 핵심 지점입니다. 이 문서에서는 두 가지 추가 고려사항을 요약합니다.

## 1. 캐시 키 버전 관리

- `CURRENT_CACHE_KEY`/`CACHE_KEY_VERSION`은 `src/components/client-providers.tsx`에서 `pga.react-query.cache.v1`로 정의되어 있습니다.
- 버전을 올릴 때는 다음을 수행합니다:
  1. `CACHE_KEY_VERSION`을 원하는 새 숫자로 증가시킵니다.
  2. `LEGACY_CACHE_KEYS` 배열에 이전 버전 키(`v1` 이전)가 모두 포함되도록 유지합니다.
  3. `restoreClient`는 `LEGACY_CACHE_KEYS`부터 순차적으로 확인하고, 오래된 키에서 데이터를 발견하면 제거하고 새 키로 다시 저장합니다.
  4. `removeClient`/`persistClient`는 `ALL_CACHE_KEYS`를 기준으로 동작합니다.

이 흐름은 기존 사용자의 캐시를 무사히 이전하면서, 필요 시 구버전 키를 비울 수 있게 설계되었습니다.

## 2. 대용량 데이터 chunked preload 제안

- `unifiedSearchIndex`, 세대별 인덱스 등은 초기 load가 크므로 한 번에 전체를 가져오면 UX가 밀릴 수 있습니다.
- chunked preload 전략:
  1. CSV/정적 JSON을 `fetch`할 때는 `fetch`(관리) 또는 `PapaParse`를 이용해 일부 범위(`pokemon`, `moves`, `abilities`, `items`)를 순차적으로 불러옵니다.
  2. 각 chunk가 로드될 때마다 `clientQueryClient.setQueryData(["search", "unified-index"], newIndex)`처럼 React Query 캐시에 병합하여 사용자에게 점진적 검색 결과를 제공할 수 있습니다.
  3. 초기 로딩 UI는 첫 번째 chunk(예: 포켓몬)만 있으면 검색창/자동완성을 보여준 뒤, 나머지는 background에서 불러옵니다.
  4. `PersistQueryClientProvider`는 `shouldDehydrateQuery`를 통해 `search` namespace를 persist 대상으로 지정하므로, 이후 재방문 시 chunked 데이터를 그대로 복원할 수 있습니다.

chunked preload를 구현하면 캐시/IndexedDB 탐색 이후 `client-providers.tsx`에서 정리한 key 버전 전략과 맞물려 안정적으로 Phase 3 캐시 퍼시스트를 유지할 수 있습니다.
