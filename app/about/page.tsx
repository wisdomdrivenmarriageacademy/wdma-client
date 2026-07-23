import {
  PageIntro,
  SignupCta,
  SiteFooter,
  SiteHeader,
} from "@/components/public-site";
import {
  BookOpenCheck,
  HeartHandshake,
  Lightbulb,
  ShieldCheck,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn why Wisdom Driven Marriage Academy exists and the principles behind every WDMA learning experience.",
};

const values = [
  {
    icon: Lightbulb,
    title: "Wisdom over noise",
    description:
      "We focus on grounded principles and useful insight—not quick fixes or empty inspiration.",
  },
  {
    icon: BookOpenCheck,
    title: "Practice over theory",
    description:
      "Every learning experience is designed to move from understanding to a clear, practical next step.",
  },
  {
    icon: HeartHandshake,
    title: "Growth with grace",
    description:
      "Healthy change requires honesty and compassion. We make room for both.",
  },
  {
    icon: ShieldCheck,
    title: "Trust by design",
    description:
      "Your learning space should feel private, respectful, and safe enough for meaningful reflection.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-[#17251d]">
      <SiteHeader />
      <PageIntro
        eyebrow="About WDMA"
        title="Stronger relationships begin with wiser choices."
        description="Wisdom Driven Marriage Academy exists to help people prepare well, relate better, and build marriages with intention."
      />

      <section className="px-5 py-24 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#a66f20]">
              Our purpose
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
              Make relationship education clear, practical, and accessible.
            </h2>
          </div>
          <div className="space-y-5 text-lg leading-8 text-[#657169]">
            <p>
              Relationships shape nearly every part of life, yet many people
              enter them without the tools to communicate, repair, or grow
              together.
            </p>
            <p>
              WDMA turns meaningful ideas into focused lessons you can
              understand, reflect on, and apply in everyday life—whether you
              are single, engaged, or married.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f6f1] px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#a66f20]">
              What guides us
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
              Principles that shape every lesson.
            </h2>
          </div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2">
            {values.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="rounded-2xl border border-[#e2e0d7] bg-white p-7 sm:p-8"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-[#e7efe4] text-[#2c6042]">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-7 text-xl font-semibold">{title}</h3>
                <p className="mt-3 leading-7 text-[#68746c]">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-24 sm:px-8">
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[2rem] bg-[#173f2b] text-white lg:grid-cols-2">
          <div className="p-8 sm:p-12">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#e7b558]">
              The WDMA approach
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              Learn. Reflect. Practice. Grow.
            </h2>
            <p className="mt-5 leading-7 text-[#b9cdbf]">
              Lasting change rarely comes from one big moment. It comes from
              small insights practiced consistently and conversations handled
              with greater care.
            </p>
          </div>
          <div className="grid gap-px bg-white/10 sm:grid-cols-2">
            {[
              ["Learn", "Understand the idea clearly."],
              ["Reflect", "Notice how it shows up in your life."],
              ["Practice", "Take one intentional next step."],
              ["Grow", "Return, refine, and keep building."],
            ].map(([title, description]) => (
              <div key={title} className="bg-[#1d4933] p-8">
                <p className="text-xl font-semibold">{title}</p>
                <p className="mt-2 text-sm leading-6 text-[#b9cdbf]">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SignupCta
        title="Take the next step with clarity."
        description="A healthier relationship can start with one intentional lesson."
      />
      <SiteFooter />
    </main>
  );
}
