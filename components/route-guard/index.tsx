"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

function RouteGuard({
  authenticated,
  user,
  element,
}: {
  authenticated: boolean;
  user: any;
  element: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!authenticated && !pathname.includes("/auth")) {
      router.replace("/auth");
      return;
    }

    if (
      authenticated &&
      user?.role !== "instructor" &&
      (pathname.includes("instructor") || pathname.includes("/auth"))
    ) {
      router.replace("/home");
      return;
    }

    if (
      authenticated &&
      user?.role === "instructor" &&
      !pathname.includes("instructor")
    ) {
      router.replace("/instructor");
    }
  }, [authenticated, user, pathname, router]);

  return <>{element}</>;
}

export default RouteGuard;
