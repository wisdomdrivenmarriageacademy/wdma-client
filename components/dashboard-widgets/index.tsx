"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export type DashboardMetric = {
  label: string;
  value: string | number;
  trend?: string;
  positive?: boolean;
  summary: string;
  detail: string;
};

export function SectionCards({ items }: { items: DashboardMetric[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 lg:px-6">
      {items.map((item) => (
        <Card
          key={item.label}
          className="@container/card shadow-none"
        >
          <CardHeader>
            <CardDescription>{item.label}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {item.value}
            </CardTitle>
            {item.trend ? (
              <span className="col-start-2 row-span-2 row-start-1 inline-flex h-6 items-center gap-1 self-start justify-self-end rounded-md border px-2 text-xs font-medium">
                {item.positive === false ? (
                  <ArrowDownRight className="size-3.5" />
                ) : (
                  <ArrowUpRight className="size-3.5" />
                )}
                {item.trend}
              </span>
            ) : null}
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="font-medium">{item.summary}</div>
            <div className="text-muted-foreground">{item.detail}</div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export function ActivityChart({
  title,
  description,
  data,
}: {
  title: string;
  description: string;
  data: { label: string; value: number }[];
}) {
  const max = Math.max(...data.map((item) => item.value), 1);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <span className="col-start-2 row-span-2 row-start-1 self-start justify-self-end rounded-md border px-2 py-1 text-xs text-muted-foreground">
          By course
        </span>
      </CardHeader>
      <CardContent className="px-4 pt-4 sm:px-6 sm:pt-6">
        <div className="relative h-[250px] overflow-hidden rounded-md">
          <div className="pointer-events-none absolute inset-0 grid grid-rows-4">
            {[0, 1, 2, 3].map((line) => (
              <span key={line} className="border-t border-border/70" />
            ))}
          </div>
          <div className="relative flex h-[220px] items-end gap-2 px-2 sm:gap-4">
            {data.length ? (
              data.map((item) => (
                <div
                  key={item.label}
                  className="group flex h-full min-w-0 flex-1 items-end"
                  title={`${item.label}: ${item.value}`}
                >
                  <div
                    className="w-full rounded-t-sm bg-primary/75 transition-colors group-hover:bg-primary"
                    style={{
                      height: `${Math.max((item.value / max) * 100, 5)}%`,
                    }}
                  />
                </div>
              ))
            ) : (
              <div className="grid h-full w-full place-items-center text-sm text-muted-foreground">
                Activity will appear when data is available.
              </div>
            )}
          </div>
          <div
            className="relative mt-2 grid text-center text-[10px] text-muted-foreground sm:text-xs"
            style={{
              gridTemplateColumns: `repeat(${Math.max(data.length, 1)}, minmax(0, 1fr))`,
            }}
          >
            {data.map((item) => (
              <span key={item.label} className="truncate px-1">
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
