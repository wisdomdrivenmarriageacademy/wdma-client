"use client";

import { Button } from "@/components/ui/button";
import AccountSettings from "@/components/account-settings";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AuthContext } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  BookOpen,
  ChevronsUpDown,
  LayoutDashboard,
  LogOut,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";

const dashboardByRole: Record<string, string> = {
  user: "/student/home",
  instructor: "/instructor",
  admin: "/admin",
};

function initials(name = "") {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "WD"
  );
}

function Avatar({
  image,
  name,
  className,
}: {
  image?: string;
  name?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center overflow-hidden rounded-full bg-primary/10 text-xs font-semibold text-primary",
        className
      )}
      aria-hidden="true"
    >
      {image ? (
        <img src={image} alt="" className="h-full w-full object-cover" />
      ) : (
        initials(name)
      )}
    </span>
  );
}

export function AccountMenu({
  variant = "default",
  side = "bottom",
  align = "end",
  logoutRedirect = "/",
}: {
  variant?: "default" | "compact" | "sidebar" | "mobile";
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  logoutRedirect?: string;
}) {
  const authContext = useContext(AuthContext);
  const router = useRouter();
  const user = authContext?.auth.user;
  const [settingsOpen, setSettingsOpen] = useState(false);

  if (!authContext?.auth.authenticate || !user) return null;

  const dashboard = dashboardByRole[user.role] || "/student/home";
  const role = user.role === "user" ? "Student" : user.role;

  function logout() {
    authContext?.resetCredentials();
    sessionStorage.clear();
    router.replace(logoutRedirect);
  }

  return (
    <>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "active:scale-[0.97]",
            variant === "compact" && "size-8 rounded-md p-0",
            variant === "default" &&
              "h-10 gap-2 rounded-md border bg-card shadow-sm hover:bg-muted",
            variant === "mobile" &&
              "h-auto w-full justify-start gap-3 rounded-lg border bg-background py-2.5",
            variant === "sidebar" &&
              "h-auto w-full justify-start px-2 py-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          )}
          aria-label={`Open account menu for ${user.userName}`}
        >
          <Avatar
            image={user.profileImage}
            name={user.userName}
            className={variant === "compact" ? "size-8" : "size-8"}
          />
          {variant !== "compact" ? (
            <>
              <span className="min-w-0 flex-1 text-left">
                <span className="block truncate text-sm font-medium">
                  {user.userName}
                </span>
                {(variant === "sidebar" || variant === "mobile") && (
                  <span className="block truncate text-xs font-normal text-muted-foreground">
                    {user.userEmail}
                  </span>
                )}
              </span>
              <ChevronsUpDown className="size-3.5 text-muted-foreground" />
            </>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side={side} align={align} className="w-fit rounded-lg">
        <DropdownMenuLabel className="flex items-center gap-3 font-normal">
          <Avatar
            image={user.profileImage}
            name={user.userName}
            className="size-10"
          />
          <span className="min-w-0">
            <span className="block truncate font-medium">{user.userName}</span>
            <span className="block truncate text-xs text-muted-foreground">
              {user.userEmail}
            </span>
            <span className="mt-1 block text-[10px] font-medium uppercase tracking-[0.12em] text-primary">
              {role}
            </span>
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={dashboard}>
            <LayoutDashboard />
            Open dashboard
          </Link>
        </DropdownMenuItem>
        {user.role === "user" ? (
          <DropdownMenuItem asChild>
            <Link href="/student/student-courses">
              <BookOpen />
              My learning
            </Link>
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => setSettingsOpen(true)}>
          <Settings />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={logout}>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    <AccountSettings open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}

export function PublicAuthActions({ mobile = false }: { mobile?: boolean }) {
  const authContext = useContext(AuthContext);

  if (authContext?.auth.authenticate) {
    return <AccountMenu variant={mobile ? "mobile" : "default"} />;
  }

  return (
    <div className={cn("flex gap-2", mobile && "grid grid-cols-2")}>
      <Button asChild variant={mobile ? "outline" : "ghost"}>
        <Link href="/auth/signin">Sign in</Link>
      </Button>
      <Button
        asChild
        className="shadow-sm"
      >
        <Link href="/auth/signup">
          {mobile ? "Join" : "Get started"}
          {!mobile ? <ArrowRight /> : null}
        </Link>
      </Button>
    </div>
  );
}

export function PublicPrimaryCta({
  signedOutLabel = "Get started",
  signedOutHref = "/auth/signup",
  signedInLabel = "Open dashboard",
  className,
}: {
  signedOutLabel?: string;
  signedOutHref?: string;
  signedInLabel?: string;
  className?: string;
}) {
  const authContext = useContext(AuthContext);
  const user = authContext?.auth.user;
  const href = authContext?.auth.authenticate
    ? dashboardByRole[user?.role || "user"] || "/student/home"
    : signedOutHref;

  return (
    <Button asChild size="lg" className={className}>
      <Link href={href}>
        {authContext?.auth.authenticate ? signedInLabel : signedOutLabel}
        <ArrowRight />
      </Link>
    </Button>
  );
}

export function HomeHeroActions() {
  const authContext = useContext(AuthContext);
  const user = authContext?.auth.user;

  if (authContext?.auth.authenticate) {
    const dashboard =
      dashboardByRole[user?.role || "user"] || "/student/home";
    return (
      <div className="mt-9 flex flex-col gap-3 sm:flex-row">
        <Button
          asChild
          size="lg"
          className="h-12 px-6 text-base shadow-sm active:scale-[0.97]"
        >
          <Link href={dashboard}>
            Continue learning
            <ArrowRight />
          </Link>
        </Button>
        {user?.role === "user" ? (
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 border-border bg-card px-6 text-base active:scale-[0.97]"
          >
            <Link href="/student/courses">Browse courses</Link>
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="mt-9 flex flex-col gap-3 sm:flex-row">
      <Button
        asChild
        size="lg"
        className="h-12 px-6 text-base shadow-sm active:scale-[0.97]"
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
        className="h-12 border-border bg-card px-6 text-base active:scale-[0.97]"
      >
        <Link href="/auth/signin">I already have an account</Link>
      </Button>
    </div>
  );
}
