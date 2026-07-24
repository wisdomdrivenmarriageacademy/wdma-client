"use client";

import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/theme-toggle";
import { AccountMenu } from "@/components/account-menu";
import { AuthContext } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  CircleHelp,
  GraduationCap,
  LayoutDashboard,
  Library,
  Menu,
  PlusCircle,
  Presentation,
  ReceiptText,
  UserCog,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useContext, useEffect, useState } from "react";

export type DashboardArea = "student" | "instructor" | "admin";

type NavigationItem = {
  title: string;
  url: string;
  icon: LucideIcon;
};

const navigation: Record<DashboardArea, NavigationItem[]> = {
  student: [
    { title: "Overview", url: "/student/home", icon: LayoutDashboard },
    {
      title: "My learning",
      url: "/student/student-courses",
      icon: BookOpen,
    },
    { title: "Discover courses", url: "/student/courses", icon: Library },
  ],
  instructor: [
    { title: "Overview", url: "/instructor", icon: LayoutDashboard },
    { title: "My courses", url: "/instructor/courses", icon: Presentation },
    { title: "My students", url: "/instructor/students", icon: Users },
    {
      title: "Create course",
      url: "/instructor/courses/new",
      icon: PlusCircle,
    },
  ],
  admin: [
    { title: "Overview", url: "/admin", icon: LayoutDashboard },
    { title: "All courses", url: "/admin/courses", icon: BookOpen },
    { title: "Transactions", url: "/admin/orders", icon: ReceiptText },
    { title: "Students", url: "/admin/students", icon: Users },
    { title: "Instructors", url: "/admin/instructors", icon: UserCog },
    { title: "Create course", url: "/admin/courses/new", icon: PlusCircle },
  ],
};

const areaLabels: Record<DashboardArea, string> = {
  student: "Learning",
  instructor: "Instructor studio",
  admin: "Academy administration",
};

const roleHome: Record<string, string> = {
  user: "/student/home",
  instructor: "/instructor",
  admin: "/admin",
};

export default function DashboardShell({
  area,
  children,
  contentOnly = false,
}: {
  area: DashboardArea;
  children: ReactNode;
  contentOnly?: boolean;
}) {
  const authContext = useContext(AuthContext);
  const pathname = usePathname();
  const router = useRouter();
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = authContext?.auth.user;
  const expectedRole = area === "student" ? "user" : area;
  const hasAccess = user?.role === expectedRole;
  const items = navigation[area];
  const activeItem =
    [...items]
      .sort((a, b) => b.url.length - a.url.length)
      .find(
        (item) =>
          pathname === item.url ||
          (!["/admin", "/instructor"].includes(item.url) &&
            pathname.startsWith(`${item.url}/`))
      ) ?? items[0];

  useEffect(() => {
    if (!authContext?.auth.authenticate) {
      router.replace("/auth/signin");
    } else if (!hasAccess) {
      router.replace(roleHome[user?.role || "user"] || "/student/home");
    }
  }, [authContext?.auth.authenticate, hasAccess, router, user?.role]);

  useEffect(() => setMobileOpen(false), [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  if (!authContext?.auth.authenticate || !hasAccess) return null;
  if (contentOnly) return <>{children}</>;

  const home = roleHome[user?.role || "user"] || "/student/home";

  const sidebar = (
    <div className="flex h-full min-h-0 w-72 max-w-full flex-col">
      <div className="flex h-14 shrink-0 items-center px-4">
        <Link href={home} className="flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <GraduationCap className="size-4" />
          </span>
          <span className="text-sm font-semibold">Wisdom Driven Academy</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-2">
        <p className="px-2 pb-2 text-xs font-medium text-sidebar-foreground/55">
          {areaLabels[area]}
        </p>
        <nav className="space-y-1" aria-label={`${area} navigation`}>
          {items.map((item) => {
            const active =
              pathname === item.url ||
              (!["/admin", "/instructor"].includes(item.url) &&
                pathname.startsWith(`${item.url}/`));
            return (
              <Link
                key={item.url}
                href={item.url}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-8 items-center gap-2 rounded-md px-2 text-sm font-medium transition-colors active:scale-[0.98]",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon
                  className={cn("size-4", active && "text-sidebar-primary")}
                />
                {item.title}
              </Link>
            );
          })}
        </nav>

        <div className="mt-6">
          <p className="px-2 pb-2 text-xs font-medium text-sidebar-foreground/55">
            Support
          </p>
          <Link
            href="/faq"
            className="flex h-8 items-center gap-2 rounded-md px-2 text-sm text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <CircleHelp className="size-4" />
            Help Center
          </Link>
        </div>
      </div>

      <div className="p-2">
        <AccountMenu
          variant="sidebar"
          side="top"
          align="start"
          logoutRedirect="/auth/signin"
        />
      </div>
    </div>
  );

  return (
    <div
      className={cn(
        "grid min-h-svh min-w-0 grid-cols-1 bg-white dark:bg-black md:h-svh md:overflow-hidden md:p-2",
        desktopOpen
          ? "md:grid-cols-[18rem_minmax(0,1fr)]"
          : "md:grid-cols-[0_minmax(0,1fr)]"
      )}
    >
      <aside className="hidden min-h-0 overflow-hidden text-sidebar-foreground md:block">
        {sidebar}
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-[70] md:hidden">
          <button
            className="absolute inset-0 bg-foreground/35"
            aria-label="Close sidebar"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative h-full w-[min(18rem,88vw)] bg-sidebar text-sidebar-foreground shadow-xl">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 z-10"
              aria-label="Close sidebar"
              onClick={() => setMobileOpen(false)}
            >
              <X />
            </Button>
            {sidebar}
          </aside>
        </div>
      ) : null}

      <section className="flex min-h-svh min-w-0 flex-col bg-background md:min-h-0 md:overflow-hidden md:rounded-xl md:border md:shadow-sm">
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="-ml-2 size-8"
            aria-label="Toggle sidebar"
            onClick={() =>
              window.matchMedia("(min-width: 768px)").matches
                ? setDesktopOpen((open) => !open)
                : setMobileOpen(true)
            }
          >
            <Menu />
          </Button>
          <span className="h-4 w-px bg-border" />
          <h1 className="text-sm font-medium">{activeItem.title}</h1>
          <span className="ml-auto hidden text-xs capitalize text-muted-foreground sm:inline">
            {areaLabels[area]}
          </span>
          <ThemeToggle />
          <AccountMenu
            variant="compact"
            logoutRedirect="/auth/signin"
          />
        </header>
        <main className="@container/main min-h-0 min-w-0 flex-1 overflow-x-hidden py-4 md:overflow-y-auto md:overscroll-contain md:py-6">
          <div className="flex min-w-0 flex-col gap-4 md:gap-6">
          {children}
          </div>
        </main>
      </section>
    </div>
  );
}
