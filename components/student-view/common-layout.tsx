"use client";

import { AuthContext } from "@/context/auth-context";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useContext, useEffect } from "react";
import StudentViewCommonHeader from "./header";

export default function StudentViewCommonLayout({
  children,
}: {
  children: ReactNode;
}) {
  const authContext = useContext(AuthContext);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!authContext?.auth.authenticate) {
      router.replace("/auth/signin");
    }
  }, [authContext?.auth.authenticate, router]);

  if (!authContext?.auth.authenticate) return null;

  return (
    <div>
      {!pathname.includes("course-progress") ? (
        <StudentViewCommonHeader />
      ) : null}
      {children}
    </div>
  );
}
