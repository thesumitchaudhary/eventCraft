import React, { useState } from "react";
import { X } from "lucide-react";
import { TextInput } from "@mantine/core";

const MakePaymentModal = ({ closePaymentModal }) => {
  // this is for floating and also focused state for field designs
  const [focusedTotalBudget, setFocusedTotalBudget] = useState(false);
  const [focusedAlreadyPaid, setFocusedAlreadyPaid] = useState(false);
  const [focusedCardNumber, setFocusedCardNumber] = useState(false);
  const [focusedExpiryDate, setFocusedExpiryDate] = useState(false);
  const [focusedPaymentAmount, setFocusedPaymentAmount] = useState(false);
  const [focusedCvv, setFocusedCvv] = useState(false);

  // this is for state change in form fields
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
            <div>
              <TextInput
                disabled
                label="Total Budget"
                placeholder={focusedTotalBudget ? "$50,000" : ""}
                value={totalBudget}
                onChange={(e) => setTotalBudget(e.currentTarget.value)}
                onFocus={() => setFocusedTotalBudget(true)}
                onBlur={() => setFocusedTotalBudget(true)}
                classNames={{
                  root: "relative mt-1",
                  input:
                    "bg-transparent border-0 border-b-2 border-gray-300 rounded-none px-0 pt-5 pb-1 focus:outline-none focus:border-gray-900",
                  label: `absolute left-0 top-2 z-10 pointer-events-none text-sm font-normal text-gray-400 transition-all duration-100 ease-in-out ${
                    floatingTotalBudget
                      ? "-translate-y-7 text-xs text-gray-900"
                      : ""
                  }`,
                }}
              />
            </div>
            <div>
              <TextInput
                disabled
                label="Already Paid"
                placeholder={focusedAlreadyPaid ? "$50,000" : ""}
                value={alreadyPaid}
                onChange={(e) => setAlreadyPaid(e.currentTarget.value)}
                onFocus={() => setFocusedAlreadyPaid(true)}
                onBlur={() => setFocusedAlreadyPaid(true)}
                classNames={{
                  root: "relative mt-1",
                  input:
                    "bg-transparent border-0 border-b-2 border-gray-300 rounded-none px-0 pt-5 pb-1 focus:outline-none focus:border-gray-900",
                  label: `absolute left-0 top-2 z-10 pointer-events-none text-sm font-normal text-gray-400 transition-all duration-100 ease-in-out ${
                    floatingAlreadyPaid
                      ? "-translate-y-7 text-xs text-gray-900"
                      : ""
                  }`,
                }}
              />
            </div>
          </div>
          <div>
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
                  floatingPaymentAmount
                    ? "-translate-y-5 text-xs text-gray-900"
                    : ""
                }`,
              }}
            />
          </div>
          <div>
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
                  floatingCardNumber
                    ? "-translate-y-5 text-xs text-gray-900"
                    : ""
                }`,
              }}
            />
          </div>
          <div className="flex justify-between">
            <div>
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
                    floatingExpireDate
                      ? "-translate-y-5 text-xs text-gray-900"
                      : ""
                  }`,
                }}
              />
            </div>
            <div>
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
          <button className="bg-black text-white p-2 rounded-xl"> <span className="font-bold text-sm"> Process Payment</span></button>
        </div>
      </div>
    </>
  );
};

export default MakePaymentModal;
