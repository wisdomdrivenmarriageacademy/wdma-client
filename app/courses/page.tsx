import {
  PageIntro,
  SignupCta,
  SiteFooter,
  SiteHeader,
} from "@/components/public-site";
import { PublicPrimaryCta } from "@/components/account-menu";
import {
  Brain,
  Compass,
  HeartHandshake,
  MessageCircleHeart,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learning",
  description:
    "Explore wisdom-led learning paths for preparation, communication, conflict repair, intimacy, and personal growth.",
};

const paths = [
  {
    icon: Compass,
    title: "Preparing for marriage",
    description:
      "Clarify expectations, values, purpose, and the kind of partnership you want to build.",
    topics: ["Self-awareness", "Shared expectations", "Purpose and values"],
  },
  {
    icon: MessageCircleHeart,
    title: "Healthy communication",
    description:
      "Build the habits that make honest conversations safer, clearer, and more productive.",
    topics: ["Active listening", "Emotional honesty", "Difficult conversations"],
  },
  {
    icon: ShieldCheck,
    title: "Conflict and repair",
    description:
      "Understand conflict patterns and learn how to repair trust after disconnection.",
    topics: ["Conflict patterns", "Taking responsibility", "Rebuilding trust"],
  },
  {
    icon: HeartHandshake,
    title: "Connection and intimacy",
    description:
      "Create a relationship where affection, friendship, and emotional closeness can deepen.",
    topics: ["Emotional safety", "Friendship", "Intentional connection"],
  },
  {
    icon: Brain,
    title: "Personal growth",
    description:
      "Recognize the experiences and habits that shape how you show up in relationships.",
    topics: ["Emotional patterns", "Boundaries", "Personal responsibility"],
  },
  {
    icon: UsersRound,
    title: "Growing together",
    description:
      "Keep your partnership aligned as responsibilities, seasons, and goals change.",
    topics: ["Shared rhythms", "Decision-making", "Long-term growth"],
  },
];

export default function CoursesPage() {
  return (
    <main className="min-h-screen bg-card text-foreground">
      <SiteHeader />
      <PageIntro
        eyebrow="Learning at WDMA"
        title="Practical wisdom for every relationship season."
        description="Explore focused learning paths designed to help you understand what matters and put it into practice."
      />

      <section className="px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {paths.map(({ icon: Icon, title, description, topics }) => (
              <article
                key={title}
                className="flex flex-col rounded-2xl border border-border bg-card p-7"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <h2 className="mt-7 text-xl font-semibold">{title}</h2>
                <p className="mt-3 leading-7 text-muted-foreground">{description}</p>
                <ul className="mt-6 grid gap-2 border-t border-border pt-5 text-sm text-muted-foreground">
                  {topics.map((topic) => (
                    <li key={topic} className="flex items-center gap-2">
                      <span className="size-1.5 rounded-full bg-brand-gold" />
                      {topic}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-start justify-between gap-6 rounded-2xl border border-border bg-card p-7 sm:flex-row sm:items-center sm:p-9">
            <div>
              <h2 className="text-2xl font-semibold tracking-[-0.03em]">
                Ready to see available courses?
              </h2>
              <p className="mt-2 text-muted-foreground">
                Browse the current course catalog and continue learning at your
                own pace.
              </p>
            </div>
            <PublicPrimaryCta
              signedOutHref="/auth/signin"
              signedOutLabel="Open course catalog"
              signedInLabel="Open course catalog"
              className="shadow-sm"
            />
          </div>
        </div>
      </section>

      <SignupCta />
      <SiteFooter />
    </main>
  );
}
