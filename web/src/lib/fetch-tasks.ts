"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export const fetchTasks = async (
  workspaceId: string,
  queryString: string = "",
  errFn: (res: Response) => void,
) => {
  const cookieStore = await cookies();
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/tasks?workspace_id=${workspaceId}&${queryString}`,
    {
      method: "GET",
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: "force-cache",
      next: {
        tags: [`fetch-tasks-${workspaceId}`],
      },
    },
  );

  if (!response.ok) {
    errFn(response);
  }

  const data = await response.json();

  return data.data;
};

export const invalidateTasks = async (workspaceId: string) => {
  revalidateTag(`fetch-tasks-${workspaceId}`);
  revalidateTag(`/dashboard/workspace/${workspaceId}`);
};
