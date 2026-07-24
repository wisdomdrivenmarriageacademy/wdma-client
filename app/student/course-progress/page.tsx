"use client";

import ThemeToggle from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import VideoPlayer from "@/components/video-player";
import { AuthContext } from "@/context/auth-context";
import {
  getCurrentCourseProgressService,
  markLectureAsViewedService,
  resetCourseProgressService,
} from "@/services";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  ListVideo,
  Menu,
  Play,
  RotateCcw,
  X,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import Confetti from "react-confetti";

type Lecture = {
  _id: string;
  title: string;
  videoUrl: string;
  progressValue?: number;
};

type CourseProgress = {
  courseDetails: {
    _id: string;
    title: string;
    description?: string;
    curriculum: Lecture[];
  };
  progress: { lectureId: string; viewed: boolean }[];
  completed?: boolean;
};

export default function StudentViewCourseProgressPage() {
  const router = useRouter();
  const courseId = useSearchParams().get("id") ?? "";
  const { auth } = useContext(AuthContext)!;
  const [data, setData] = useState<CourseProgress | null>(null);
  const [currentLecture, setCurrentLecture] = useState<Lecture | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [locked, setLocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [complete, setComplete] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const markingRef = useRef<string | null>(null);

  const loadProgress = useCallback(async () => {
    if (!auth.user?._id || !courseId) return;
    try {
      const response = await getCurrentCourseProgressService(
        auth.user._id,
        courseId
      );
      if (!response.success) throw new Error(response.message);
      if (!response.data.isPurchased) {
        setLocked(true);
        return;
      }

      const nextData = response.data as CourseProgress;
      setData(nextData);
      setComplete(Boolean(nextData.completed));
      setCurrentLecture((selected) => {
        if (selected) {
          return (
            nextData.courseDetails.curriculum.find(
              (lecture) => lecture._id === selected._id
            ) || nextData.courseDetails.curriculum[0] || null
          );
        }
        const firstUnwatched =
          nextData.courseDetails.curriculum.find(
            (lecture) =>
              !nextData.progress.some(
                (progress) =>
                  progress.lectureId === lecture._id && progress.viewed
              )
          ) || nextData.courseDetails.curriculum[0];
        return firstUnwatched || null;
      });
    } catch {
      setError("Your learning progress could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, [auth.user?._id, courseId]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const syncSidebar = () => setSidebarOpen(desktop.matches);
    syncSidebar();
    desktop.addEventListener("change", syncSidebar);
    return () => desktop.removeEventListener("change", syncSidebar);
  }, []);

  useEffect(() => {
    if (!sidebarOpen || window.matchMedia("(min-width: 1024px)").matches) {
      return;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [sidebarOpen]);

  useEffect(() => {
    if (!confetti) return;
    const timeout = window.setTimeout(() => setConfetti(false), 7000);
    return () => window.clearTimeout(timeout);
  }, [confetti]);

  const viewedIds = useMemo(
    () =>
      new Set(
        data?.progress
          .filter((progress) => progress.viewed)
          .map((progress) => progress.lectureId) || []
      ),
    [data?.progress]
  );
  const lessons = data?.courseDetails.curriculum || [];
  const percent = lessons.length
    ? Math.round((viewedIds.size / lessons.length) * 100)
    : 0;
  const currentIndex = Math.max(
    lessons.findIndex((lecture) => lecture._id === currentLecture?._id),
    0
  );

  const markComplete = useCallback(async (lecture: Lecture) => {
    if (
      lecture.progressValue !== 1 ||
      viewedIds.has(lecture._id) ||
      markingRef.current === lecture._id ||
      !auth.user?._id ||
      !data
    ) {
      return;
    }

    markingRef.current = lecture._id;
    try {
      const response = await markLectureAsViewedService(
        auth.user._id,
        data.courseDetails._id,
        lecture._id
      );
      if (response.success) {
        const finalLesson = viewedIds.size + 1 >= lessons.length;
        await loadProgress();
        if (finalLesson) {
          setComplete(true);
          setConfetti(true);
        }
      }
    } finally {
      markingRef.current = null;
    }
  }, [
    auth.user?._id,
    data,
    lessons.length,
    loadProgress,
    viewedIds,
  ]);

  useEffect(() => {
    if (currentLecture?.progressValue === 1) markComplete(currentLecture);
  }, [currentLecture, markComplete]);

  async function resetCourse() {
    if (!auth.user?._id || !data) return;
    const response = await resetCourseProgressService(
      auth.user._id,
      data.courseDetails._id
    );
    if (response.success) {
      setComplete(false);
      setConfetti(false);
      setCurrentLecture(null);
      await loadProgress();
    }
  }

  function moveLecture(offset: number) {
    const target = lessons[currentIndex + offset];
    if (target) setCurrentLecture(target);
  }

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-media text-media-foreground">
        <div className="text-center">
          <div className="mx-auto size-7 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          <p className="mt-4 text-sm text-white/65">Preparing your lesson…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid min-h-screen place-items-center bg-media px-6 text-center text-media-foreground">
        <div>
          <p className="font-medium">{error}</p>
          <Button
            variant="outline"
            className="mt-4 border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
            onClick={() => router.push("/student/student-courses")}
          >
            <ArrowLeft />
            Back to my learning
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-svh min-w-0 flex-col overflow-hidden bg-media text-media-foreground">
      {confetti ? <Confetti recycle={false} numberOfPieces={220} /> : null}
      <header className="z-40 flex h-14 shrink-0 items-center gap-3 border-b border-white/10 bg-media/95 px-3 backdrop-blur md:px-5">
        <Button
          variant="ghost"
          size="sm"
          className="text-white/75 hover:bg-white/10 hover:text-white"
          onClick={() => router.push("/student/student-courses")}
        >
          <ArrowLeft />
          <span className="hidden sm:inline">My learning</span>
        </Button>
        <span className="h-5 w-px bg-white/10" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">
            {data?.courseDetails.title}
          </p>
          <p className="text-[11px] text-white/45">
            {viewedIds.size} of {lessons.length} lessons · {percent}%
          </p>
        </div>
        <ThemeToggle />
        <Button
          variant="ghost"
          size="icon"
          className="text-white/75 hover:bg-white/10 hover:text-white"
          aria-label={sidebarOpen ? "Hide course content" : "Show course content"}
          onClick={() => setSidebarOpen((open) => !open)}
        >
          {sidebarOpen ? <X /> : <Menu />}
        </Button>
      </header>

      <div className="relative flex min-h-0 min-w-0 flex-1 overflow-hidden">
        <main className="min-w-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="mx-auto max-w-6xl p-3 md:p-6">
            <div className="aspect-video overflow-hidden rounded-lg border border-white/10 bg-black shadow-2xl">
              {currentLecture ? (
                <VideoPlayer
                  key={currentLecture._id}
                  url={currentLecture.videoUrl}
                  progressData={currentLecture}
                  onProgressUpdate={(progress) =>
                    setCurrentLecture(progress as Lecture)
                  }
                />
              ) : (
                <div className="grid h-full place-items-center text-sm text-white/50">
                  Select a lesson to begin.
                </div>
              )}
            </div>

            <div className="flex flex-col gap-5 py-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-xs text-white/45">
                  Lesson {lessons.length ? currentIndex + 1 : 0} of {lessons.length}
                </p>
                <h1 className="mt-1 text-xl font-semibold tracking-tight md:text-2xl">
                  {currentLecture?.title}
                </h1>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button
                  variant="outline"
                  className="border-white/15 bg-transparent text-white hover:bg-white/10 hover:text-white"
                  disabled={currentIndex <= 0}
                  onClick={() => moveLecture(-1)}
                >
                  <ChevronLeft />
                  Previous
                </Button>
                <Button
                  className="bg-white text-black hover:bg-white/90"
                  disabled={currentIndex >= lessons.length - 1}
                  onClick={() => moveLecture(1)}
                >
                  Next
                  <ChevronRight />
                </Button>
              </div>
            </div>

            <div className="border-t border-white/10 py-6">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-white/45">
                Course overview
              </p>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-white/65">
                {data?.courseDetails.description}
              </p>
            </div>
          </div>
        </main>

        {sidebarOpen ? (
          <button
            type="button"
            className="absolute inset-0 z-20 bg-black/55 lg:hidden"
            aria-label="Close course content"
            onClick={() => setSidebarOpen(false)}
          />
        ) : null}

        <aside
          className={`absolute inset-y-0 right-0 z-30 w-[min(88vw,380px)] shrink-0 border-l border-white/10 bg-[#0d0d0d] transition-transform duration-200 lg:relative ${
            sidebarOpen ? "translate-x-0" : "translate-x-full lg:hidden"
          }`}
        >
          <div className="flex h-full flex-col">
            <div className="border-b border-white/10 p-5">
              <div className="flex items-center gap-2">
                <ListVideo className="size-4 text-white/60" />
                <h2 className="text-sm font-medium">Course content</h2>
              </div>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-brand-gold transition-[width]"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              <div className="space-y-1">
                {lessons.map((lecture, index) => {
                  const viewed = viewedIds.has(lecture._id);
                  const active = currentLecture?._id === lecture._id;
                  return (
                    <button
                      key={lecture._id}
                      type="button"
                      onClick={() => setCurrentLecture(lecture)}
                      className={`flex w-full items-start gap-3 rounded-md px-3 py-3 text-left transition-colors ${
                        active ? "bg-white/10" : "hover:bg-white/[0.06]"
                      }`}
                    >
                      <span
                        className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border ${
                          viewed
                            ? "border-success/40 bg-success/15 text-success"
                            : "border-white/15 text-white/45"
                        }`}
                      >
                        {viewed ? (
                          <Check className="size-3.5" />
                        ) : active ? (
                          <Play className="size-3 fill-current" />
                        ) : (
                          <span className="text-[10px]">{index + 1}</span>
                        )}
                      </span>
                      <span className="min-w-0">
                        <span
                          className={`block text-sm leading-5 ${
                            active ? "text-white" : "text-white/70"
                          }`}
                        >
                          {lecture.title}
                        </span>
                        <span className="mt-1 block text-[11px] text-white/35">
                          {viewed ? "Completed" : "Video lesson"}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>
      </div>

      <Dialog open={locked}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enrollment required</DialogTitle>
            <DialogDescription>
              Enroll in this course before opening its private lessons.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => router.replace(`/student/course-details?id=${courseId}`)}>
            View course
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={complete} onOpenChange={setComplete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Course complete</DialogTitle>
            <DialogDescription>
              You finished every lesson in {data?.courseDetails.title}.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button onClick={() => router.push("/student/student-courses")}>
              My learning
            </Button>
            <Button variant="outline" onClick={resetCourse}>
              <RotateCcw />
              Rewatch course
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
