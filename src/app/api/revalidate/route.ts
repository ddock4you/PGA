import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";

const EXPECTED_TOKEN = process.env.NEXT_REVALIDATE_TOKEN;

interface RevalidateRequestBody {
  token?: string;
  tags?: string[];
  paths?: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RevalidateRequestBody;
    if (EXPECTED_TOKEN && body.token !== EXPECTED_TOKEN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const operations: Promise<void>[] = [];

    if (Array.isArray(body.tags) && body.tags.length > 0) {
      operations.push(
        Promise.all(body.tags.map((tag) => revalidateTag(tag))).then(() => undefined)
      );
    }

    if (Array.isArray(body.paths) && body.paths.length > 0) {
      operations.push(
        Promise.all(body.paths.map((path) => revalidatePath(path))).then(() => undefined)
      );
    }

    if (operations.length === 0) {
      return NextResponse.json({ message: "Nothing to revalidate" });
    }

    await Promise.all(operations);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}
