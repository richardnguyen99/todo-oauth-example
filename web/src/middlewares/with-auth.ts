import { NextFetchEvent, NextResponse, type NextRequest } from "next/server";
import { CustomMiddleware } from "./chain";

export function withAuth(middleware: CustomMiddleware) {
  return async (
    request: NextRequest,
    event: NextFetchEvent,
    response: NextResponse,
  ) => {
    const pathname = request.nextUrl.pathname;
    const accessToken = request.cookies.get("access_token");

    const isProtectedRoute = (pathname: string) =>
      pathname.includes("/dashboard");

    if (isProtectedRoute(pathname) && !accessToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (!isProtectedRoute(pathname) && accessToken) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (isProtectedRoute(pathname) && accessToken) {
      const userResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/@me`,
        {
          method: "GET",
          cache: "no-store",
          credentials: "include",
          headers: {
            Cookie: request.cookies.toString(),
          },
        },
      );

      if (!userResponse.ok) {
        if (userResponse.status === 401) {
          const refreshTokenResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
            {
              method: "GET",
              cache: "no-store",
              credentials: "include",
              headers: {
                Cookie: request.cookies.toString(),
              },
            },
          );

          if (refreshTokenResponse.ok) {
            const newResponse = NextResponse.next();
            newResponse.headers.set(
              "set-cookie",
              refreshTokenResponse.headers.get("set-cookie")!,
            );

            return middleware(request, event, newResponse);
          } else {
            const errorResponse = await refreshTokenResponse.json();
            return NextResponse.json({
              statusCode: refreshTokenResponse.status,
              message: errorResponse.message,
              data: null,
            });
          }
        } else {
          const errorResponse = await userResponse.json();
          return NextResponse.json({
            statusCode: userResponse.status,
            message: errorResponse.message,
            data: null,
          });
        }
      }

      response.headers.set("X-User", await userResponse.text());
    }

    return middleware(request, event, response);
  };
}
