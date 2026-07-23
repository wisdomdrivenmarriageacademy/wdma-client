import { ArrowLeft, GraduationCap, Sparkles } from "lucide-react";
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
    <main className="relative min-h-screen overflow-hidden bg-[#f7f6f1] px-5 py-6 text-[#17251d] sm:px-8">
      <div className="absolute -left-40 -top-44 size-[30rem] rounded-full bg-[#e6b75e]/15 blur-3xl" />
      <div className="absolute -bottom-52 -right-44 size-[34rem] rounded-full bg-[#5e9c73]/15 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl flex-col">
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-[#173f2b] text-white">
              <GraduationCap className="size-5" />
            </span>
            <span className="font-semibold tracking-[-0.02em]">
              Wisdom Driven Academy
            </span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#657169] hover:bg-white hover:text-[#17251d]"
          >
            <ArrowLeft className="size-4" />
            Home
          </Link>
        </header>

        <div className="grid flex-1 items-center gap-14 py-12 lg:grid-cols-[1fr_460px]">
          <section className="hidden max-w-lg lg:block">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#deddd3] bg-white/70 px-3 py-1.5 text-xs font-semibold text-[#3f654f]">
              <Sparkles className="size-3.5 text-[#c48932]" />
              Learn with clarity
            </span>
            <h2 className="mt-7 text-5xl font-semibold leading-[1.06] tracking-[-0.055em]">
              Your growth deserves a thoughtful space.
            </h2>
            <p className="mt-6 text-lg leading-8 text-[#657169]">
              Sign in to continue learning, track your progress, and turn each
              lesson into meaningful action.
            </p>
          </section>

          <section className="w-full rounded-[1.5rem] border border-white bg-white p-6 shadow-xl shadow-[#173f2b]/8 sm:p-9">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a66f20]">
              {eyebrow}
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
              {title}
            </h1>
            <p className="mt-3 leading-7 text-[#6b766f]">{description}</p>
            <div className="mt-8">{children}</div>
          </section>
        </div>
      </div>
    </main>
  );
}
