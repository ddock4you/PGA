## PokéAPI fetch 캐싱 전략

`src/lib/pokeapi.ts`의 `fetchFromPokeApi`는 Next.js App Router 환경에서 서버 사이드 캐시(`next.revalidate`, `tags`)를 제어할 수 있도록 확장되었습니다.

- `next` 옵션을 통해 `revalidate`(초 단위 TTL)와 `tags`(캐시 invalidation/유사한 항목 그룹 지정)가 전달됩니다.
- 각 PokéAPI 헬퍼(`fetchPokemon` 등)는 적절한 TTL/태그를 설정합니다:
  - `fetchPokemon`, `fetchPokemonSpecies`, `fetchEvolutionChain`: 1시간(`3600s`) 재검증, `pokemon-...` 태그.
  - `fetchPokemonEncounters`: 24시간(`3600 * 24`) 재검증, `pokemon-encounters-...` 태그로 동적 데이터를 서버 캐시에서 분리.
- `fetchEvolutionChain`은 `absoluteUrl`도 함께 전달하여 Next.js가 전체 URL(포켓몬 진화 체인)으로 캐시 태그를 추적하게 합니다.

이렇게 하면 React Query는 클라이언트 측 캐시를 관리하고, Next.js는 `next` 옵션으로 서버 사이드 fetch 캐시를 담당하게 되므로 Phase 3의 하이브리드 캐싱 전략을 수월하게 조율할 수 있습니다. Any 함수에서 추가 캐시 태그나 TTL이 필요하면 이 문서를 참고하여 `next` 파라미터를 조정해 주세요.
