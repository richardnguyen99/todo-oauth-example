// https://github.com/vercel/next.js/discussions/54955#discussioncomment-11744585

import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { CustomMiddleware } from "./chain";

export function withSearchParams(middleware: CustomMiddleware) {
  return async (
    request: NextRequest,
    event: NextFetchEvent,
    response: NextResponse,
  ) => {
    const nextUrl = request.nextUrl;
    const searchParams = nextUrl.searchParams.toString();
    const url = request.url;
    const referer = request.headers.get("referer");

    if (
      url.includes("/task/") &&
      !referer &&
      (nextUrl.searchParams.get("fallback") ||
        nextUrl.searchParams.get("sort") ||
        nextUrl.searchParams.get("filter"))
    ) {
      nextUrl.searchParams.delete("fallback");
      nextUrl.searchParams.delete("sort");
      nextUrl.searchParams.delete("filter");

      const newResponse = NextResponse.redirect(nextUrl.href, {});

      return newResponse;
    }

    response.headers.set("X-Search-Params", searchParams);

    return middleware(request, event, response);
  };
}
