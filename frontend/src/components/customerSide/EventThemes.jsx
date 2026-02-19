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

const fetcher = (url) =>
  fetch(url, {
    credentials: "include",
  }).then((res) => res.json());

const EventThemes = () => {
  const { data = [], isLoading } = useQuery({
    queryKey: ["eventThemesDetails"],
    queryFn: async () => await fetcher(`${API_URL}/admin/getAllEventTheme`),
  });

  return (
    <div className="bg-[#eeeeef] min-h-screen">
      <Header />
      <main className="mb-5">
        <section className="bg-white mx-4 p-5 rounded-2xl">
          <h2 className="text-md font-bold">Available Event Themes</h2>
          <p className="text-gray-600">Browse our collection of event themes</p>

          <div className="flex flex-wrap gap-4 my-10">
            {isLoading ? (
              <p>Loading themes...</p>
            ) : (
              data.map((theme) => (
                <div
                  key={theme._id}
                  className="border border-gray-400 min-w-sm py-5 px-4 flex flex-col gap-4 justify-between rounded-2xl"
                >
                  <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-bold">{theme.themeName}</h3>
                    <p>{theme.themeType}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-2xl font-bold text-purple-600">
                      {theme.themePrice}
                    </h3>
                    <p>Base package price</p>
                  </div>
                </div>
              ))
            )}
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
