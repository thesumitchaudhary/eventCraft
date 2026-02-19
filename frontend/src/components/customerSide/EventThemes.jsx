import React, { useState } from "react";
import {
  Bell,
  Calendar,
  Settings,
  LogOut,
  Palette,
  CreditCard,
  Image,
  Star,
  CircleQuestionMark,
  TrendingUp,
} from "lucide-react";
import Header from "./header-footer components/Header";
import Footer from "./header-footer components/Footer";
import LiveIcon from "./header-footer components/live icon components/LiveIcon";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_BACKEND_URL;
console.log(API_URL);

const fetcher = (url) =>
  fetcher(url, {
    credentials: "include",
  }).then((res) => res.json());

const EventThemes = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["eventThemesDetails"],
    queryFn: () => fetcher(),
  });

  return (
    <div className="bg-[#eeeeef] min-h-screen">
      <Header />
      <main className="mb-5">
        <section className="bg-white mx-4 p-5 rounded-2xl">
          <h2 className="text-md font-bold">Available Event Themes</h2>
          <p className="text-gray-600">Browse our collection of event themes</p>
          <div className="flex flex-wrap gap-4 my-10">
            <div className="border border-gray-400 min-w-sm py-5 px-4 flex flex-col gap-4 justify-between rounded-2xl">
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-bold">Classic Elegant</h3>
                <p>Wedding</p>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-bold text-purple-600">$5000</h3>
                <p>Base package price</p>
              </div>
            </div>
            <div className="border border-gray-400 min-w-sm py-5 px-4 flex flex-col gap-4 justify-between rounded-2xl">
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-bold">Modern Minimalist</h3>
                <p>Wedding</p>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-bold text-purple-600">$4500</h3>
                <p>Base package price</p>
              </div>
            </div>
            <div className="border border-gray-400 min-w-sm py-5 px-4 flex flex-col gap-4 justify-between rounded-2xl">
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-bold">Rustic Charm</h3>
                <p>Wedding</p>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-bold text-purple-600">$4000</h3>
                <p>Base package price</p>
              </div>
            </div>
            <div className="border border-gray-400 min-w-sm py-5 px-4 flex flex-col gap-4 justify-between rounded-2xl">
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-bold">Beach Paradise</h3>
                <p>Wedding</p>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-bold text-purple-600">$6000</h3>
                <p>Base package price</p>
              </div>
            </div>
            <div className="border border-gray-400 min-w-sm py-5 px-4 flex flex-col gap-4 justify-between rounded-2xl">
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-bold">Corporate Professional</h3>
                <p>Corporate</p>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-bold text-purple-600">$3000</h3>
                <p>Base package price</p>
              </div>
            </div>
            <div className="border border-gray-400 min-w-sm py-5 px-4 flex flex-col gap-4 justify-between rounded-2xl">
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-bold">Tech Innovation</h3>
                <p>Corporate</p>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-bold text-purple-600">$3500</h3>
                <p>Base package price</p>
              </div>
            </div>
            <div className="border border-gray-400 min-w-sm py-5 px-4 flex flex-col gap-4 justify-between rounded-2xl">
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-bold">Kids Wonderland</h3>
                <p>Birthday</p>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-bold text-purple-600">$2000</h3>
                <p>Base package price</p>
              </div>
            </div>
            <div className="border border-gray-400 min-w-sm py-5 px-4 flex flex-col gap-4 justify-between rounded-2xl">
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-bold">Hollywood Glamour</h3>
                <p>Birthday</p>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-bold text-purple-600">$2500</h3>
                <p>Base package price</p>
              </div>
            </div>
            <div className="border border-gray-400 min-w-sm py-5 px-4 flex flex-col gap-4 justify-between rounded-2xl">
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-bold">Romantic Garden</h3>
                <p>Anniversary</p>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-bold text-purple-600">$3000</h3>
                <p>Base package price</p>
              </div>
            </div>
            <div className="border border-gray-400 min-w-sm py-5 px-4 flex flex-col gap-4 justify-between rounded-2xl">
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-bold">Vintage Romance</h3>
                <p>Anniversary</p>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-bold text-purple-600">$3200</h3>
                <p>Base package price</p>
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

export default EventThemes;
