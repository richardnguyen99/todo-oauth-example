import React, { type JSX } from "react";
import { headers } from "next/headers";
import { ReadonlyURLSearchParams } from "next/navigation";

import FetchedWorkspaceIdLayout from "./_components/fetched-workspace-id-layout";
import SuspenseWorkspaceIdLayout from "./_components/suspense-workspace-id-layout";
import {
  WorkspaceIdLayoutProps,
  WorkspaceIdSearchParams,
} from "./_types/props";
import { buildSearchParams } from "@/lib/utils";

export default async function WorkspaceIdLayout({
  children,
  modal,
  params,
}: WorkspaceIdLayoutProps): Promise<JSX.Element> {
  const { workspace } = await params;
  const headerList = await headers();
  const searchParamsString = headerList.get("x-search-params") || "";
  const searchParams = buildSearchParams<WorkspaceIdSearchParams>(
    new ReadonlyURLSearchParams(searchParamsString),
  );

  return (
    <React.Suspense fallback={<SuspenseWorkspaceIdLayout />}>
      <FetchedWorkspaceIdLayout
        searchParams={searchParams}
        workspaceId={workspace}
      >
        {children}
        {modal}
      </FetchedWorkspaceIdLayout>
    </React.Suspense>
  );
}
