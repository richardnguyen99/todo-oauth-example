import React, { type JSX } from "react";

import DashboardHeader from "./_components/dashboard-header";

type Props = Readonly<{
  children: React.ReactNode;
}>;

export default function DashboardLayout({ children }: Props): JSX.Element {
  return (
    <>
      <DashboardHeader />
      {children}
    </>
  );
}
