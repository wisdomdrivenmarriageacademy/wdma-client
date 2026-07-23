import {
  PageIntro,
  SiteFooter,
  SiteHeader,
} from "@/components/public-site";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CircleHelp,
  KeyRound,
  Mail,
  UserRound,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Wisdom Driven Marriage Academy for learning, account, or enrollment support.",
};

const supportOptions = [
  {
    icon: UserRound,
    title: "Enrollment questions",
    description:
      "Not sure where to begin or which learning path is right for you?",
    action: "Email the team",
    href: "mailto:thewisdomdrivenmarriageacademy@gmail.com?subject=Enrollment%20question",
  },
  {
    icon: KeyRound,
    title: "Account access",
    description:
      "Forgotten passwords can be reset securely with a one-time code.",
    action: "Recover your account",
    href: "/auth/recovery",
  },
  {
    icon: CircleHelp,
    title: "Quick answers",
    description:
      "Read about course access, payments, devices, and other common topics.",
    action: "Browse the FAQ",
    href: "/faq",
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white text-[#17251d]">
      <SiteHeader />
      <PageIntro
        eyebrow="Contact WDMA"
        title="Tell us how we can help."
        description="Choose the support path that fits your question. We will help you find a clear next step."
      />

      <section className="px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          {supportOptions.map(
            ({ icon: Icon, title, description, action, href }) => (
              <article
                key={title}
                className="flex flex-col rounded-2xl border border-[#e2e0d7] bg-[#fbfaf6] p-7"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-[#e7efe4] text-[#2c6042]">
                  <Icon className="size-5" />
                </span>
                <h2 className="mt-7 text-xl font-semibold">{title}</h2>
                <p className="mt-3 flex-1 leading-7 text-[#68746c]">
                  {description}
                </p>
                <Link
                  href={href}
                  className="mt-7 inline-flex items-center gap-2 font-semibold text-[#285a40] hover:text-[#173f2b]"
                >
                  {action}
                  <ArrowRight className="size-4" />
                </Link>
              </article>
            )
          )}
        </div>
      </section>

      <section className="bg-[#f7f6f1] px-5 py-20 sm:px-8">
        <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[2rem] border border-[#dfddd3] bg-white lg:grid-cols-[.9fr_1.1fr]">
          <div className="bg-[#173f2b] p-8 text-white sm:p-12">
            <span className="grid size-12 place-items-center rounded-xl bg-white/10 text-[#e7b558]">
              <Mail className="size-5" />
            </span>
            <h2 className="mt-8 text-3xl font-semibold tracking-[-0.04em]">
              Send us an email
            </h2>
            <p className="mt-4 leading-7 text-[#b9cdbf]">
              For the best support, write from the email address connected to
              your WDMA account.
            </p>
          </div>
          <div className="flex flex-col justify-center p-8 sm:p-12">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#8a6a36]">
              Email address
            </p>
            <a
              href="mailto:thewisdomdrivenmarriageacademy@gmail.com"
              className="mt-3 break-words text-xl font-semibold text-[#173f2b] hover:underline sm:text-2xl"
            >
              thewisdomdrivenmarriageacademy@gmail.com
            </a>
            <p className="mt-4 leading-7 text-[#68746c]">
              Include a short subject and any relevant course or payment
              details. Never send your password or full card information.
            </p>
            <Button
              asChild
              size="lg"
              className="mt-7 w-fit bg-[#173f2b] text-white hover:bg-[#20533a]"
            >
              <a href="mailto:thewisdomdrivenmarriageacademy@gmail.com?subject=WDMA%20support%20request">
                Write an email
                <ArrowRight />
              </a>
            </Button>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
