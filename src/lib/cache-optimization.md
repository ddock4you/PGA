## 캐시 최적화 가이드

Phase 3.5에서 요구하는 “불필요 캐시 정리 / TTL 최적화 / 메모리 모니터링”을 위한 체크리스트입니다.

1. **TTL 적절성 검토**

   - React Query `clientQueryClient`의 `staleTime`/`gcTime` (`src/lib/query-clients.ts`)이 각 데이터별로 적절한지를 평가합니다.
   - 예를 들어 `unifiedSearchIndex`는 `staleTime` 24시간, `gcTime` 7일로 오래 유지되지만, "검색 인덱스" 변경이 드물므로 현재 값이 적절합니다. 반면 자주 바뀌는 `pokemon` 기본 정보는 5분 `staleTime`/24시간 `gcTime`으로 조정합니다.
   - `getCacheMeta`의 `maxAge` 값은 IndexedDB 영속화 기간을 의미하므로 사용자 데이터를 과도하게 오래 유지하지 않도록 주기 점검(예: `maxAge` 7일)합니다.

2. **불필요 캐시 정리**

   - `client-providers.tsx`의 `persisted` key 리스트(`ALL_CACHE_KEYS`)를 주기적으로 점검하고, 더 이상 사용하지 않는 key를 `LEGACY_CACHE_KEYS`에 등록하거나 삭제합니다.
   - 디버깅 시 `localforage.keys()`를 확인해 저장된 캐시 크기를 확인하고, 사용량이 증가하는 쿼리를 파악합니다.

3. **메모리/성능 감시**

   - 개발 중 `clientQueryClient.getQueriesData()`를 활용해 현재 캐시에 몇 개의 query entry가 있는지 검사합니다.
   - Next.js DevTools의 Network 탭에서 `fetch` 요청 헤더를 보고 `next-revalidate` 값이 1시간/24시간 등으로 유지되는지 확인합니다.

4. **자동 캐시 무효화 준비**
   - ISR/Next.js `tags`(`pokemon-${id}` 등)를 활용해 특정 캐시를 `revalidateTag`로 무효화할 준비를 합니다.
   - 필요 시 `revalidateTag("pokemon-25")` 호출로 서버 캐시를 즉시 갱신할 수 있도록 문서에 기록해 둡니다.

이 가이드를 따라가면 Phase 3 캐시 최적화 요구사항(3.5)을 충족하면서, 예상치 못한 캐시 충돌이나 용량 폭증을 미리 방지할 수 있습니다.
