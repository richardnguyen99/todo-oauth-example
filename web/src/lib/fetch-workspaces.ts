"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export const fetchWorkspaces = async (errorFn: (r: Response) => void) => {
  const cookieStore = await cookies();
  const searchParams = new URLSearchParams({
    fields: [
      "title",
      "icon",
      "color",
      "private",
      "createdAt",
      "updatedAt",
    ].join(","),
    tag_fields: ["text", "color"].join(","),
    member_fields: [
      "_id",
      "userId",
      "role",
      "isActive",
      "createdAt",
      "user.username",
      "user.email",
      "user.emailVerified",
      "user.avatar",
    ].join(","),
    owner_field: ["username", "email", "emailVerified", "avatar"].join(","),
    includes: ["tags", "members", "owner"].join(","),
    include_member_account: "true",
    include_shared_workspaces: "true",
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/workspaces?${searchParams.toString()}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        Cookie: cookieStore.toString(),
      },
      next: {
        tags: ["fetch-workspaces"],
      },
    },
  );

  if (!response.ok) {
    errorFn(response);
  }

  const data = await response.json();

  return data.data;
};

export const invalidateWorkspaces = async () => {
  revalidateTag("fetch-workspaces");
};
