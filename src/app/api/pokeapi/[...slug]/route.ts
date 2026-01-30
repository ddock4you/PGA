import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { fetchFromPokeApi } from "@/lib/pokeapi.server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await context.params;
  const slugParts = slug ?? [];

  if (slugParts.length === 0) {
    return NextResponse.json({ error: "PokéAPI 경로를 지정해야 합니다." }, { status: 400 });
  }

  const path = slugParts.join("/");
  const queryString = new URL(request.url).search;
  const targetPath = queryString ? `${path}${queryString}` : path;

  try {
    const data = await fetchFromPokeApi(targetPath);
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      const status = error.message.includes('404') ? 404 : 500;
      return NextResponse.json({ error: error.message }, { status });
    }
    return NextResponse.json({ error: "알 수 없는 에러가 발생했습니다." }, { status: 500 });
  }
}
