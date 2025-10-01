import { NextResponse } from "next/server";

export function error(status: number, message: string, err?: unknown) {
  return NextResponse.json(
    { error: message, message: err instanceof Error ? err.message : message },
    { status }
  );
}
