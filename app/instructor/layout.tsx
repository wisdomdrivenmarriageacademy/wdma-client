import DashboardShell from "@/components/dashboard-shell";

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell area="instructor">{children}</DashboardShell>;
}
