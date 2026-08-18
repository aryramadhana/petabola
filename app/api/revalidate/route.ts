import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

interface WebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  schema: string;
}

const REVALIDATE_BY_TABLE: Record<string, string[]> = {
  clubs: ["/", "/klub/[slug]", "/liga/[slug]", "/sitemap.xml"],
  leagues: ["/", "/liga/[slug]"],
  seasons: ["/", "/liga/[slug]"],
  matches: ["/liga/[slug]"],
  standings: ["/liga/[slug]"],
  player_stats: ["/liga/[slug]"],
};

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-webhook-secret");
  if (secret !== process.env.SUPABASE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json()) as WebhookPayload;
  const paths = REVALIDATE_BY_TABLE[payload.table];

  if (!paths) {
    return NextResponse.json(
      { error: `Tabel "${payload.table}" tidak dikenal, tidak ada path yang direvalidate` },
      { status: 400 }
    );
  }

  for (const path of paths) {
    if (path.includes("[slug]")) {
      revalidatePath(path, "page");
    } else {
      revalidatePath(path);
    }
  }

  return NextResponse.json({ revalidated: true, table: payload.table, paths });
}
