"use client";

import DashboardShell from "@/components/dashboard-shell";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function StudentViewCommonLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <DashboardShell
      area="student"
      contentOnly={pathname.includes("course-progress")}
    >
      {children}
    </DashboardShell>
  );
}
