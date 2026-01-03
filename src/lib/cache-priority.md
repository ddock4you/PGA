## Cache Priority / Conflict 체크

Phase 3에서 서버(fetch) 캐시와 React Query 캐시가 혼재하므로, TTL/우선순위가 충돌하지 않도록 명확히 확인해야 합니다.

| 레이어                                                                                           | TTL/전략                                                                                                                                          | 참고 위치                                                |
| ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| Server fetch (`fetchFromPokeApi`)                                                                | `next.revalidate` (`pokemon`: 3600s, `pokemon-species`: 3600s, `evolution-chain`: 3600s, `pokemon-encounters`: 86400s) + `tags` 기반 invalidation | `src/features/pokemon/api/pokemonApi.ts`                 |
| React Query cache (`usePokemonDetail`, `usePokemonSpeciesByGeneration`, `useUnifiedSearchIndex`) | `staleTime`/`cacheTime` (1분–24시간) 및 `gcTime`                                                                                                  | `src/lib/query-clients.ts`, `src/features/pokemon/hooks` |
| Persist strategy (`getCacheMeta`)                                                                | `cacheStrategy` + `persist`/`maxAge`                                                                                                              | `src/lib/cache-strategy.ts`                              |

- **충돌 확인**: 서버 TTL은 React Query보다 같거나 길어야 캐시 재검증 시점에서 일관된 데이터를 유지할 수 있습니다. 예를 들어 `fetchPokemon`은 1시간 TTL이므로 React Query의 `staleTime`을 5분으로 두어도 `fetch` 캐시는 더 오래 지속되고, React Query는 그 레이어를 존중합니다.
- **검증 방법**: 위 테이블을 기준으로 `next.revalidate` 값과 `useQuery`의 `staleTime`/`meta.retry`가 이상치가 없는지 수동으로 비교하며, `cacheStrategy` 매핑이 누락된 키(예: `pokemon-encounters`)를 추가해 `PersistQueryClientProvider`가 예상대로 `persist`를 적용하도록 했습니다.

필요하면 이 문서를 업데이트해서 새로운 `queryKey`/`fetch` TTL이 추가될 때마다 리포트하십시오.
