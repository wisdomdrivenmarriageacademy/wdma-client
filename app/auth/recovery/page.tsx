"use client";

import CommonForm from "@/components/common-form";
import AuthShell from "@/components/auth-shell";
import { requestOtpService } from "@/services";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const controls = [
  {
    name: "userEmail",
    label: "Email",
    placeholder: "you@example.com",
    type: "email",
    componentType: "input",
  },
];

export default function RecoveryPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<Record<string, any>>({
    userEmail: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await requestOtpService(formData.userEmail);
      if (res.success) {
        router.replace(
          `/auth/verify-otp?email=${encodeURIComponent(formData.userEmail)}`
        );
      } else {
        setError(res.message || "Failed to request OTP");
      }
    } catch (e: any) {
      setError(e?.message || "Failed to request OTP");
    } finally {
      setSubmitting(false);
    }
  }

  const isValid = formData.userEmail;

  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Let’s get you back in"
      description="Enter the email connected to your account and we’ll send a six-digit verification code."
    >
      {error ? (
        <p className="mb-4 rounded-lg bg-destructive-muted px-3 py-2.5 text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <CommonForm
        formControls={controls as any}
        buttonText={submitting ? "Sending code..." : "Send verification code"}
        formData={formData}
        setFormData={setFormData}
        isButtonDisabled={!isValid || submitting}
        handleSubmit={handleSubmit}
      />
      <p className="mt-5 text-center text-sm text-muted-foreground">
        Remembered your password?{" "}
        <Link
          href="/auth/signin"
          className="font-semibold text-primary hover:underline"
        >
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
