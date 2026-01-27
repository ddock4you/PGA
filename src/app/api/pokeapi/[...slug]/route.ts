import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { fetchFromPokeApi } from "@/lib/pokeapi";

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
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "PokéAPI 요청을 처리하지 못했습니다.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
