"use client";

import CommonForm from "@/components/common-form";
import AuthShell from "@/components/auth-shell";
import { resetPasswordService } from "@/services";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const controls = [
  {
    name: "newPassword",
    label: "New Password",
    placeholder: "******",
    type: "password",
    componentType: "input",
  },
];

export default function ResetPasswordPage() {
  const router = useRouter();
  const search = useSearchParams();
  const userEmail = search.get("email") ?? "";
  const token = search.get("token") ?? "";
  const [formData, setFormData] = useState<Record<string, any>>({
    newPassword: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await resetPasswordService(
        userEmail,
        token,
        formData.newPassword
      );
      if (res.success) {
        router.replace("/auth/signin");
      } else {
        setError(res.message || "Failed to reset password");
      }
    } catch (e: any) {
      setError(e?.message || "Failed to reset password");
    } finally {
      setSubmitting(false);
    }
  }

  const isValid = userEmail && token && formData.newPassword.length >= 6;

  return (
    <AuthShell
      eyebrow="Password update"
      title="Choose a new password"
      description="Use at least six characters and choose something you don’t use elsewhere."
    >
      {error ? (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      <CommonForm
        formControls={controls as any}
        buttonText={submitting ? "Updating password..." : "Update password"}
        formData={formData}
        setFormData={setFormData}
        isButtonDisabled={!isValid || submitting}
        handleSubmit={handleSubmit}
      />
      <p className="mt-5 text-center text-sm text-[#6b766f]">
        Back to{" "}
        <Link
          href="/auth/signin"
          className="font-semibold text-[#173f2b] hover:underline"
        >
          sign in
        </Link>
      </p>
    </AuthShell>
  );
}
