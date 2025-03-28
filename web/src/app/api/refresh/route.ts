import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();

  const userResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
    {
      headers: request.headers,
    }
  );

  const response = new NextResponse(userResponse.body, {
    headers: userResponse.headers,
  });

  return response;
}
