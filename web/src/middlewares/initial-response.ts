import { NextFetchEvent, NextResponse, type NextRequest } from "next/server";
import { CustomMiddleware } from "./chain";

export function withInitializeResponse(middleware: CustomMiddleware) {
  return async (
    request: NextRequest,
    event: NextFetchEvent,
    _response: NextResponse,
  ) => {
    const initialResponseInChain = NextResponse.next();

    return middleware(request, event, initialResponseInChain);
  };
}
