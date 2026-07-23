"use client";

import CommonForm from "@/components/common-form";
import AuthShell from "@/components/auth-shell";
import { registerService } from "@/services";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const controls = [
  {
    name: "userName",
    label: "User Name",
    placeholder: "John Doe",
    type: "text",
    componentType: "input",
  },
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

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<Record<string, any>>({
    userName: "",
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
      const res = await registerService(formData);
      if (res.success) {
        router.replace("/auth/signin");
      } else {
        setError(res.message || "Registration failed");
      }
    } catch (e: any) {
      setError(e?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  const isValid = formData.userName && formData.userEmail && formData.password;

  return (
    <AuthShell
      eyebrow="Start learning"
      title="Create your account"
      description="Join the academy and begin learning at your own pace."
    >
      {error ? (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      <CommonForm
        formControls={controls as any}
        buttonText={submitting ? "Creating account..." : "Create account"}
        formData={formData}
        setFormData={setFormData}
        isButtonDisabled={!isValid || submitting}
        handleSubmit={handleSubmit}
      />
      <p className="mt-5 text-center text-sm text-[#6b766f]">
        Already have an account?{" "}
        <Link
          href="/auth/signin"
          className="font-semibold text-[#173f2b] hover:underline"
        >
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
