import FormControls from "@/components/common-form/form-controls";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { courseLandingPageFormControls } from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import { useContext } from "react";

function CourseLanding() {
  const { courseLandingFormData, setCourseLandingFormData } =
    useContext(InstructorContext);
  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="px-0">
        <CardTitle>Course details</CardTitle>
        <p className="text-sm text-muted-foreground">
          Write a clear promise and enough context for learners to decide.
        </p>
      </CardHeader>
      <CardContent className="px-0">
        <FormControls
          formControls={courseLandingPageFormControls as any}
          formData={courseLandingFormData}
          setFormData={setCourseLandingFormData}
        />
      </CardContent>
    </Card>
  );
}

export default CourseLanding;
