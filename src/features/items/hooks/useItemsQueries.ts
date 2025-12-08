import { useQuery, useQueries } from "@tanstack/react-query";
import { fetchItem, fetchItemList } from "../api/itemsApi";

// 모든 아이템 목록(이름/URL)을 가져오는 훅 (세대 필터링 불가로 전체 로딩)
export function useAllItemsList() {
  return useQuery({
    queryKey: ["items", "all"],
    queryFn: async () => {
      return fetchItemList(); // limit=10000
    },
    staleTime: 1000 * 60 * 60 * 24,
  });
}

export function useItemsDetails(names: string[]) {
  return useQueries({
    queries: names.map((name) => ({
      queryKey: ["item", name],
      queryFn: () => fetchItem(name),
      staleTime: 1000 * 60 * 60 * 24,
    })),
  });
}

export function useItem(idOrName: string | number) {
  return useQuery({
    queryKey: ["item", idOrName],
    queryFn: () => fetchItem(idOrName),
    enabled: !!idOrName,
  });
}
