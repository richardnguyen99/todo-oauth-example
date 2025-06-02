export type WorkspaceIdPageProps = Readonly<{
  params: Promise<{
    workspace: string;
  }>;

  searchParams: Promise<{
    sort: "manual" | "dueDate" | "createdAt" | "priority" | undefined;
    filter: string | string[] | undefined;
    views: "list" | "board" | "calendar" | undefined;

    [key: string]: string | string[] | undefined;
  }>;
}>;

export type WorkspaceIdLayoutProps = Readonly<
  {
    children: React.ReactNode;
    modal: React.ReactNode;
  } & WorkspaceIdPageProps
>;
