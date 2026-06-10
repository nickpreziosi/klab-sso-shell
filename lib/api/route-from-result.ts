import { NextResponse } from "next/server";
import type { Result } from "@/contexts/shared/domain/result";

/**
 * Converts a Result<T> into a NextResponse with appropriate status code.
 * Use in API route handlers to avoid repeating the same status/body mapping.
 */
export function jsonFromResult<T>(result: Result<T>): NextResponse {
  const body: Record<string, unknown> = {};
  if (result.data !== null && result.data !== undefined) body.data = result.data;
  if (result.message.length > 0) body.message = result.message;
  if (result.errors.length > 0) body.errors = result.errors;
  return NextResponse.json(body, { status: result.statusCode });
}
