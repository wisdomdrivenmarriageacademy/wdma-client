"use client";

import DashboardPageHeader from "@/components/dashboard-page-header";
import InstructorCourses from "@/components/instructor-view/courses";
import { InstructorContext } from "@/context/instructor-context";
import { fetchInstructorCourseListService } from "@/services";
import { useContext, useEffect } from "react";

export default function AdminCoursesPage() {
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
        eyebrow="Academy catalogue"
        title="All courses"
        description="Create and manage every learning experience available across the academy."
      />
      <InstructorCourses listOfCourses={instructorCoursesList} />
    </div>
  );
}
