import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const userResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/@me`,
    {
      headers: {
        ...request.headers,
      },
    }
  );

  return userResponse;
}
