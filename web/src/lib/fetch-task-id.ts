"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export const fetchTaskId = async (
  taskId: string,
  workspaceId: string,
  errorFn: (res: Response) => void,
) => {
  const query = new URLSearchParams({
    workspace_id: workspaceId,
  });

  const cookieStore = await cookies();
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}?${query.toString()}`,
    {
      method: "GET",
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: "force-cache",
      next: {
        tags: [`fetch-task-${taskId}`],
      },
    },
  );

  if (!response.ok) {
    errorFn(response);
  }

  const data = await response.json();

  return data.data;
};

export const invalidateTaskId = async (taskId: string) => {
  revalidateTag(`fetch-task-${taskId}`);
};
