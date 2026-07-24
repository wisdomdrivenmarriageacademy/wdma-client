"use client";

import InstructorDashboard from "@/components/instructor-view/dashboard";
import { InstructorContext } from "@/context/instructor-context";
import { fetchInstructorCourseListService } from "@/services";
import { useContext, useEffect } from "react";

export default function InstructorDashboardPage() {
  const { instructorCoursesList, setInstructorCoursesList } =
    useContext(InstructorContext);

  useEffect(() => {
    fetchInstructorCourseListService().then((response) => {
      if (response.success) setInstructorCoursesList(response.data);
    });
  }, [setInstructorCoursesList]);

  return (
    <InstructorDashboard
      listOfCourses={instructorCoursesList}
      scope="instructor"
    />
  );
}
