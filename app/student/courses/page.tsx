"use client";

import DashboardPageHeader from "@/components/dashboard-page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { courseCategories, courseLevelOptions, sortOptions } from "@/config";
import { AuthContext } from "@/context/auth-context";
import {
  checkCoursePurchaseInfoService,
  fetchStudentViewCourseListService,
} from "@/services";
import {
  ArrowRight,
  BookOpen,
  Clock3,
  Search,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useMemo, useState } from "react";

type CourseItem = {
  _id: string;
  title: string;
  subtitle?: string;
  image?: string;
  instructorName?: string;
  category?: string;
  level?: string;
  pricing?: number;
  students?: unknown[];
  curriculum?: unknown[];
};

const currency = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export default function StudentViewCoursesPage() {
  const router = useRouter();
  const { auth } = useContext(AuthContext)!;
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [sort, setSort] = useState("price-lowtohigh");
  const [loading, setLoading] = useState(true);
  const [opening, setOpening] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams({ sortBy: sort });
    if (category) params.set("category", category);
    if (level) params.set("level", level);

    setLoading(true);
    setError("");
    fetchStudentViewCourseListService(params.toString())
      .then((response) => {
        if (response.success) setCourses(response.data as unknown as CourseItem[]);
      })
      .catch(() => setError("Courses could not be loaded. Please try again."))
      .finally(() => setLoading(false));
  }, [category, level, sort]);

  const visibleCourses = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return courses;
    return courses.filter((course) =>
      [course.title, course.subtitle, course.instructorName]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(normalized))
    );
  }, [courses, query]);

  async function openCourse(courseId: string) {
    if (!auth.user?._id) return;
    setOpening(courseId);
    try {
      const response = await checkCoursePurchaseInfoService(
        courseId,
        auth.user._id
      );
      router.push(
        response.data
          ? `/student/course-progress?id=${courseId}`
          : `/student/course-details?id=${courseId}`
      );
    } catch {
      setError("This course could not be opened. Please try again.");
      setOpening(null);
    }
  }

  return (
    <div className="space-y-6 px-4 lg:px-6">
      <DashboardPageHeader
        eyebrow="Academy library"
        title="Learn for the relationship you want to build."
        description="Focused courses, practical lessons, and trusted guidance for each season of marriage and family life."
      >
        <div className="hidden rounded-lg border border-panel-foreground/15 bg-panel/60 p-4 text-right backdrop-blur-sm md:block">
          <p className="text-2xl font-semibold tabular-nums">{courses.length}</p>
          <p className="text-xs text-panel-muted">learning paths</p>
        </div>
      </DashboardPageHeader>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px_160px_190px]">
        <label className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search courses or instructors"
            className="h-10 w-full rounded-md border bg-background pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>
        <label className="relative">
          <span className="sr-only">Category</span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">All categories</option>
            {courseCategories.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <select
          aria-label="Course level"
          value={level}
          onChange={(event) => setLevel(event.target.value)}
          className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">All levels</option>
          {courseLevelOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        <label className="relative">
          <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <select
            aria-label="Sort courses"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="h-10 w-full rounded-md border bg-background pl-9 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {sortOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error ? (
        <div className="rounded-md border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((item) => (
            <Skeleton key={item} className="h-[370px] rounded-xl" />
          ))}
        </div>
      ) : visibleCourses.length ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {visibleCourses.map((course) => (
            <article
              key={course._id}
              className="group flex min-h-[370px] flex-col overflow-hidden rounded-xl border bg-card transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                {course.image ? (
                  <img
                    src={course.image}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                  />
                ) : (
                  <div className="grid h-full place-items-center">
                    <BookOpen className="size-8 text-muted-foreground" />
                  </div>
                )}
                <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/65 px-2.5 py-1 text-[11px] font-medium capitalize text-white backdrop-blur">
                  {course.level || "All levels"}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-xs font-medium capitalize text-primary">
                  {course.category?.replaceAll("-", " ") || "Relationships"}
                </p>
                <h3 className="mt-2 text-lg font-semibold leading-6 tracking-tight">
                  {course.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                  {course.subtitle || "Practical, guided learning from the academy."}
                </p>
                <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 className="size-3.5" />
                    {course.curriculum?.length || 0} lessons
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="size-3.5" />
                    {course.students?.length || 0} enrolled
                  </span>
                </div>
                <div className="mt-auto flex items-end justify-between gap-4 pt-5">
                  <div>
                    <p className="text-[11px] text-muted-foreground">
                      By {course.instructorName || "WDMA"}
                    </p>
                    <p className="mt-1 font-semibold tabular-nums">
                      {currency.format(Number(course.pricing) || 0)}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => openCourse(course._id)}
                    disabled={opening === course._id}
                  >
                    {opening === course._id ? "Opening…" : "View course"}
                    <ArrowRight />
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="grid min-h-72 place-items-center rounded-xl border border-dashed text-center">
          <div>
            <BookOpen className="mx-auto size-8 text-muted-foreground" />
            <p className="mt-3 font-medium">No courses match these filters</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try another search, category, or level.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                setQuery("");
                setCategory("");
                setLevel("");
              }}
            >
              Clear filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
