"use client";

import { Button } from "@/components/ui/button";
import { verifyAndFinalizePaymentService } from "@/services";
import { Check, CircleAlert, LoaderCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type Status = "processing" | "success" | "error";

export default function PaystackPaymentReturnPage() {
  const reference = useSearchParams().get("reference") ?? "";
  const router = useRouter();
  const [status, setStatus] = useState<Status>("processing");
  const [message, setMessage] = useState("Confirming your Paystack payment…");

  useEffect(() => {
    if (!reference) {
      setStatus("error");
      setMessage("The payment reference is missing.");
      return;
    }

    verifyAndFinalizePaymentService(reference)
      .then((response) => {
        if (!response.success) throw new Error(response.message);
        setStatus("success");
        setMessage("Payment confirmed. Your course is ready.");
      })
      .catch(() => {
        setStatus("error");
        setMessage(
          "We could not confirm this payment. If you were charged, contact support with your reference."
        );
      });
  }, [reference]);

  return (
    <div className="grid min-h-[65vh] place-items-center px-4">
      <div className="w-full max-w-md rounded-xl border bg-card p-8 text-center shadow-sm">
        <span
          className={`mx-auto grid size-12 place-items-center rounded-full ${
            status === "success"
              ? "bg-success-muted text-success"
              : status === "error"
                ? "bg-destructive-muted text-destructive"
                : "bg-muted text-muted-foreground"
          }`}
        >
          {status === "success" ? (
            <Check className="size-5" />
          ) : status === "error" ? (
            <CircleAlert className="size-5" />
          ) : (
            <LoaderCircle className="size-5 animate-spin" />
          )}
        </span>
        <p className="mt-5 text-xs font-medium uppercase tracking-[0.16em] text-primary">
          Secure checkout
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">
          {status === "success"
            ? "Enrollment complete"
            : status === "error"
              ? "Confirmation needs attention"
              : "Confirming payment"}
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{message}</p>
        {reference ? (
          <p className="mt-4 rounded-md bg-muted px-3 py-2 font-mono text-[11px] text-muted-foreground">
            {reference}
          </p>
        ) : null}
        {status !== "processing" ? (
          <Button
            className="mt-6 w-full"
            variant={status === "success" ? "default" : "outline"}
            onClick={() =>
              router.replace(
                status === "success"
                  ? "/student/student-courses"
                  : "/student/courses"
              )
            }
          >
            {status === "success" ? "Start learning" : "Return to courses"}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
