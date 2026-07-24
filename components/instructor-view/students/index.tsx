import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users } from "lucide-react";

export default function EnrollmentTable({
  courses,
  title = "Students",
  description = "Learners enrolled across your courses.",
}: {
  courses: any[];
  title?: string;
  description?: string;
}) {
  const enrolments = courses.flatMap((course) =>
    (course.students || []).map((student: any) => ({
      id: `${course._id}-${student.studentId}`,
      ...student,
      course: course.title,
    }))
  );

  return (
    <Card className="gap-0 overflow-hidden py-0">
      <CardHeader className="border-b py-4">
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {description} {enrolments.length} total enrolments.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {enrolments.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b bg-muted/40 text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 font-medium">Student</th>
                  <th className="px-6 py-3 font-medium">Email</th>
                  <th className="px-6 py-3 font-medium">Course</th>
                  <th className="px-6 py-3 text-right font-medium">Paid</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {enrolments.map((student) => (
                  <tr key={student.id} className="hover:bg-muted/30">
                    <td className="px-6 py-3.5 font-medium">
                      {student.studentName}
                    </td>
                    <td className="px-6 py-3.5 text-muted-foreground">
                      {student.studentEmail}
                    </td>
                    <td className="px-6 py-3.5 text-muted-foreground">
                      {student.course}
                    </td>
                    <td className="px-6 py-3.5 text-right tabular-nums">
                      ₦{Number(student.paidAmount || 0).toLocaleString("en-NG")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <Users className="mx-auto size-7 text-muted-foreground" />
            <p className="mt-3 font-medium">No students yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Enrolments will appear here automatically.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
