import React, { type JSX } from "react";
import { cookies } from "next/headers";
import { TaskStoreProvider } from "../_providers/task";
import { notFound } from "next/navigation";

type Props = Readonly<{
  children: React.ReactNode;
  workspaceId: string;
}>;

export default async function WorkspacePageLayout({
  workspaceId,
  children,
}: Props): Promise<JSX.Element | never> {
  const cookieStore = await cookies();
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/tasks?workspace_id=${workspaceId}`,
    {
      method: "GET",
      cache: "no-store",
      headers: {
        Cookie: cookieStore.toString(),
      },
    },
  );

  if (!response.ok) {
    notFound();
  }

  const data = await response.json();

  return (
    <TaskStoreProvider initialData={data.data}>{children}</TaskStoreProvider>
  );
}
