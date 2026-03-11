import React, { useState } from "react";
import { X } from "lucide-react";
import { TextInput } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const makePayment = async ({ bookingId, paymentAmount, cardDetails }) => {
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

const MakePaymentModal = ({ closePaymentModal, bookingId }) => {
  const [focusedTotalBudget, setFocusedTotalBudget] = useState(false);
  const [focusedAlreadyPaid, setFocusedAlreadyPaid] = useState(false);
  const [focusedCardNumber, setFocusedCardNumber] = useState(false);
  const [focusedExpiryDate, setFocusedExpiryDate] = useState(false);
  const [focusedPaymentAmount, setFocusedPaymentAmount] = useState(false);
  const [focusedCvv, setFocusedCvv] = useState(false);

  const [totalBudget, setTotalBudget] = useState("$50,000");
  const [alreadyPaid, setAlreadyPaid] = useState("$25,000");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const floatingTotalBudget = focusedTotalBudget || totalBudget?.length > 0;
  const floatingAlreadyPaid = focusedAlreadyPaid || alreadyPaid?.length > 0;
  const floatingCardNumber = focusedCardNumber || cardNumber?.length > 0;
  const floatingExpireDate = focusedExpiryDate || expiryDate?.length > 0;
  const floatingPaymentAmount =
    focusedPaymentAmount || paymentAmount?.length > 0;
  const floatingCvv = focusedCvv || cvv?.length > 0;

  const parseExpiry = (value) => {
    const [mm, yy] = String(value || "").split("/");
    const expiryMonth = Number(mm);
    const twoDigitYear = Number(yy);

    if (!expiryMonth || expiryMonth < 1 || expiryMonth > 12 || Number.isNaN(twoDigitYear)) {
      return null;
    }

    const expiryYear = twoDigitYear < 100 ? 2000 + twoDigitYear : twoDigitYear;
    return { expiryMonth, expiryYear };
  };

  const paymentMutation = useMutation({
    mutationFn: () => {
      if (!bookingId) throw new Error("bookingId is required");
      if (!paymentAmount) throw new Error("paymentAmount is required");

      const normalizedCardNumber = cardNumber.replace(/\D/g, ""); // remove spaces/dashes
      const normalizedCvv = cvv.replace(/\D/g, "");
      const expiry = parseExpiry(expiryDate);

      if (!expiry) throw new Error("Expiry must be in MM/YY format");
      if (normalizedCardNumber.length < 12) throw new Error("Invalid card number");
      if (normalizedCvv.length < 3) throw new Error("Invalid CVV");

      return makePayment({
        bookingId,
        paymentAmount,
        cardDetails: {
          cardNumber: normalizedCardNumber,
          expiryMonth: expiry.expiryMonth,
          expiryYear: expiry.expiryYear,
          cvv: normalizedCvv,
        },
      });
    },
    onSuccess: () => {
      closePaymentModal();
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={closePaymentModal}
      />

      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-md w-full bg-white rounded-2xl p-4 z-50">
        <div className="flex flex-col gap-5">
          <div className="flex justify-between">
            <h1 className="text-xl font-bold">Make Payment</h1>
            <button onClick={closePaymentModal}>
              <X />
            </button>
          </div>

          <div className="flex flex-col gap-7 mt-5">
            <TextInput
              disabled
              label="Total Budget"
              placeholder={focusedTotalBudget ? "$50,000" : ""}
              value={totalBudget}
              onChange={(e) => setTotalBudget(e.currentTarget.value)}
              onFocus={() => setFocusedTotalBudget(true)}
              onBlur={() => setFocusedTotalBudget(false)}
              classNames={{
                root: "relative mt-1",
                input:
                  "bg-transparent border-0 border-b-2 border-gray-300 rounded-none px-0 pt-5 pb-1 focus:outline-none focus:border-gray-900",
                label: `absolute left-0 top-2 z-10 pointer-events-none text-sm font-normal text-gray-400 transition-all duration-100 ease-in-out ${
                  floatingTotalBudget ? "-translate-y-7 text-xs text-gray-900" : ""
                }`,
              }}
            />

            <TextInput
              disabled
              label="Already Paid"
              placeholder={focusedAlreadyPaid ? "$25,000" : ""}
              value={alreadyPaid}
              onChange={(e) => setAlreadyPaid(e.currentTarget.value)}
              onFocus={() => setFocusedAlreadyPaid(true)}
              onBlur={() => setFocusedAlreadyPaid(false)}
              classNames={{
                root: "relative mt-1",
                input:
                  "bg-transparent border-0 border-b-2 border-gray-300 rounded-none px-0 pt-5 pb-1 focus:outline-none focus:border-gray-900",
                label: `absolute left-0 top-2 z-10 pointer-events-none text-sm font-normal text-gray-400 transition-all duration-100 ease-in-out ${
                  floatingAlreadyPaid ? "-translate-y-7 text-xs text-gray-900" : ""
                }`,
              }}
            />
          </div>

          <TextInput
            label="Payment Amount"
            placeholder={focusedPaymentAmount ? "$25,000" : ""}
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.currentTarget.value)}
            onFocus={() => setFocusedPaymentAmount(true)}
            onBlur={() => setFocusedPaymentAmount(false)}
            classNames={{
              root: "relative mt-1",
              input:
                "bg-transparent border-0 border-b-2 border-gray-300 rounded-none px-0 pt-5 pb-1 focus:outline-none focus:border-gray-900",
              label: `absolute left-0 top-2 z-10 pointer-events-none text-sm font-normal text-gray-400 transition-all duration-100 ease-in-out ${
                floatingPaymentAmount ? "-translate-y-5 text-xs text-gray-900" : ""
              }`,
            }}
          />

          <TextInput
            label="Card Number"
            placeholder={focusedCardNumber ? "1234 5678 3456" : ""}
            value={cardNumber}
            onChange={(e) => setCardNumber(e.currentTarget.value)}
            onFocus={() => setFocusedCardNumber(true)}
            onBlur={() => setFocusedCardNumber(false)}
            classNames={{
              root: "relative mt-1",
              input:
                "bg-transparent border-0 border-b-2 border-gray-300 rounded-none px-0 pt-5 pb-1 focus:outline-none focus:border-gray-900",
              label: `absolute left-0 top-2 z-10 pointer-events-none text-sm font-normal text-gray-400 transition-all duration-100 ease-in-out ${
                floatingCardNumber ? "-translate-y-5 text-xs text-gray-900" : ""
              }`,
            }}
          />

          <div className="flex justify-between gap-4">
            <div className="w-full">
              <TextInput
                label="Expiry Date"
                placeholder={focusedExpiryDate ? "MM/YY" : ""}
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.currentTarget.value)}
                onFocus={() => setFocusedExpiryDate(true)}
                onBlur={() => setFocusedExpiryDate(false)}
                classNames={{
                  root: "relative mt-1",
                  input:
                    "bg-transparent border-0 border-b-2 border-gray-300 rounded-none px-0 pt-5 pb-1 focus:outline-none focus:border-gray-900",
                  label: `absolute left-0 top-2 z-10 pointer-events-none text-sm font-normal text-gray-400 transition-all duration-100 ease-in-out ${
                    floatingExpireDate ? "-translate-y-5 text-xs text-gray-900" : ""
                  }`,
                }}
              />
            </div>

            <div className="w-full">
              <TextInput
                label="CVV"
                placeholder={focusedCvv ? "123" : ""}
                value={cvv}
                onChange={(e) => setCvv(e.currentTarget.value)}
                onFocus={() => setFocusedCvv(true)}
                onBlur={() => setFocusedCvv(false)}
                classNames={{
                  root: "relative mt-1",
                  input:
                    "bg-transparent border-0 border-b-2 border-gray-300 rounded-none px-0 pt-5 pb-1 focus:outline-none focus:border-gray-900",
                  label: `absolute left-0 top-2 z-10 pointer-events-none text-sm font-normal text-gray-400 transition-all duration-100 ease-in-out ${
                    floatingCvv ? "-translate-y-5 text-xs text-gray-900" : ""
                  }`,
                }}
              />
            </div>
          </div>

          <button
            onClick={() => paymentMutation.mutate()}
            disabled={!bookingId || paymentMutation.isPending}
            className="bg-black text-white p-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="font-bold text-sm">
              {paymentMutation.isPending ? "Processing..." : "Make Payment"}
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default MakePaymentModal;

