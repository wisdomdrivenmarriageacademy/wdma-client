"use client";

import CourseCurriculum from "@/components/instructor-view/courses/add-new-course/course-curriculum";
import CourseLanding from "@/components/instructor-view/courses/add-new-course/course-landing";
import CourseSettings from "@/components/instructor-view/courses/add-new-course/course-settings";
import DashboardPageHeader from "@/components/dashboard-page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import {
  addNewCourseService,
  fetchInstructorCourseDetailsService,
  updateCourseByIdService,
} from "@/services";
import { ArrowLeft, CircleAlert, Save } from "lucide-react";
import { useCallback, useContext, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

function AddNewCoursePage() {
  const {
    courseLandingFormData,
    courseCurriculumFormData,
    setCourseLandingFormData,
    setCourseCurriculumFormData,
    currentEditedCourseId,
    setCurrentEditedCourseId,
  } = useContext(InstructorContext);

  const router = useRouter();
  const pathname = usePathname();
  const courseId = useSearchParams().get("courseId");
  const coursesPath = pathname.startsWith("/instructor")
    ? "/instructor/courses"
    : "/admin/courses";
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function isEmpty(value: any) {
    if (Array.isArray(value)) {
      return value.length === 0;
    }

    return value === "" || value === null || value === undefined;
  }

  function validateFormData() {
    for (const key in courseLandingFormData) {
      if (isEmpty(courseLandingFormData[key])) {
        return false;
      }
    }

    let hasFreePreview = false;

    for (const item of courseCurriculumFormData) {
      if (
        isEmpty(item.title) ||
        isEmpty(item.videoUrl) ||
        isEmpty(item.public_id)
      ) {
        return false;
      }

      if (item.freePreview) {
        hasFreePreview = true; //found at least one free preview
      }
    }

    return hasFreePreview;
  }

  async function handleCreateCourse() {
    setSaving(true);
    setError("");
    const courseFinalFormData = {
      date: new Date(),
      ...courseLandingFormData,
      students: [],
      curriculum: courseCurriculumFormData,
      isPublised: true,
    };

    try {
      const response =
        currentEditedCourseId !== null
          ? await updateCourseByIdService(
              currentEditedCourseId,
              courseFinalFormData
            )
          : await addNewCourseService(courseFinalFormData);

      if (response?.success) {
        setCourseLandingFormData(courseLandingInitialFormData);
        setCourseCurriculumFormData(courseCurriculumInitialFormData);
        setCurrentEditedCourseId(null);
        router.push(coursesPath);
      }
    } catch {
      setError("The course could not be saved. Review the content and try again.");
    } finally {
      setSaving(false);
    }
  }

  const fetchCurrentCourseDetails = useCallback(async () => {
    const response = await fetchInstructorCourseDetailsService(
      currentEditedCourseId
    );

    if (response?.success) {
      const setCourseFormData = Object.keys(
        courseLandingInitialFormData
      ).reduce((acc: Record<string, any>, key: string) => {
        acc[key] =
          (response?.data as any)[key] ||
          (courseLandingInitialFormData as any)[key];
        return acc;
      }, {});

      setCourseLandingFormData(setCourseFormData);
      setCourseCurriculumFormData((response?.data as any)?.curriculum);
    }
  }, [
    currentEditedCourseId,
    setCourseCurriculumFormData,
    setCourseLandingFormData,
  ]);

  useEffect(() => {
    if (currentEditedCourseId !== null) fetchCurrentCourseDetails();
  }, [currentEditedCourseId, fetchCurrentCourseDetails]);

  useEffect(() => {
    setCurrentEditedCourseId(courseId);
  }, [courseId, setCurrentEditedCourseId]);

  return (
    <div className="space-y-5 px-4 lg:px-6">
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2"
        onClick={() => router.push(coursesPath)}
      >
        <ArrowLeft />
        Course library
      </Button>

      <DashboardPageHeader
        eyebrow="Course studio"
        title={courseId ? "Refine your course" : "Create a learning experience"}
        description="Shape the promise, lessons, and presentation learners will see."
      >
        <Button
          disabled={!validateFormData() || saving}
          onClick={handleCreateCourse}
        >
          <Save />
          {saving
            ? "Saving…"
            : courseId
              ? "Save changes"
              : "Publish course"}
        </Button>
      </DashboardPageHeader>

      {error ? (
        <div className="flex items-start gap-2 rounded-md border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <CircleAlert className="mt-0.5 size-4 shrink-0" />
          {error}
        </div>
      ) : null}

      {!validateFormData() ? (
        <p className="text-xs text-muted-foreground">
          Complete every course field, upload each lesson, add artwork, and
          choose at least one free preview before publishing.
        </p>
      ) : null}

      <Card className="gap-0 overflow-hidden py-0">
        <CardContent className="p-0">
          <Tabs defaultValue="course-landing-page">
            <div className="overflow-x-auto border-b px-4 pt-3 md:px-6">
              <TabsList className="h-10 w-max min-w-full justify-start bg-transparent p-0">
                <TabsTrigger
                  value="course-landing-page"
                  className="rounded-none border-b-2 border-transparent px-4 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  01 · Details
                </TabsTrigger>
                <TabsTrigger
                  value="curriculum"
                  className="rounded-none border-b-2 border-transparent px-4 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  02 · Curriculum
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="rounded-none border-b-2 border-transparent px-4 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  03 · Artwork
                </TabsTrigger>
              </TabsList>
            </div>
            <div className="p-4 md:p-6">
              <TabsContent value="course-landing-page" className="mt-0">
                <CourseLanding />
              </TabsContent>
              <TabsContent value="curriculum" className="mt-0">
                <CourseCurriculum />
              </TabsContent>
              <TabsContent value="settings" className="mt-0">
                <CourseSettings />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default AddNewCoursePage;
