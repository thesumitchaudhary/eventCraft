import { useContext, useEffect, useState } from "react";
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
import { Button, Select, TextInput } from "@mantine/core";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, X } from "lucide-react";
import { EventContext } from "../../../context/EventContext";

const INDEX_BACKEND_API_URL = import.meta.env.VITE_INDEX_BACKEND_URL;
const ADMIN_API_URL = import.meta.env.VITE_ADMIN_BACKEND_URL;
const EVENT_BOOKING_API_URL = import.meta.env.VITE_CUSTOMER_EVENT_BOOKING_BACKEND_URL;
const API_URL = import.meta.env.VITE_BACKEND_URL;

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
}

interface MyBookingsResponse {
  events: Booking[];
}

interface EventTheme {
  _id: string;
  themeName?: string;
  themeType?: string;
  eventType?: string;
  theme?: string;
  type?: string;
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

interface EventBookingPayload {
  eventName: string;
  eventType: string;
  selectTheme: string;
  date: string;
  venue: string;
  guestCount: string;
  budget: string;
}

// this is for the show booked events
const fetcher = async (url: string): Promise<MyBookingsResponse> => {
  const res = await fetch(url, { credentials: "include" });
  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(body?.message || "There was a problem");
  }

  return body;
};

const fetchThemes = async (url: string): Promise<EventTheme[]> => {
  const res = await fetch(url, { credentials: "include" });
  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(body?.message || "Failed to fetch event themes");
  }

  if (Array.isArray(body)) {
    return body;
  }

  return Array.isArray(body?.data) ? body.data : [];
};

const createEventBooking = async ({
  eventName,
  eventType,
  selectTheme,
  date,
  venue,
  guestCount,
  budget,
}: EventBookingPayload) => {
  const res = await fetch(`${EVENT_BOOKING_API_URL}/createEvent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      eventName,
      eventType,
      theme: selectTheme,
      eventDate: date || null,
      venue,
      guestCount: Number(guestCount),
      totalAmount: Number(budget),
    }),
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(body?.message || body?.error || "Event booking failed");
  }

  return body;
};

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

type EventRegistrationModalProps = {
  close: () => void;
  onSuccess: () => void;
};

function EventRegistrationModal({ close, onSuccess }: EventRegistrationModalProps) {
  const {
    eventName,
    setEventName,
    eventType,
    setEventType,
    selectTheme,
    setSelectTheme,
    date,
    setDate,
    venue,
    setVenue,
    guestCount,
    setGuestCount,
    budget,
    setBudget,
  } = useContext(EventContext);

  const [focusedEventname, setFocusedEventname] = useState(false);
  const [focusedDate, setFocusedDate] = useState(false);
  const [focusedVenue, setFocusedVenue] = useState(false);
  const [focusedGuestCount, setFocusedGuestCount] = useState(false);
  const [focusedBudget, setFocusedBudget] = useState(false);
  const [focusedEventType, setFocusedEventType] = useState(false);
  const [focusedSelectTheme, setFocusedSelectTheme] = useState(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const floatingEventname = focusedEventname || eventName?.length > 0;
  const floatingDate = focusedDate || date?.length > 0;
  const floatingVenue = focusedVenue || venue?.length > 0;
  const floatingGuestCount = focusedGuestCount || guestCount?.length > 0;
  const floatingBudget = focusedBudget || budget?.length > 0;
  const floatingEventType = focusedEventType || eventType?.length > 0;
  const floatingSelectTheme = focusedSelectTheme || selectTheme?.length > 0;

  const { data: themesData = [], isPending, isError, error } = useQuery({
    queryKey: ["eventThemesDetails", ADMIN_API_URL],
    enabled: Boolean(ADMIN_API_URL),
    queryFn: () => fetchThemes(`${ADMIN_API_URL}/getAllEventTheme`),
  });

  const getEventType = (item: EventTheme) =>
    String(
      item?.themeType ?? item?.eventType ?? item?.type ?? item?.theme ?? "",
    ).trim();

  const eventTypeOptions = [
    ...new Map(
      themesData
        .map((item) => getEventType(item))
        .filter(Boolean)
        .map((type) => [type.toLowerCase(), { value: type, label: type }]),
    ).values(),
  ];

  const themeOptions = themesData
    .filter(
      (item) =>
        getEventType(item).toLowerCase() === String(eventType).toLowerCase(),
    )
    .map((item) => String(item?.themeName ?? item?.theme ?? "").trim())
    .filter(Boolean)
    .map((theme) => ({ value: theme, label: theme }));

  const createEventMutation = useMutation({
    mutationFn: () => {
      if (!eventName.trim()) {
        throw new Error("Event name is required");
      }

      if (!eventType.trim()) {
        throw new Error("Event type is required");
      }

      if (!selectTheme.trim()) {
        throw new Error("Theme is required");
      }

      if (!date.trim()) {
        throw new Error("Event date is required");
      }

      if (!venue.trim()) {
        throw new Error("Venue is required");
      }

      if (!guestCount.trim()) {
        throw new Error("Guest count is required");
      }

      if (!budget.trim()) {
        throw new Error("Budget is required");
      }

      return createEventBooking({
        eventName,
        eventType,
        selectTheme,
        date,
        venue,
        guestCount,
        budget,
      });
    },
    onSuccess: () => {
      onSuccess();
      close();
    },
  });

  const handleClose = () => {
    setEventName("");
    setEventType("");
    setSelectTheme("");
    setDate("");
    setVenue("");
    setGuestCount("");
    setBudget("");
    close();
  };

  return (
    <div className="z-50">
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-booking-dialog-title"
      >
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h3 id="event-booking-dialog-title" className="text-lg font-semibold text-gray-800">
              Create New Event Booking
            </h3>
            <p className="text-sm text-gray-500">Fill in the details for your event</p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="text-gray-500 transition hover:text-black"
          >
            <X size={20} />
          </button>
        </div>

        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            createEventMutation.mutate();
          }}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <TextInput
              label="Event Name"
              placeholder={focusedEventname ? "e.g. Johnson Wedding" : ""}
              value={eventName}
              onChange={(e) => setEventName(e.currentTarget.value)}
              onFocus={() => setFocusedEventname(true)}
              onBlur={() => setFocusedEventname(false)}
              classNames={{
                root: "relative mt-1",
                input:
                  "bg-transparent border-0 border-b-2 border-gray-300 rounded-none px-0 pt-5 pb-1 focus:outline-none focus:border-gray-900",
                label: `absolute left-0 top-2 z-10 pointer-events-none text-sm font-normal text-gray-400 transition-all duration-100 ease-in-out ${
                  floatingEventname
                    ? "-translate-y-5 text-xs text-gray-900"
                    : ""
                }`,
              }}
            />

            <Select
              value={eventType}
              onChange={(value) => {
                setEventType(value || "");
                setSelectTheme("");
              }}
              label="Select Type"
              placeholder={focusedEventType ? "Select Type" : ""}
              data={eventTypeOptions}
              disabled={isPending || isError}
              onFocus={() => setFocusedEventType(true)}
              onBlur={() => setFocusedEventType(false)}
              classNames={{
                root: "relative mt-1",
                input:
                  "bg-transparent border-0 border-b-2 border-gray-300 rounded-none px-0 pt-5 pb-1 focus:outline-none focus:border-gray-900",
                label: `absolute left-0 top-2 z-10 pointer-events-none text-sm font-normal text-gray-400 transition-all duration-100 ease-in-out ${
                  floatingEventType
                    ? "-translate-y-5 text-xs text-gray-900"
                    : ""
                }`,
              }}
            />
          </div>

          <Select
            disabled={!eventType}
            value={selectTheme}
            onChange={(value) => setSelectTheme(value || "")}
            label="Select Theme"
            placeholder={focusedSelectTheme ? "Select Theme" : ""}
            data={themeOptions}
            onFocus={() => setFocusedSelectTheme(true)}
            onBlur={() => setFocusedSelectTheme(false)}
            classNames={{
              root: "relative mt-1",
              input:
                "bg-transparent border-0 border-b-2 border-gray-300 rounded-none px-0 pt-5 pb-1 focus:outline-none focus:border-gray-900",
              label: `absolute left-0 top-2 z-10 pointer-events-none text-sm font-normal text-gray-400 transition-all duration-100 ease-in-out ${
                floatingSelectTheme
                  ? "-translate-y-5 text-xs text-gray-900"
                  : ""
              }`,
            }}
          />

          <div className="grid gap-4 md:grid-cols-3">
            <TextInput
              type="date"
              label="Select Date"
              value={date}
              onChange={(e) => setDate(e.currentTarget.value)}
              onFocus={() => setFocusedDate(true)}
              onBlur={() => setFocusedDate(false)}
              classNames={{
                root: "relative mt-1",
                input:
                  "bg-transparent border-0 border-b-2 border-gray-300 rounded-none px-0 pt-5 pb-1 focus:outline-none focus:border-gray-900",
                label: `absolute left-0 top-2 z-10 pointer-events-none text-sm font-normal text-gray-400 transition-all duration-100 ease-in-out ${
                  floatingDate ? "-translate-y-5 text-xs text-gray-900" : ""
                }`,
              }}
            />

            <TextInput
              label="Venue"
              placeholder={focusedVenue ? "e.g. Grand Hotel" : ""}
              value={venue}
              onChange={(e) => setVenue(e.currentTarget.value)}
              onFocus={() => setFocusedVenue(true)}
              onBlur={() => setFocusedVenue(false)}
              classNames={{
                root: "relative mt-1",
                input:
                  "bg-transparent border-0 border-b-2 border-gray-300 rounded-none px-0 pt-5 pb-1 focus:outline-none focus:border-gray-900",
                label: `absolute left-0 top-2 z-10 pointer-events-none text-sm font-normal text-gray-400 transition-all duration-100 ease-in-out ${
                  floatingVenue ? "-translate-y-5 text-xs text-gray-900" : ""
                }`,
              }}
            />

            <TextInput
              type="number"
              label="Guest Count"
              placeholder={focusedGuestCount ? "Guest Count" : ""}
              value={guestCount}
              onChange={(e) => setGuestCount(e.currentTarget.value)}
              onFocus={() => setFocusedGuestCount(true)}
              onBlur={() => setFocusedGuestCount(false)}
              classNames={{
                root: "relative mt-1",
                input:
                  "bg-transparent border-0 border-b-2 border-gray-300 rounded-none px-0 pt-5 pb-1 focus:outline-none focus:border-gray-900",
                label: `absolute left-0 top-2 z-10 pointer-events-none text-sm font-normal text-gray-400 transition-all duration-100 ease-in-out ${
                  floatingGuestCount
                    ? "-translate-y-5 text-xs text-gray-900"
                    : ""
                }`,
              }}
            />
          </div>

          <TextInput
            type="number"
            label="Budget ($)"
            placeholder={focusedBudget ? "Budget" : ""}
            value={budget}
            onChange={(e) => setBudget(e.currentTarget.value)}
            onFocus={() => setFocusedBudget(true)}
            onBlur={() => setFocusedBudget(false)}
            classNames={{
              root: "relative mt-1",
              input:
                "bg-transparent border-0 border-b-2 border-gray-300 rounded-none px-0 pt-5 pb-1 focus:outline-none focus:border-gray-900",
              label: `absolute left-0 top-2 z-10 pointer-events-none text-sm font-normal text-gray-400 transition-all duration-100 ease-in-out ${
                floatingBudget ? "-translate-y-5 text-xs text-gray-900" : ""
              }`,
            }}
          />

          <div className="flex items-center justify-between gap-4">
            <div className="min-h-5 text-sm text-red-600">
              {isError && error instanceof Error ? error.message : ""}
              {createEventMutation.error instanceof Error
                ? createEventMutation.error.message
                : ""}
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                color="dark"
                onClick={handleClose}
                disabled={createEventMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                color="dark"
                loading={createEventMutation.isPending}
                className="border border-black"
              >
                {createEventMutation.isPending ? "Booking..." : "Create Booking"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Page() {
  const queryClient = useQueryClient();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
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

  const handleOpenBookingModal = () => {
    setIsBookingModalOpen(true);
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
  };

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
          <div className="min-h-[10vh] rounded-xl bg-muted/50 p-4">
            <div className="flex justify-between">
              <h4 className="text-lg font-semibold">Payment History</h4>
              <Button
                color="dark"
                onClick={handleOpenBookingModal}
                className="flex items-center gap-2"
              >
                <Plus size={16} />
                New Booking
              </Button>
            </div>
          </div>
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
        {isBookingModalOpen && (
          <EventRegistrationModal
            close={handleCloseBookingModal}
            onSuccess={() =>
              queryClient.invalidateQueries({ queryKey: ["my-bookings"] })
            }
          />
        )}
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
