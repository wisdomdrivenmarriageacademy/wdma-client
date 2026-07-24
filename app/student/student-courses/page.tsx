"use client";

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
import { fetchStudentBoughtCoursesService } from "@/services";
import { BookOpen, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

export default function StudentCoursesPage() {
  const { auth } = useContext(AuthContext)!;
  const { studentBoughtCoursesList, setStudentBoughtCoursesList } =
    useContext(StudentContext)!;
  const router = useRouter();
  const courses = Array.isArray(studentBoughtCoursesList)
    ? studentBoughtCoursesList
    : [];

  useEffect(() => {
    if (!auth.user?._id) return;
    fetchStudentBoughtCoursesService(auth.user._id).then((response) => {
      if (response.success) setStudentBoughtCoursesList(response.data);
    });
  }, [auth.user?._id, setStudentBoughtCoursesList]);

  return (
    <div className="space-y-6 px-4 lg:px-6">
      <DashboardPageHeader
        eyebrow="Personal library"
        title="My learning"
        description="Continue your courses and keep building practical wisdom at your own pace."
      />

      <Card className="gap-0 overflow-hidden py-0">
        <CardHeader className="border-b py-4">
          <CardTitle>My courses</CardTitle>
          <CardDescription>
            Continue the learning paths in your personal library.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {courses.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="border-b bg-muted/40 text-muted-foreground">
                  <tr>
                    <th className="px-6 py-3 font-medium">Course</th>
                    <th className="px-6 py-3 font-medium">Instructor</th>
                    <th className="px-6 py-3 font-medium">Enrolled</th>
                    <th className="px-6 py-3 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {courses.map((course: any) => (
                    <tr key={course.courseId} className="hover:bg-muted/30">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div className="size-10 overflow-hidden rounded-md bg-muted">
                            {course.courseImage ? (
                              <img
                                src={course.courseImage}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            ) : null}
                          </div>
                          <span className="font-medium">{course.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-muted-foreground">
                        {course.instructorName}
                      </td>
                      <td className="px-6 py-3 text-muted-foreground">
                        {course.dateOfPurchase
                          ? new Date(course.dateOfPurchase).toLocaleDateString(
                              "en-NG",
                              { day: "numeric", month: "short", year: "numeric" }
                            )
                          : "—"}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            router.push(
                              `/student/course-progress?id=${course.courseId}`
                            )
                          }
                        >
                          <Play />
                          Continue
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
              <p className="mt-3 font-medium">No enrolled courses yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Explore the catalogue to begin learning.
              </p>
              <Button
                className="mt-4"
                variant="outline"
                onClick={() => router.push("/student/courses")}
              >
                Browse courses
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
