import MediaProgressbar from "@/components/media-progress-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import VideoPlayer from "@/components/video-player";
import { courseCurriculumInitialFormData } from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import {
  mediaBulkUploadService,
  mediaDeleteService,
  mediaUploadService,
} from "@/services";
import { Plus, Trash2, Upload, Video } from "lucide-react";
import { useContext, useRef } from "react";

function CourseCurriculum() {
  const {
    courseCurriculumFormData,
    setCourseCurriculumFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);

  const bulkUploadInputRef = useRef(null);

  function handleNewLecture() {
    setCourseCurriculumFormData([
      ...courseCurriculumFormData,
      {
        ...courseCurriculumInitialFormData[0],
      },
    ]);
  }

  function handleCourseTitleChange(event, currentIndex) {
    const cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    cpyCourseCurriculumFormData[currentIndex] = {
      ...cpyCourseCurriculumFormData[currentIndex],
      title: event.target.value,
    };

    setCourseCurriculumFormData(cpyCourseCurriculumFormData);
  }

  function handleFreePreviewChange(currentValue, currentIndex) {
    const cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    cpyCourseCurriculumFormData[currentIndex] = {
      ...cpyCourseCurriculumFormData[currentIndex],
      freePreview: currentValue,
    };

    setCourseCurriculumFormData(cpyCourseCurriculumFormData);
  }

  async function handleSingleLectureUpload(event, currentIndex) {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const videoFormData = new FormData();
      videoFormData.append("file", selectedFile);

      try {
        setMediaUploadProgress(true);
        const response = await mediaUploadService(
          videoFormData,
          setMediaUploadProgressPercentage
        );
        if (response.success) {
          const cpyCourseCurriculumFormData = [...courseCurriculumFormData];
          cpyCourseCurriculumFormData[currentIndex] = {
            ...cpyCourseCurriculumFormData[currentIndex],
            videoUrl: response?.data?.url,
            public_id: response?.data?.public_id,
          };
          setCourseCurriculumFormData(cpyCourseCurriculumFormData);
          setMediaUploadProgress(false);
        }
      } catch {
        setMediaUploadProgress(false);
      }
    }
  }

  async function handleReplaceVideo(currentIndex) {
    const cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    const getCurrentVideoPublicId =
      cpyCourseCurriculumFormData[currentIndex].public_id;

    const deleteCurrentMediaResponse = await mediaDeleteService(
      getCurrentVideoPublicId
    );

    if (deleteCurrentMediaResponse?.success) {
      cpyCourseCurriculumFormData[currentIndex] = {
        ...cpyCourseCurriculumFormData[currentIndex],
        videoUrl: "",
        public_id: "",
      };

      setCourseCurriculumFormData(cpyCourseCurriculumFormData);
    }
  }

  function isCourseCurriculumFormDataValid() {
    return courseCurriculumFormData.every((item) => {
      return (
        item &&
        typeof item === "object" &&
        item.title.trim() !== "" &&
        item.videoUrl.trim() !== ""
      );
    });
  }

  function handleOpenBulkUploadDialog() {
    bulkUploadInputRef.current?.click();
  }

  function areAllCourseCurriculumFormDataObjectsEmpty(arr) {
    return arr.every((obj) => {
      return Object.values(obj).every((value) => {
        if (typeof value === "boolean") {
          return true;
        }
        return value === "";
      });
    });
  }

  async function handleMediaBulkUpload(event) {
    const selectedFiles = Array.from(event.target.files as FileList);
    const bulkFormData = new FormData();

    selectedFiles.forEach((fileItem) => bulkFormData.append("files", fileItem));

    try {
      setMediaUploadProgress(true);
      const response = await mediaBulkUploadService(
        bulkFormData,
        setMediaUploadProgressPercentage
      );

      if (response?.success) {
        let cpyCourseCurriculumFormdata =
          areAllCourseCurriculumFormDataObjectsEmpty(courseCurriculumFormData)
            ? []
            : [...courseCurriculumFormData];

        cpyCourseCurriculumFormdata = [
          ...cpyCourseCurriculumFormdata,
          ...response?.data.map((item, index) => ({
            videoUrl: item?.url,
            public_id: item?.public_id,
            title: `Lecture ${
              cpyCourseCurriculumFormdata.length + (index + 1)
            }`,
            freePreview: false,
          })),
        ];
        setCourseCurriculumFormData(cpyCourseCurriculumFormdata);
        setMediaUploadProgress(false);
      }
    } catch {
      setMediaUploadProgress(false);
    }
  }

  async function handleDeleteLecture(currentIndex) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    const getCurrentSelectedVideoPublicId =
      cpyCourseCurriculumFormData[currentIndex].public_id;

    if (!getCurrentSelectedVideoPublicId) {
      setCourseCurriculumFormData(
        cpyCourseCurriculumFormData.filter((_, index) => index !== currentIndex)
      );
      return;
    }

    const response = await mediaDeleteService(getCurrentSelectedVideoPublicId);
    if (response?.success) {
      cpyCourseCurriculumFormData = cpyCourseCurriculumFormData.filter(
        (_, index) => index !== currentIndex
      );

      setCourseCurriculumFormData(cpyCourseCurriculumFormData);
    }
  }

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="flex flex-col justify-between gap-4 px-0 sm:flex-row sm:items-center">
        <div className="w-full sm:w-auto">
          <CardTitle>Build the curriculum</CardTitle>
          <p className="mt-2 text-sm text-muted-foreground">
            Add lessons in viewing order and select at least one free preview.
          </p>
        </div>
        <div>
          <Input
            type="file"
            ref={bulkUploadInputRef}
            accept="video/*"
            multiple
            className="hidden"
            id="bulk-media-upload"
            onChange={handleMediaBulkUpload}
          />
          <Button
            variant="outline"
            className="w-full cursor-pointer sm:w-auto"
            onClick={handleOpenBulkUploadDialog}
          >
            <Upload />
            Upload multiple
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <Button
          variant="outline"
          disabled={!isCourseCurriculumFormDataValid() || mediaUploadProgress}
          onClick={handleNewLecture}
        >
          <Plus />
          Add lesson
        </Button>
        {mediaUploadProgress ? (
          <MediaProgressbar
            isMediaUploading={mediaUploadProgress}
            progress={mediaUploadProgressPercentage}
          />
        ) : null}
        <div className="mt-5 space-y-3">
          {courseCurriculumFormData.map((curriculumItem, index) => (
            <div
              key={curriculumItem.public_id || `lesson-${index}`}
              className="rounded-lg border bg-background p-4 md:p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                <span className="grid size-8 shrink-0 place-items-center rounded-full border text-xs font-medium text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <Input
                  name={`title-${index + 1}`}
                  aria-label={`Title for lesson ${index + 1}`}
                  placeholder="Lesson title"
                  className="flex-1"
                  onChange={(event) => handleCourseTitleChange(event, index)}
                  value={courseCurriculumFormData[index]?.title}
                />
                <div className="flex shrink-0 items-center space-x-2">
                  <Switch
                    onCheckedChange={(value) =>
                      handleFreePreviewChange(value, index)
                    }
                    checked={courseCurriculumFormData[index]?.freePreview}
                    id={`freePreview-${index + 1}`}
                  />
                  <Label htmlFor={`freePreview-${index + 1}`}>
                    Free preview
                  </Label>
                </div>
              </div>
              <div className="mt-4 border-t pt-4">
                {courseCurriculumFormData[index]?.videoUrl ? (
                  <div className="grid gap-4 md:grid-cols-[minmax(0,420px)_auto] md:items-start">
                    <div className="aspect-video overflow-hidden rounded-lg bg-media">
                      <VideoPlayer
                        url={courseCurriculumFormData[index]?.videoUrl}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2 md:flex-col">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReplaceVideo(index)}
                      >
                        <Upload />
                        Replace
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteLecture(index)}
                      >
                        <Trash2 />
                        Delete
                      </Button>
                    </div>
                  </div>
                ) : (
                  <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed bg-muted/20 px-4 text-center transition-colors hover:bg-muted/35">
                    <Video className="size-5 text-muted-foreground" />
                    <span className="mt-2 text-sm font-medium">
                      Choose lesson video
                    </span>
                    <span className="mt-1 text-xs text-muted-foreground">
                      Upload a video file from your device
                    </span>
                    <Input
                      type="file"
                      accept="video/*"
                      onChange={(event) =>
                        handleSingleLectureUpload(event, index)
                      }
                      className="sr-only"
                    />
                  </label>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default CourseCurriculum;
