"use client";

import DashboardPageHeader from "@/components/dashboard-page-header";
import EnrollmentTable from "@/components/instructor-view/students";
import { InstructorContext } from "@/context/instructor-context";
import { fetchInstructorCourseListService } from "@/services";
import { useContext, useEffect } from "react";

export default function InstructorStudentsPage() {
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
        eyebrow="Learner community"
        title="My students"
        description="See who is enrolled and follow participation across your courses."
      />
      <EnrollmentTable courses={instructorCoursesList} />
    </div>
  );
}
