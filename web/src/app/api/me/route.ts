import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get("access_token")?.value;
  let refreshToken = cookieStore.get("refresh_token")?.value;

  if (!accessToken) {
    return NextResponse.json(
      {
        error: "No access token found",
      },
      {
        status: 401,
      },
    );
  }

  const userResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/@me`,
    {
      method: "GET",
      headers: {
        Cookie: `access_token=${accessToken}; refresh_token=${refreshToken}`,
      },
      credentials: "include",
      cache: "no-store",
    },
  );

  if (userResponse.ok) {
    const userData = await userResponse.json();

    cookieStore.set("access_token", accessToken!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      domain: process.env.NODE_ENV ? `.${process.env.DOMAIN}` : "",
      maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 year
    });

    cookieStore.set("refresh_token", refreshToken!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      domain: process.env.NODE_ENV ? `.${process.env.DOMAIN}` : "",
      maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 year
    });

    return NextResponse.json({
      data: userData.data,
    });
  }

  if (!refreshToken || userResponse.status !== 401) {
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      },
    );
  }

  const refreshResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieStore.toString(),
      },
      credentials: "include",
      cache: "no-store",
    },
  );

  if (!refreshResponse.ok) {
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      },
    );
  }

  const refreshData = await refreshResponse.json();
  accessToken = refreshData.data.access_token;
  refreshToken = refreshData.data.refresh_token;

  const newUserResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/@me`,
    {
      method: "GET",
      headers: {
        Cookie: `access_token=${accessToken}; refresh_token=${refreshToken}`,
      },
      credentials: "include",
      cache: "no-store",
    },
  );

  if (!newUserResponse.ok) {
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      },
    );
  }

  const newUserData = await newUserResponse.json();
  return new Response(
    JSON.stringify({
      data: newUserData.data,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": refreshResponse.headers.get("set-cookie") || "",
      },
    },
  );
}
