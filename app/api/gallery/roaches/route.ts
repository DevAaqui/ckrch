import { NextResponse } from "next/server";

import { getAllGlobalRoachCounts } from "@/lib/roach-counts-store";

export async function GET() {
  const counts = await getAllGlobalRoachCounts();
  return NextResponse.json({ counts });
}
