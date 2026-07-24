"use client";

import DashboardPageHeader from "@/components/dashboard-page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  fetchAdminUsersService,
  updateUserRoleService,
  type UserAccount,
} from "@/services";
import { Search, ShieldCheck, UserRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const roleLabels: Record<UserAccount["role"], string> = {
  user: "Student",
  instructor: "Instructor",
  admin: "Administrator",
};

export default function UserDirectory({
  initialRole,
}: {
  initialRole?: UserAccount["role"];
}) {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAdminUsersService(initialRole)
      .then((response) => {
        if (response.success) setUsers(response.data);
      })
      .catch(() => setError("The account directory could not be loaded."))
      .finally(() => setLoading(false));
  }, [initialRole]);

  const filteredUsers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return users;
    return users.filter(
      (user) =>
        user.userName.toLowerCase().includes(normalized) ||
        user.userEmail.toLowerCase().includes(normalized)
    );
  }, [query, users]);

  async function changeRole(user: UserAccount, role: UserAccount["role"]) {
    if (role === user.role) return;
    setUpdating(user._id);
    setError("");
    try {
      const response = await updateUserRoleService(user._id, role);
      if (response.success) {
        setUsers((current) =>
          initialRole
            ? current.filter((item) => item._id !== user._id)
            : current.map((item) =>
                item._id === user._id ? response.data : item
              )
        );
      }
    } catch {
      setError("The role could not be updated. Please try again.");
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div className="space-y-6 px-4 lg:px-6">
      <DashboardPageHeader
        eyebrow="Access directory"
        title={initialRole ? `${roleLabels[initialRole]}s` : "Academy accounts"}
        description="Review identity and assign only the access each person needs."
      >
        <label className="relative block w-full shrink-0 sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name or email"
            className="h-9 w-full rounded-md border bg-background pl-9 pr-3 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>
      </DashboardPageHeader>

      {error ? (
        <div className="rounded-md border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <Card className="gap-0 overflow-hidden py-0">
        <CardHeader className="border-b py-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <ShieldCheck className="size-4 text-primary" />
            Role access
          </CardTitle>
          <CardDescription>
            {loading
              ? "Loading accounts…"
              : `${filteredUsers.length} account${filteredUsers.length === 1 ? "" : "s"}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {!loading && filteredUsers.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="border-b bg-muted/35 text-xs text-muted-foreground">
                  <tr>
                    <th className="px-6 py-3 font-medium">Person</th>
                    <th className="px-6 py-3 font-medium">Email</th>
                    <th className="px-6 py-3 font-medium">Access</th>
                    <th className="px-6 py-3 text-right font-medium">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-muted/25">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <span className="grid size-9 place-items-center rounded-full bg-muted font-medium">
                            {user.userName.charAt(0).toUpperCase()}
                          </span>
                          <span className="font-medium">{user.userName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-muted-foreground">
                        {user.userEmail}
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="rounded-full border px-2 py-1 text-xs text-muted-foreground">
                          {roleLabels[user.role]}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <select
                          aria-label={`Role for ${user.userName}`}
                          value={user.role}
                          disabled={updating === user._id}
                          onChange={(event) =>
                            changeRole(
                              user,
                              event.target.value as UserAccount["role"]
                            )
                          }
                          className="h-8 rounded-md border bg-background px-2 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                        >
                          <option value="user">Student</option>
                          <option value="instructor">Instructor</option>
                          <option value="admin">Administrator</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid min-h-56 place-items-center px-6 text-center">
              <div>
                <UserRound className="mx-auto size-7 text-muted-foreground" />
                <p className="mt-3 font-medium">
                  {loading ? "Loading accounts…" : "No matching accounts"}
                </p>
                {!loading && query ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={() => setQuery("")}
                  >
                    Clear search
                  </Button>
                ) : null}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
