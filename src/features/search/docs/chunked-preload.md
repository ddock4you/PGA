## Chunked Unified Search Preload

이전에는 `buildUnifiedSearchIndex`가 모든 CSV를 `Promise.all`로 병렬 로드했기 때문에, 대용량 데이터를 불러올 때 초기 로딩 시간이 길고, IndexedDB/React Query에 저장하기 전에 모든 결과가 준비될 때까지 기다려야 했습니다. Phase 3 캐싱 최적화를 위해서는 데이터를 **순차(chunked) 로드하면서** 사용자에게 점진적으로 결과를 채워주는 것이 유리합니다.

### 구현 전략

- `buildUnifiedSearchIndex`가 각 카테고리(`pokemon`, `moves`, `abilities`, `items`)를 순서대로 로드하고, chunk(부분 결과)를 생성합니다.
- 로딩이 끝난 chunk는 `progress` 콜백을 통해 외부에 전달되며, `useUnifiedSearchIndex`에서는 `clientQueryClient.setQueryData`를 사용해 `["unifiedSearchIndex"]` 캐시를 부분적으로 갱신합니다.
- React Query는 최종 결과를 기다리되, 데이터가 chunk 단위로 반영되므로 IndexedDB persist나 캐시 히트 시 이미 일부 데이터가 빠르게 복원됩니다.
- 이 구조는 chunk 단위로 캐시 키를 나누지 않더라도 `PersistQueryClientProvider`에서 `shouldDehydrateQuery` 조건을 만족하므로 `unified-search` 인덱스가 chunked 상태로 영속 저장됩니다.

### 향후 확장

- 필요하다면 chunk마다 `localforage`에 별도 key로 저장하여 앱 재시작 시 복원 우선순위를 조정할 수 있습니다.
- chunk 로딩 순서를 조정하거나, chunk 사이에 `await delay`를 넣어 UI 스레드 부담을 낮추는 것도 가능하며, `clientQueryClient`에 chunk별 `updatedAt`을 설정해 캐시 타임라인을 조정할 수 있습니다.
