"use client";

import CommonForm from "@/components/common-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        router.replace("/student/home");
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
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? <p className="text-red-600 mb-3 text-sm">{error}</p> : null}
          <CommonForm
            formControls={controls as any}
            buttonText={submitting ? "Signing in..." : "Sign In"}
            formData={formData}
            setFormData={setFormData}
            isButtonDisabled={!isValid || submitting}
            handleSubmit={handleSubmit}
          />
          <div className="mt-4 text-sm flex justify-between">
            <Link href="/auth/recovery" className="underline">
              Forgot password?
            </Link>
            <Link href="/auth/signup" className="underline">
              Create account
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
