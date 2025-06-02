// https://github.com/vercel/next.js/discussions/54955#discussioncomment-11744585

import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { CustomMiddleware } from "./chain";

export function withSearchParams(middleware: CustomMiddleware) {
  return async (
    request: NextRequest,
    event: NextFetchEvent,
    _response: NextResponse,
  ) => {
    const response = NextResponse.next();
    const searchParams = request.nextUrl.searchParams.toString();
    response.headers.set("X-Search-Params", searchParams);

    return middleware(request, event, response);
  };
}
