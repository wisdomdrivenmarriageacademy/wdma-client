import { Button } from "@/components/ui/button";
import { ArrowRight, GraduationCap, Menu } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/courses", label: "Learning" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export const faqItems = [
  {
    question: "Who is Wisdom Driven Marriage Academy for?",
    answer:
      "WDMA is for singles, engaged couples, and married couples who want practical, wisdom-led guidance for building healthier relationships.",
  },
  {
    question: "Do I need to be married to join?",
    answer:
      "No. Several learning paths are designed to help singles and engaged couples prepare intentionally before marriage.",
  },
  {
    question: "Can I learn at my own pace?",
    answer:
      "Yes. Courses are self-paced, so you can pause, revisit lessons, and continue whenever it works for you.",
  },
  {
    question: "How do I access a course after enrolling?",
    answer:
      "Sign in to your student account and open My Learning. Your enrolled courses and progress are available there.",
  },
  {
    question: "How are payments processed?",
    answer:
      "Payments are processed securely through Paystack. WDMA does not store your card details.",
  },
  {
    question: "What if I forget my password?",
    answer:
      "Use the Forgot password link on the sign-in page. We will send a one-time code so you can securely choose a new password.",
  },
  {
    question: "Can I use WDMA on my phone?",
    answer:
      "Yes. The learning experience works across phones, tablets, and computers with an internet connection.",
  },
  {
    question: "How can I get more help?",
    answer:
      "Visit the Contact page and email the WDMA team. Include the email address connected to your account if your question is account-related.",
  },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#e4e2d9]/80 bg-[#f7f6f1]/90 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="WDMA home">
          <span className="grid size-10 place-items-center rounded-xl bg-[#173f2b] text-white shadow-sm">
            <GraduationCap className="size-5" />
          </span>
          <span className="font-semibold tracking-[-0.02em]">
            Wisdom Driven
            <span className="hidden text-[#6b766f] lg:inline">
              {" "}
              Marriage Academy
            </span>
          </span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-1 lg:flex"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-[#536159] transition-colors hover:bg-white hover:text-[#17251d]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 sm:flex">
          <Button asChild variant="ghost" className="active:scale-[0.97]">
            <Link href="/auth/signin">Sign in</Link>
          </Button>
          <Button
            asChild
            className="bg-[#173f2b] text-white shadow-sm hover:bg-[#20533a] active:scale-[0.97]"
          >
            <Link href="/auth/signup">
              Get started
              <ArrowRight />
            </Link>
          </Button>
        </div>

        <details className="group relative lg:hidden">
          <summary className="grid size-10 cursor-pointer list-none place-items-center rounded-lg border border-[#d9d9cd] bg-white text-[#173f2b] transition-transform active:scale-[0.97] [&::-webkit-details-marker]:hidden">
            <Menu className="size-5" />
            <span className="sr-only">Open navigation</span>
          </summary>
          <div className="absolute right-0 top-12 w-64 origin-top-right rounded-2xl border border-[#dfded5] bg-white p-3 shadow-xl">
            <nav aria-label="Mobile navigation" className="grid">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-[#536159] hover:bg-[#f7f6f1] hover:text-[#17251d]"
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-2 grid grid-cols-2 gap-2 border-t border-[#eceae2] pt-3">
                <Button asChild variant="outline">
                  <Link href="/auth/signin">Sign in</Link>
                </Button>
                <Button
                  asChild
                  className="bg-[#173f2b] text-white hover:bg-[#20533a]"
                >
                  <Link href="/auth/signup">Join</Link>
                </Button>
              </div>
            </nav>
          </div>
        </details>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-[#deddd4] bg-[#f7f6f1] px-5 py-12 text-sm text-[#6b766f] sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-3 text-[#17251d]">
            <span className="grid size-9 place-items-center rounded-xl bg-[#173f2b] text-white">
              <GraduationCap className="size-4.5" />
            </span>
            <span className="font-semibold">Wisdom Driven Marriage Academy</span>
          </Link>
          <p className="mt-4 max-w-sm leading-6">
            Practical, wisdom-led learning for healthier relationships and
            stronger marriages.
          </p>
        </div>
        <div>
          <p className="font-semibold text-[#17251d]">Explore</p>
          <div className="mt-4 grid gap-3">
            {navigation.slice(1).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="w-fit hover:text-[#173f2b]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="font-semibold text-[#17251d]">Your account</p>
          <div className="mt-4 grid gap-3">
            <Link href="/auth/signin" className="w-fit hover:text-[#173f2b]">
              Sign in
            </Link>
            <Link href="/auth/signup" className="w-fit hover:text-[#173f2b]">
              Create account
            </Link>
            <Link href="/auth/recovery" className="w-fit hover:text-[#173f2b]">
              Recover password
            </Link>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-7xl border-t border-[#deddd4] pt-6">
        © {new Date().getFullYear()} Wisdom Driven Marriage Academy. All rights
        reserved.
      </div>
    </footer>
  );
}

export function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="border-b border-[#e3e1d8] bg-[#f7f6f1] px-5 py-20 text-center sm:px-8 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#a66f20]">
          {eyebrow}
        </p>
        <h1 className="mt-5 text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">
          {title}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#657169] sm:text-xl">
          {description}
        </p>
      </div>
    </section>
  );
}

export function SignupCta({
  title = "Build your relationship with intention.",
  description = "Create your account and begin learning at your own pace.",
  children,
}: {
  title?: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <section className="bg-[#f7f6f1] px-5 py-20 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 rounded-[2rem] bg-[#173f2b] px-7 py-12 text-white sm:px-12 lg:flex-row lg:items-center">
        <div>
          <p className="text-sm font-medium text-[#b6cfbd]">{description}</p>
          <h2 className="mt-2 max-w-2xl text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
            {title}
          </h2>
          {children}
        </div>
        <Button
          asChild
          size="lg"
          className="h-12 shrink-0 bg-[#e7b558] px-6 text-[#2c2416] hover:bg-[#f0c36d] active:scale-[0.97]"
        >
          <Link href="/auth/signup">
            Get started
            <ArrowRight />
          </Link>
        </Button>
      </div>
    </section>
  );
}
