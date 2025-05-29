"use server";
import { cookies } from "next/headers";

export async function setCookie(
  name: string,
  value: string,
  options: object = {},
) {
  const cookieStore = await cookies();

  cookieStore.set(name, value, {
    httpOnly: true,
    maxAge: 60 * 60 * 24, // 24 hours
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    ...options,
  });
}
