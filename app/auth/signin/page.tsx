"use client";

import CommonForm from "@/components/common-form";
import AuthShell from "@/components/auth-shell";
import { AuthContext } from "@/context/auth-context";
import { loginService } from "@/services";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";

const controls = [
  {
    name: "userEmail",
    label: "Email",
    placeholder: "you@example.com",
    type: "email",
    componentType: "input",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "******",
    type: "password",
    componentType: "input",
  },
];

export default function SignInPage() {
  const router = useRouter();
  const authCtx = useContext(AuthContext);
  const [formData, setFormData] = useState<Record<string, any>>({
    userEmail: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await loginService(formData);
      if (res.success) {
        sessionStorage.setItem(
          "accessToken",
          JSON.stringify(res.data.accessToken)
        );
        authCtx?.setAuth({ authenticate: true, user: res.data.user });
        router.replace(
          res.data.user.role === "admin"
            ? "/admin"
            : res.data.user.role === "instructor"
              ? "/instructor"
              : "/student/home"
        );
      } else {
        setError("Invalid credentials");
      }
    } catch (e: any) {
      setError(e?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  const isValid = formData.userEmail && formData.password;

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in to continue"
      description="Return to your courses and pick up exactly where you left off."
    >
      {error ? (
        <p className="mb-4 rounded-lg bg-destructive-muted px-3 py-2.5 text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <CommonForm
        formControls={controls as any}
        buttonText={submitting ? "Signing in..." : "Sign in"}
        formData={formData}
        setFormData={setFormData}
        isButtonDisabled={!isValid || submitting}
        handleSubmit={handleSubmit}
      />
      <div className="mt-5 flex justify-between text-sm">
        <Link
          href="/auth/recovery"
          className="font-medium text-secondary-foreground hover:text-primary"
        >
          Forgot password?
        </Link>
        <Link
          href="/auth/signup"
          className="font-semibold text-primary hover:underline"
        >
          Create account
        </Link>
      </div>
    </AuthShell>
  );
}
