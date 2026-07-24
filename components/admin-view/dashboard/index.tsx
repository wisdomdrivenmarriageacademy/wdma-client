"use client";

import DashboardPageHeader from "@/components/dashboard-page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AdminDashboardData,
  fetchAdminDashboardService,
} from "@/services";
import {
  ArrowRight,
  BookOpen,
  CircleDollarSign,
  GraduationCap,
  ReceiptText,
  RefreshCw,
  Users,
} from "lucide-react";
import Link from "next/link";
import { PointerEvent, useCallback, useEffect, useMemo, useState } from "react";

const currency = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

const compactNumber = new Intl.NumberFormat("en-NG", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const ranges = [
  { value: 30, label: "Last 30 days" },
  { value: 90, label: "Last 3 months" },
  { value: 365, label: "Last 12 months" },
];

function fillDailySeries(data: AdminDashboardData, days: number) {
  const byDate = new Map(data.trend.map((item) => [item.date, item]));
  const end = new Date(data.period.to);
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(end);
    date.setUTCDate(end.getUTCDate() - (days - index - 1));
    const key = date.toISOString().slice(0, 10);
    return byDate.get(key) ?? { date: key, revenue: 0, enrollments: 0 };
  });
}

function pointsFor(values: number[], width: number, height: number) {
  const max = Math.max(...values, 1);
  return values.map((value, index) => ({
    x: values.length === 1 ? width / 2 : (index / (values.length - 1)) * width,
    y: height - (value / max) * (height - 18) - 9,
  }));
}

function linePath(points: { x: number; y: number }[]) {
  return points
    .map((point, index) => `${index ? "L" : "M"}${point.x},${point.y}`)
    .join(" ");
}

function AnalyticsChart({
  data,
  days,
  onDaysChange,
}: {
  data: AdminDashboardData;
  days: number;
  onDaysChange: (days: number) => void;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const series = useMemo(() => fillDailySeries(data, days), [data, days]);
  const width = 1000;
  const height = 250;
  const revenuePoints = pointsFor(
    series.map((item) => item.revenue),
    width,
    height
  );
  const enrollmentPoints = pointsFor(
    series.map((item) => item.enrollments),
    width,
    height
  );
  const revenueLine = linePath(revenuePoints);
  const enrollmentLine = linePath(enrollmentPoints);
  const revenueArea = `${revenueLine} L${width},${height} L0,${height} Z`;
  const active = activeIndex === null ? null : series[activeIndex];
  const activeRevenuePoint =
    activeIndex === null ? null : revenuePoints[activeIndex];
  const activeEnrollmentPoint =
    activeIndex === null ? null : enrollmentPoints[activeIndex];

  function selectPoint(event: PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(
      Math.max((event.clientX - bounds.left) / bounds.width, 0),
      1
    );
    setActiveIndex(Math.round(ratio * (series.length - 1)));
  }

  return (
    <Card className="gap-0 overflow-hidden py-0">
      <CardHeader className="gap-3 border-b py-5 sm:grid-cols-[1fr_auto]">
        <div>
          <CardTitle>Revenue and enrolments</CardTitle>
          <CardDescription className="mt-1">
            Completed Paystack payments, grouped by purchase date.
          </CardDescription>
        </div>
        <select
          aria-label="Analytics period"
          value={days}
          onChange={(event) => onDaysChange(Number(event.target.value))}
          className="h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-44"
        >
          {ranges.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div
          className="relative h-[290px] touch-none"
          onPointerMove={selectPoint}
          onPointerLeave={() => setActiveIndex(null)}
        >
          <svg
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
            className="h-[250px] w-full overflow-visible"
            role="img"
            aria-label="Revenue and enrolments over time"
          >
            {[0, 1, 2, 3, 4].map((line) => (
              <line
                key={line}
                x1="0"
                x2={width}
                y1={(line / 4) * height}
                y2={(line / 4) * height}
                stroke="var(--border)"
                strokeWidth="1"
              />
            ))}
            <path d={revenueArea} fill="var(--chart-1)" opacity="0.13" />
            <path
              d={revenueLine}
              fill="none"
              stroke="var(--chart-1)"
              strokeWidth="2.5"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d={enrollmentLine}
              fill="none"
              stroke="var(--chart-3)"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
            {activeRevenuePoint && activeEnrollmentPoint ? (
              <>
                <line
                  x1={activeRevenuePoint.x}
                  x2={activeRevenuePoint.x}
                  y1="0"
                  y2={height}
                  stroke="var(--muted-foreground)"
                  strokeDasharray="4 5"
                  opacity="0.55"
                />
                <circle
                  cx={activeRevenuePoint.x}
                  cy={activeRevenuePoint.y}
                  r="5"
                  fill="var(--chart-1)"
                />
                <circle
                  cx={activeEnrollmentPoint.x}
                  cy={activeEnrollmentPoint.y}
                  r="5"
                  fill="var(--chart-3)"
                />
              </>
            ) : null}
          </svg>
          {active && activeRevenuePoint ? (
            <div
              className="pointer-events-none absolute top-3 z-10 min-w-40 -translate-x-1/2 rounded-lg border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-lg"
              style={{ left: `${(activeRevenuePoint.x / width) * 100}%` }}
            >
              <p className="font-medium">
                {new Date(`${active.date}T00:00:00Z`).toLocaleDateString(
                  "en-NG",
                  { day: "numeric", month: "short", year: "numeric" }
                )}
              </p>
              <p className="mt-1 text-muted-foreground">
                Revenue: {currency.format(active.revenue)}
              </p>
              <p className="text-muted-foreground">
                Enrolments: {active.enrollments}
              </p>
            </div>
          ) : null}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-5 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <span className="size-2 rounded-sm bg-chart-1" />
              Revenue
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="size-2 rounded-sm bg-chart-3" />
              Enrolments
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const paid = status === "paid";
  return (
    <span
      className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${
        paid
          ? "border-success/25 bg-success-muted text-success-foreground"
          : "text-muted-foreground"
      }`}
    >
      {status}
    </span>
  );
}

export default function AdminDashboard() {
  const [days, setDays] = useState(90);
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetchAdminDashboardService(days);
      if (!response.success) throw new Error(response.message);
      setData(response.data);
      setLastUpdated(new Date());
    } catch {
      setError("Live academy analytics could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const interval = window.setInterval(load, 60_000);
    return () => window.clearInterval(interval);
  }, [load]);

  const header = (
    <DashboardPageHeader
      eyebrow="Academy operations"
      title="Decisions backed by live data."
      description="Revenue, enrolments, catalogue health, and learner progress are synced directly from the academy database."
    >
      {lastUpdated ? (
        <span className="self-center text-xs text-panel-muted">
          Updated{" "}
          {lastUpdated.toLocaleTimeString("en-NG", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      ) : null}
      <Button
        variant="outline"
        size="sm"
        disabled={loading}
        onClick={load}
      >
        <RefreshCw className={loading ? "animate-spin" : ""} />
        Refresh
      </Button>
      <Button asChild>
        <Link href="/admin/orders">
          <ReceiptText />
          View transactions
        </Link>
      </Button>
    </DashboardPageHeader>
  );

  if (loading && !data) {
    return (
      <div className="space-y-6 px-4 lg:px-6">
        {header}
        <div className="grid gap-4 lg:grid-cols-4">
          {[0, 1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-36 rounded-xl" />
          ))}
          <Skeleton className="h-96 rounded-xl lg:col-span-4" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-6 px-4 lg:px-6">
        {header}
        <div className="grid min-h-80 place-items-center rounded-xl border border-dashed text-center">
          <div>
            <p className="font-medium">{error}</p>
            <Button variant="outline" className="mt-4" onClick={load}>
              Try again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const metrics = [
    {
      label: "Gross revenue",
      value: currency.format(data.totals.revenue),
      detail: `${data.totals.paidOrders} completed payments`,
      icon: CircleDollarSign,
    },
    {
      label: "Students",
      value: compactNumber.format(data.totals.students),
      detail: `${data.totals.activeLearners} active learners`,
      icon: Users,
    },
    {
      label: "Courses",
      value: data.totals.courses,
      detail: `${data.totals.publishedCourses} published · ${data.totals.draftCourses} drafts`,
      icon: BookOpen,
    },
    {
      label: "Completion rate",
      value: `${data.totals.completionRate}%`,
      detail: `${data.totals.completedCourses} course completions`,
      icon: GraduationCap,
    },
  ];

  return (
    <div className="space-y-6 px-4 lg:px-6">
      {header}

      {error ? (
        <div className="rounded-md border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error} Showing the last successful result.
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="gap-4 shadow-none">
            <CardHeader className="grid-cols-[1fr_auto]">
              <CardDescription>{metric.label}</CardDescription>
              <span className="grid size-8 place-items-center rounded-md bg-primary/10 text-primary">
                <metric.icon className="size-4" />
              </span>
              <CardTitle className="text-2xl tabular-nums md:text-3xl">
                {metric.value}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {metric.detail}
            </CardContent>
          </Card>
        ))}
      </div>

      <AnalyticsChart data={data} days={days} onDaysChange={setDays} />

      <div className="grid items-start gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <Card className="gap-0 overflow-hidden py-0">
          <CardHeader className="border-b py-5">
            <CardTitle>Top courses</CardTitle>
            <CardDescription>
              Highest revenue in the selected period.
            </CardDescription>
          </CardHeader>
          <CardContent className="divide-y p-0">
            {data.topCourses.length ? (
              data.topCourses.map((course, index) => (
                <div
                  key={course.courseId}
                  className="flex items-center gap-3 px-5 py-4"
                >
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-muted text-xs font-medium">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {course.title}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {course.enrollments} enrolments
                    </p>
                  </div>
                  <p className="text-sm font-medium tabular-nums">
                    {currency.format(course.revenue)}
                  </p>
                </div>
              ))
            ) : (
              <p className="px-5 py-12 text-center text-sm text-muted-foreground">
                Paid course activity will appear here.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="gap-0 overflow-hidden py-0">
          <CardHeader className="border-b py-5">
            <CardTitle>Recent transactions</CardTitle>
            <CardDescription>
              Latest payment attempts across the academy.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {data.recentOrders.length ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[660px] text-left text-sm">
                  <thead className="border-b bg-muted/35 text-xs text-muted-foreground">
                    <tr>
                      <th className="px-5 py-3 font-medium">Student</th>
                      <th className="px-5 py-3 font-medium">Course</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                      <th className="px-5 py-3 text-right font-medium">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {data.recentOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-muted/25">
                        <td className="px-5 py-3.5">
                          <p className="font-medium">{order.userName}</p>
                          <p className="text-xs text-muted-foreground">
                            {order.userEmail}
                          </p>
                        </td>
                        <td className="max-w-64 truncate px-5 py-3.5 text-muted-foreground">
                          {order.courseTitle}
                        </td>
                        <td className="px-5 py-3.5">
                          <StatusBadge status={order.paymentStatus} />
                        </td>
                        <td className="px-5 py-3.5 text-right font-medium tabular-nums">
                          {currency.format(Number(order.coursePricing) || 0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="px-5 py-12 text-center text-sm text-muted-foreground">
                Transactions will appear after checkout begins.
              </p>
            )}
          </CardContent>
          <div className="border-t px-5 py-3 text-right">
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/orders">
                All transactions
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
