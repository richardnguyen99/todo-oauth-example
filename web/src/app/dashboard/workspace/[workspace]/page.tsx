import React, { type JSX } from "react";

import TaskList from "./_components/sortable-task-list";
import { WorkspaceIdSearchParams } from "./_types/props";
import WorkspaceMenubar from "./_components/menubar";

type Props = Readonly<{
  searchParams: Promise<WorkspaceIdSearchParams>;
}>;

export default async function WorkspacePage({
  searchParams,
}: Props): Promise<JSX.Element> {
  const params = await searchParams;

  return (
    <div>
      <WorkspaceMenubar
        sort={params.sort}
        filter={params.filter}
        views={params.views}
      />

      <div className="mx-auto mt-3 max-w-4xl px-3">
        <TaskList sort={params.sort} />
      </div>
    </div>
  );
}
