"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { updateAdminCoursePublicationService } from "@/services";
import { BookOpen, Eye, EyeOff, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function InstructorCourses({
  listOfCourses = [],
  basePath = "/admin",
}: {
  listOfCourses: any[];
  basePath?: "/admin" | "/instructor";
}) {
  const router = useRouter();
  const [courses, setCourses] = useState(listOfCourses);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => setCourses(listOfCourses), [listOfCourses]);

  async function togglePublication(course: any) {
    if (basePath !== "/admin") return;
    setUpdating(course._id);
    try {
      const response = await updateAdminCoursePublicationService(
        course._id,
        !course.isPublised
      );
      if (response.success) {
        setCourses((current) =>
          current.map((item) =>
            item._id === course._id ? response.data : item
          )
        );
      }
    } finally {
      setUpdating(null);
    }
  }

  return (
    <Card className="gap-0 overflow-hidden py-0">
      <CardHeader className="border-b py-4">
        <CardTitle>Courses</CardTitle>
        <CardDescription>
          Create and manage the academy&apos;s learning catalogue.
        </CardDescription>
        <CardAction>
          <Button
            size="sm"
            onClick={() => router.push(`${basePath}/courses/new`)}
          >
            <Plus />
            New course
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="p-0">
        {courses.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b bg-muted/40 text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 font-medium">Course</th>
                  <th className="px-6 py-3 font-medium">Category</th>
                  <th className="px-6 py-3 font-medium">Students</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {courses.map((course: any) => (
                  <tr key={course._id} className="hover:bg-muted/30">
                    <td className="px-6 py-3.5 font-medium">{course.title}</td>
                    <td className="px-6 py-3.5 capitalize text-muted-foreground">
                      {course.category?.replaceAll("-", " ")}
                    </td>
                    <td className="px-6 py-3.5 tabular-nums text-muted-foreground">
                      {course.students?.length || 0}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="rounded-md border px-2 py-1 text-xs font-medium">
                        {course.isPublised ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex justify-end gap-1">
                        {basePath === "/admin" ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={updating === course._id}
                            onClick={() => togglePublication(course)}
                          >
                            {course.isPublised ? <EyeOff /> : <Eye />}
                            {course.isPublised ? "Unpublish" : "Publish"}
                          </Button>
                        ) : null}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            router.push(
                              `${basePath}/courses/new?courseId=${course._id}`
                            )
                          }
                        >
                          Edit
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <BookOpen className="mx-auto size-7 text-muted-foreground" />
            <p className="mt-3 font-medium">No courses created yet</p>
            <Button
              className="mt-4"
              variant="outline"
              onClick={() => router.push(`${basePath}/courses/new`)}
            >
              Create the first course
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
