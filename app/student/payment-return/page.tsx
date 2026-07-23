"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { verifyAndFinalizePaymentService } from "@/services";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function PaystackPaymentReturnPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reference = searchParams.get("reference") ?? "";

  useEffect(() => {
    if (reference) {
      async function verifyPayment() {
        const response = await verifyAndFinalizePaymentService(reference);

        if (response?.success) {
          router.replace("/student/student-courses");
        }
      }

      verifyPayment();
    }
  }, [reference, router]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing payment... Please wait</CardTitle>
      </CardHeader>
    </Card>
  );
}

export default PaystackPaymentReturnPage;
