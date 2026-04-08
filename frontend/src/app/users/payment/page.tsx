import { AppSidebar } from "../../../components/app-siderbar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { useState } from "react";

const INDEX_BACKEND_API_URL = import.meta.env.VITE_INDEX_BACKEND_URL;

interface Booking {
  _id: string;
  eventName: string;
  eventType?: string;
  theme?: string;
  eventDate: string;
  venue: string;
  guestCount: number;
  totalAmount: number;
  totalPaid: number;
  progress: number;
  bookingStatus?: string;
  paymentStatus?: string;
}

interface MyBookingsResponse {
  events: Booking[];
}

interface CardDetails {
  cardNumber: string;
  expiryMonth: number;
  expiryYear: number;
  cvv: string;
}

interface PaymentPayload {
  bookingId: string;
  paymentAmount: number;
  cardDetails: CardDetails;
}

// this is for the show booked events
const fetcher = async (url: string): Promise<MyBookingsResponse> => {
  const res = await fetch(url, { credentials: "include" });
  const body = await res.json();

  if (!res.ok) {
    throw new Error(body?.message || "There was a problem");
  }

  return body;
};

const API_URL = import.meta.env.VITE_BACKEND_URL;

const makePayment = async ({
  bookingId,
  paymentAmount,
  cardDetails,
}: PaymentPayload) => {
  const res = await fetch(`${API_URL}/index/payment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      bookingId,
      paymentAmount,
      cardDetails,
    }),
  });

  const data = await res.json();

  if (!res.ok || data?.success === false) {
    throw new Error(data?.message || "Payment request failed");
  }

  return data;
};

export default function Page() {
  const queryClient = useQueryClient();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null,
  );
  const [paymentAmount, setPaymentAmount] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const handleOpenPaymentModal = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setPaymentAmount("");
    setCardNumber("");
    setExpiryDate("");
    setCvv("");
    setIsPaymentModalOpen(true);
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setSelectedBookingId(null);
    setPaymentAmount("");
    setCardNumber("");
    setExpiryDate("");
    setCvv("");
  };

  const parseExpiry = (value: string) => {
    const [mm, yy] = String(value || "").split("/");
    const expiryMonth = Number(mm);
    const twoDigitYear = Number(yy);

    if (
      !expiryMonth ||
      expiryMonth < 1 ||
      expiryMonth > 12 ||
      Number.isNaN(twoDigitYear)
    ) {
      return null;
    }

    const expiryYear = twoDigitYear < 100 ? 2000 + twoDigitYear : twoDigitYear;
    return { expiryMonth, expiryYear };
  };

  const paymentMutation = useMutation({
    mutationFn: () => {
      if (!selectedBookingId) throw new Error("bookingId is required");
      if (!paymentAmount) throw new Error("paymentAmount is required");

      const paymentAmountNumber = Number(paymentAmount);
      const remainingAmount =
        (selectedBooking?.totalAmount ?? 0) - (selectedBooking?.totalPaid ?? 0);

      if (Number.isNaN(paymentAmountNumber) || paymentAmountNumber <= 0) {
        throw new Error("Payment amount must be a valid positive number");
      }
      if (paymentAmountNumber > remainingAmount) {
        throw new Error("Payment amount cannot exceed remaining balance");
      }

      const normalizedCardNumber = cardNumber.replace(/\D/g, ""); // remove spaces/dashes
      const normalizedCvv = cvv.replace(/\D/g, "");
      const expiry = parseExpiry(expiryDate);

      if (!expiry) throw new Error("Expiry must be in MM/YY format");
      if (normalizedCardNumber.length < 12)
        throw new Error("Invalid card number");
      if (normalizedCvv.length < 3) throw new Error("Invalid CVV");

      return makePayment({
        bookingId: selectedBookingId,
        paymentAmount: paymentAmountNumber,
        cardDetails: {
          cardNumber: normalizedCardNumber,
          expiryMonth: expiry.expiryMonth,
          expiryYear: expiry.expiryYear,
          cvv: normalizedCvv,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
      handleClosePaymentModal();
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const {
    data,
    isLoading,
    error,
  } = useQuery<MyBookingsResponse>({
    queryKey: ["my-bookings"],
    queryFn: () => fetcher(`${INDEX_BACKEND_API_URL}/my-booking`),
  });

  const selectedBooking = data?.events?.find(
    (booking: Booking) => booking._id === selectedBookingId,
  );
  const remainingAmount =
    (selectedBooking?.totalAmount ?? 0) - (selectedBooking?.totalPaid ?? 0);
  const bookings = data?.events ?? [];

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbPage>Customer dashboard</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Payments</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="min-h-[60vh] rounded-xl bg-muted/50 p-4">
            <div className="flex flex-col gap-1">
              <h4 className="text-lg font-semibold">Payment History</h4>
              <p className="text-sm text-muted-foreground">
                Track your event payments and complete pending balances.
              </p>
            </div>

            {isLoading ? (
              <div className="mt-5 rounded-xl border border-dashed border-border bg-background p-6 text-sm text-muted-foreground">
                Loading your bookings...
              </div>
            ) : error instanceof Error ? (
              <div className="mt-5 rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-sm text-destructive">
                {error.message}
              </div>
            ) : bookings.length === 0 ? (
              <div className="mt-5 rounded-xl border border-dashed border-border bg-background p-6 text-sm text-muted-foreground">
                No bookings found.
              </div>
            ) : (
              <table className="mt-5 w-full border-collapse rounded-xl bg-white">
                <thead>
                  <tr>
                    <th className="border-b px-4 py-2 text-left">Event</th>
                    <th className="border-b px-4 py-2 text-left">Date</th>
                    <th className="border-b px-4 py-2 text-left">Venue</th>
                    <th className="border-b px-4 py-2 text-left">Total Budget</th>
                    <th className="border-b px-4 py-2 text-left">Amount Paid</th>
                    <th className="border-b px-4 py-2 text-left">Remaining</th>
                    <th className="border-b px-4 py-2 text-left">Status</th>
                    <th className="border-b px-4 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => {
                    const bookingRemaining =
                      (booking.totalAmount ?? 0) - (booking.totalPaid ?? 0);
                    const paymentStatus =
                      booking.paymentStatus ||
                      (bookingRemaining <= 0 ? "paid" : "partial");

                    return (
                      <tr key={booking._id} className="border-b last:border-b-0">
                        <td className="px-4 py-3">
                          <div className="font-medium">{booking.eventName}</div>
                          <div className="text-xs text-muted-foreground">
                            {booking.eventType ?? booking.theme ?? "Event booking"}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {booking.eventDate
                            ? new Date(booking.eventDate).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="px-4 py-3">{booking.venue}</td>
                        <td className="px-4 py-3">
                          ${Number(booking.totalAmount || 0).toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          ${Number(booking.totalPaid || 0).toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          ${Math.max(bookingRemaining, 0).toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-md px-2 py-1 text-xs font-medium ${
                              paymentStatus === "paid"
                                ? "bg-emerald-100 text-emerald-700"
                                : paymentStatus === "partial"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {paymentStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => handleOpenPaymentModal(booking._id)}
                            disabled={bookingRemaining <= 0}
                            className="rounded-xl bg-black px-3 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {bookingRemaining <= 0 ? "Paid" : "Pay now"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
        {isPaymentModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={handleClosePaymentModal}
          >
            <div
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-semibold">Make Payment</h2>
              <form
                className="mt-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  paymentMutation.mutate();
                }}
              >
                <div>
                  <div className="mb-2 text-sm text-gray-600">
                    Total Amount: $
                    {Number(selectedBooking?.totalAmount ?? 0).toLocaleString()}
                  </div>
                  <div className="mb-2 text-sm text-gray-600">
                    Paid: ${Number(selectedBooking?.totalPaid ?? 0).toLocaleString()}
                  </div>
                  <div className="mb-2 text-sm text-gray-600">
                    Remaining: ${Math.max(remainingAmount, 0).toLocaleString()}
                  </div>
                </div>
                <label
                  htmlFor="payment-amount"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Payment Amount
                </label>

                <input
                  id="payment-amount"
                  type="number"
                  min="1"
                  max={remainingAmount > 0 ? remainingAmount : undefined}
                  step="0.01"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
                />
                <label
                  htmlFor="card-number"
                  className="mb-1 mt-3 block text-sm font-medium text-gray-700"
                >
                  Card Number
                </label>
                <input
                  id="card-number"
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
                />

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="expiry-date"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Expiry (MM/YY)
                    </label>
                    <input
                      id="expiry-date"
                      type="text"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      placeholder="08/29"
                      className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="card-cvv"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      CVV
                    </label>
                    <input
                      id="card-cvv"
                      type="password"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      placeholder="123"
                      className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
                    />
                  </div>
                </div>

                {paymentMutation.error instanceof Error && (
                  <p className="mt-3 text-sm text-red-600">
                    {paymentMutation.error.message}
                  </p>
                )}

                <div className="mt-6 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleClosePaymentModal}
                    className="rounded-xl border border-gray-300 px-4 py-2 text-sm"
                    disabled={paymentMutation.isPending}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-black px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={paymentMutation.isPending}
                  >
                    {paymentMutation.isPending ? "Processing..." : "Pay"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
