import "server-only";

const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2";

interface FetchOptions extends RequestInit {
  /** 절대 URL을 그대로 호출하고 싶을 때 사용 (선택 사항) */
  absoluteUrl?: string;
  next?: NextFetchRequestConfig;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    const message = text || response.statusText || "PokéAPI 요청에 실패했습니다.";
    throw new Error(`PokéAPI error ${response.status}: ${message}`);
  }

  return (await response.json()) as T;
}

/**
 * PokéAPI v2 공통 JSON fetch 유틸.
 *
 * @param path - `/type/1`, `type/1` 처럼 베이스 URL 이후 경로 또는 절대 URL
 */
export async function fetchFromPokeApi<T>(path: string, options?: FetchOptions): Promise<T> {
  const { absoluteUrl, headers, next, ...rest } = options ?? {};
  const normalizedNext: NextFetchRequestConfig = next
    ? { ...next, revalidate: next.revalidate ?? 86400 }
    : { revalidate: 86400 };

  const url =
    absoluteUrl ??
    (path.startsWith("http")
      ? path
      : `${POKEAPI_BASE_URL}/${path.startsWith("/") ? path.slice(1) : path}`);

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      ...(headers ?? {}),
    },
    next: normalizedNext,
    ...rest,
  });

  return handleResponse<T>(response);
}

export { POKEAPI_BASE_URL };
