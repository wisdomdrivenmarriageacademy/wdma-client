import {
  ActivityChart,
  SectionCards,
} from "@/components/dashboard-widgets";
import DashboardPageHeader from "@/components/dashboard-page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plus, Users } from "lucide-react";
import Link from "next/link";

const naira = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export default function InstructorDashboard({
  listOfCourses = [],
  scope = "academy",
}: {
  listOfCourses: any[];
  scope?: "academy" | "instructor";
}) {
  const summary = listOfCourses.reduce(
    (result, course) => {
      const students = Array.isArray(course.students) ? course.students : [];
      result.students += students.length;
      result.revenue += students.reduce(
        (total: number, student: any) =>
          total + Number(student.paidAmount || course.pricing || 0),
        0
      );
      if (course.isPublised) result.published += 1;
      result.lessons += course.curriculum?.length || 0;
      students.forEach((student: any) =>
        result.enrolments.push({
          id: `${course._id}-${student.studentId}`,
          course: course.title,
          name: student.studentName,
          email: student.studentEmail,
        })
      );
      return result;
    },
    {
      students: 0,
      revenue: 0,
      published: 0,
      lessons: 0,
      enrolments: [] as any[],
    }
  );

  const chartData = listOfCourses.slice(0, 7).map((course: any) => ({
    label: course.title?.split(" ").slice(0, 2).join(" ") || "Course",
    value: course.students?.length || 0,
  }));

  return (
    <>
      <div className="px-4 lg:px-6">
        <DashboardPageHeader
          eyebrow={scope === "academy" ? "Academy command center" : "Teaching studio"}
          title={
            scope === "academy"
              ? "The academy at a glance."
              : "Teach with clarity and confidence."
          }
          description={
            scope === "academy"
              ? "Monitor learning, catalogue health, and access from one focused workspace."
              : "Review learner activity, refine your curriculum, and keep every course moving."
          }
        >
          <Button asChild variant="outline">
            <Link href={scope === "academy" ? "/admin/courses" : "/instructor/courses"}>
              View courses
              <ArrowRight />
            </Link>
          </Button>
          <Button asChild>
            <Link href={scope === "academy" ? "/admin/courses/new" : "/instructor/courses/new"}>
              <Plus />
              New course
            </Link>
          </Button>
        </DashboardPageHeader>
      </div>

      <SectionCards
        items={[
          {
            label: "Total Revenue",
            value: naira.format(summary.revenue),
            summary:
              scope === "academy"
                ? "Revenue across the academy"
                : "Revenue from your courses",
            detail: "From recorded student enrolments",
          },
          {
            label: "Enrolled Students",
            value: summary.students,
            summary: "Learner community",
            detail:
              scope === "academy"
                ? "Enrolments across the academy"
                : "Enrolments in your courses",
          },
          {
            label: "Courses",
            value: listOfCourses.length,
            summary: `${summary.published} published`,
            detail: `${listOfCourses.length - summary.published} saved as draft`,
          },
          {
            label: "Lessons",
            value: summary.lessons,
            summary: "Curriculum depth",
            detail: "Lessons available across all courses",
          },
        ]}
      />

      <div className="px-4 lg:px-6">
        <ActivityChart
          title="Student activity"
          description="Enrolment distribution across academy courses"
          data={chartData}
        />
      </div>

      <div className="px-4 lg:px-6">
        <Card className="gap-0 overflow-hidden py-0">
          <CardHeader className="border-b py-4">
            <CardTitle>Recent enrolments</CardTitle>
            <CardDescription>
              Students who recently joined academy courses.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {summary.enrolments.length ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="border-b bg-muted/40 text-muted-foreground">
                    <tr>
                      <th className="px-6 py-3 font-medium">Student</th>
                      <th className="px-6 py-3 font-medium">Email</th>
                      <th className="px-6 py-3 font-medium">Course</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {summary.enrolments.slice(0, 10).map((student) => (
                      <tr key={student.id} className="hover:bg-muted/30">
                        <td className="px-6 py-3.5 font-medium">
                          {student.name}
                        </td>
                        <td className="px-6 py-3.5 text-muted-foreground">
                          {student.email}
                        </td>
                        <td className="px-6 py-3.5 text-muted-foreground">
                          {student.course}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center">
                <Users className="mx-auto size-7 text-muted-foreground" />
                <p className="mt-3 font-medium">No enrolments yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Student activity will appear here.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
