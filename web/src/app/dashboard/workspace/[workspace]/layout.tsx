import React, { type JSX } from "react";

type Props = Readonly<{
  children: React.ReactNode;
  params: Promise<{ workspace: string }>;
}>;

export default async function WorkspacePage({
  children,
}: Props): Promise<JSX.Element | never> {
  return <>{children}</>;
}
