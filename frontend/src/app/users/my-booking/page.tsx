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
  eventDate: string;
  venue: string;
  guestCount: number;
  totalAmount: number;
  totalPaid: number;
  progress: number;
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

  if (!res.ok) {
    throw new Error("There was a problem");
  }

  return res.json();
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

  const { data } = useQuery<MyBookingsResponse>({
    queryKey: ["my-bookings"],
    queryFn: () => fetcher(`${INDEX_BACKEND_API_URL}/my-booking`),
  });

  const selectedBooking = data?.events?.find(
    (booking: Booking) => booking._id === selectedBookingId,
  );
  const remainingAmount =
    (selectedBooking?.totalAmount ?? 0) - (selectedBooking?.totalPaid ?? 0);

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
                  <BreadcrumbPage>My Bookings</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="min-h-[60vh] rounded-xl p-4">
          <div className="left-4 p-2 my-4 rounded-xl max-w-250 flex flex-col gap-10">
            {data?.events?.map((booking) => (
              <div
                key={booking._id}
                className="mb-4 bg-muted/50 p-3 rounded-xl"
              >
                <div className="flex justify-between">
                  <div>
                    <h2 className="font-bold text-xl">{booking.eventName}</h2>
                    <p>Wedding - Classic Elegant</p>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <span className=" bg-black max-h-max max-w-max px-3 text-xs rounded-md text-white">
                      in-progress
                    </span>
                    <span className="bg-[#dbeafe] max-h-max max-w-max px-4 text-xs rounded-md text-[#193cba]">
                      partial
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-4 my-3">
                  <div>
                    <span>Date</span>
                    <p>{new Date(booking.eventDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span>Venue</span>
                    <h3>{booking.venue}</h3>
                  </div>
                </div>
                <div className="grid grid-cols-4 my-3">
                  <div>
                    <span>Guest Count</span>
                    <h3>{booking.guestCount} guests</h3>
                  </div>
                  <div>
                    <span>Budgets</span>
                    <p>{booking.totalAmount}</p>
                  </div>
                </div>
                <div className="">
                  <div className="relative">
                    <p>Event Progress</p>
                    <p className="">{booking.progress}%</p>
                    <div className="max-w-7xl h-3 border border-black rounded-xl overflow-hidden">
                      <div
                        className="h-full bg-black"
                        style={{ width: `${booking.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
                <hr className="mt-4" />
                <div className="flex justify-between mt-2">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Payment</span>
                    <span className="font-semibold text-sm">
                      ${booking.totalPaid} / {booking.totalAmount}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenPaymentModal(booking?._id)}
                    className="bg-black rounded-xl p-2"
                  >
                    <span className="text-white">Make Payment</span>
                  </button>
                </div>
              </div>
            ))}
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
                    Total Amount: ${selectedBooking?.totalAmount ?? 0}
                  </div>
                  <div className="mb-2 text-sm text-gray-600">
                    Paid: ${selectedBooking?.totalPaid ?? 0}
                  </div>
                  <div className="mb-2 text-sm text-gray-600">
                    Remaining: ${remainingAmount}
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
