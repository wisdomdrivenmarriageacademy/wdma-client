"use client";

import CommonForm from "@/components/common-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { verifyOtpService, requestPasswordResetService } from "@/services";
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
        // optionally request a reset token email directly
        const req = await requestPasswordResetService(userEmail);
        router.replace(
          `/auth/reset-password?email=${encodeURIComponent(userEmail)}`
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
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Verify OTP</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? <p className="text-red-600 mb-3 text-sm">{error}</p> : null}
          <CommonForm
            formControls={controls as any}
            buttonText={submitting ? "Verifying..." : "Verify"}
            formData={formData}
            setFormData={setFormData}
            isButtonDisabled={!isValid || submitting}
            handleSubmit={handleSubmit}
          />
        </CardContent>
      </Card>
    </div>
  );
}
