import React, { type JSX } from "react";

type Props = Readonly<{
  children: React.ReactNode;
}>;

export default function TaskTabLayout({ children }: Props): JSX.Element {
  return <>{children}</>;
}
