import { NextResponse } from "next/server";

import {
  getGlobalRoachCount,
  incrementGlobalRoachCount,
  isValidCardId,
} from "@/lib/roach-counts-store";

type RouteContext = { params: Promise<{ cardId: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { cardId } = await context.params;
  if (!isValidCardId(cardId)) {
    return NextResponse.json({ error: "Unknown card" }, { status: 404 });
  }
  const count = await getGlobalRoachCount(cardId);
  return NextResponse.json({ count });
}

export async function POST(_request: Request, context: RouteContext) {
  const { cardId } = await context.params;
  if (!isValidCardId(cardId)) {
    return NextResponse.json({ error: "Unknown card" }, { status: 404 });
  }
  try {
    const count = await incrementGlobalRoachCount(cardId);
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ error: "Could not increment" }, { status: 500 });
  }
}
