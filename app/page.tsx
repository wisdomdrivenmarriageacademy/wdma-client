"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/auth-context";

export default function Home() {
  const router = useRouter();
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    if (!authCtx) {
      router.replace("/auth");
      return;
    }
    if (authCtx.auth.authenticate) {
      router.replace("/student/home");
    } else {
      router.replace("/auth");
    }
  }, [authCtx, router]);

  return null;
}
