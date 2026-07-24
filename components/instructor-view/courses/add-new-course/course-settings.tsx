import MediaProgressbar from "@/components/media-progress-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { InstructorContext } from "@/context/instructor-context";
import { mediaUploadService } from "@/services";
import { ImagePlus } from "lucide-react";
import { useContext } from "react";

function CourseSettings() {
  const {
    courseLandingFormData,
    setCourseLandingFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);

  async function handleImageUploadChange(event) {
    const selectedImage = event.target.files[0];

    if (selectedImage) {
      const imageFormData = new FormData();
      imageFormData.append("file", selectedImage);

      try {
        setMediaUploadProgress(true);
        const response = await mediaUploadService(
          imageFormData,
          setMediaUploadProgressPercentage
        );
        if (response.success) {
          setCourseLandingFormData({
            ...courseLandingFormData,
            image: response.data.url,
          });
          setMediaUploadProgress(false);
        }
      } catch {
        setMediaUploadProgress(false);
      }
    }
  }

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="px-0">
        <CardTitle>Course artwork</CardTitle>
        <p className="text-sm text-muted-foreground">
          Use a calm, high-quality landscape image with minimal or no text.
        </p>
      </CardHeader>
      <div className="p-4">
        {mediaUploadProgress ? (
          <MediaProgressbar
            isMediaUploading={mediaUploadProgress}
            progress={mediaUploadProgressPercentage}
          />
        ) : null}
      </div>
      <CardContent className="px-0">
        {courseLandingFormData?.image ? (
          <div className="space-y-4">
            <div className="aspect-[16/7] max-w-3xl overflow-hidden rounded-xl border bg-muted">
              <img
                src={courseLandingFormData.image}
                alt="Course artwork preview"
                className="h-full w-full object-cover"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setCourseLandingFormData({
                  ...courseLandingFormData,
                  image: "",
                })
              }
            >
              Replace artwork
            </Button>
          </div>
        ) : (
          <label className="flex min-h-56 max-w-3xl cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 px-6 text-center transition-colors hover:bg-muted/35">
            <ImagePlus className="size-7 text-muted-foreground" />
            <span className="mt-3 font-medium">Upload course artwork</span>
            <span className="mt-1 text-sm text-muted-foreground">
              Recommended ratio 16:9, JPG or PNG
            </span>
            <Input
              onChange={handleImageUploadChange}
              type="file"
              accept="image/*"
              className="sr-only"
            />
          </label>
        )}
      </CardContent>
    </Card>
  );
}

export default CourseSettings;
