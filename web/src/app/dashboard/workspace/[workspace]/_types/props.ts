export type WorkspaceIdSearchParams = Readonly<{
  sort: "manual" | "dueDate" | "createdAt" | "priority" | undefined;
  filter: string | string[] | undefined;
  views: "list" | "board" | "calendar" | undefined;
  priority: string | string[] | undefined;

  [key: string]: string | string[] | undefined;
}>;

export type WorkspaceIdPageProps = Readonly<{
  params: Promise<{
    workspace: string;
  }>;
}>;

export type WorkspaceIdLayoutProps = Readonly<
  {
    children: React.ReactNode;
    modal: React.ReactNode;
  } & WorkspaceIdPageProps
>;
