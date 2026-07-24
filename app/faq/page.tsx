import {
  faqItems,
  PageIntro,
  SiteFooter,
  SiteHeader,
} from "@/components/public-site";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers about WDMA courses, accounts, payments, access, and support.",
};

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-card text-foreground">
      <SiteHeader />
      <PageIntro
        eyebrow="Frequently asked questions"
        title="A clear answer goes a long way."
        description="Find quick answers about learning, payments, accounts, and getting support."
      />

      <section className="px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.65fr_1.35fr]">
          <aside>
            <div className="sticky top-28 rounded-2xl bg-panel p-7 text-panel-foreground">
              <p className="text-sm font-medium text-panel-muted">
                Still have a question?
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
                We are happy to help.
              </h2>
              <p className="mt-3 text-sm leading-6 text-panel-muted">
                Send the team a message and include any details that will help
                us understand what you need.
              </p>
              <Button
                asChild
                className="mt-6 bg-brand-gold text-brand-gold-foreground hover:bg-brand-gold-strong"
              >
                <Link href="/contact">
                  Contact WDMA
                  <ArrowRight />
                </Link>
              </Button>
            </div>
          </aside>

          <div className="divide-y divide-border border-y border-border">
            {faqItems.map((item) => (
              <details key={item.question} className="group py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-semibold [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-secondary text-xl font-normal text-secondary-foreground transition-transform duration-150 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="max-w-2xl pr-12 pt-4 leading-7 text-muted-foreground">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
