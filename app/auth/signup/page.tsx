"use client";

import CommonForm from "@/components/common-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthContext } from "@/context/auth-context";
import { registerService } from "@/services";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";

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
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create account</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? <p className="text-red-600 mb-3 text-sm">{error}</p> : null}
          <CommonForm
            formControls={controls as any}
            buttonText={submitting ? "Creating..." : "Sign Up"}
            formData={formData}
            setFormData={setFormData}
            isButtonDisabled={!isValid || submitting}
            handleSubmit={handleSubmit}
          />
          <div className="mt-4 text-sm flex justify-between">
            <Link href="/auth/signin" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
