"use client";

import {
  ActivityChart,
  SectionCards,
} from "@/components/dashboard-widgets";
import DashboardPageHeader from "@/components/dashboard-page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
  fetchStudentBoughtCoursesService,
  fetchStudentViewCourseListService,
} from "@/services";
import { ArrowRight, BookOpen, Compass, PlayCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function StudentHomePage() {
  const router = useRouter();
  const { auth } = useContext(AuthContext)!;
  const {
    studentViewCoursesList,
    setStudentViewCoursesList,
    studentBoughtCoursesList,
    setStudentBoughtCoursesList,
  } = useContext(StudentContext)!;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.user?._id) return;
    Promise.all([
      fetchStudentViewCourseListService(""),
      fetchStudentBoughtCoursesService(auth.user._id),
    ])
      .then(([courses, enrolled]) => {
        if (courses.success) setStudentViewCoursesList(courses.data);
        if (enrolled.success) setStudentBoughtCoursesList(enrolled.data);
      })
      .finally(() => setLoading(false));
  }, [
    auth.user?._id,
    setStudentBoughtCoursesList,
    setStudentViewCoursesList,
  ]);

  async function openCourse(courseId: string) {
    const response = await checkCoursePurchaseInfoService(
      courseId,
      auth.user!._id
    );
    router.push(
      response?.data
        ? `/student/course-progress?id=${courseId}`
        : `/student/course-details?id=${courseId}`
    );
  }

  const enrolled = Array.isArray(studentBoughtCoursesList)
    ? studentBoughtCoursesList
    : [];
  const lessonCount = studentViewCoursesList.reduce(
    (total: number, course: any) => total + (course.curriculum?.length || 0),
    0
  );
  const chartData = studentViewCoursesList.slice(0, 7).map((course: any) => ({
    label: course.title?.split(" ").slice(0, 2).join(" ") || "Course",
    value: course.curriculum?.length || 1,
  }));

  return (
    <>
      <div className="px-4 lg:px-6">
        <DashboardPageHeader
          eyebrow="Student workspace"
          title={`Welcome back, ${auth.user?.userName?.split(" ")[0] || "learner"}.`}
          description="Pick up where you stopped or find the next practical lesson for your relationship journey."
        >
          <Button asChild variant="outline">
            <Link href="/student/courses">
              <Compass />
              Explore courses
            </Link>
          </Button>
          {enrolled[0]?.courseId ? (
            <Button asChild>
              <Link href={`/student/course-progress?id=${enrolled[0].courseId}`}>
                <PlayCircle />
                Continue learning
              </Link>
            </Button>
          ) : null}
        </DashboardPageHeader>
      </div>

      <SectionCards
        items={[
          {
            label: "Enrolled Courses",
            value: loading ? "—" : enrolled.length,
            trend: enrolled.length ? "Active" : "Ready",
            summary: enrolled.length ? "Learning in progress" : "Ready to begin",
            detail: "Courses in your personal library",
          },
          {
            label: "Available Courses",
            value: loading ? "—" : studentViewCoursesList.length,
            trend: "Explore",
            summary: "New wisdom to discover",
            detail: "Published academy courses",
          },
          {
            label: "Available Lessons",
            value: loading ? "—" : lessonCount,
            trend: `${studentViewCoursesList.length} paths`,
            summary: "Practical, guided learning",
            detail: "Multiple course catalogue",
          },
          {
            label: "Learning Status",
            value: enrolled.length ? "Active" : "New",
            trend: "On track",
            summary: "Build consistent momentum",
            detail: `Welcome back, ${auth.user?.userName?.split(" ")[0] || "learner"}`,
          },
        ]}
      />

      <div className="px-4 lg:px-6">
        <ActivityChart
          title="Learning library"
          description="Lesson depth across currently available courses"
          data={chartData}
        />
      </div>

      <div className="px-4 lg:px-6">
        <Card className="gap-0 overflow-hidden py-0">
          <CardHeader className="border-b py-4">
            <CardTitle>Recommended courses</CardTitle>
            <CardDescription>
              Continue learning or choose your next course.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {studentViewCoursesList.length ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="border-b bg-muted/40 text-muted-foreground">
                    <tr>
                      <th className="px-6 py-3 font-medium">Course</th>
                      <th className="px-6 py-3 font-medium">Instructor</th>
                      <th className="px-6 py-3 font-medium">Level</th>
                      <th className="px-6 py-3 font-medium">Lessons</th>
                      <th className="px-6 py-3 text-right font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {studentViewCoursesList.slice(0, 8).map((course: any) => (
                      <tr key={course._id} className="hover:bg-muted/30">
                        <td className="px-6 py-3.5 font-medium">{course.title}</td>
                        <td className="px-6 py-3.5 text-muted-foreground">
                          {course.instructorName}
                        </td>
                        <td className="px-6 py-3.5 capitalize text-muted-foreground">
                          {course.level}
                        </td>
                        <td className="px-6 py-3.5 tabular-nums text-muted-foreground">
                          {course.curriculum?.length || 0}
                        </td>
                        <td className="px-6 py-3 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openCourse(course._id)}
                          >
                            Open
                            <ArrowRight />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center">
                <BookOpen className="mx-auto size-7 text-muted-foreground" />
                <p className="mt-3 font-medium">No courses available yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Published courses will appear here.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
