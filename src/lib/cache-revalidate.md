## 캐시 무효화 엔드포인트

| 항목 | 내용                                                                                               |
| ---- | -------------------------------------------------------------------------------------------------- |
| 경로 | `POST /api/revalidate`                                                                             |
| 목적 | Next.js 13 `revalidateTag`/`revalidatePath`를 클라이언트나 외부 스크립트에서 호출할 수 있도록 래핑 |

### 요청 예시

```json
POST /api/revalidate
Content-Type: application/json

{
  "token": "값이 설정된 경우 서버 env와 일치해야 함",
  "tags": ["pokemon-25", "pokemon-species-25"],
  "paths": ["/dex/25"]
}
```

- `tags`가 있을 경우 `revalidateTag`를 호출하고, `paths`가 있을 경우 `revalidatePath`도 함께 호출합니다.
- 둘 다 비어 있으면 `Nothing to revalidate`를 반환합니다.

### 보안

- `NEXT_REVALIDATE_TOKEN` 환경 변수가 설정돼 있으면 요청 헤더에 해당 토큰을 함께 보내야 합니다. 설정하지 않으면 토큰 검증은 생략되어 내부에서 자유롭게 호출할 수 있습니다.

### 활용 예시

- `pokemon` 상세 데이터를 수정한 뒤 `revalidateTag("pokemon-25")`를 호출해 관련 페이지와 캐시를 즉시 다시 생성할 수 있습니다.
- React Query `unifiedSearchIndex`나 `types` 등의 캐시도 `revalidatePath("/search")`처럼 경로를 통해 갱신할 수 있습니다.

이 엔드포인트 덕분에 Phase 3 캐시 전략과 Phase 4 테스트에서 **서버 캐시 무효화 시나리오**를 재현할 수 있습니다. 필요한 경우 이 파일과 `NEXT_REVALIDATE_TOKEN`을 활용해 배포 환경/CI 파이프라인에서 자동으로 실행하도록 설정할 수 있습니다.
