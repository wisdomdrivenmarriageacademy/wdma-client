import { Button } from "@/components/ui/button";
import {
  faqItems,
  SignupCta,
  SiteFooter,
  SiteHeader,
} from "@/components/public-site";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Check,
  Compass,
  GraduationCap,
  HeartHandshake,
  MessageCircleHeart,
  Play,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";
import { HomeHeroActions } from "@/components/account-menu";

const benefits = [
  {
    icon: BookOpen,
    title: "Practical learning",
    description:
      "Focused courses that turn useful ideas into steps you can apply immediately.",
  },
  {
    icon: Users,
    title: "Learn from experts",
    description:
      "Clear guidance from instructors who teach from real experience.",
  },
  {
    icon: HeartHandshake,
    title: "Grow with purpose",
    description:
      "Build knowledge, confidence, and habits that create lasting change.",
  },
];

const learningPaths = [
  {
    icon: Compass,
    title: "Preparing for marriage",
    description:
      "Build self-awareness, shared expectations, and a thoughtful foundation before saying “I do.”",
    tone: "bg-primary/10 text-primary",
  },
  {
    icon: MessageCircleHeart,
    title: "Communication",
    description:
      "Learn to listen well, speak honestly, and handle difficult conversations with care.",
    tone: "bg-brand-coral/15 text-brand-plum",
  },
  {
    icon: ShieldCheck,
    title: "Conflict and repair",
    description:
      "Replace destructive patterns with practical tools for repair, trust, and reconnection.",
    tone: "bg-brand-gold/15 text-brand-gold-strong",
  },
  {
    icon: Brain,
    title: "Personal growth",
    description:
      "Understand the beliefs, habits, and emotional patterns you bring into your relationship.",
    tone: "bg-primary/10 text-primary",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-clip bg-background text-foreground">
      <SiteHeader />

      <section className="relative mx-auto grid max-w-7xl gap-14 px-5 pb-24 pt-14 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:pb-32 lg:pt-24">
        <div className="relative z-10 max-w-2xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5 text-xs font-semibold text-secondary-foreground shadow-sm">
            <GraduationCap className="size-3.5 text-brand-gold-strong" />
            Learn with clarity. Grow with purpose.
          </div>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.03] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
            Learning that moves your life{" "}
            <span className="text-brand-gold-strong">forward.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground sm:text-xl">
            Practical, wisdom-led courses for singles and couples who want to
            build healthier relationships and stronger marriages.
          </p>
          <HomeHeroActions />
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {["Learn anywhere", "Practical guidance", "Grow together"].map(
              (item) => (
                <span key={item} className="flex items-center gap-2">
                  <span className="grid size-5 place-items-center rounded-full bg-primary/10 text-primary">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  {item}
                </span>
              )
            )}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:mx-0">
          <div className="relative rotate-[1.5deg] rounded-[2rem] border border-border bg-panel p-3 shadow-2xl shadow-black/15">
            <div className="overflow-hidden rounded-[1.4rem] bg-card">
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Continue learning
                  </p>
                  <p className="mt-1 font-semibold">Foundations for growth</p>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  64% complete
                </span>
              </div>
              <div className="p-5 sm:p-7">
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-muted p-6 text-foreground">
                  <div className="relative flex h-full flex-col justify-between">
                    <span className="w-fit rounded-full bg-card/40 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                      Lesson 04
                    </span>
                    <div>
                      <p className="max-w-xs text-2xl font-semibold leading-tight tracking-[-0.03em] sm:text-3xl">
                        Strong relationships are built on intentional choices.
                      </p>
                      <button
                        type="button"
                        aria-label="Play lesson preview"
                        className="mt-5 grid size-11 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform duration-150 active:scale-[0.95]"
                      >
                        <Play className="ml-0.5 size-4 fill-current" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <div className="mb-2 flex justify-between text-xs font-medium text-muted-foreground">
                    <span>Your progress</span>
                    <span>8 of 12 lessons</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div className="h-full w-[64%] rounded-full bg-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-7xl divide-y divide-border px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8">
          {[
            ["Self-paced", "Learn in a rhythm that works for your life."],
            ["Practical", "Turn every lesson into an intentional next step."],
            ["Purpose-led", "Grow with clarity, wisdom, and shared direction."],
          ].map(([title, description]) => (
            <div key={title} className="px-4 py-8 text-center">
              <p className="font-semibold">{title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-background py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold-strong">
                Learning for real life
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
                Start where your relationship needs you most.
              </h2>
            </div>
            <Button asChild variant="outline" className="w-fit bg-card">
              <Link href="/courses">
                Explore learning paths
                <ArrowRight />
              </Link>
            </Button>
          </div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2">
            {learningPaths.map(({ icon: Icon, title, description, tone }) => (
              <article
                key={title}
                className="rounded-2xl border border-border bg-card p-7 sm:p-8"
              >
                <span
                  className={`grid size-12 place-items-center rounded-xl ${tone}`}
                >
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-7 text-xl font-semibold tracking-[-0.02em]">
                  {title}
                </h3>
                <p className="mt-3 max-w-lg leading-7 text-muted-foreground">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="why-wdma" className="bg-card py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold-strong">
              A better way to learn
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
              Everything you need to keep growing.
            </h2>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              A calm, focused learning space built around progress—not
              pressure.
            </p>
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {benefits.map(({ icon: Icon, title, description }, index) => (
              <article
                key={title}
                className="rounded-2xl border border-border bg-card p-7"
              >
                <div className="flex items-start justify-between">
                  <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-8 text-xl font-semibold tracking-[-0.02em]">
                  {title}
                </h3>
                <p className="mt-3 leading-7 text-muted-foreground">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-panel py-24 text-panel-foreground">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">
              Simple by design
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
              A clear path from insight to action.
            </h2>
          </div>
          <ol className="mt-14 grid gap-10 md:grid-cols-3">
            {[
              [
                "01",
                "Choose your focus",
                "Find the learning path that matches your current season and goals.",
              ],
              [
                "02",
                "Learn at your pace",
                "Work through focused lessons when you have the time and space.",
              ],
              [
                "03",
                "Put wisdom to work",
                "Use practical reflections and tools in your everyday relationship.",
              ],
            ].map(([number, title, description]) => (
              <li key={number}>
                <span className="font-mono text-sm text-panel-muted">
                  {number}
                </span>
                <h3 className="mt-5 text-xl font-semibold">{title}</h3>
                <p className="mt-3 leading-7 text-panel-muted">{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-card py-24">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold-strong">
              Questions, answered
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
              Know what to expect.
            </h2>
            <p className="mt-5 max-w-md leading-7 text-muted-foreground">
              Everything you need to feel confident before you begin.
            </p>
            <Link
              href="/faq"
              className="mt-7 inline-flex items-center gap-2 font-semibold text-secondary-foreground hover:text-primary"
            >
              View all questions
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="divide-y divide-border border-y border-border">
            {faqItems.slice(0, 4).map((item) => (
              <details key={item.question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-semibold [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-secondary text-lg text-secondary-foreground transition-transform duration-150 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="max-w-2xl pr-10 pt-3 leading-7 text-muted-foreground">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <SignupCta />
      <SiteFooter />
    </main>
  );
}
