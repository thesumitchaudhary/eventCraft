import React, { useState } from "react";
import { CircleQuestionMark, ChevronUp, ChevronDown } from "lucide-react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import Header from "./header-footer components/Header";
import Footer from "./header-footer components/Footer";
import LiveIcon from "./header-footer components/live icon components/LiveIcon";

const FAQ = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleQuestion = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="bg-[#eeeeef] min-h-screen">
      <Header />
      <main>
        <section className="border bg-gray-50 border-gray-400 mx-4 rounded-2xl p-1">
          <div className="p-4">
            <h1 className="font-bold">Frequently Asked Questions</h1>
            <p className="text-gray-400 text-sm mb-3">
              Find answers to common questions
            </p>

            <div className="border border-gray-400 mx-6 p-1 rounded-xl">
              <h2 className="flex font-bold gap-1">
                <CircleQuestionMark />
                Frequently Asked Questions
              </h2>
              <div className="p-3">
                <div className="p-1 border-b border-gray-400">
                  <button
                    onClick={() => toggleQuestion(0)}
                    className="hover:underline flex justify-between font-medium text-base w-full"
                  >
                    How far in advance should I book my event?
                    {openFaq === 0 ? (
                      <ChevronUp className="text-gray-500" />
                    ) : (
                      <ChevronDown className="text-gray-500" />
                    )}
                  </button>

                  {openFaq === 0 && (
                    <p className="text-sm text-gray-600">
                      We recommend booking at least 3-6 months in advance for
                      major events like weddings and corporate functions. For
                      smaller events, 4-8 weeks notice is usually sufficient.
                      However, we can accommodate last-minute bookings based on
                      availability.
                    </p>
                  )}
                </div>
                <div className="p-1 border-b border-gray-400">
                  <button
                    onClick={() => toggleQuestion(1)}
                    className="hover:underline flex justify-between font-medium text-base w-full"
                  >
                    What payment methods do you accept?
                    {openFaq === 1 ? (
                      <ChevronUp className="text-gray-500" />
                    ) : (
                      <ChevronDown className="text-gray-500" />
                    )}
                  </button>

                  {openFaq === 1 && (
                    <p className="text-sm text-gray-600">
                      We accept all major credit cards, debit cards, bank
                      transfers, and online payment methods. A deposit is
                      typically required to confirm your booking, with the
                      remaining balance due before the event date.
                    </p>
                  )}
                </div>
                <div className="p-1 border-b border-gray-400">
                  <button
                    onClick={() => toggleQuestion(2)}
                    className="hover:underline flex justify-between font-medium text-base w-full"
                  >
                    Can I customize my event package?
                    {openFaq === 2 ? (
                      <ChevronUp className="text-gray-500" />
                    ) : (
                      <ChevronDown className="text-gray-500" />
                    )}
                  </button>

                  {openFaq === 2 && (
                    <p className="text-sm text-gray-600">
                      Absolutely! All our packages are fully customizable. You
                      can add or remove services, choose different themes, and
                      adjust the guest count. Our team will work with you to
                      create a package that fits your vision and budget.
                    </p>
                  )}
                </div>
                <div className="p-1 border-b border-gray-400">
                  <button
                    onClick={() => toggleQuestion(3)}
                    className="hover:underline flex justify-between font-medium text-base w-full"
                  >
                    What is your cancellation policy?
                    {openFaq === 3 ? (
                      <ChevronUp className="text-gray-500" />
                    ) : (
                      <ChevronDown className="text-gray-500" />
                    )}
                  </button>

                  {openFaq === 3 && (
                    <p className="text-sm text-gray-600">
                      Cancellations made 60+ days before the event receive a
                      full refund minus a 10% processing fee. Cancellations
                      30-59 days before receive 50% refund. Unfortunately,
                      cancellations less than 30 days before the event are
                      non-refundable, though we offer rescheduling options.
                    </p>
                  )}
                </div>
                <div className="p-1 border-b border-gray-400">
                  <button
                    onClick={() => toggleQuestion(4)}
                    className="hover:underline flex justify-between font-medium text-base w-full"
                  >
                    Do you provide vendors for catering, photography, etc.?
                    {openFaq === 4 ? (
                      <ChevronUp className="text-gray-500" />
                    ) : (
                      <ChevronDown className="text-gray-500" />
                    )}
                  </button>

                  {openFaq === 4 && (
                    <p className="text-sm text-gray-600">
                      Yes! We have a network of trusted vendors for catering,
                      photography, videography, entertainment, and more. You can
                      choose from our recommended vendors or bring your own. We
                      coordinate with all vendors to ensure everything runs
                      smoothly.
                    </p>
                  )}
                </div>
                <div className="p-1 border-b border-gray-400">
                  <button
                    onClick={() => toggleQuestion(5)}
                    className="hover:underline flex justify-between font-medium text-base w-full"
                  >
                    Can I visit the venue before booking?
                    {openFaq === 5 ? (
                      <ChevronUp className="text-gray-500" />
                    ) : (
                      <ChevronDown className="text-gray-500" />
                    )}
                  </button>

                  {openFaq === 5 && (
                    <p className="text-sm text-gray-600">
                      Of course! We encourage site visits. Contact us to
                      schedule a venue tour. During the visit, you can see the
                      space, discuss your requirements, and ask any questions.
                      Virtual tours are also available for out-of-town clients.
                    </p>
                  )}
                </div>
                <div className="p-1 border-b border-gray-400">
                  <button
                    onClick={() => toggleQuestion(6)}
                    className="hover:underline flex justify-between font-medium text-base w-full"
                  >
                    What happens if there is bad weather on my event day?
                    {openFaq === 6 ? (
                      <ChevronUp className="text-gray-500" />
                    ) : (
                      <ChevronDown className="text-gray-500" />
                    )}
                  </button>

                  {openFaq === 6 && (
                    <p className="text-sm text-gray-600">
                      For outdoor events, we always have a backup plan. This may
                      include indoor alternatives, tent arrangements, or
                      rescheduling options. We monitor weather forecasts closely
                      and communicate with you well in advance if changes are
                      needed.
                    </p>
                  )}
                </div>
                <div className="p-1 border-b border-gray-400">
                  <button
                    onClick={() => toggleQuestion(7)}
                    className="hover:underline flex justify-between font-medium text-base w-full"
                  >
                    Do you handle event permits and licenses?
                    {openFaq === 7 ? (
                      <ChevronUp className="text-gray-500" />
                    ) : (
                      <ChevronDown className="text-gray-500" />
                    )}
                  </button>

                  {openFaq === 7 && (
                    <p className="text-sm text-gray-600">
                      Yes, we take care of all necessary permits, licenses, and
                      insurance requirements for your event. This includes venue
                      permits, music licenses, alcohol permits (if applicable),
                      and any other regulatory requirements.
                    </p>
                  )}
                </div>
                <div className="p-1 border-b border-gray-400">
                  <button
                    onClick={() => toggleQuestion(8)}
                    className="hover:underline flex justify-between font-medium text-base w-full"
                  >
                    Can I make changes to my booking after confirmation?
                    {openFaq === 8 ? (
                      <ChevronUp className="text-gray-500" />
                    ) : (
                      <ChevronDown className="text-gray-500" />
                    )}
                  </button>

                  {openFaq === 8 && (
                    <p className="text-sm text-gray-600">
                      Yes, changes can be made up to 30 days before the event
                      date. Changes may affect pricing depending on the nature
                      of the modification. Major changes made less than 30 days
                      before may incur additional fees.
                    </p>
                  )}
                </div>
                <div className="p-1 border-b border-gray-400">
                  <button
                    onClick={() => toggleQuestion(9)}
                    className="hover:underline flex justify-between font-medium text-base w-full"
                  >
                    What COVID-19 safety measures do you have in place?
                    {openFaq === 9 ? (
                      <ChevronUp className="text-gray-500" />
                    ) : (
                      <ChevronDown className="text-gray-500" />
                    )}
                  </button>

                  {openFaq === 9 && (
                    <p className="text-sm text-gray-600">
                      We follow all local health guidelines and can implement
                      additional safety measures as requested. This includes
                      capacity limits, sanitization stations, mask requirements,
                      social distancing arrangements, and outdoor venue options.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="flex justify-end mr-4">
          <LiveIcon />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
