import React, { type JSX } from "react";

import { WorkspaceIdSearchParams } from "./_types/props";
import WorkspaceView from "./_components/views";

type Props = Readonly<{
  searchParams: Promise<WorkspaceIdSearchParams>;
}>;

export const dynamic = "force-dynamic";

export default async function WorkspaceIdPage({
  searchParams,
}: Props): Promise<JSX.Element> {
  const params = await searchParams;

  return <WorkspaceView params={params} />;
}
