import type { ReactNode } from "react";

export default function DashboardPageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  description: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden rounded-xl bg-panel p-6 text-panel-foreground md:p-8">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[url('/images/page-header.jpg')] bg-cover bg-center"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-panel/45" />
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand-gold">
            {eyebrow}
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            {title}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-panel-muted md:text-base">
            {description}
          </p>
        </div>
        {children ? (
          <div className="flex shrink-0 flex-wrap gap-2">{children}</div>
        ) : null}
      </div>
    </section>
  );
}
