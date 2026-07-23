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
  HeartHandshake,
  MessageCircleHeart,
  Play,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";

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
    tone: "bg-[#e8efe4] text-[#2f6345]",
  },
  {
    icon: MessageCircleHeart,
    title: "Communication",
    description:
      "Learn to listen well, speak honestly, and handle difficult conversations with care.",
    tone: "bg-[#f5e8cf] text-[#8a5c1b]",
  },
  {
    icon: ShieldCheck,
    title: "Conflict and repair",
    description:
      "Replace destructive patterns with practical tools for repair, trust, and reconnection.",
    tone: "bg-[#e5ecec] text-[#315e60]",
  },
  {
    icon: Brain,
    title: "Personal growth",
    description:
      "Understand the beliefs, habits, and emotional patterns you bring into your relationship.",
    tone: "bg-[#ede8f2] text-[#65527a]",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f6f1] text-[#17251d]">
      <SiteHeader />

      <section className="relative mx-auto grid max-w-7xl gap-14 px-5 pb-24 pt-14 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:pb-32 lg:pt-24">
        <div className="relative z-10 max-w-2xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#d9d9cd] bg-white/80 px-3 py-1.5 text-xs font-semibold text-[#345a45] shadow-sm">
            <Sparkles className="size-3.5 text-[#d19a42]" />
            Learn with clarity. Grow with purpose.
          </div>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.03] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
            Learning that moves your life{" "}
            <span className="text-[#ca8d31]">forward.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-[#5d6a62] sm:text-xl">
            Practical, wisdom-led courses for singles and couples who want to
            build healthier relationships and stronger marriages.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-12 bg-[#173f2b] px-6 text-base text-white shadow-md shadow-[#173f2b]/15 hover:bg-[#20533a] active:scale-[0.97]"
            >
              <Link href="/auth/signup">
                Start learning
                <ArrowRight />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 border-[#d9d9cd] bg-white px-6 text-base active:scale-[0.97]"
            >
              <Link href="/auth/signin">I already have an account</Link>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#607067]">
            {["Learn anywhere", "Practical guidance", "Grow together"].map(
              (item) => (
                <span key={item} className="flex items-center gap-2">
                  <span className="grid size-5 place-items-center rounded-full bg-[#dfeadd] text-[#24513a]">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  {item}
                </span>
              )
            )}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:mx-0">
          <div className="absolute -left-16 -top-16 size-52 rounded-full bg-[#e4b75f]/25 blur-3xl" />
          <div className="absolute -bottom-14 -right-16 size-60 rounded-full bg-[#7caf8d]/20 blur-3xl" />
          <div className="relative rotate-[1.5deg] rounded-[2rem] border border-white/80 bg-[#173f2b] p-3 shadow-2xl shadow-[#173f2b]/20">
            <div className="overflow-hidden rounded-[1.4rem] bg-[#fbfaf6]">
              <div className="flex items-center justify-between border-b border-[#e8e6dc] px-5 py-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#849087]">
                    Continue learning
                  </p>
                  <p className="mt-1 font-semibold">Foundations for growth</p>
                </div>
                <span className="rounded-full bg-[#e7efe4] px-3 py-1 text-xs font-semibold text-[#315943]">
                  64% complete
                </span>
              </div>
              <div className="p-5 sm:p-7">
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-[#d8a84f] p-6 text-white">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(255,255,255,.28),transparent_35%)]" />
                  <div className="relative flex h-full flex-col justify-between">
                    <span className="w-fit rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                      Lesson 04
                    </span>
                    <div>
                      <p className="max-w-xs text-2xl font-semibold leading-tight tracking-[-0.03em] sm:text-3xl">
                        Strong relationships are built on intentional choices.
                      </p>
                      <button
                        type="button"
                        aria-label="Play lesson preview"
                        className="mt-5 grid size-11 place-items-center rounded-full bg-white text-[#875d20] shadow-lg transition-transform duration-150 active:scale-[0.95]"
                      >
                        <Play className="ml-0.5 size-4 fill-current" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <div className="mb-2 flex justify-between text-xs font-medium text-[#6b766f]">
                    <span>Your progress</span>
                    <span>8 of 12 lessons</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#e8e9e1]">
                    <div className="h-full w-[64%] rounded-full bg-[#2f6b49]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#e0ded5] bg-white">
        <div className="mx-auto grid max-w-7xl divide-y divide-[#e8e6de] px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8">
          {[
            ["Self-paced", "Learn in a rhythm that works for your life."],
            ["Practical", "Turn every lesson into an intentional next step."],
            ["Purpose-led", "Grow with clarity, wisdom, and shared direction."],
          ].map(([title, description]) => (
            <div key={title} className="px-4 py-8 text-center">
              <p className="font-semibold">{title}</p>
              <p className="mt-1 text-sm text-[#6b766f]">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#f7f6f1] py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#a66f20]">
                Learning for real life
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
                Start where your relationship needs you most.
              </h2>
            </div>
            <Button asChild variant="outline" className="w-fit bg-white">
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
                className="rounded-2xl border border-[#e2e0d7] bg-white p-7 sm:p-8"
              >
                <span
                  className={`grid size-12 place-items-center rounded-xl ${tone}`}
                >
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-7 text-xl font-semibold tracking-[-0.02em]">
                  {title}
                </h3>
                <p className="mt-3 max-w-lg leading-7 text-[#68746c]">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="why-wdma" className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#a66f20]">
              A better way to learn
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
              Everything you need to keep growing.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#657169]">
              A calm, focused learning space built around progress—not
              pressure.
            </p>
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {benefits.map(({ icon: Icon, title, description }, index) => (
              <article
                key={title}
                className="rounded-2xl border border-[#e7e6de] bg-[#fbfaf6] p-7"
              >
                <div className="flex items-start justify-between">
                  <span className="grid size-11 place-items-center rounded-xl bg-[#e7efe4] text-[#2c6042]">
                    <Icon className="size-5" />
                  </span>
                  <span className="font-mono text-xs text-[#a2aaa4]">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-8 text-xl font-semibold tracking-[-0.02em]">
                  {title}
                </h3>
                <p className="mt-3 leading-7 text-[#68746c]">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#173f2b] py-24 text-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#e7b558]">
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
                <span className="font-mono text-sm text-[#91ad99]">
                  {number}
                </span>
                <h3 className="mt-5 text-xl font-semibold">{title}</h3>
                <p className="mt-3 leading-7 text-[#b6cbbd]">{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#a66f20]">
              Questions, answered
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
              Know what to expect.
            </h2>
            <p className="mt-5 max-w-md leading-7 text-[#68746c]">
              Everything you need to feel confident before you begin.
            </p>
            <Link
              href="/faq"
              className="mt-7 inline-flex items-center gap-2 font-semibold text-[#285a40] hover:text-[#173f2b]"
            >
              View all questions
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="divide-y divide-[#e2e0d8] border-y border-[#e2e0d8]">
            {faqItems.slice(0, 4).map((item) => (
              <details key={item.question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-semibold [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#edf1e9] text-lg text-[#315943] transition-transform duration-150 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="max-w-2xl pr-10 pt-3 leading-7 text-[#68746c]">
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
