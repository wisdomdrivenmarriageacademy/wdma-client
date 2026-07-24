"use client";

import { Moon, Sun } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/auth-context";
import { updateAccountSettingsService } from "@/services";

export default function ThemeToggle() {
  const authContext = useContext(AuthContext);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggleTheme() {
    const nextIsDark = !document.documentElement.classList.contains("dark");
    const theme = nextIsDark ? "dark" : "light";
    document.documentElement.classList.toggle("dark", nextIsDark);
    localStorage.setItem("wdma-theme", theme);
    setIsDark(nextIsDark);
    if (authContext?.auth.authenticate) {
      updateAccountSettingsService({ theme })
        .then(({ data }) =>
          authContext.setAuth((auth) => ({ ...auth, user: data.user }))
        )
        .catch(() => {});
    }
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      title={`Switch to ${isDark ? "light" : "dark"} theme`}
      className="grid size-8 shrink-0 place-items-center rounded-md border border-border bg-background text-foreground transition-[background-color,transform] hover:bg-accent active:scale-[0.96]"
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
