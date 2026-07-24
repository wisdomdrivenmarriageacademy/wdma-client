"use client";

import DashboardPageHeader from "@/components/dashboard-page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AdminOrder,
  fetchAdminOrdersService,
} from "@/services";
import { ChevronLeft, ChevronRight, ReceiptText, Search } from "lucide-react";
import { useEffect, useState } from "react";

const currency = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${
        status === "paid"
          ? "border-success/25 bg-success-muted text-success-foreground"
          : "text-muted-foreground"
      }`}
    >
      {status}
    </span>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setLoading(true);
      setError("");
      fetchAdminOrdersService({
        page,
        limit: 20,
        status,
        search: query.trim(),
      })
        .then((response) => {
          if (!response.success) throw new Error(response.message);
          setOrders(response.data.orders);
          setPages(response.data.pagination.pages);
          setTotal(response.data.pagination.total);
        })
        .catch(() => setError("Transactions could not be loaded."))
        .finally(() => setLoading(false));
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [page, query, status]);

  function changeStatus(value: string) {
    setStatus(value);
    setPage(1);
  }

  return (
    <div className="space-y-5 px-4 lg:px-6">
      <DashboardPageHeader
        eyebrow="Finance"
        title="Transactions"
        description="Audit Paystack payment attempts and completed enrolments."
      >
        <p className="text-sm tabular-nums text-panel-muted">
          {total} transaction{total === 1 ? "" : "s"}
        </p>
      </DashboardPageHeader>

      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_190px]">
        <label className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Search student, course, or reference"
            className="h-10 w-full rounded-md border bg-background pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>
        <select
          aria-label="Payment status"
          value={status}
          onChange={(event) => changeStatus(event.target.value)}
          className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="all">All statuses</option>
          <option value="paid">Paid</option>
          <option value="initiated">Initiated</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {error ? (
        <div className="rounded-md border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <Card className="gap-0 overflow-hidden py-0">
        <CardHeader className="border-b py-5">
          <CardTitle className="flex items-center gap-2">
            <ReceiptText className="size-4 text-primary" />
            Payment ledger
          </CardTitle>
          <CardDescription>
            Newest payment attempts appear first.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-px">
              {[0, 1, 2, 3, 4].map((item) => (
                <Skeleton key={item} className="h-16 rounded-none" />
              ))}
            </div>
          ) : orders.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="border-b bg-muted/35 text-xs text-muted-foreground">
                  <tr>
                    <th className="px-5 py-3 font-medium">Student</th>
                    <th className="px-5 py-3 font-medium">Course</th>
                    <th className="px-5 py-3 font-medium">Reference</th>
                    <th className="px-5 py-3 font-medium">Date</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 text-right font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-muted/25">
                      <td className="px-5 py-3.5">
                        <p className="font-medium">{order.userName}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.userEmail}
                        </p>
                      </td>
                      <td className="max-w-64 truncate px-5 py-3.5 text-muted-foreground">
                        {order.courseTitle}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">
                        {order.paymentReference}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-muted-foreground">
                        {new Date(order.orderDate).toLocaleDateString("en-NG", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={order.paymentStatus} />
                      </td>
                      <td className="px-5 py-3.5 text-right font-medium tabular-nums">
                        {currency.format(Number(order.coursePricing) || 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid min-h-60 place-items-center px-6 text-center">
              <div>
                <ReceiptText className="mx-auto size-7 text-muted-foreground" />
                <p className="mt-3 font-medium">No matching transactions</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Change the search or payment-status filter.
                </p>
              </div>
            </div>
          )}
        </CardContent>
        <div className="flex items-center justify-between border-t px-5 py-3">
          <p className="text-xs text-muted-foreground">
            Page {page} of {pages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1 || loading}
              onClick={() => setPage((current) => current - 1)}
            >
              <ChevronLeft />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= pages || loading}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
              <ChevronRight />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
