import React, { type JSX } from "react";

import FetchedWorkspaceIdLayout from "./_components/fetched-workspace-id-layout";
import SuspenseWorkspaceIdLayout from "./_components/suspense-workspace-id-layout";

type Props = Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
  params: Promise<{
    workspace: string;
  }>;
}>;

export default async function WorkspaceIdLayout({
  children,
  modal,
  params,
}: Props): Promise<JSX.Element> {
  const { workspace } = await params;

  return (
    <React.Suspense fallback={<SuspenseWorkspaceIdLayout />}>
      <FetchedWorkspaceIdLayout workspaceId={workspace}>
        {children}
        {modal}
      </FetchedWorkspaceIdLayout>
    </React.Suspense>
  );
}
