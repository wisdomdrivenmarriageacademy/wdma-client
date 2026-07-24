"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { AuthContext } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import {
  Bell,
  CircleUserRound,
  GraduationCap,
  KeyRound,
  LoaderCircle,
  Palette,
  Save,
  SlidersHorizontal,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import {
  getAccountSettingsService,
  updateAccountSettingsService,
  type AccountPreferences,
  type UserAccount,
} from "@/services";

type Section = "profile" | "notifications" | "appearance" | "workspace" | "security";

const defaultPreferences: AccountPreferences = {
  theme: "system",
  emailNotifications: true,
  announcements: true,
  roleActivity: true,
  secondaryRoleActivity: false,
  profileVisible: true,
};

const roleCopy = {
  user: {
    label: "Student",
    workspace: "Learning",
    title: "Learning preferences",
    description: "Choose how the academy supports your learning routine.",
    primary: ["Course reminders", "Remind me about lessons and unfinished courses."],
    secondary: ["Autoplay next lesson", "Continue automatically when a lesson ends."],
  },
  instructor: {
    label: "Instructor",
    workspace: "Teaching",
    title: "Teaching preferences",
    description: "Control updates that help you manage courses and learners.",
    primary: ["New enrolments", "Tell me when a student joins one of my courses."],
    secondary: ["Course feedback", "Notify me when learners leave course feedback."],
  },
  admin: {
    label: "Administrator",
    workspace: "Administration",
    title: "Administration preferences",
    description: "Choose which academy operations need your attention.",
    primary: ["System alerts", "Notify me about important account and course activity."],
    secondary: ["Weekly report", "Send me a weekly academy activity summary."],
  },
} satisfies Record<
  UserAccount["role"],
  {
    label: string;
    workspace: string;
    title: string;
    description: string;
    primary: [string, string];
    secondary: [string, string];
  }
>;

const sections = [
  { id: "profile", label: "Profile", icon: CircleUserRound },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "workspace", label: "Workspace", icon: SlidersHorizontal },
  { id: "security", label: "Security", icon: KeyRound },
] satisfies { id: Section; label: string; icon: typeof Bell }[];

function initials(name: string) {
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

function applyTheme(theme: AccountPreferences["theme"]) {
  const dark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
  localStorage.setItem("wdma-theme", theme);
}

function SwitchRow({
  label,
  description,
  checked,
  onCheckedChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-6 border-b py-4 last:border-b-0">
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        <p className="mt-1 text-sm leading-5 text-muted-foreground">
          {description}
        </p>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        aria-label={label}
        className="mt-0.5"
      />
    </div>
  );
}

export default function AccountSettings({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const authContext = useContext(AuthContext);
  const currentUser = authContext?.auth.user;
  const role = (currentUser?.role || "user") as UserAccount["role"];
  const copy = roleCopy[role] || roleCopy.user;
  const [section, setSection] = useState<Section>("profile");
  const [form, setForm] = useState({
    userName: currentUser?.userName || "",
    userEmail: currentUser?.userEmail || "",
    profileImage: currentUser?.profileImage || "",
    ...(currentUser?.preferences || defaultPreferences),
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setMessage("");
    setError("");
    setLoading(true);
    getAccountSettingsService()
      .then(({ data }) => {
        const user = data.user;
        setForm({
          userName: user.userName,
          userEmail: user.userEmail,
          profileImage: user.profileImage || "",
          ...defaultPreferences,
          ...user.preferences,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      })
      .catch((reason: Error) =>
        setError(reason.message || "Settings could not be loaded.")
      )
      .finally(() => setLoading(false));
  }, [open]);

  function setPreference<K extends keyof AccountPreferences>(
    key: K,
    value: AccountPreferences[K]
  ) {
    setForm((current) => ({ ...current, [key]: value }));
    if (key === "theme") applyTheme(value as AccountPreferences["theme"]);
  }

  async function save() {
    setMessage("");
    setError("");
    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      setError("The new passwords do not match.");
      setSection("security");
      return;
    }
    setSaving(true);
    try {
      const password =
        form.currentPassword || form.newPassword
          ? {
              currentPassword: form.currentPassword,
              newPassword: form.newPassword,
            }
          : {};
      const { data } = await updateAccountSettingsService({
        userName: form.userName,
        userEmail: form.userEmail,
        profileImage: form.profileImage,
        theme: form.theme,
        emailNotifications: form.emailNotifications,
        announcements: form.announcements,
        roleActivity: form.roleActivity,
        secondaryRoleActivity: form.secondaryRoleActivity,
        profileVisible: form.profileVisible,
        ...password,
      });
      authContext?.setAuth((auth) => ({ ...auth, user: data.user }));
      setForm((current) => ({
        ...current,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      setMessage("Your settings have been saved.");
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Settings could not be saved."
      );
    } finally {
      setSaving(false);
    }
  }

  const activeLabel =
    section === "workspace"
      ? copy.title
      : sections.find((item) => item.id === section)?.label || "Settings";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="bottom-0 left-0 right-0 top-auto flex h-[min(92dvh,54rem)] max-w-none translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden rounded-b-none rounded-t-2xl p-0 data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom lg:left-1/2 lg:right-auto lg:top-1/2 lg:h-[min(46rem,calc(100dvh-4rem))] lg:w-[min(64rem,calc(100vw-4rem))] lg:max-w-none lg:-translate-x-1/2 lg:-translate-y-1/2 lg:flex-row lg:rounded-xl lg:data-[state=closed]:slide-out-to-bottom-0 lg:data-[state=open]:slide-in-from-bottom-0"
      >
        <DialogTitle className="sr-only">Account settings</DialogTitle>
        <DialogDescription className="sr-only">
          Update your profile, preferences, notifications, and password.
        </DialogDescription>

        <div className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-muted-foreground/25 lg:hidden" />

        <aside className="shrink-0 border-b bg-muted/40 px-3 pb-2 pt-3 lg:w-60 lg:border-b-0 lg:border-r lg:p-3">
          <div className="hidden items-center gap-3 border-b px-2 pb-4 pt-1 lg:flex">
            <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold">Settings</p>
              <p className="truncate text-xs text-muted-foreground">
                {copy.label} account
              </p>
            </div>
          </div>

          <nav
            className="flex gap-1 overflow-x-auto pt-1 lg:flex-col lg:pt-3"
            aria-label="Settings sections"
          >
            {sections.map((item) => {
              const Icon = item.icon;
              const label =
                item.id === "workspace" ? copy.workspace : item.label;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setSection(item.id);
                    setError("");
                    setMessage("");
                  }}
                  className={cn(
                    "flex h-9 shrink-0 items-center gap-2 rounded-md px-3 text-sm transition-[background-color,color,transform] active:scale-[0.98] lg:w-full",
                    section === item.id
                      ? "bg-background font-medium text-foreground shadow-sm lg:bg-accent lg:shadow-none"
                      : "text-muted-foreground hover:bg-background/70 hover:text-foreground lg:hover:bg-accent"
                  )}
                  aria-current={section === item.id ? "page" : undefined}
                >
                  <Icon className="size-4" />
                  {label}
                </button>
              );
            })}
          </nav>
        </aside>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <header className="shrink-0 border-b px-5 py-4 pr-14 lg:px-7 lg:py-5">
            <p className="text-xs font-medium text-muted-foreground">Settings</p>
            <h2 className="mt-1 text-lg font-semibold">{activeLabel}</h2>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 lg:px-7 lg:py-6">
            {loading ? (
              <div className="grid h-full place-items-center text-muted-foreground">
                <LoaderCircle className="size-5 animate-spin" />
              </div>
            ) : (
              <div className="mx-auto max-w-2xl">
                {section === "profile" && (
                  <section>
                    <h3 className="text-base font-semibold">Personal details</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      This information identifies you across the academy.
                    </p>
                    <div className="mt-6 flex items-center gap-4 rounded-xl border bg-card p-4">
                      <span className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-full bg-primary/10 font-semibold text-primary">
                        {form.profileImage ? (
                          <img
                            src={form.profileImage}
                            alt=""
                            className="size-full object-cover"
                          />
                        ) : (
                          initials(form.userName)
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{form.userName}</p>
                        <p className="truncate text-sm text-muted-foreground">
                          {form.userEmail}
                        </p>
                        <p className="mt-1 text-xs font-medium text-primary">
                          {copy.label}
                        </p>
                      </div>
                    </div>
                    <div className="mt-6 grid gap-5 sm:grid-cols-2">
                      <div className="grid gap-2">
                        <Label htmlFor="settings-name">Full name</Label>
                        <Input
                          id="settings-name"
                          value={form.userName}
                          onChange={(event) =>
                            setForm((current) => ({
                              ...current,
                              userName: event.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="settings-email">Email address</Label>
                        <Input
                          id="settings-email"
                          type="email"
                          value={form.userEmail}
                          onChange={(event) =>
                            setForm((current) => ({
                              ...current,
                              userEmail: event.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="grid gap-2 sm:col-span-2">
                        <Label htmlFor="settings-image">Profile image URL</Label>
                        <Input
                          id="settings-image"
                          type="url"
                          placeholder="https://example.com/photo.jpg"
                          value={form.profileImage}
                          onChange={(event) =>
                            setForm((current) => ({
                              ...current,
                              profileImage: event.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div className="mt-5 rounded-xl border px-4">
                      <SwitchRow
                        label="Public profile"
                        description="Allow other academy members to see your name and profile image."
                        checked={form.profileVisible}
                        onCheckedChange={(value) =>
                          setPreference("profileVisible", value)
                        }
                      />
                    </div>
                  </section>
                )}

                {section === "notifications" && (
                  <section>
                    <h3 className="text-base font-semibold">Stay informed</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Choose which updates can reach your inbox.
                    </p>
                    <div className="mt-6 rounded-xl border px-4">
                      <SwitchRow
                        label="Email notifications"
                        description="Receive important account and academy activity by email."
                        checked={form.emailNotifications}
                        onCheckedChange={(value) =>
                          setPreference("emailNotifications", value)
                        }
                      />
                      <SwitchRow
                        label="Academy announcements"
                        description="Hear about new programmes, events, and platform updates."
                        checked={form.announcements}
                        onCheckedChange={(value) =>
                          setPreference("announcements", value)
                        }
                      />
                    </div>
                  </section>
                )}

                {section === "appearance" && (
                  <section>
                    <h3 className="text-base font-semibold">Appearance</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Select how Wisdom Driven Academy looks on this device.
                    </p>
                    <div className="mt-6 rounded-xl border p-4">
                      <Label htmlFor="settings-theme">Theme</Label>
                      <Select
                        value={form.theme}
                        onValueChange={(value) =>
                          setPreference(
                            "theme",
                            value as AccountPreferences["theme"]
                          )
                        }
                      >
                        <SelectTrigger
                          id="settings-theme"
                          className="mt-3 w-full sm:w-64"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="system">Use device setting</SelectItem>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </section>
                )}

                {section === "workspace" && (
                  <section>
                    <h3 className="text-base font-semibold">{copy.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {copy.description}
                    </p>
                    <div className="mt-6 rounded-xl border px-4">
                      <SwitchRow
                        label={copy.primary[0]}
                        description={copy.primary[1]}
                        checked={form.roleActivity}
                        onCheckedChange={(value) =>
                          setPreference("roleActivity", value)
                        }
                      />
                      <SwitchRow
                        label={copy.secondary[0]}
                        description={copy.secondary[1]}
                        checked={form.secondaryRoleActivity}
                        onCheckedChange={(value) =>
                          setPreference("secondaryRoleActivity", value)
                        }
                      />
                    </div>
                  </section>
                )}

                {section === "security" && (
                  <section>
                    <h3 className="text-base font-semibold">Change password</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Use at least six characters. Leave these fields blank to
                      keep your current password.
                    </p>
                    <div className="mt-6 grid gap-5 rounded-xl border p-4">
                      <div className="grid gap-2">
                        <Label htmlFor="settings-current-password">
                          Current password
                        </Label>
                        <Input
                          id="settings-current-password"
                          type="password"
                          autoComplete="current-password"
                          value={form.currentPassword}
                          onChange={(event) =>
                            setForm((current) => ({
                              ...current,
                              currentPassword: event.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <div className="grid gap-2">
                          <Label htmlFor="settings-new-password">
                            New password
                          </Label>
                          <Input
                            id="settings-new-password"
                            type="password"
                            minLength={6}
                            autoComplete="new-password"
                            value={form.newPassword}
                            onChange={(event) =>
                              setForm((current) => ({
                                ...current,
                                newPassword: event.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="settings-confirm-password">
                            Confirm password
                          </Label>
                          <Input
                            id="settings-confirm-password"
                            type="password"
                            minLength={6}
                            autoComplete="new-password"
                            value={form.confirmPassword}
                            onChange={(event) =>
                              setForm((current) => ({
                                ...current,
                                confirmPassword: event.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </section>
                )}
              </div>
            )}
          </div>

          <footer className="flex min-h-16 shrink-0 items-center gap-3 border-t bg-background px-5 py-3 lg:px-7">
            <span
              className={cn(
                "min-w-0 flex-1 truncate text-sm",
                error ? "text-destructive" : "text-success-foreground"
              )}
              role="status"
            >
              {error || message}
            </span>
            <Button
              onClick={save}
              disabled={loading || saving}
              className="active:scale-[0.97]"
            >
              {saving ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <Save />
              )}
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </footer>
        </div>
      </DialogContent>
    </Dialog>
  );
}
