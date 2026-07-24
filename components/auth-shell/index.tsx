import { ArrowLeft, GraduationCap, Sparkles } from "lucide-react";
import ThemeToggle from "@/components/theme-toggle";
import Link from "next/link";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

export default function AuthShell({
  eyebrow,
  title,
  description,
  children,
}: AuthShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background px-5 py-6 text-foreground sm:px-8">
      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl flex-col">
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground">
              <GraduationCap className="size-5" />
            </span>
            <span className="font-semibold tracking-[-0.02em]">
              Wisdom Driven Academy
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-card hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </div>
        </header>

        <div className="grid flex-1 items-center gap-14 py-12 lg:grid-cols-[1fr_460px]">
          <section className="hidden max-w-lg lg:block">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1.5 text-xs font-semibold text-secondary-foreground">
              <Sparkles className="size-3.5 text-brand-gold-strong" />
              Learn with clarity
            </span>
            <h2 className="mt-7 text-5xl font-semibold leading-[1.06] tracking-[-0.055em]">
              Your growth deserves a thoughtful space.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Sign in to continue learning, track your progress, and turn each
              lesson into meaningful action.
            </p>
          </section>

          <section className="w-full rounded-[1.5rem] border border-border bg-card p-6 shadow-xl shadow-black/5 sm:p-9 dark:shadow-black/30">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold-strong">
              {eyebrow}
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
              {title}
            </h1>
            <p className="mt-3 leading-7 text-muted-foreground">{description}</p>
            <div className="mt-8">{children}</div>
          </section>
        </div>
      </div>
    </main>
  );
}
