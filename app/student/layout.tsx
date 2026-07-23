import StudentViewCommonLayout from "@/components/student-view/common-layout";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StudentViewCommonLayout>{children}</StudentViewCommonLayout>;
}
