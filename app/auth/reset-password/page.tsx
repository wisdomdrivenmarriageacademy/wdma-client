"use client";

import CommonForm from "@/components/common-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { resetPasswordService } from "@/services";
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
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Set a new password</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? <p className="text-red-600 mb-3 text-sm">{error}</p> : null}
          <CommonForm
            formControls={controls as any}
            buttonText={submitting ? "Updating..." : "Update Password"}
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
