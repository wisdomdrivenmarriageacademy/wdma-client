"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function InstructorCourses({ listOfCourses = [] }: { listOfCourses: any[] }) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Courses</h2>
        <Button onClick={() => router.push("/instructor/add-new-course")}>
          Add New Course
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {listOfCourses.map((course: any) => (
          <Card
            key={course._id}
            className="cursor-pointer"
            onClick={() =>
              router.push(`/instructor/add-new-course?courseId=${course._id}`)
            }
          >
            <CardContent className="p-4">
              <CardTitle>{course.title}</CardTitle>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default InstructorCourses;
