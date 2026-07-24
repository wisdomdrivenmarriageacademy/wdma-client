"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import VideoPlayer from "@/components/video-player";
import {
  createPaymentService,
  fetchStudentViewCourseDetailsService,
} from "@/services";
import {
  ArrowLeft,
  Check,
  Clock3,
  Globe2,
  LockKeyhole,
  Play,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Lecture = {
  _id?: string;
  public_id?: string;
  title: string;
  videoUrl: string;
  freePreview: boolean;
};

type CourseDetails = {
  _id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  instructorName?: string;
  primaryLanguage?: string;
  level?: string;
  category?: string;
  date?: string;
  pricing?: number;
  objectives?: string;
  students?: unknown[];
  curriculum?: Lecture[];
};

const currency = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export default function StudentViewCourseDetailsPage() {
  const router = useRouter();
  const courseId = useSearchParams().get("id") ?? "";
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [preview, setPreview] = useState<Lecture | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!courseId) {
      setError("This course link is incomplete.");
      setLoading(false);
      return;
    }

    fetchStudentViewCourseDetailsService(courseId)
      .then((response) => {
        if (response.success) {
          setCourse(response.data as unknown as CourseDetails);
        } else {
          setError(response.message || "Course not found.");
        }
      })
      .catch(() => setError("The course could not be loaded."))
      .finally(() => setLoading(false));
  }, [courseId]);

  const objectives = useMemo(
    () =>
      course?.objectives
        ?.split(/[\n,]/)
        .map((item) => item.trim())
        .filter(Boolean) || [],
    [course?.objectives]
  );
  const freePreview = course?.curriculum?.find((lecture) => lecture.freePreview);

  async function beginCheckout() {
    if (!course?._id) return;
    setPaying(true);
    setError("");
    try {
      const response = await createPaymentService({ courseId: course._id });
      const url = response.data?.authorizationUrl;
      if (!url) throw new Error("Missing checkout URL");
      window.location.assign(url);
    } catch {
      setError("Checkout could not be started. Please try again.");
      setPaying(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-5 px-4 lg:px-6">
        <Skeleton className="h-64 rounded-xl" />
        <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
          <Skeleton className="h-96 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="mx-4 grid min-h-[55vh] place-items-center rounded-xl border border-dashed text-center lg:mx-6">
        <div>
          <p className="font-medium">{error || "Course not found"}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => router.push("/student/courses")}
          >
            <ArrowLeft />
            Back to courses
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 px-4 lg:px-6">
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2"
        onClick={() => router.push("/student/courses")}
      >
        <ArrowLeft />
        Course library
      </Button>

      <section className="relative overflow-hidden rounded-xl bg-panel px-6 py-10 text-panel-foreground md:px-10 md:py-14">
        {course.image ? (
          <img
            src={course.image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-20 grayscale"
          />
        ) : null}
        <div className="absolute inset-0 bg-panel/80" />
        <div className="relative max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand-gold">
            {course.category?.replaceAll("-", " ") || "Academy course"}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
            {course.title}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-panel-muted md:text-lg">
            {course.subtitle}
          </p>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-panel-muted">
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="size-3.5" />
              {course.curriculum?.length || 0} lessons
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Globe2 className="size-3.5" />
              {course.primaryLanguage || "English"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users className="size-3.5" />
              {course.students?.length || 0} learners
            </span>
          </div>
        </div>
      </section>

      {error ? (
        <div className="rounded-md border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <main className="space-y-5">
          <section className="rounded-xl border bg-card p-6 md:p-8">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-primary">
              Course outcomes
            </p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight">
              What you will take away
            </h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {objectives.length ? (
                objectives.map((objective) => (
                  <div key={objective} className="flex gap-3 text-sm leading-6">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-success-muted text-success-foreground">
                      <Check className="size-3" />
                    </span>
                    <span>{objective}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  Course outcomes will be shared by the instructor.
                </p>
              )}
            </div>
          </section>

          <section className="rounded-xl border bg-card p-6 md:p-8">
            <h3 className="text-xl font-semibold tracking-tight">
              About this course
            </h3>
            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-muted-foreground">
              {course.description}
            </p>
          </section>

          <section className="overflow-hidden rounded-xl border bg-card">
            <div className="border-b p-6 md:px-8">
              <h3 className="text-xl font-semibold tracking-tight">
                Course curriculum
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {course.curriculum?.length || 0} guided lessons
              </p>
            </div>
            <div className="divide-y">
              {course.curriculum?.map((lecture, index) => (
                <button
                  key={lecture._id || lecture.public_id || lecture.title}
                  type="button"
                  disabled={!lecture.freePreview}
                  onClick={() => setPreview(lecture)}
                  className="flex w-full items-center gap-4 px-6 py-4 text-left transition-colors enabled:hover:bg-muted/35 disabled:cursor-default md:px-8"
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-full border text-xs tabular-nums text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">
                      {lecture.title}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {lecture.freePreview ? "Free preview" : "Included with enrollment"}
                    </span>
                  </span>
                  {lecture.freePreview ? (
                    <Play className="size-4 text-primary" />
                  ) : (
                    <LockKeyhole className="size-4 text-muted-foreground" />
                  )}
                </button>
              ))}
            </div>
          </section>
        </main>

        <aside className="sticky top-20 overflow-hidden rounded-xl border bg-card shadow-sm">
          <div className="aspect-video bg-media">
            {freePreview ? (
              <VideoPlayer url={freePreview.videoUrl} />
            ) : course.image ? (
              <img src={course.image} alt="" className="h-full w-full object-cover" />
            ) : null}
          </div>
          <div className="p-6">
            <p className="text-xs text-muted-foreground">One-time enrollment</p>
            <p className="mt-1 text-3xl font-semibold tracking-tight tabular-nums">
              {currency.format(Number(course.pricing) || 0)}
            </p>
            <Button
              className="mt-5 w-full"
              size="lg"
              onClick={beginCheckout}
              disabled={paying}
            >
              {paying ? "Opening secure checkout…" : "Enroll with Paystack"}
            </Button>
            <div className="mt-4 flex items-start gap-2 text-xs leading-5 text-muted-foreground">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-success" />
              Secure payment. Access is added automatically after confirmation.
            </div>
            <p className="mt-5 border-t pt-5 text-xs text-muted-foreground">
              Created by{" "}
              <span className="font-medium text-foreground">
                {course.instructorName || "Wisdom Driven Academy"}
              </span>
            </p>
          </div>
        </aside>
      </div>

      <Dialog open={Boolean(preview)} onOpenChange={(open) => !open && setPreview(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{preview?.title || "Course preview"}</DialogTitle>
          </DialogHeader>
          <div className="aspect-video overflow-hidden rounded-lg bg-media">
            {preview ? <VideoPlayer url={preview.videoUrl} /> : null}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
