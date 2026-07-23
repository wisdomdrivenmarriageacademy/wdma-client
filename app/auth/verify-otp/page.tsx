"use client";

import CommonForm from "@/components/common-form";
import AuthShell from "@/components/auth-shell";
import { verifyOtpService } from "@/services";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const controls = [
  {
    name: "code",
    label: "OTP Code",
    placeholder: "6-digit code",
    type: "text",
    componentType: "input",
  },
];

export default function VerifyOtpPage() {
  const router = useRouter();
  const search = useSearchParams();
  const userEmail = search.get("email") ?? "";
  const [formData, setFormData] = useState<Record<string, any>>({ code: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await verifyOtpService(userEmail, formData.code);
      if (res.success) {
        router.replace(
          `/auth/reset-password?email=${encodeURIComponent(
            userEmail
          )}&token=${encodeURIComponent(res.data.token)}`
        );
      } else {
        setError(res.message || "Invalid code");
      }
    } catch (e: any) {
      setError(e?.message || "Verification failed");
    } finally {
      setSubmitting(false);
    }
  }

  const isValid = formData.code && userEmail;

  return (
    <AuthShell
      eyebrow="Check your inbox"
      title="Verify your email"
      description={`Enter the six-digit code sent to ${
        userEmail || "your email address"
      }. It expires in 10 minutes.`}
    >
      {error ? (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      <CommonForm
        formControls={controls as any}
        buttonText={submitting ? "Verifying..." : "Verify code"}
        formData={formData}
        setFormData={setFormData}
        isButtonDisabled={!isValid || submitting}
        handleSubmit={handleSubmit}
      />
      <p className="mt-5 text-center text-sm text-[#6b766f]">
        Wrong email?{" "}
        <Link
          href="/auth/recovery"
          className="font-semibold text-[#173f2b] hover:underline"
        >
          Go back
        </Link>
      </p>
    </AuthShell>
  );
}
