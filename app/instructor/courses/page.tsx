"use client";

import DashboardPageHeader from "@/components/dashboard-page-header";
import InstructorCourses from "@/components/instructor-view/courses";
import { InstructorContext } from "@/context/instructor-context";
import { fetchInstructorCourseListService } from "@/services";
import { useContext, useEffect } from "react";

export default function InstructorCoursesPage() {
  const { instructorCoursesList, setInstructorCoursesList } =
    useContext(InstructorContext);

  useEffect(() => {
    fetchInstructorCourseListService().then((response) => {
      if (response.success) setInstructorCoursesList(response.data);
    });
  }, [setInstructorCoursesList]);

  return (
    <div className="space-y-6 px-4 lg:px-6">
      <DashboardPageHeader
        eyebrow="Course library"
        title="My courses"
        description="Create, refine, and manage every learning experience you teach."
      />
      <InstructorCourses
        listOfCourses={instructorCoursesList}
        basePath="/instructor"
      />
    </div>
  );
}
