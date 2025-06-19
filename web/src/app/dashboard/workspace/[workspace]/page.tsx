import React, { type JSX } from "react";

import { WorkspaceIdSearchParams } from "./_types/props";
import WorkspaceView from "./_components/views";

type Props = Readonly<{
  params: Promise<{
    workspace: string;
  }>;
  searchParams: Promise<WorkspaceIdSearchParams>;
}>;

export const dynamic = "force-dynamic";

export default async function WorkspaceIdPage({
  params,
  searchParams,
}: Props): Promise<JSX.Element> {
  const awaitedParams = await params;
  const awaitedSearchParams = await searchParams;

  console.log("WorkspaceIdPage", awaitedParams, awaitedSearchParams);

  return (
    <WorkspaceView
      workspaceId={awaitedParams.workspace}
      params={awaitedSearchParams}
    />
  );
}
