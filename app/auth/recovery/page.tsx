"use client";

import CommonForm from "@/components/common-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requestOtpService, requestPasswordResetService } from "@/services";
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
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Account recovery</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? <p className="text-red-600 mb-3 text-sm">{error}</p> : null}
          <CommonForm
            formControls={controls as any}
            buttonText={submitting ? "Sending..." : "Send OTP"}
            formData={formData}
            setFormData={setFormData}
            isButtonDisabled={!isValid || submitting}
            handleSubmit={handleSubmit}
          />
          <div className="mt-4 text-sm flex justify-between">
            <Link href="/auth/signin" className="underline">
              Back to sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
